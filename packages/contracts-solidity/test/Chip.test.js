const { expectRevert, BN } = require("openzeppelin-test-helpers")
const { initializeChip } = require("./helpers")
const should = require("chai").should()

const Chip = artifacts.require("Chip")

const mode = process.env.MODE

contract("Chip", function([
  _,
  deployer,
  initialHolder,
  minterA,
  minterB,
  pauserA,
  pauserB,
]) {
  const name = "TChip"
  const symbol = "TCHIP"
  const decimals = new BN(18)

  const initialSupply = new BN(300)

  const minters = [minterA, minterB]
  const pausers = [pauserA, pauserB]

  after("write coverage output", async function() {
    if (mode === "coverage") {
      await global.coverageSubprovider.writeCoverageAsync()
    }
  })

  if (mode !== "profile") {
    describe("tests/coverage", function() {
      beforeEach(async function() {
        this.chip = await Chip.new({ from: deployer })
      })

      context("initializing", async function() {
        it("reverts if created with no minters", async function() {
          await expectRevert.unspecified(
            initializeChip(
              this.chip,
              name,
              symbol,
              decimals,
              initialSupply,
              initialHolder,
              [],
              pausers,
              deployer
            )
          )
        })

        it("reverts if created with no pausers", async function() {
          await expectRevert.unspecified(
            initializeChip(
              this.chip,
              name,
              symbol,
              decimals,
              initialSupply,
              initialHolder,
              minters,
              [],
              deployer
            )
          )
        })
      })

      context("initialized", async function() {
        beforeEach(async function() {
          initializeChip(
            this.chip,
            name,
            symbol,
            decimals,
            initialSupply,
            initialHolder,
            minters,
            pausers,
            deployer
          )
        })

        it("initializes chip metadata", async function() {
          ;(await this.chip.name()).should.equal(name)
          ;(await this.chip.symbol()).should.equal(symbol)
          ;(await this.chip.decimals()).should.be.bignumber.equal(decimals)
        })

        it("assigns the initial supply to the initial holder", async function() {
          ;(await this.chip.balanceOf(initialHolder)).should.be.bignumber.equal(
            initialSupply
          )
        })

        it("all minters have the minter role", async function() {
          for (const minter of minters) {
            ;(await this.chip.isMinter(minter)).should.equal(true)
          }
        })

        it("all pausers have the minter role", async function() {
          for (const pauser of pausers) {
            ;(await this.chip.isPauser(pauser)).should.equal(true)
          }
        })
      })
    })
  }
})
