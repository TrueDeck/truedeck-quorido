# `@truedeck/quorido-contracts-solidity`

OpenZeppelin Upgradable Solidity Contracts for Multi-Blockchain Provably Fair Casino Platform by TrueDeck

## Requirements

- First clone and setup the monorepo, as described [here](https://github.com/TrueDeck/truedeck-quorido#readme).

## Develop

After setting up the monorepo, you can start making changes to Solidity Smart-Contracts and Tests.

### Test

Solidity Smart-Contract Tests can be run by:

```bash
cd truedeck-quorido/packages/contract-solidity
yarn test
```

### Trace, Coverage and Profile

First, navigate to `contracts-solidity` directory:

```bash
cd truedeck-quorido/packages/contract-solidity
```

Use below commands to:

- Trace a failed transaction

```bash
yarn trace
```

- Run coverage and view report

```bash
yarn coverage
```

- Profile smart-contracts and view report

```bash
yarn profile
```

_Both coverage and profile commands will generate the HTML report and open it in the default browser. You can use any other istanbul reporter too. (text, json, etc.)._

## Deploy

First, navigate to `contracts-solidity` directory:

```bash
cd truedeck-quorido/packages/contract-solidity
```

Run a local blockchain:

```bash
yarn blockchain:start
```

Deploy contracts on the local blockchain:

```bash
yarn contracts:create
```

## Licence

MIT
