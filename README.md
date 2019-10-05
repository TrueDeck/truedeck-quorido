# TrueDeck Quorido

Multi-Blockchain Provably Fair Casino Platform by TrueDeck

## Requirements
- Node
- Yarn

## Getting Started
- Clone the repository
```bash
git clone https://github.com/TrueDeck/truedeck-quorido.git
```

- Bootstrap the monorepo with lerna
```bash
cd truedeck-quorido
npx lerna bootstrap
```

## Develop
While being in the root folder of monorepo:

In a new terminal window, run local blockchain:
```bash
yarn blockchain:start
```
In a new terminal window, deploy contracts on local blockchain: 
```bash
yarn contracts:create
```
In a new terminal window, launch DApps with hot-reloading support:
```bash
yarn dapp:develop
```
Now you can start developing!

## Test
Tests for the entire monorepo can be run by: 
```bash
yarn test
```

## Contract Development
- [`Solidity Contract Development`](./packages/contracts-solidity#readme)

## Licence

MIT
