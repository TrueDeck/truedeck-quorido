const ProviderEngine = require("web3-provider-engine")
const WebsocketSubprovider = require("web3-provider-engine/subproviders/websocket.js")
const { TruffleArtifactAdapter } = require("@0x/sol-trace")
const { ProfilerSubprovider } = require("@0x/sol-profiler")
const { CoverageSubprovider } = require("@0x/sol-coverage")
const { RevertTraceSubprovider } = require("@0x/sol-trace")

const HDWalletProvider = require("truffle-hdwallet-provider")
const path = require("path")
require("dotenv").config()

const mode = process.env.MODE

const projectRoot = ""
const solcVersion = "0.5.2"
const defaultFromAddress = "0x5409ed021d9299bf6814279a6a1411a7e866a631"
const isVerbose = true
const artifactAdapter = new TruffleArtifactAdapter(projectRoot, solcVersion)
const provider = new ProviderEngine()

if (mode === "profile") {
  global.profilerSubprovider = new ProfilerSubprovider(
    artifactAdapter,
    defaultFromAddress,
    isVerbose
  )
  global.profilerSubprovider.stop()
  provider.addProvider(global.profilerSubprovider)
  provider.addProvider(
    new WebsocketSubprovider({ rpcUrl: "http://localhost:8545" })
  )
} else {
  if (mode === "coverage") {
    global.coverageSubprovider = new CoverageSubprovider(
      artifactAdapter,
      defaultFromAddress,
      {
        isVerbose,
        ignoreFilesGlobs: [
          "**/node_modules/**",
          "**/contracts/mocks/**",
          "**/contracts/interfaces/**",
          "**/contracts/Migrations.sol",
          "**/test/**",
        ],
      }
    )
    provider.addProvider(global.coverageSubprovider)
  } else if (mode === "trace") {
    const revertTraceSubprovider = new RevertTraceSubprovider(
      artifactAdapter,
      defaultFromAddress,
      isVerbose
    )
    provider.addProvider(revertTraceSubprovider)
  }
  provider.addProvider(
    new WebsocketSubprovider({ rpcUrl: "http://localhost:8545" })
  )
}
provider.start(err => {
  if (err !== undefined) {
    console.log(err)
    process.exit(1)
  }
})
/**
 * HACK: Truffle providers should have `send` function, while `ProviderEngine` creates providers with `sendAsync`,
 * but it can be easily fixed by assigning `sendAsync` to `send`.
 */
provider.send = provider.sendAsync.bind(provider)

const mnemonic = process.env.MNENOMIC
// Create your own key for Production environments (https://infura.io/)
const INFURA_ID = process.env.INFURA_ID || "d6760e62b67f4937ba1ea2691046f06d"

const configNetwok = (
  network,
  networkId,
  path = "m/44'/60'/0'/0/",
  gas = 4465030,
  gasPrice = 1e10
) => ({
  provider: () =>
    new HDWalletProvider(
      mnemonic,
      `https://${network}.infura.io/v3/${INFURA_ID}`,
      0,
      1,
      true,
      path
    ),
  networkId,
  gas,
  gasPrice,
})

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    local: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    development: {
      provider,
      network_id: "*",
    },
    ropsten: configNetwok("ropsten", 3),
    kovan: configNetwok("kovan", 42),
    rinkeby: configNetwok("rinkeby", 4),
    main: configNetwok("mainnet", 1),
  },
  compilers: {
    solc: {
      version: "0.5.2",
    },
  },
}
