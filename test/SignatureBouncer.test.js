const { shouldFail } = require('openzeppelin-test-helpers');
const { signMessage } = require('./helpers');
const { shouldBehaveLikePublicRole } = require('openzeppelin-eth/test/behaviors/access/roles/PublicRole.behavior');
const should = require('chai').should();

const SignatureBouncerMock = artifacts.require('SignatureBouncerMock');

const mode = process.env.MODE;

contract('SignatureBouncer', function ([_, signer, otherSigner, anyone, authorizedUser, ...otherAccounts]) {

    after("write coverage output", async () => {
        if (mode === "coverage") {
            await global.coverageSubprovider.writeCoverageAsync();
        }
    });

    if (mode !== "profile") {
        describe("tests/coverage", () => {

            beforeEach(async function () {
                this.sigBouncer = await SignatureBouncerMock.new({ from: signer });
            });

            context('signature validation', function () {
                it('invalidates wrong hash', async function () {
                    const h1 = "0xc5ee48380eecc4832905500b23878950f5c00bf985086a4552d31285fcaf4519";
                    const invalid_hash = "0xabcd48380eecc4832905500b23878950f5c00bf985086a4552d31285fcaf4519";
                    (await this.sigBouncer.checkValidDataHash(h1, await signMessage(signer, invalid_hash))).should.equal(false);
                });

                it('invalidates hash by unauthorized signer', async function () {
                    const h1 = "0xc5ee48380eecc4832905500b23878950f5c00bf985086a4552d31285fcaf4519";
                    (await this.sigBouncer.checkValidDataHash(h1, await signMessage(otherSigner, h1))).should.equal(false);
                });

                it('validates hash by authorized signer', async function () {
                    const h1 = "0xc5ee48380eecc4832905500b23878950f5c00bf985086a4552d31285fcaf4519";
                    (await this.sigBouncer.checkValidDataHash(h1, await signMessage(signer, h1))).should.equal(true);
                });
            });

        });
    }
});