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

In a new terminal window, in the `client` directory, run the React app:

```bash
cd client
npm run start
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

### React Tests
Jest is included for testing React components. Compile your contracts before running Jest, or you may receive some file not found errors.

```javascript
truffle compile
cd client
npm run test
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

(0) 0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1 (~100 ETH)
(1) 0xffcf8fdee72ac11b5c542428b35eef5769c409f0 (~100 ETH)
(2) 0x22d491bde2303f2f43325b2108d26f1eaba1e32b (~100 ETH)


Both coverage and profile commands will generate the HTML report and open it in the default browser. You can use any other istanbul reporter too. (text, json, etc.).

## Licence

MIT
