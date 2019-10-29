import web3 from "web3"
const BN = web3.utils.BN

import {
  ZERO_ADDRESS,
  ZERO_ADDRESS_HEX,
  WRONG_ADDRESS_1,
  WRONG_ADDRESS_2,
  WRONG_CHECKSUM_ADDRESS,
} from "./constants"

function isValidAddress(address) {
  return (
    address !== undefined &&
    address !== ZERO_ADDRESS &&
    address !== ZERO_ADDRESS_HEX &&
    web3.utils.isAddress(address)
  )
}

function getInvalidArgumentError(label, argName, argValue) {
  return new Error(
    "Invalid " +
      label +
      " `" +
      argValue +
      "` supplied for" +
      " `" +
      argName +
      "` argument."
  )
}

function validateAddress(address, argName) {
  if (!isValidAddress(address)) {
    throw getInvalidArgumentError("address", argName, address)
  }
}

function getRandomAddress() {
  return web3.utils.randomHex(20)
}

function getRandomHex(size) {
  return web3.utils.randomHex(size)
}

function getInvalidAddress() {
  const invalidAddress = [
    ZERO_ADDRESS,
    ZERO_ADDRESS_HEX,
    WRONG_ADDRESS_1,
    WRONG_ADDRESS_2,
    WRONG_CHECKSUM_ADDRESS,
  ]
  return invalidAddress[Math.floor(Math.random() * invalidAddress.length)]
}

function getRandomUint256() {
  return new BN(
    web3.utils.randomHex(Math.floor(Math.random() * 32)),
    16
  ).toString(10)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export {
  isValidAddress,
  getInvalidArgumentError,
  validateAddress,
  getRandomAddress,
  getRandomHex,
  getInvalidAddress,
  getRandomUint256,
  sleep,
}
