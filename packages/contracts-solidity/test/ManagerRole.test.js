const { shouldBehaveLikePublicRole } = require('openzeppelin-eth/test/behaviors/access/roles/PublicRole.behavior');
const should = require('chai').should();

const ManagerRole = artifacts.require('ManagerRoleMock');

const mode = process.env.MODE;

contract('ManagerRole', function ([_, owner, manager, otherManager, ...otherAccounts]) {

    after('write coverage output', async function () {
        if (mode === 'coverage') {
            await global.coverageSubprovider.writeCoverageAsync();
        }
    });

    if (mode !== 'profile') {
        describe('tests/coverage', function () {
            beforeEach(async function () {
                this.contract = await ManagerRole.new({ from: owner });
                await this.contract.addManager(manager, { from: owner });
                await this.contract.addManager(otherManager, { from: owner });
            });

            shouldBehaveLikePublicRole(manager, otherManager, otherAccounts, 'manager', owner);
        });
    }

});