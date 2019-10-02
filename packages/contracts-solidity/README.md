# TrueDeck Quorido

Multi-Blockchain Provably Fair Casino Platform by TrueDeck

## Requirements

Install Truffle, Ganache, and OpenZeppelin

```bash
npm install -g truffle@5.0.2 ganache-cli@6.3.0 @openzeppelin/cli@2.5.0
```

## Getting Started

- Clone the repository
- Install packages in both root and client folder.

## Run

In a new terminal window, run your local blockchain:

```bash
ganache-cli --deterministic
```

Compile smart-contracts:

```bash
truffle compile
```

Deploy Contracts (Chip, Bankroll and Dice) using OpenZeppelin CLI:

```bash
openzeppelin create
```

In a new terminal window, in the `client` directory, run the Gatsby app:

```bash
cd client
gatsby develop
```

## Test

In a new terminal window, run your local blockchain:

```bash
ganache-cli --deterministic
```

### Solidity Tests

```bash
npm test
```

## Sol-trace

Now we don't need to check all the require and revert statements but we know exactly which one reverted and who called it.

```bash
npm run trace
```

## Sol-coverage

```bash
npm run coverage
```

## Sol-profiler

```bash
npm run profile
```

Both coverage and profile commands will generate the HTML report and open it in the default browser. You can use any other istanbul reporter too. (text, json, etc.).

## Licence

MIT
