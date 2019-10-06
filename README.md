# TrueDeck Quorido

Multi-Blockchain Provably Fair Casino Platform by TrueDeck

## Requirements

- Node
- Yarn

_**Note:** For Windows, first setup WSL by following [this](./WINDOWS_DEVELOPMENT_SETUP.md) guide._

## Getting Started

- Clone the repository

```bash
git clone https://github.com/TrueDeck/truedeck-quorido.git
```

_**Note:** For WSL, repository should not be cloned in Ubuntu file system._

- Bootstrap the monorepo

```bash
cd truedeck-quorido
yarn bootstrap
```

_**Note:** For WSL, use Ubuntu terminal and navigate to repository using drive mounts in `/mnt` directory._

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
