const { BN } = require('openzeppelin-test-helpers');
const { calculateGameHash } = require('./helpers');
const should = require('chai').should();

const Utils = artifacts.require('UtilsMock');

const mode = process.env.MODE;

contract("utils", async ([_, owner, ...otherAccounts]) => {

    let utils;
    const BN_999 = new BN(999);
    const BN_1 = new BN(1);

    before(async () => {
        if (mode === "profile") {
            utils = await Utils.deployed();
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
            utils = await Utils.new();
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

            it("should calculate game hash", async () => {
                const h1 = "0xc5ee48380eecc4832905500b23878950f5c00bf985086a4552d31285fcaf4519";
                const c1 = "0xfb3a08bc90a8964b7436cc3573a4e82f386eca38fa150e81a8ddec0c2c7bd5ae";
                const s1 = "0x456d291cf53f3dd1c67766843c3867d8946b7ad1b8eda2eb92c774c3dad3f2e0";
                const d1 = "0xdc36d162f7ffbbfd1a7cc5794a5fe902b8afbf09fa2e2a9299cf8ebf1af15975ac0f19c8ba83a4307d1250b130c892ac8a2c30f6b174fc1e849f5fb1511d4eff";

                const h2 = "0xb16222d190976de424b241214ce31f32ab305193b859bab01e21d449d52a60f1";
                const c2 = "0x794969a292881b4bdc841b7e52018a236dbd032d754f636c9d86ab70b31eb7d5";
                const s2 = "0x59afb1bebacc47df2019ef37652eccd0126f99658cbc5627a08f4b1f14571d0a";
                const d2 = "0x15adf883fa0c69294e491461620bc7da919a65adb3e9d8ce7b9686cb1b9135913b5d3a4f2853fbbceae7aa504c0f0f1d0d2f733c2afe72990687eeaec4eab8b6";

                const h3 = "0x8ba81c8c2185a2b272c7bb452631f7e62742319a7f139dd07b85dd8a9f2e81eb";
                const c3 = "0x24962d7c82459c704b500ee0068e893ec302703b3080f2077a4215f7cc7e0396";
                const s3 = "0x9337c0e3115c207da2aba79a6e2f0268cd8d2517125b989421c951edf8f4f5d2";
                const d3 = "0x4b7b4baaa2f39fc6cd43fa83f4456b23672accd2f1e5c755d85b4c2429d71337ec815e15202722e4c27d07cd721234db7ac9029b7f5d1ff2f48337b3c9c96f48";

                const h = [h1, h2, h3];
                const c = [c1, c2, c3];
                const s = [s1, s2, s3];
                const d = [d1, d2, d3];

                for (let i = 0; i < h.length; i++) {
                    const actual = await utils.calculateGameHash(h[i], c[i], s[i], d[i]);
                    const expected = calculateGameHash(h[i], c[i], s[i], d[i]);
                    actual.should.equal(expected);
                }
            });

            it("should convert to bool", async () => {
                const packedBools = new BN("AA", 16);

                (await utils.toBool(packedBools, 0)).should.equal(false);
                (await utils.toBool(packedBools, 1)).should.equal(true);
                (await utils.toBool(packedBools, 2)).should.equal(false);
                (await utils.toBool(packedBools, 3)).should.equal(true);
                (await utils.toBool(packedBools, 4)).should.equal(false);
                (await utils.toBool(packedBools, 5)).should.equal(true);
                (await utils.toBool(packedBools, 6)).should.equal(false);
                (await utils.toBool(packedBools, 7)).should.equal(true);
            });

            it("should convert bytes to uint8", async () => {
                // one byte input
                (await utils.toUint8(1, "0x4")).should.bignumber.equal(new BN("4", 16));
                (await utils.toUint8(1, "0xA")).should.bignumber.equal(new BN("A", 16));
                (await utils.toUint8(1, "0xF")).should.bignumber.equal(new BN("F", 16));
                (await utils.toUint8(1, "0x7F")).should.bignumber.equal(new BN("7F", 16));
                (await utils.toUint8(1, "0xFF")).should.bignumber.equal(new BN("FF", 16));

                // multiple bytes input
                (await utils.toUint8(2, "0x25045F")).should.bignumber.equal(new BN("4", 16));
                (await utils.toUint8(4, "0x5F255F0A")).should.bignumber.equal(new BN("A", 16));
                (await utils.toUint8(1, "0xFDD5F")).should.bignumber.equal(new BN("F", 16));
                (await utils.toUint8(3, "0xA1457FC5EE")).should.bignumber.equal(new BN("7F", 16));
                (await utils.toUint8(5, "0x255FEFEFFFEFE0000")).should.bignumber.equal(new BN("FF", 16));
            });

            it("should convert bytes to uint16", async () => {
                // multiple bytes input
                (await utils.toUint16(2, "0x25045F")).should.bignumber.equal(new BN("2504", 16));
                (await utils.toUint16(4, "0x5F255F0A")).should.bignumber.equal(new BN("5F0A", 16));
                (await utils.toUint16(2, "0xFDD5F")).should.bignumber.equal(new BN("0FDD", 16));
                (await utils.toUint16(3, "0xA1457FC5EE")).should.bignumber.equal(new BN("457F", 16));
                (await utils.toUint16(5, "0x255FEFEFFFEFE0000")).should.bignumber.equal(new BN("FEFF", 16));
            });

            it("should convert bytes to uint32", async () => {
                // multiple bytes input
                (await utils.toUint32(5, "0x25045F25045F")).should.bignumber.equal(new BN("45F2504", 16));
                (await utils.toUint32(6, "0x5F255F0A5F255F0A")).should.bignumber.equal(new BN("5F0A5F25", 16));
                (await utils.toUint32(4, "0xFDD5FFDD5F")).should.bignumber.equal(new BN("FDD5FFDD", 16));
                (await utils.toUint32(7, "0xA1457FC5ABACEEDD")).should.bignumber.equal(new BN("C5ABACEE", 16));
                (await utils.toUint32(8, "0x255FEFEFFFEFE0000")).should.bignumber.equal(new BN("FFFEFE00", 16));
            });

            it("should convert bytes to uint256", async () => {
                // 32 bytes, position = [1,32], offset = 32
                const o1 = 32;
                const b1 = "0xF57278154268028842209B73232002239291055907C81674318526773816223D";
                const n1 = "F57278154268028842209B73232002239291055907C81674318526773816223D";

                // 34 bytes, position = [2,33], offset = 33
                const o2 = 33;
                const b2 = "0xAAB38788873543584270061C88237770638155495604D10905824979335160813EAA";
                const n2 = "B38788873543584270061C88237770638155495604D10905824979335160813E";

                // 36 bytes, position = [3,34], offset = 34
                const o3 = 34;
                const b3 = "0xAAAAC70113004420642622502D01386216611394630504E97624900482615777508FAAAA";
                const n3 = "C70113004420642622502D01386216611394630504E97624900482615777508F";

                // 38 bytes, position = [4,35], offset = 35
                const o4 = 35;
                const b4 = "0xAAAAAAD18794167054996158975E52222437898270817487F42833319505457825860BAAAAAA";
                const n4 = "D18794167054996158975E52222437898270817487F42833319505457825860B";

                // 40 bytes, position = [5,36], offset = 36
                const o5 = 36;
                const b5 = "0xAAAAAAAAE63764674862174594792F85315850066960935168A01500787187682329815BAAAAAAAA";
                const n5 = "E63764674862174594792F85315850066960935168A01500787187682329815B";

                const o = [o1, o2, o3, o4, o5];
                const b = [b1, b2, b3, b4, b5];
                const n = [n1, n2, n3, n4, n5];

                for (let i = 0; i < o.length; i++) {
                    (await utils.toUint256(o[i], b[i])).should.bignumber.equal(new BN(n[i], 16));
                }
            });

            it("should convert bytes to bytes32", async () => {
                // 32 bytes, position = [1,32], offset = 0
                const o1 = 0;
                const b1 = "0x56ec63c61aac091731e8611fc41ed540043b7f0bfbc28e1cb26c7f0739e77265";
                const n1 = "0x56ec63c61aac091731e8611fc41ed540043b7f0bfbc28e1cb26c7f0739e77265";

                // 34 bytes, position = [2,32], offset = 1
                const o2 = 1;
                const b2 = "0xdc5530395ed6446c498c6968a9801b47c4cc49300f77af94c03a0cc6f23cad9c6da5";
                const n2 = "0x5530395ed6446c498c6968a9801b47c4cc49300f77af94c03a0cc6f23cad9c6d";

                // 36 bytes, position = [3,32], offset = 2
                const o3 = 2;
                const b3 = "0x621d9a6eb4b90093291c733cdf4978169883f0830d30e19a48a6b2a596a3c5e9ba40b296";
                const n3 = "0x9a6eb4b90093291c733cdf4978169883f0830d30e19a48a6b2a596a3c5e9ba40";

                // 38 bytes, position = [4,32], offset = 3
                const o4 = 3;
                const b4 = "0x72f57f0e003bc74ba40d4fac3445c43433155ca2fb33d1615d4f999efbcb58f8d8d3f2c511cf";
                const n4 = "0x0e003bc74ba40d4fac3445c43433155ca2fb33d1615d4f999efbcb58f8d8d3f2";

                // 40 bytes, position = [5,32], offset = 4
                const o5 = 4;
                const b5 = "0x4c5766bdca506e6bc47b5e37f0ad2260844e14ea3d73388374ef8abc95e6e93f6e2266bca98b8cfd";
                const n5 = "0xca506e6bc47b5e37f0ad2260844e14ea3d73388374ef8abc95e6e93f6e2266bc";

                const o = [o1, o2, o3, o4, o5];
                const b = [b1, b2, b3, b4, b5];
                const n = [n1, n2, n3, n4, n5];

                for (let i = 0; i < o.length; i++) {
                    (await utils.toBytes32(o[i], b[i])).should.equal(n[i]);
                }
            });

            it("should extract bytes from bytes", async () => {
                // 40 bytes
                const b1 = "0xaaaaaaaae63764674862174594792f85315850066960935168a01500787187682329815baaaaaaaa";
                // 80 bytes
                const b2 = "0xaaaaaaaae63764674862174594792f85315850066960935168a01500787187682329815baaaaaaaaaaaaaaaae63764674862174594792f85315850066960935168a01500787187682329815baaaaaaaa";
                // 103 bytes
                const b3 = "0x2f77de4495ddbadade2d06ea9f92873494366c1b4418fbb4b9139eca0b8049498cf382f06c4a4325fa5c8e22e42e6e04b75d0698391a28bb259f931a78446253d965f5817654eaac765a9c571a572e89238f19a420781092eec0d987f1e60b8d01b1a480e40085";

                // Upto One Word
                (await utils.toBytes(2, 5, b1)).should.equal("0xaaaae63764");
                (await utils.toBytes(7, 13, b1)).should.equal("0x674862174594792f8531585006");
                (await utils.toBytes(12, 18, b1)).should.equal("0x94792f85315850066960935168a015007871");

                // Upto Two Word
                (await utils.toBytes(1, 38, b1)).should.equal("0xaaaaaae63764674862174594792f85315850066960935168a01500787187682329815baaaaaa");
                (await utils.toBytes(0, 40, b1)).should.equal(b1);

                // Upto Three Word
                (await utils.toBytes(4, 70, b2)).should.equal("0xe63764674862174594792f85315850066960935168a01500787187682329815baaaaaaaaaaaaaaaae63764674862174594792f85315850066960935168a01500787187682329");
                (await utils.toBytes(0, 80, b2)).should.equal(b2);

                // More Than Three Word
                (await utils.toBytes(0, 103, b3)).should.equal(b3);
            });

            it("should deserialize bytes into types", async () => {
                const b = "0x2f77de4495ddbadade2d06ea9f92873494366c1b4418fbb4b9139eca0b8049498cf382f06c4a4325fa5c8e22e42e6e04b75d0698391a28bb259f931a78446253d965f5817654eaac765a9c571a572e89238f19a420781092eec0d987f1e60b8d01b1a480e40085";

                const { _bytes1, _int8, _b1, _int16, _bytes2, _int32, _b2, _int256 } = await utils.deserialize(b);

                _bytes1.should.equal("0x2f77de4495ddbadade2d06ea9f92873494366c1b4418fbb4b9139eca0b8049498cf382");
                _int8.should.bignumber.equal(new BN("2f", 16));
                _b1.should.equal("0x77de4495ddbadade2d06ea9f92873494366c1b4418fbb4b9139eca0b8049498c");
                _int16.should.bignumber.equal(new BN("f382", 16));

                _bytes2.should.equal("0xf06c4a4325fa5c8e22e42e6e04b75d0698391a28bb259f931a78446253d965f5817654eaac765a9c571a572e89238f19a420781092eec0d987f1e60b8d01b1a480e40085");
                _int32.should.bignumber.equal(new BN("f06c4a43", 16));
                _b2.should.equal("0x25fa5c8e22e42e6e04b75d0698391a28bb259f931a78446253d965f5817654ea");
                _int256.should.bignumber.equal(new BN("ac765a9c571a572e89238f19a420781092eec0d987f1e60b8d01b1a480e40085", 16));
            });
        });
    } else {
        describe("profile", () => {
            it("should profile Utils contract", async () => {
                const h = "0xb16222d190976de424b241214ce31f32ab305193b859bab01e21d449d52a60f1";
                const c = "0x794969a292881b4bdc841b7e52018a236dbd032d754f636c9d86ab70b31eb7d5";
                const s = "0x59afb1bebacc47df2019ef37652eccd0126f99658cbc5627a08f4b1f14571d0a";
                const d = "0x2f77de4495ddbadade2d06ea9f92873494366c1b4418fbb4b9139eca0b8049498cf382f06c4a4325fa5c8e22e42e6e04b75d0698391a28bb259f931a78446253d965f5817654eaac765a9c571a572e89238f19a420781092eec0d987f1e60b8d01b1a480e40085";
                await utils.profile(h, c, s, d);
            });
        });
    }

});