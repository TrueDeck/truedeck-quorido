const { BN, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const { initializeBankroll, initializeChip } = require('./helpers');
const should = require('chai').should();

const Bankroll = artifacts.require('Bankroll');
const Chip = artifacts.require('Chip');
const GameMock = artifacts.require('GameMock');

const mode = process.env.MODE;

contract('Bankroll', function ([_, deployer, owner, managerA, managerB, initialHolder, minter, pauser, player, ...otherAccounts]) {
    const name = 'TChip';
    const symbol = 'TCHIP';
    const decimals = new BN(18);

    const initialSupply = new BN(40000);
    const initialBalance = new BN(10000);
    const initialBankroll = new BN(30000);
    const approveAmount = new BN(5000);
    const depositAmount = new BN(1000);
    const withdrawAmount = new BN(15000);
    const zeroAmount = new BN(0);

    const managers = [managerA, managerB];
    const minters = [minter];
    const pausers = [pauser];

    after('write coverage output', async () => {
        if (mode === 'coverage') {
            await global.coverageSubprovider.writeCoverageAsync();
        }
    });

    if (mode !== 'profile') {
        describe('tests/coverage', () => {
            let token;
            let spender;
            let withdrawer;
            let otherWithdrawer;
            let withdrawers;
            let anygame;

            beforeEach(async function () {
                this.bankroll = await Bankroll.new({ from: deployer });
                spender = this.bankroll.address;

                this.chip = await Chip.new({ from: deployer });
                token = this.chip.address;

                this.gameContract = (await GameMock.new({ from: owner }));
                await this.gameContract.setBankroll(this.bankroll.address);
                withdrawer = this.gameContract.address;

                this.otherGameContract = (await GameMock.new({ from: owner }));
                await this.otherGameContract.setBankroll(this.bankroll.address);
                otherWithdrawer = this.otherGameContract.address;

                this.anyGameContract = (await GameMock.new({ from: owner }));
                await this.anyGameContract.setBankroll(this.bankroll.address);
                anygame = this.anyGameContract.address;

                withdrawers = [withdrawer, otherWithdrawer];
            });

            context('initialized', async function () {
                beforeEach(async function () {
                    initializeChip(this.chip, name, symbol, decimals, initialSupply, initialHolder, minters, pausers, deployer);
                    initializeBankroll(this.bankroll, owner, deployer);
                    for (const manager of managers) {
                        (await this.bankroll.addManager(manager, { from: owner }));
                    }
                    for (const withdrawer of withdrawers) {
                        (await this.bankroll.addWithdrawer(withdrawer, { from: owner }));
                    }
                });

                it('owner has the owner role', async function () {
                    (await this.bankroll.isOwner({ from: owner })).should.equal(true);
                });

                it('all managers have the manager role', async function () {
                    for (const manager of managers) {
                        (await this.bankroll.isManager(manager)).should.equal(true);
                    }
                });

                it('all withdrawers have the withdrawer role', async function () {
                    for (const withdrawer of withdrawers) {
                        (await this.bankroll.isWithdrawer(withdrawer)).should.equal(true);
                    }
                });

                it('anygame does not have the withdrawer role', async function () {
                    (await this.bankroll.isWithdrawer(anygame)).should.equal(false);
                });

                describe('deposit', function () {

                    describe('when the spender does not have enough approved balance', function () {
                        describe('when the player does not have enough balance', function () {
                            it('reverts', async function () {
                                await shouldFail.reverting(this.gameContract.deposit(token, depositAmount, { from: player }));
                            });
                        });

                        describe('when the player has enough balance', function () {
                            beforeEach(async function () {
                                await this.chip.transfer(player, initialBalance, { from: initialHolder });
                                (await this.chip.balanceOf(player)).should.be.bignumber.equal(initialBalance);
                            });

                            it('reverts', async function () {
                                await shouldFail.reverting(this.gameContract.deposit(token, depositAmount, { from: player }));
                            });
                        });
                    });

                    describe('when the spender has enough approved balance', function () {
                        beforeEach(async function() {
                            await this.chip.approve(spender, approveAmount, { from: player });
                        });

                        describe('when the player does not have enough balance', function () {
                            it('reverts', async function () {
                                await shouldFail.reverting(this.gameContract.deposit(token, depositAmount, { from: player }));
                            });
                        });

                        describe('when the player has enough balance', function () {
                            beforeEach(async function () {
                                await this.chip.transfer(player, initialBalance, { from: initialHolder });
                                (await this.chip.balanceOf(player)).should.be.bignumber.equal(initialBalance);
                            });

                            context('when paused', function () {
                                beforeEach(async function () {
                                    await this.bankroll.pause({ from: managerA });
                                    (await this.bankroll.paused()).should.equal(true);
                                });

                                it('reverts', async function () {
                                    await shouldFail.reverting(this.gameContract.deposit(token, depositAmount, { from: player }));
                                });
                            });

                            context('when unpaused', function () {
                                beforeEach(async function () {
                                    (await this.bankroll.paused()).should.equal(false);
                                });

                                it('deposits the requested amount', async function () {
                                    await this.gameContract.deposit(token, depositAmount, { from: player });

                                    (await this.gameContract.balanceOf(player)).should.be.bignumber.equal(depositAmount);
                                    (await this.chip.balanceOf(spender)).should.be.bignumber.equal(depositAmount);
                                    (await this.chip.balanceOf(player)).should.be.bignumber.equal(initialBalance.sub(depositAmount));
                                });

                                it('decreases the spender allowance', async function () {
                                    await this.gameContract.deposit(token, depositAmount, { from: player });

                                    (await this.chip.allowance(player, spender)).should.be.bignumber.equal(approveAmount.sub(depositAmount));
                                });

                                it('emits a transfer event', async function () {
                                    const receipt = await this.gameContract.deposit(token, depositAmount, { from: player });

                                    expectEvent.inTransaction(receipt.tx, Chip, 'Transfer', {
                                        from: player,
                                        to: spender,
                                        value: depositAmount,
                                    });
                                });

                                it('emits an approval event', async function () {
                                    const receipt = await this.gameContract.deposit(token, depositAmount, { from: player });

                                    expectEvent.inTransaction(receipt.tx, Chip, 'Approval', {
                                        owner: player,
                                        spender: spender,
                                        value: approveAmount.sub(depositAmount),
                                    });
                                });
                            });
                        });
                    });
                });

                describe('withdrawal', function () {

                    describe('when the bankroll does not has enough balance', function () {
                        it('reverts', async function () {
                            await shouldFail.reverting(this.gameContract.withdraw(
                                token, withdrawAmount, "0x0", "0x0", { from: player }));
                        });
                    });

                    describe('when the bankroll has enough balance', function () {
                        beforeEach(async function() {
                            await this.chip.transfer(spender, initialBankroll, { from: initialHolder });
                            (await this.chip.balanceOf(spender)).should.be.bignumber.equal(initialBankroll);
                        });

                        context('when paused', function () {
                            beforeEach(async function () {
                                await this.bankroll.pause({ from: managerA });
                                (await this.bankroll.paused()).should.equal(true);
                            });

                            it('reverts', async function () {
                                await shouldFail.reverting(this.gameContract.withdraw(
                                    token, withdrawAmount, "0x0", "0x0", { from: player }));
                            });
                        });

                        context('when unpaused', function () {
                            beforeEach(async function () {
                                (await this.bankroll.paused()).should.equal(false);
                            });

                            describe('when the player withdraws through non-withdrawer', function () {
                                it('reverts', async function () {
                                    await shouldFail.reverting(this.anyGameContract.withdraw(
                                        token, withdrawAmount, "0x0", "0x0", { from: player }));
                                });
                            });

                            it('withdraws the requested amount', async function () {
                                await this.gameContract.withdraw(
                                    token, withdrawAmount, "0x0", "0x0", { from: player });

                                (await this.gameContract.balanceOf(player)).should.be.bignumber.equal(zeroAmount);
                                (await this.chip.balanceOf(player)).should.be.bignumber.equal(withdrawAmount);
                                (await this.chip.balanceOf(spender)).should.be.bignumber.equal(initialBankroll.sub(withdrawAmount));
                            });

                            it('emits a transfer event', async function () {
                                const receipt = await this.gameContract.withdraw(
                                    token, withdrawAmount, "0x0", "0x0", { from: player });

                                expectEvent.inTransaction(receipt.tx, Chip, 'Transfer', {
                                    from: spender,
                                    to: player,
                                    value: withdrawAmount,
                                });
                            });

                            it('emits a proved event', async function () {
                                const receipt = await this.gameContract.withdraw(
                                    token, withdrawAmount, "0x0", "0x123456", { from: player });

                                expectEvent.inTransaction(receipt.tx, GameMock, 'Proved', {
                                    player: player,
                                    gamehash: "0xbc36789e7a1e281436464229828f817d6612f7b477d66591ff96a9e064bcc98a"
                                });
                            });
                        });
                    });
                });
            });
        });
    }

});