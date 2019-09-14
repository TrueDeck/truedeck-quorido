const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const { initializeBankroll, initializeChip, initializeDice, calculateGameHash, signMessage } = require('./helpers');
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
    const withdrawAmount = new BN(1500);
    const zeroAmount = new BN(0);

    const initialHolder = owner;
    const minters = [owner];
    const pausers = [owner];

    before(async function () {
        if (mode === "profile") {
            this.bankroll = await Bankroll.deployed();
            this.chip = await Chip.deployed();
            this.dice = await Dice.deployed();

            initializeChip(this.chip, name, symbol, decimals, initialSupply, initialHolder, minters, pausers, deployer);
            initializeBankroll(this.bankroll, owner, deployer);
            initializeDice(this.dice, owner, signer, this.bankroll.address, deployer);

            (await this.dice.addManager(manager, { from: owner }));
            (await this.bankroll.addManager(manager, { from: owner }));
            (await this.bankroll.addWithdrawer(this.dice.address, { from: owner }));

            // Bankroll has enough balance
            await this.chip.transfer(this.bankroll.address, initialBankroll, { from: initialHolder });
            (await this.chip.balanceOf(this.bankroll.address)).should.be.bignumber.equal(initialBankroll);

            // Player has enough balance
            await this.chip.transfer(player, initialBalance, { from: initialHolder });
            (await this.chip.balanceOf(player)).should.be.bignumber.equal(initialBalance);

            // Player approves an amount
            await this.chip.approve(this.bankroll.address, approveAmount, { from: player });
        }
    });

    after("write coverage/profiler output", async function () {
        if (mode === "profile") {
            await global.profilerSubprovider.writeProfilerOutputAsync();
        } else if (mode === "coverage") {
            await global.coverageSubprovider.writeCoverageAsync();
        }
    });

    beforeEach(async function () {
        if (mode === "profile") {
            global.profilerSubprovider.start();
        }
    });

    afterEach(async function () {
        if (mode === "profile") {
            global.profilerSubprovider.stop();
        }
    });

    if (mode !== 'profile') {
        describe('tests/coverage', function () {

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

                it('signer has the signer role', async function () {
                    (await this.dice.isSigner(signer)).should.equal(true);
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
                        beforeEach(async function () {
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
                        beforeEach(async function () {
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

                        context('when unpaused', function () {
                            beforeEach(async function () {
                                (await this.bankroll.paused()).should.equal(false);
                            });

                            describe('game tests', function () {
                                const prevHash = "0000000000000000000000000000000000000000000000000000000000000000";

                                beforeEach(async function () {
                                    // Player has enough balance
                                    await this.chip.transfer(player, initialBalance, { from: initialHolder });
                                    (await this.chip.balanceOf(player)).should.be.bignumber.equal(initialBalance);

                                    // Player deposits an amount
                                    await this.chip.approve(this.bankroll.address, approveAmount, { from: player });
                                    await this.dice.deposit(this.chip.address, depositAmount, { from: player });
                                    (await this.dice.balanceOf(player)).should.be.bignumber.equal(depositAmount);
                                    (await this.chip.balanceOf(this.bankroll.address)).should.be.bignumber.equal(initialBankroll.add(depositAmount));
                                    (await this.chip.balanceOf(player)).should.be.bignumber.equal(initialBalance.sub(depositAmount));
                                });

                                describe('a simple game', function () {

                                    // Random Roll = 4
                                    const clientSeed = "df0ea096b54fc7ef48f679c094fe2f3ff2af2dd75a228fe719e9868004a11f15";
                                    const serverSeed = "75f82f273177f1760120a0fb29e5572d031723dd955af840438fc7ea44d6e994";

                                    // Bet Amount = 100
                                    const betAmount = "0000000000000000000000000000000000000000000000000000000000000064";
                                    const betAmountBN = new BN(100);

                                    // Roll Under = 10
                                    const rollUnder = "0A";

                                    // Flags = ... | WON | EOG | = 0000 0010 = 2
                                    const flags = "02";

                                    // Payout = betAmount * 99 / (rollUnder - 1)
                                    const payout = new BN(100 * 99 / (10 - 1));

                                    const clientData = clientSeed + betAmount + rollUnder;
                                    const data = "0x" + clientData + serverSeed + flags;
                                    const gamehash = calculateGameHash("0x"+prevHash, "0x"+serverSeed, "0x"+clientData);

                                    it('withdraws the requested amount', async function () {
                                        const proof = await signMessage(signer, gamehash);

                                        // Withdraw Transaction
                                        await this.dice.withdraw(this.chip.address, withdrawAmount, data, proof, { from: player });

                                        // Assertions
                                        const expectedDiceBalanceOfPlayer = depositAmount.sub(betAmountBN).add(payout).sub(withdrawAmount);
                                        (await this.dice.balanceOf(player)).should.be.bignumber.equal(expectedDiceBalanceOfPlayer);

                                        const expectedBankrollBalance = initialBankroll.add(depositAmount).sub(withdrawAmount);
                                        (await this.chip.balanceOf(this.bankroll.address)).should.be.bignumber.equal(expectedBankrollBalance);

                                        const expectedPlayerBalance = initialBalance.sub(depositAmount).add(withdrawAmount);
                                        (await this.chip.balanceOf(player)).should.be.bignumber.equal(expectedPlayerBalance);
                                    });

                                    it('emits a transfer event', async function () {
                                        const proof = await signMessage(signer, gamehash);

                                        // Withdraw Transaction
                                        const receipt = await this.dice.withdraw(this.chip.address, withdrawAmount, data, proof, { from: player });

                                        expectEvent.inTransaction(receipt.tx, Chip, 'Transfer', {
                                            from: this.bankroll.address,
                                            to: player,
                                            value: withdrawAmount,
                                        });
                                    });

                                    it('emits a proved event', async function () {
                                        const proof = await signMessage(signer, gamehash);

                                        // Withdraw Transaction
                                        const { logs } = await this.dice.withdraw(this.chip.address, withdrawAmount, data, proof, { from: player });

                                        expectEvent.inLogs(logs, 'Proved', {
                                            player: player,
                                            gamehash: gamehash
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    } else {
        describe("profile", function () {
            const prevHash = "0000000000000000000000000000000000000000000000000000000000000000";

            it('should profile a simple game', async function () {
                // Deposit Transaction
                await this.dice.deposit(this.chip.address, depositAmount, { from: player });

                // Random Roll = 4
                const clientSeed = "df0ea096b54fc7ef48f679c094fe2f3ff2af2dd75a228fe719e9868004a11f15";
                const serverSeed = "75f82f273177f1760120a0fb29e5572d031723dd955af840438fc7ea44d6e994";

                // Bet Amount = 100
                const betAmount = "0000000000000000000000000000000000000000000000000000000000000064";

                // Roll Under = 10
                const rollUnder = "0A";

                // Flags = ... | WON | EOG | = 0000 0010 = 2
                const flags = "02";

                const clientData = clientSeed + betAmount + rollUnder;
                const data = "0x" + clientData + serverSeed + flags;
                const gamehash = calculateGameHash("0x"+prevHash, "0x"+serverSeed, "0x"+clientData);
                const proof = await signMessage(signer, gamehash);

                // Withdraw Transaction
                await this.dice.withdraw(this.chip.address, withdrawAmount, data, proof, { from: player });
            });
        });
    }
});