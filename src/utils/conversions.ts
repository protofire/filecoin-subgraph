import { BigDecimal, BigInt, ByteArray, Bytes, crypto } from '@graphprotocol/graph-ts'


export function getUniqueId(inputIds: Array<string>): string {

  const idElement = inputIds.join('-');

  const normalizedId = idElement.length % 2 !== 0 ? "0"+idElement: idElement

  const id = crypto.keccak256(ByteArray.fromHexString(normalizedId));
  
  return id.toHexString();
}

export function bigIntToBigDecimal(value: BigInt, decimals: BigInt): BigDecimal {
  if (value == BigInt.fromI32(0)) {
    return value.toBigDecimal()
  }
  return value.toBigDecimal().div(exponentToBigDecimal(decimals))
}


export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = BigInt.fromI32(0); i.lt(decimals as BigInt); i = i.plus(BigInt.fromI32(1))) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}
