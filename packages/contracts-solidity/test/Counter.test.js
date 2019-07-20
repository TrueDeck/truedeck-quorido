const { BN } = require('openzeppelin-test-helpers');
const should = require('chai').should();

const Counter = artifacts.require('Counter');

const mode = process.env.MODE;

contract("counter", async ([_, owner, ...otherAccounts]) => {

  let counter;
  const BN_999 = new BN(999);
  const BN_1 = new BN(1);

  before(async () => {
    if (mode === "profile") {
      counter = await Counter.deployed();
      await counter.initialize(BN_999, {from: owner});
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
    if (mode !== "profile") {
      counter = await Counter.new();
      await counter.initialize(BN_999, {from: owner});
    } else if (mode === "profile") {
      global.profilerSubprovider.start();
    }
  });

  afterEach(async () => {
    if (mode === "profile") {
      global.profilerSubprovider.stop();
    }
  });

  if (mode !== "profile") {
    describe("tests/coverage", () => {
      it("should have proper owner", async () => {
        (await counter.owner()).should.equal(owner);
      });

      it("should have proper default value", async () => {
        (await counter.count()).should.bignumber.equal(BN_999);
      });

      it("should increase counter value", async () => {
        await counter.increaseCounter(BN_1);
        (await counter.count()).should.bignumber.equal(BN_999.add(BN_1));
      });

      it("should decrease counter value", async () => {
        await counter.decreaseCounter(BN_1);
        (await counter.count()).should.bignumber.equal(BN_999.sub(BN_1));
      });
    });
  } else {
    describe("profile", () => {
      it("should profile counter contract", async () => {
        /* Pre-Assertions */
        (await counter.owner()).should.equal(owner);
        (await counter.count()).should.bignumber.equal(BN_999);

        /* Transactions */
        await counter.increaseCounter(BN_1);
        (await counter.count()).should.bignumber.equal(BN_999.add(BN_1));

        await counter.decreaseCounter(BN_1);
        (await counter.count()).should.bignumber.equal(BN_999);
      });
    });
  }

});