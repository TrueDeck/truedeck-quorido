const { expectEvent, expectRevert } = require("openzeppelin-test-helpers")
const {
  shouldBehaveLikePublicRole,
} = require("./behaviors/access/roles/PublicRole.behavior")
const should = require("chai").should()

const Manageable = artifacts.require("ManageableMock")

const mode = process.env.MODE

contract("Manageable", function([
  _,
  owner,
  manager,
  otherManager,
  anyone,
  ...otherAccounts
]) {
  after("write coverage output", async function() {
    if (mode === "coverage") {
      await global.coverageSubprovider.writeCoverageAsync()
    }
  })

  if (mode !== "profile") {
    describe("tests/coverage", function() {
      beforeEach(async function() {
        this.manageable = await Manageable.new({ from: owner })
      })

      describe("manager role", function() {
        beforeEach(async function() {
          this.contract = this.manageable
          await this.contract.addManager(manager, { from: owner })
          await this.contract.addManager(otherManager, { from: owner })
        })

        shouldBehaveLikePublicRole(
          manager,
          otherManager,
          otherAccounts,
          "manager",
          owner
        )
      })

      describe("pause operation", function() {
        beforeEach(async function() {
          await this.manageable.addManager(manager, { from: owner })
        })

        context("when unpaused", function() {
          beforeEach(async function() {
            ;(await this.manageable.paused()).should.equal(false)
          })

          it("can perform normal process in non-pause", async function() {
            ;(await this.manageable.count()).should.be.bignumber.equal("0")

            await this.manageable.normalProcess({ from: anyone })
            ;(await this.manageable.count()).should.be.bignumber.equal("1")
          })

          it("cannot take drastic measure in non-pause", async function() {
            await expectRevert.unspecified(
              this.manageable.drasticMeasure({ from: anyone })
            )
            ;(await this.manageable.drasticMeasureTaken()).should.equal(false)
          })

          describe("pausing", function() {
            it("is pausable by the manager", async function() {
              await this.manageable.pause({ from: manager })
              ;(await this.manageable.paused()).should.equal(true)
            })

            it("reverts when pausing from non-manager", async function() {
              await expectRevert.unspecified(
                this.manageable.pause({ from: anyone })
              )
            })

            context("when paused", function() {
              beforeEach(async function() {
                ;({ logs: this.logs } = await this.manageable.pause({
                  from: manager,
                }))
              })

              it("emits a Paused event", function() {
                expectEvent.inLogs(this.logs, "Paused", { account: manager })
              })

              it("cannot perform normal process in pause", async function() {
                await expectRevert.unspecified(
                  this.manageable.normalProcess({ from: anyone })
                )
              })

              it("can take a drastic measure in a pause", async function() {
                await this.manageable.drasticMeasure({ from: anyone })
                ;(await this.manageable.drasticMeasureTaken()).should.equal(
                  true
                )
              })

              it("reverts when re-pausing", async function() {
                await expectRevert.unspecified(
                  this.manageable.pause({ from: manager })
                )
              })

              describe("unpausing", function() {
                it("is unpausable by the manager", async function() {
                  await this.manageable.unpause({ from: manager })
                  ;(await this.manageable.paused()).should.equal(false)
                })

                it("reverts when unpausing from non-manager", async function() {
                  await expectRevert.unspecified(
                    this.manageable.unpause({ from: anyone })
                  )
                })

                context("when unpaused", function() {
                  beforeEach(async function() {
                    ;({ logs: this.logs } = await this.manageable.unpause({
                      from: manager,
                    }))
                  })

                  it("emits an Unpaused event", function() {
                    expectEvent.inLogs(this.logs, "Unpaused", {
                      account: manager,
                    })
                  })

                  it("should resume allowing normal process", async function() {
                    ;(await this.manageable.count()).should.be.bignumber.equal(
                      "0"
                    )
                    await this.manageable.normalProcess({ from: anyone })
                    ;(await this.manageable.count()).should.be.bignumber.equal(
                      "1"
                    )
                  })

                  it("should prevent drastic measure", async function() {
                    await expectRevert.unspecified(
                      this.manageable.drasticMeasure({ from: anyone })
                    )
                  })

                  it("reverts when re-unpausing", async function() {
                    await expectRevert.unspecified(
                      this.manageable.unpause({ from: manager })
                    )
                  })
                })
              })
            })
          })
        })
      })
    })
  }
})
