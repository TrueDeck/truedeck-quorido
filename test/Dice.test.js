const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const { initializeBankroll, initializeChip, initializeDice } = require('./helpers');
const should = require('chai').should();

const Bankroll = artifacts.require('Bankroll');
const Chip = artifacts.require('Chip');
const Dice = artifacts.require('Dice');

const mode = process.env.MODE;

contract('Dice', function ([_, deployer, owner, signer, manager, player, anyone, ...otherAccounts]) {
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

    const initialHolder = owner;
    const minters = [owner];
    const pausers = [owner];

    before(async () => {
        if (mode === "profile") {
            this.bankroll = await Bankroll.deployed();
            this.chip = await Chip.deployed();
            this.dice = await Dice.deployed();

            initializeChip(this.chip, name, symbol, decimals, initialSupply, initialHolder, minters, pausers, deployer);
            initializeBankroll(this.bankroll, owner, deployer);
            initializeDice(this.dice, owner, signer, this.bankroll.address, deployer);
        }
    });

    after("write coverage/profiler output", async () => {
        if (mode === "profile") {
            await global.profilerSubprovider.writeProfilerOutputAsync();
        } else if (mode === "coverage") {
            await global.coverageSubprovider.writeCoverageAsync();
        }
    });

    beforeEach(async () => {
        if (mode === "profile") {
            global.profilerSubprovider.start();
        }
    });

    afterEach(async () => {
        if (mode === "profile") {
            global.profilerSubprovider.stop();
        }
    });

    if (mode !== 'profile') {
        describe('tests/coverage', () => {

            beforeEach(async function () {
                this.bankroll = await Bankroll.new({ from: deployer });
                this.chip = await Chip.new({ from: deployer });
                this.dice = await Dice.new({ from: deployer });
            });

            context('initialized', async function () {
                beforeEach(async function () {
                    initializeChip(this.chip, name, symbol, decimals, initialSupply, initialHolder, minters, pausers, deployer);
                    initializeBankroll(this.bankroll, owner, deployer);
                    initializeDice(this.dice, owner, signer, this.bankroll.address, deployer);

                    (await this.dice.addManager(manager, { from: owner }));
                    (await this.bankroll.addManager(manager, { from: owner }));
                    (await this.bankroll.addWithdrawer(this.dice.address, { from: owner }));
                });

                it('owner has the owner role', async function () {
                    (await this.dice.isOwner({ from: owner })).should.equal(true);
                    (await this.bankroll.isOwner({ from: owner })).should.equal(true);
                });

                it('manager has the manager role', async function () {
                    (await this.dice.isManager(manager)).should.equal(true);
                    (await this.bankroll.isManager(manager)).should.equal(true);
                });

                it('dice contract has the withdrawer role', async function () {
                    (await this.bankroll.isWithdrawer(this.dice.address)).should.equal(true);
                });

                it('dice isGame returns true', async function () {
                    (await this.dice.isGame({ from: anyone })).should.equal(true);
                });

                describe('deposit', function () {

                    describe('when the bankroll does not have enough approved balance', function () {
                        describe('when the player does not have enough balance', function () {
                            it('reverts', async function () {
                                await shouldFail.reverting(this.dice.deposit(this.chip.address, depositAmount, { from: player }));
                            });
                        });

                        describe('when the player has enough balance', function () {
                            beforeEach(async function () {
                                await this.chip.transfer(player, initialBalance, { from: initialHolder });
                                (await this.chip.balanceOf(player)).should.be.bignumber.equal(initialBalance);
                            });

                            it('reverts', async function () {
                                await shouldFail.reverting(this.dice.deposit(this.chip.address, depositAmount, { from: player }));
                            });
                        });
                    });

                    describe('when the bankroll has enough approved balance', function () {
                        beforeEach(async function() {
                            await this.chip.approve(this.bankroll.address, approveAmount, { from: player });
                        });

                        describe('when the player does not have enough balance', function () {
                            it('reverts', async function () {
                                await shouldFail.reverting(this.dice.deposit(this.chip.address, depositAmount, { from: player }));
                            });
                        });

                        describe('when the player has enough balance', function () {
                            beforeEach(async function () {
                                await this.chip.transfer(player, initialBalance, { from: initialHolder });
                                (await this.chip.balanceOf(player)).should.be.bignumber.equal(initialBalance);
                            });

                            context('when paused', function () {
                                beforeEach(async function () {
                                    await this.dice.pause({ from: manager });
                                    (await this.dice.paused()).should.equal(true);
                                });

                                it('reverts', async function () {
                                    await shouldFail.reverting(this.dice.deposit(this.chip.address, depositAmount, { from: player }));
                                });
                            });

                            context('when unpaused', function () {
                                beforeEach(async function () {
                                    (await this.dice.paused()).should.equal(false);
                                });

                                it('deposits the requested amount', async function () {
                                    await this.dice.deposit(this.chip.address, depositAmount, { from: player });

                                    (await this.dice.balanceOf(player)).should.be.bignumber.equal(depositAmount);
                                    (await this.chip.balanceOf(this.bankroll.address)).should.be.bignumber.equal(depositAmount);
                                    (await this.chip.balanceOf(player)).should.be.bignumber.equal(initialBalance.sub(depositAmount));
                                });

                                it('decreases the bankroll allowance', async function () {
                                    await this.dice.deposit(this.chip.address, depositAmount, { from: player });

                                    (await this.chip.allowance(player, this.bankroll.address)).should.be.bignumber.equal(approveAmount.sub(depositAmount));
                                });

                                it('emits a transfer event', async function () {
                                    const receipt = await this.dice.deposit(this.chip.address, depositAmount, { from: player });

                                    expectEvent.inTransaction(receipt.tx, Chip, 'Transfer', {
                                        from: player,
                                        to: this.bankroll.address,
                                        value: depositAmount,
                                    });
                                });

                                it('emits an approval event', async function () {
                                    const receipt = await this.dice.deposit(this.chip.address, depositAmount, { from: player });

                                    expectEvent.inTransaction(receipt.tx, Chip, 'Approval', {
                                        owner: player,
                                        spender: this.bankroll.address,
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
                            await shouldFail.reverting(this.dice.withdraw(
                                this.chip.address, withdrawAmount, "0x0", "0x0", { from: player }));
                        });
                    });

                    describe('when the bankroll has enough balance', function () {
                        beforeEach(async function() {
                            await this.chip.transfer(this.bankroll.address, initialBankroll, { from: initialHolder });
                            (await this.chip.balanceOf(this.bankroll.address)).should.be.bignumber.equal(initialBankroll);
                        });

                        context('when paused', function () {
                            beforeEach(async function () {
                                await this.dice.pause({ from: manager });
                                (await this.dice.paused()).should.equal(true);
                            });

                            it('reverts', async function () {
                                await shouldFail.reverting(this.dice.withdraw(
                                    this.chip.address, withdrawAmount, "0x0", "0x0", { from: player }));
                            });
                        });

//                        context('when unpaused', function () {
//                            beforeEach(async function () {
//                                (await this.bankroll.paused()).should.equal(false);
//                            });
//
//                        });
                    });
                });

            });
        });
    } else {
        describe("profile", () => {
//        //     it("should profile dice contract", async () => {
//        //         /* Pre-Assertions */
//        //         (await counter.owner()).should.equal(owner);
//        //         (await counter.count()).should.bignumber.equal(BN_999);
//        //
//        //         /* Transactions */
//        //         await counter.increaseCounter(BN_1);
//        //         (await counter.count()).should.bignumber.equal(BN_999.add(BN_1));
//        //
//        //         await counter.decreaseCounter(BN_1);
//        //         (await counter.count()).should.bignumber.equal(BN_999);
//        //     });
        });
    }
});