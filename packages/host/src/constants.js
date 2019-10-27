import web3 from "web3"
const BN = web3.utils.BN

export const MAX_UINT256 = new BN("2").pow(new BN("256")).sub(new BN("1"))
export const MAX_INT256 = new BN("2").pow(new BN("255")).sub(new BN("1"))
export const MIN_INT256 = new BN("2").pow(new BN("255")).mul(new BN("-1"))

export const ZERO_ADDRESS = "0000000000000000000000000000000000000000"
export const ZERO_ADDRESS_HEX = "0x0000000000000000000000000000000000000000"
export const WRONG_ADDRESS_1 = "abcdef"
export const WRONG_ADDRESS_2 = "0xAAc1912fEE45d61C87Cc5EA59DaE31190FFFFf232d"
export const WRONG_CHECKSUM_ADDRESS =
  "0xC1912fEE45d61C87Cc5EA59DaE31190FFFFf232d"
