const { shouldFail, constants, expectEvent } = require('openzeppelin-test-helpers');
const { ZERO_ADDRESS } = constants;
const should = require('chai').should();

const WithdrawerRole = artifacts.require('WithdrawerRoleMock');
const GameMock = artifacts.require('GameMock');

const mode = process.env.MODE;

contract('WithdrawerRole', function ([_, owner, ...otherAccounts]) {

    after('write coverage output', async function () {
        if (mode === 'coverage') {
            await global.coverageSubprovider.writeCoverageAsync();
        }
    });

    if (mode !== 'profile') {
        describe('tests/coverage', function () {

            const manager = owner;
            const anyone = otherAccounts[0];
            let withdrawer;
            let otherWithdrawer;
            let anygame;

            beforeEach(async function () {
                this.contract = await WithdrawerRole.new({ from: owner });

                const contractAddress = this.contract.address;

                this.gameContract = (await GameMock.new({ from: owner }));
                await this.gameContract.setWithdrawerRoleMock(contractAddress);
                withdrawer = this.gameContract.address;

                this.otherGameContract = (await GameMock.new({ from: owner }));
                await this.otherGameContract.setWithdrawerRoleMock(contractAddress);
                otherWithdrawer = this.otherGameContract.address;

                this.anyGameContract = (await GameMock.new({ from: owner }));
                await this.anyGameContract.setWithdrawerRoleMock(contractAddress);
                anygame = this.anyGameContract.address;

                await this.contract.addWithdrawer(withdrawer, { from: owner });
                await this.contract.addWithdrawer(otherWithdrawer, { from: owner });
            });

            describe('should behave like Withdrawer role', function () {
                beforeEach('check preconditions', async function () {
                    (await this.contract['isWithdrawer'](withdrawer)).should.equal(true);
                    (await this.contract['isWithdrawer'](otherWithdrawer)).should.equal(true);
                    (await this.contract['isWithdrawer'](anyone)).should.equal(false);
                });

                it('reverts when querying roles for the null account', async function () {
                    await shouldFail.reverting(this.contract['isWithdrawer'](ZERO_ADDRESS));
                });

                describe('access control', function () {
                    context('from withdrawer game contract', function () {
                        const from = anyone;

                        it('allows access', async function () {
                            await this.gameContract['onlyWithdrawerMock']({ from });
                        });
                    });

                    context('from unwithdrawer game contract', function () {
                      const from = anyone;

                      it('reverts', async function () {
                          await shouldFail.reverting(this.anyGameContract['onlyWithdrawerMock']({ from }));
                      });
                    });
                });

                describe('add', function () {
                    const from = manager;

                    context('from the manager account', function () {
                        it('adds role to a new account', async function () {
                            await this.contract['addWithdrawer'](anygame, { from });
                            (await this.contract['isWithdrawer'](anygame)).should.equal(true);
                        });

                        it('emits a WithdrawerAdded event', async function () {
                            const { logs } = await this.contract['addWithdrawer'](anygame, { from });
                            expectEvent.inLogs(logs, 'WithdrawerAdded', { account: anygame });
                        });

                        it('reverts when adding role to an already assigned contract', async function () {
                            await shouldFail.reverting(this.contract['addWithdrawer'](withdrawer, { from }));
                        });

                        it('reverts when adding role to the non-game account', async function () {
                            await shouldFail.reverting(this.contract['addWithdrawer'](anyone, { from }));
                        });

                        it('reverts when adding role to the null account', async function () {
                            await shouldFail.reverting(this.contract['addWithdrawer'](ZERO_ADDRESS, { from }));
                        });
                    });
                });

                describe('remove', function () {
                    const from = manager;

                    context('from the manager account', function () {
                        it('removes role from an already assigned game contract', async function () {
                            await this.contract['removeWithdrawer'](withdrawer, { from });
                            (await this.contract['isWithdrawer'](withdrawer)).should.equal(false);
                            (await this.contract['isWithdrawer'](otherWithdrawer)).should.equal(true);
                        });

                        it('emits a WithdrawerRemoved event', async function () {
                            const { logs } = await this.contract['removeWithdrawer'](withdrawer, { from });
                            expectEvent.inLogs(logs, 'WithdrawerRemoved', { account: withdrawer });
                        });

                        it('reverts when removing from an unassigned game contract', async function () {
                            await shouldFail.reverting(this.contract['removeWithdrawer'](anygame), { from });
                        });

                        it('reverts when removing from an unassigned non-game contract', async function () {
                            await shouldFail.reverting(this.contract['removeWithdrawer'](anyone), { from });
                        });

                        it('reverts when removing role from the null account', async function () {
                            await shouldFail.reverting(this.contract['removeWithdrawer'](ZERO_ADDRESS), { from });
                        });
                    });
                });

                describe('renouncing roles', function () {
                    it('renounces an assigned role', async function () {
                        await this.gameContract['renounceWithdrawer']({ from: anyone });
                        (await this.contract['isWithdrawer'](withdrawer)).should.equal(false);
                    });

                    it('emits a WithdrawerRemoved event', async function () {
                        const receipt = await this.gameContract['renounceWithdrawer']({ from: anyone });

                        expectEvent.inTransaction(receipt.tx, WithdrawerRole, 'WithdrawerRemoved', {
                            account: withdrawer
                        });
                    });

                    it('reverts when renouncing unassigned role by game contract', async function () {
                        await shouldFail.reverting(this.anyGameContract['renounceWithdrawer']({ from: anyone }));
                    });

                    it('reverts when renouncing unassigned role by non-game account', async function () {
                        await shouldFail.reverting(this.contract['renounceWithdrawer']({ from: anyone }));
                    });
                });
            });
        });
    }

});