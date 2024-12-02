import { BigDecimal, BigInt, log } from "@graphprotocol/graph-ts";
import { Vault, VaultSnapshot } from "../types/schema";
import {
  PrevAnnualVaultSnapshot,
  PrevDailyVaultSnapshot,
  PrevMonthlyVaultSnapshot,
  PrevVaultSnapshot,
  PrevWeeklyVaultSnapshot,
} from "../types/schemas";
import { Snapshot } from "../types/templates/vault/Vault";

const oneHourInSeconds = 60 * 60;
const oneDayInSeconds = 24 * oneHourInSeconds;
const oneMonthInSeconds = 30 * 24 * oneHourInSeconds;
const oneYearInSeconds = 365 * 24 * oneHourInSeconds;
const oneWeekInSeconds = 7 * 24 * oneHourInSeconds;

class TotalT0ValuePerLPT {
  totalT0ValuePerLPT: BigDecimal;
  t1PerLpToken: BigDecimal;

  constructor(totalT0ValuePerLPT: BigDecimal, t1PerLpToken: BigDecimal) {
    this.totalT0ValuePerLPT = totalT0ValuePerLPT;
    this.t1PerLpToken = t1PerLpToken;
  }
}

export class FeeArrAmounts {
  yearlyAPR: BigDecimal;
  averageAprPerSecond: BigDecimal;
  weeklyFeeApr: BigDecimal;
  dailyFeeApr: BigDecimal;

  constructor(annualFeeARR: BigDecimal, averageAprPerSecond: BigDecimal, weeklyFeeApr: BigDecimal, dailyFeeApr: BigDecimal) {
    this.yearlyAPR = annualFeeARR;
    this.averageAprPerSecond = averageAprPerSecond;
    this.weeklyFeeApr = weeklyFeeApr;
    this.dailyFeeApr = dailyFeeApr;
  }
}

class PrevSnapshot {
  sqrtPriceX96: BigInt;
  totalAmount0: BigInt;
  totalSupply: BigInt;
  totalAmount1: BigInt;
  timestamp: BigInt;

  constructor(
    sqrtPriceX96: BigInt,
    totalAmount0: BigInt,
    totalSupply: BigInt,
    totalAmount1: BigInt,
    timestamp: BigInt
  ) {
    this.sqrtPriceX96 = sqrtPriceX96;
    this.totalAmount0 = totalAmount0;
    this.totalSupply = totalSupply;
    this.totalAmount1 = totalAmount1;
    this.timestamp = timestamp;
  }
}

export function calculateDailyApy(
  currentSnapshot: VaultSnapshot,
  lastSnapshot: PrevDailyVaultSnapshot
): BigDecimal {
  const prevSnapshot: PrevSnapshot = new PrevSnapshot(
    lastSnapshot.sqrtPriceX96,
    lastSnapshot.totalAmount0,
    lastSnapshot.totalSupply,
    lastSnapshot.totalAmount1,
    lastSnapshot.timestamp
  );
  return calculateApy(currentSnapshot, prevSnapshot, oneYearInSeconds);
}

export function calculateYearlyApy(
  currentSnapshot: VaultSnapshot,
  lastSnapshot: PrevAnnualVaultSnapshot
): BigDecimal {
  const prevSnapshot: PrevSnapshot = new PrevSnapshot(
    lastSnapshot.sqrtPriceX96,
    lastSnapshot.totalAmount0,
    lastSnapshot.totalSupply,
    lastSnapshot.totalAmount1,
    lastSnapshot.timestamp
  );
  return calculateApy(currentSnapshot, prevSnapshot, oneYearInSeconds);
}

export function calculateHourlyApy(
  currentSnapshot: VaultSnapshot,
  lastSnapshot: PrevVaultSnapshot
): BigDecimal {
  const prevSnapshot: PrevSnapshot = new PrevSnapshot(
    lastSnapshot.sqrtPriceX96,
    lastSnapshot.totalAmount0,
    lastSnapshot.totalSupply,
    lastSnapshot.totalAmount1,
    lastSnapshot.timestamp
  );
  return calculateApy(currentSnapshot, prevSnapshot, oneYearInSeconds);

  // return BigDecimal.zero();
}

export function calculateMonthlyApy(
  currentSnapshot: VaultSnapshot,
  lastSnapshot: PrevMonthlyVaultSnapshot
): BigDecimal {
  const prevSnapshot: PrevSnapshot = new PrevSnapshot(
    lastSnapshot.sqrtPriceX96,
    lastSnapshot.totalAmount0,
    lastSnapshot.totalSupply,
    lastSnapshot.totalAmount1,
    lastSnapshot.timestamp
  );
  return calculateApy(currentSnapshot, prevSnapshot, oneMonthInSeconds);
}

export function getPoolValuePerLpToken(
  sqrtPriceNumber: BigInt,
  amount0: BigInt,
  totalSupply: BigInt,
  amount1: BigInt
): TotalT0ValuePerLPT {
  const sqrtPrice = sqrtPriceNumber.times(sqrtPriceNumber).toBigDecimal();
  log.info("sqrtPrice: {}", [sqrtPriceNumber.toString()]);
  
  const tenPow18 = BigInt.fromI32(10).pow(18);
  const twoPow192 = BigInt.fromI32(2).pow(192);
  const price = sqrtPrice.div(twoPow192.toBigDecimal());

  const currentPrice = price;

  if (totalSupply.equals(BigInt.fromI32(0))) {
    return new TotalT0ValuePerLPT(
      BigDecimal.fromString("0"),
      BigDecimal.fromString("0")
    );
  }
  const t0PerLp = amount0.times(tenPow18).div(totalSupply);
  log.info("t0PerLp: {}", [t0PerLp.toString()]);

  const t1PerLp = amount1.times(tenPow18).div(totalSupply);
  log.info("t1PerLp: {}", [t1PerLp.toString()]);


  const t1PerLpToken = t1PerLp.toBigDecimal().div(tenPow18.toBigDecimal());

  if (currentPrice.equals(BigDecimal.fromString("0"))) {
    return new TotalT0ValuePerLPT(
      BigDecimal.fromString("0"),
      BigDecimal.fromString("0")
    );
  }

  log.info("currentPrice: {}", [currentPrice.toString()]);

  const fraction = t1PerLpToken.div(currentPrice);

  const t0PerLpToken = t0PerLp.toBigDecimal().div(tenPow18.toBigDecimal());

  const totalT0ValuePerLPT = t0PerLpToken.plus(fraction);

  return new TotalT0ValuePerLPT(totalT0ValuePerLPT, t1PerLpToken);
}

function getFractionOfTheYear(
  duration: BigInt,
  totalSecondsInAYear: BigDecimal
): BigDecimal {
  const fraction = duration.toBigDecimal().div(totalSecondsInAYear);
  return fraction;
}

function calculateApy(
  currentSnapshot: VaultSnapshot,
  lastSnapshot: PrevSnapshot,
  periodInSeconds: number
): BigDecimal {
  if (lastSnapshot.totalSupply.equals(BigInt.fromI32(0))) {
    return BigDecimal.fromString("0");
  }
  if (lastSnapshot.sqrtPriceX96.equals(BigInt.fromI32(0))) {
    return BigDecimal.fromString("0");
  }
  const currentPoolShare: TotalT0ValuePerLPT = getPoolValuePerLpToken(
    currentSnapshot.sqrtPriceX96,
    currentSnapshot.totalAmount0,
    currentSnapshot.totalSupply,
    currentSnapshot.totalAmount1
  );

  const lastPoolShare: TotalT0ValuePerLPT = getPoolValuePerLpToken(
    lastSnapshot.sqrtPriceX96,
    lastSnapshot.totalAmount0,
    lastSnapshot.totalSupply,
    lastSnapshot.totalAmount1
  );

  const duration = currentSnapshot.timestamp.minus(lastSnapshot.timestamp);
  log.info("duration: {}", [duration.toString()]);

  const fraction = getFractionOfTheYear(
    duration,
    BigDecimal.fromString(periodInSeconds.toString())
  );

  log.info("fraction: {}", [fraction.toString()]);

  log.info("currentPoolShare: {}", [
    currentPoolShare.totalT0ValuePerLPT.toString(),
  ]);

  log.info("lastPoolShare: {}", [lastPoolShare.totalT0ValuePerLPT.toString()]);

  if (lastPoolShare.totalT0ValuePerLPT.equals(BigDecimal.fromString("0"))) {
    return BigDecimal.fromString("0");
  }

  const returns = currentPoolShare.totalT0ValuePerLPT.minus(
    lastPoolShare.totalT0ValuePerLPT
  );

  if (currentPoolShare.t1PerLpToken.equals(BigDecimal.fromString("0"))) {
    return BigDecimal.fromString("0");
  }

  log.info("returns: {}", [returns.toString()]);

  log.info("currentPoolShare.t0PerLpToken: {}", [
    currentPoolShare.t1PerLpToken.toString(),
  ]);
  // const percentageReturns = returns.div(currentPoolShare.t1PerLpToken);
  const percentageReturns = currentPoolShare.totalT0ValuePerLPT
    .div(lastPoolShare.totalT0ValuePerLPT)
    .minus(BigDecimal.fromString("1"));

  log.info("percentageReturns: {}", [percentageReturns.toString()]);
  const apy = getApy(percentageReturns, fraction);

  return apy;
}

function getApy(perReturns: BigDecimal, fraction: BigDecimal): BigDecimal {
  if (fraction.equals(BigDecimal.fromString("0"))) {
    return BigDecimal.fromString("0");
  }

  const rate =
    parseFloat(
      BigDecimal.fromString("1")
        .plus(perReturns)
        .toString()
    ) **
    (1 / parseFloat(fraction.toString()));

  const finalRate = BigDecimal.fromString((rate - 1).toString());

  const returns = BigDecimal.fromString("1")
    .plus(finalRate)
    .div(fraction);

  const apy = parseFloat(returns.toString()) ** parseFloat(fraction.toString());

  if (isNaN(apy)) {
    return BigDecimal.fromString("0");
  }
  return BigDecimal.fromString((apy - 1).toString())
    .times(BigDecimal.fromString("100"))
    .truncate(2);
}

export function getFeeArr(
  currentSnapshot: VaultSnapshot,
  prevVaultSnapshot: PrevVaultSnapshot,
  vault: Vault,
  interval: String
): FeeArrAmounts {
  // calculate the current price from sqrt ratio from current snapshot

  const sqrtPrice = currentSnapshot.sqrtPriceX96.times(
    currentSnapshot.sqrtPriceX96
  );

  // log.info("sqrtPrice: {}", [currentSnapshot.sqrtPriceX96.toString()]);
  const tenPow18 = BigInt.fromI32(10).pow(18);
  const twoPow192 = BigInt.fromI32(2).pow(192);
  const price = sqrtPrice.times(tenPow18).div(twoPow192);
  // calculate ratio

  // log.info("price: {}", [price.toString()]);

  const ratio = price.toBigDecimal().div(tenPow18.toBigDecimal());

  log.info("ratio: {}", [ratio.toString()]);

  // calculate amount1 in terms of amount0
  const amount1 = ratio.times(currentSnapshot.totalAmount0.toBigDecimal());

  // log.info("amount1: {}", [amount1.toString()]);

  // log.info("currentSnapshot.totalAmount1: {}", [currentSnapshot.totalAmount1.toString()]);

  // calculate the total value of the pool
  const totalToken1Amounts = amount1.plus(
    currentSnapshot.totalAmount1.toBigDecimal()
  );

  log.info("Asset 1 combined: {}", [totalToken1Amounts.toString()]);

  // calculate total Fees from vault in terms
  const actualFees0 = vault.fees0.minus(prevVaultSnapshot.fees0);

  log.info("actualFees0: {}", [actualFees0.toString()]);

  // fees1 earned on this one
  const actualFees1 = vault.fees1.minus(prevVaultSnapshot.fees1);

  log.info("actualFees1: {}", [actualFees1.toString()]);

  // calculate the total fees in terms of token1
  const fees1 = ratio.times(actualFees0.toBigDecimal());

  log.info("fees1: {}", [fees1.toString()]);

  // calculate the total value of the pool including fees
  const feesCombined = fees1.plus(actualFees1.toBigDecimal());
  log.info("feesCombined: {}", [feesCombined.toString()]);

  // duration
  const duration = currentSnapshot.timestamp.minus(prevVaultSnapshot.timestamp);

  log.info("duration: {}", [duration.toString()]);

  if (duration.equals(BigInt.fromI32(0))) {
    return new FeeArrAmounts(
      BigDecimal.fromString("0"),
      BigDecimal.fromString("0"),
      BigDecimal.fromString("0"),
      BigDecimal.zero(),
    );
  }

  let averageAprPerSecond = BigDecimal.zero();
  let totalSnapshots = vault.totalSnapshots;
  
  if (totalToken1Amounts.equals(BigDecimal.zero())) {
    totalSnapshots = totalSnapshots.minus(BigInt.fromString("1"));
    if (totalSnapshots.equals(BigInt.zero())) {
      return new FeeArrAmounts(
        BigDecimal.fromString("0"),
        BigDecimal.fromString("0"),
        BigDecimal.fromString("0"),
        BigDecimal.zero(),
      );
    }
    
    averageAprPerSecond = vault.averageFeeArrPerSecond.div((vault.totalSnapshots.toBigDecimal().minus(BigDecimal.fromString('1')).div(vault.totalSnapshots.toBigDecimal())))
  } else {
    const averagePerSecond = feesCombined
    .div(totalToken1Amounts)
    .div(duration.toBigDecimal());
    log.info("averagePerSecond: {}", [averagePerSecond.toString()]);

    averageAprPerSecond = vault.averageFeeArrPerSecond.plus(
      averagePerSecond
    );
  }
  // calculate average per second

  log.info("averageAprPerSecond: {}", [averageAprPerSecond.toString()]);

  log.info("Total snapshots: {}", [totalSnapshots.toString()]);

  const annualFeeARR = getApr(
    'yearly',
    averageAprPerSecond,
    totalSnapshots
  );

  const dailyFeeApr = getApr(
    'daily',
    averageAprPerSecond,
    totalSnapshots
  );

  const weeklyFeeApr = getApr(
    'weekly',
    averageAprPerSecond,
    totalSnapshots
  );

  log.info("annualFeeARR: {}", [annualFeeARR.toString()]);

  // return averageAprPerSecond.

  return new FeeArrAmounts(annualFeeARR, averageAprPerSecond, weeklyFeeApr, dailyFeeApr);
}

function getApr(interval: String, averageAprPerSecond: BigDecimal, totalSnapshots: BigInt): BigDecimal {
  const aprDuration =
  interval === "daily"
    ? oneDayInSeconds
    : interval === "weekly"
    ? oneYearInSeconds
    : oneYearInSeconds;

const annualFeeARR = averageAprPerSecond
  .div(totalSnapshots.toBigDecimal())
  .times(BigDecimal.fromString(aprDuration.toString()))
  .times(BigDecimal.fromString("100"))
  .truncate(2);

  return annualFeeARR;
}

// export function getCombined
export function getWeeklyAprs(
  currentSnapshot: VaultSnapshot,
  prevVaultSnapshot: PrevVaultSnapshot,
  weeklySnapshot: PrevWeeklyVaultSnapshot,
  vault: Vault
): FeeArrAmounts {

  const sqrtPrice = currentSnapshot.sqrtPriceX96.times(
    currentSnapshot.sqrtPriceX96
  );

  // log.info("sqrtPrice: {}", [currentSnapshot.sqrtPriceX96.toString()]);
  const tenPow18 = BigInt.fromI32(10).pow(18);
  const twoPow192 = BigInt.fromI32(2).pow(192);
  const price = sqrtPrice.times(tenPow18).div(twoPow192);
  // calculate ratio

  // log.info("price: {}", [price.toString()]);

  const ratio = price.toBigDecimal().div(tenPow18.toBigDecimal());

  log.info("ratio: {}", [ratio.toString()]);

  // calculate amount1 in terms of amount0
  const amount1 = ratio.times(currentSnapshot.totalAmount0.toBigDecimal());

  // log.info("amount1: {}", [amount1.toString()]);

  // log.info("currentSnapshot.totalAmount1: {}", [currentSnapshot.totalAmount1.toString()]);

  // calculate the total value of the pool
  const totalToken1Amounts = amount1.plus(
    currentSnapshot.totalAmount1.toBigDecimal()
  );

  log.info("Asset 1 combined: {}", [totalToken1Amounts.toString()]);

  // calculate total Fees from vault in terms
  const actualFees0 = vault.fees0.minus(prevVaultSnapshot.fees0);

  log.info("actualFees0: {}", [actualFees0.toString()]);

  // fees1 earned on this one
  const actualFees1 = vault.fees1.minus(prevVaultSnapshot.fees1);

  log.info("actualFees1: {}", [actualFees1.toString()]);

  // calculate the total fees in terms of token1
  const fees1 = ratio.times(actualFees0.toBigDecimal());

  log.info("fees1: {}", [fees1.toString()]);

  // calculate the total value of the pool including fees
  const feesCombined = fees1.plus(actualFees1.toBigDecimal());
  log.info("feesCombined: {}", [feesCombined.toString()]);

  // duration
  const duration = currentSnapshot.timestamp.minus(prevVaultSnapshot.timestamp);

  log.info("duration: {}", [duration.toString()]);

  if (duration.equals(BigInt.fromI32(0))) {
    return new FeeArrAmounts(
      BigDecimal.fromString("0"),
      BigDecimal.fromString("0"),
      BigDecimal.fromString("0"),
      BigDecimal.zero(),
    );
  }

  let averageAprPerSecond = BigDecimal.zero();
  let totalSnapshots = weeklySnapshot.totalSnapshots;
  
  if (totalToken1Amounts.equals(BigDecimal.zero())) {
    totalSnapshots = totalSnapshots.minus(BigInt.fromString("1"));
    if (totalSnapshots.equals(BigInt.zero())) {
      return new FeeArrAmounts(
        BigDecimal.fromString("0"),
        BigDecimal.fromString("0"),
        BigDecimal.fromString("0"),
        BigDecimal.zero(),
      );
    }
    
    averageAprPerSecond = weeklySnapshot.averageFeeArrPerSecond.div((weeklySnapshot.totalSnapshots.toBigDecimal().minus(BigDecimal.fromString('1')).div(weeklySnapshot.totalSnapshots.toBigDecimal())))
  } else {
    const averagePerSecond = feesCombined
    .div(totalToken1Amounts)
    .div(duration.toBigDecimal());
    log.info("averagePerSecond: {}", [averagePerSecond.toString()]);

    averageAprPerSecond = weeklySnapshot.averageFeeArrPerSecond.plus(
      averagePerSecond
    );
  }
  // calculate average per second

  log.info("averageAprPerSecond: {}", [averageAprPerSecond.toString()]);

  log.info("Total snapshots: {}", [totalSnapshots.toString()]);

  const annualFeeARR = getApr(
    'yearly',
    averageAprPerSecond,
    totalSnapshots
  );

  const dailyFeeApr = getApr(
    'daily',
    averageAprPerSecond,
    totalSnapshots
  );

  const weeklyFeeApr = getApr(
    'weekly',
    averageAprPerSecond,
    totalSnapshots
  );

  log.info("annualFeeARR: {}", [annualFeeARR.toString()]);

  // return averageAprPerSecond.

  return new FeeArrAmounts(annualFeeARR, averageAprPerSecond, weeklyFeeApr, dailyFeeApr);
}