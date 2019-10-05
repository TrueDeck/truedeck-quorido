#! /bin/sh

# Exit script as soon as a command fails.
set -o errexit

ganache_port=8545
network=local
owner=0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0
signer=0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b
deployer=0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d

ganache_running() {
  nc -z localhost "$ganache_port"
}

create_contracts() {
  rm -rf build .0x-artifacts coverage
  rm -f .openzeppelin/dev-4447.json
  node_modules/.bin/openzeppelin compile

  chip_address=$(node_modules/.bin/openzeppelin create Chip --init --args Chip,CHIP,18,1000000000000000000000000,$owner,[$owner],[$owner] --network $network --from $deployer --skip-compile)
  echo "- Chip     : ${chip_address}"

  bankroll_address=$(node_modules/.bin/openzeppelin create Bankroll --init --args $owner --network $network --from $deployer --skip-compile)
  echo "- Bankroll : ${bankroll_address}"

  dice_address=$(node_modules/.bin/openzeppelin create Dice --init --args $owner,$signer,$bankroll_address --network $network --from $deployer --skip-compile)
  echo "- Dice     : ${dice_address}"
  echo "All contracts created successfully!"
  echo ""
}

if ganache_running; then
  echo ""
  echo "Creating contracts:"
  echo "===================="
  create_contracts
else
  echo "ERROR: Blockchain not running!"
  echo "  Use \"yarn blockchain:start\" to start blockchain and try again!"
  start_ganache
fi
