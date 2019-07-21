# TrueDeck Quorido
Multi-Blockchain Provably Fair Casino Platform by TrueDeck

## Requirements

Install ZeppelinOS, Ganache, and Truffle

```bash
npm install -g truffle@5.0.2 ganache-cli@6.3.0 zos@2.4.0
```

## Getting Started

- Clone the repository
- Install packages in both root and client folder.

## Run

In a new terminal window, run your local blockchain:

```bash
ganache-cli --secure -u 0 -u 1 -u 2 deterministic
```

Compile and deploy smart-contracts on your local blockchain:

```bash
zos create
```

In a new terminal window, in the `client` directory, run the React app:

```bash
cd client
npm run start
```

## Test

### Solidity Tests

```bash
npm test
```

### React Tests
Jest is included for testing React components. Compile your contracts before running Jest, or you may receive some file not found errors.

```javascript
// ensure you are inside the client directory when running this
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

It will generate the HTML report and open it in the default browser. You can use any other istanbul reporter too. (text, json, etc.).

## Sol-profiler

Keep your local ganache blockchain running and run below command:

```bash
npm run profile
```

## Licence

MIT
