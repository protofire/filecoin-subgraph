import {
  BeaconConfigUpdated,
  BeaconDeregistered,
  BeaconRegistered,
  VaultStateChanged,
} from "../../generated/VaultRegistry/VaultRegistry";
import {
  Depositor,
  LeaderBoard,
  Vault,
  VaultBeacon,
  VaultPosition,
  VaultSnapshot
} from "../types/schema";
import { DynamicJob, Vault as VaultTemplate } from "../types/templates";
import { LiquiditySteer, VaultDeposit, VaultWithdraw } from "./../types/schema";

import {
  Deposit,
  FeesEarned,
  Snapshot,
  Vault as VaultContract,
  Withdraw
} from "../types/templates/vault/Vault";

import { Vault as SinglePositionContract } from "../types/templates/vault/SinglePostionVault";

import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { VaultCreated } from "../../generated/VaultRegistry/VaultRegistry";

import {
  BEACONS_SINGLE_POSITIONS,
  BEACON_NAME_DYNAMIC_JOBS,
  BEACON_NAME_SINGLE_SCHEDULED_JOBS,
} from "../utils/constants";

import { getUniqueId } from "../utils/conversions";

import { SteerPeriphery } from "../../generated/VaultRegistry/SteerPeriphery";

import { log } from "@graphprotocol/graph-ts";

import {
  STEER_PERIPHERY_ADDRESS_FILECOIN
} from "../utils/constants";


import {
  PrevAnnualVaultSnapshot,
  PrevDailyVaultSnapshot,
  PrevMonthlyVaultSnapshot,
  PrevVaultSnapshot,
  PrevWeeklyVaultSnapshot,
} from "../types/schemas";

import { FeeArrAmounts, getFeeArr, getWeeklyAprs } from "../utils/vaultUtils";

const STEER_PERIPHERY_ADDRESS = STEER_PERIPHERY_ADDRESS_FILECOIN;
// const STEER_PERIPHERY_ADDRESS = STEER_PERIPHERY_ADDRESS_FANTOM;

export function handleVaultCreation(event: VaultCreated): void {
  let vault = new Vault(event.params.vault.toHexString());

  vault.totalValueLockedToken0 = BigDecimal.zero();
  vault.totalValueLockedToken1 = BigDecimal.zero();
  vault.totalAmount0 = BigDecimal.zero();
  vault.totalAmount1 = BigDecimal.zero();

  let vaultContract = VaultContract.bind(event.params.vault);

  const steerPeriphery = SteerPeriphery.bind(STEER_PERIPHERY_ADDRESS);

  const steerPeripheryVaultDetailsResult = steerPeriphery.try_vaultDetailsByAddress(
    event.params.vault
  );

  vault.vaultManager = event.params.vaultManager.toHex();

  if (!steerPeripheryVaultDetailsResult.reverted) {
    const vaultData = steerPeripheryVaultDetailsResult.value;
    vault.totalLPTokensIssued = vaultData.totalLPTokensIssued;
    vault.token1Symbol = vaultData.token1Symbol;
    vault.decimals = vaultData.decimals;
    vault.feeTier = vaultData.feeTier;
    vault.name = vaultData.name;
    vault.symbol = vaultData.symbol;
    vault.token0Balance = vaultData.token0Balance;
    vault.token0Decimals = vaultData.token0Decimals;
    vault.token0Name = vaultData.token0Name;
    vault.token0Symbol = vaultData.token0Symbol;
    vault.token1Balance = vaultData.token1Balance;
    vault.token1Decimals = vaultData.token1Decimals;
    vault.token1Name = vaultData.token1Name;
  } else {
    const algebraSteerPeripheryVaultDetailsResult = steerPeriphery.try_algebraVaultDetailsByAddress(
      event.params.vault
    );

    if (!algebraSteerPeripheryVaultDetailsResult.reverted) {
      const vaultData = algebraSteerPeripheryVaultDetailsResult.value;
      vault.totalLPTokensIssued = vaultData.totalLPTokensIssued;
      vault.token1Symbol = vaultData.token1Symbol;
      vault.decimals = vaultData.decimals;
      vault.feeTier = BigInt.fromString("3000");
      vault.name = vaultData.name;
      vault.symbol = vaultData.symbol;
      vault.token0Balance = vaultData.token0Balance;
      vault.token0Decimals = vaultData.token0Decimals;
      vault.token0Name = vaultData.token0Name;
      vault.token0Symbol = vaultData.token0Symbol;
      vault.token1Balance = vaultData.token1Balance;
      vault.token1Decimals = vaultData.token1Decimals;
      vault.token1Name = vaultData.token1Name;
    } else {
      vault.totalLPTokensIssued = BigInt.zero();
      vault.token1Symbol = "";
      vault.decimals = BigInt.zero();
      vault.feeTier = BigInt.zero();
      vault.name = "";
      vault.token0Balance = BigInt.zero();
      vault.token0Decimals = BigInt.zero();
      vault.token0Name = "";
      vault.token0Symbol = "";
      vault.token1Balance = BigInt.zero();
      vault.token1Decimals = BigInt.zero();
      vault.token1Name = "";
    }
  }

  const steerPeripheryVaultsResult = steerPeriphery.try_vaultsByStrategy(
    event.params.tokenId
  );

  vault.payloadIpfs = "";
  vault.state = BigInt.fromI32(0); // Has to be 0 when created

  if (!steerPeripheryVaultsResult.reverted) {
    const strategyVaults = steerPeripheryVaultsResult.value;

    for (let counter = 0; counter < strategyVaults.length; counter++) {
      const strategyVault = strategyVaults[counter];

      if (
        strategyVault.vaultAddress.toHexString().toLowerCase() ==
        event.params.vault.toHexString().toLowerCase()
      ) {
        vault.payloadIpfs = strategyVault.payloadIpfs;
        vault.state = BigInt.fromI32(strategyVault.state);
        break;
      }
    }
  }

  const vaultContractToken0Result = vaultContract.try_token0();
  const vaultContractToken1Result = vaultContract.try_token1();

  if (!vaultContractToken0Result.reverted) {
    vault.token0 = vaultContractToken0Result.value.toHexString();
  } else {
    vault.token0 = "";
  }

  if (!vaultContractToken1Result.reverted) {
    vault.token1 = vaultContractToken1Result.value.toHexString();
  } else {
    vault.token1 = "";
  }

  vault.beaconName = event.params.beaconName;

  //Sets the strategy creator
  // vault.deployer = event.params.deployer.toHex();

  vault.deployer = event.transaction.from.toHex();

  let leaderBoard = LeaderBoard.load(vault.deployer);
  if (leaderBoard) {
    leaderBoard.numApps = leaderBoard.numApps.plus(BigInt.fromI32(1));
  } else {
    leaderBoard = new LeaderBoard(vault.deployer);
    leaderBoard.address = vault.deployer;
    leaderBoard.numApps = leaderBoard.numApps.plus(BigInt.fromI32(1));
    leaderBoard.timestamp = event.block.timestamp;
  }

  leaderBoard.save();

  const vaultContractPoolCall = vaultContract.try_pool();
  if (!vaultContractPoolCall.reverted) {
    vault.pool = vaultContractPoolCall.value.toHexString();
  } else {
    vault.pool = "";
  }

  // let vaultContract = VaultContract.bind(event.params.deployer);
  vault.createdAt = event.block.timestamp;

  //Sets all the values to 0
  vault.lastSnapshot = BigInt.fromI32(0);
  vault.annualPercentageYield = BigDecimal.zero();
  vault.annualPercentageDailyYield = BigDecimal.zero();
  vault.annualPercentageMonthlyYield = BigDecimal.zero();
  vault.annualPercentageYearlyYield = BigDecimal.zero();
  //Token Index of the strategy token
  vault.strategyToken = event.params.tokenId.toHexString();

  // let factoryContract = StrategyRegistryContract.bind(SRATEGY_FACTORY_ADDRESS) // to be updated
  //Need to account for the delay

  // Sets the vault status to active
  vault.save();

  if (vault.beaconName == BEACON_NAME_SINGLE_SCHEDULED_JOBS || vault.beaconName == BEACON_NAME_DYNAMIC_JOBS) {
    log.info("Creating DynamicJob template for address: {}", [event.params.vault.toHexString()]);
    DynamicJob.create(event.params.vault);
    log.info("DynamicJob template created", []);
  } else {
    log.info("Creating VaultTemplate for address: {}", [event.params.vault.toHexString()]);
    VaultTemplate.create(event.params.vault); //Creates a new template for the vault
    log.info("Vault template created", []);
  }
}

export function handleVaultCreated(event: VaultCreated): void {
  handleVaultCreation(event);
}

export function handleStateChanged(event: VaultStateChanged): void {
  let vault = Vault.load(event.params.vault.toHexString());
  if (vault == null) {
    return;
  }
  vault.state = BigInt.fromI32(event.params.newState);
  vault.save();
}

export function handleVaultDeposit(event: Deposit): void {
  const ids: Array<string> = [
    event.transaction.hash.toHexString(),
    event.transactionLogIndex.toString(),
  ];

  const id = getUniqueId(ids);

  const depositorId = `${event.address.toHexString()}-${event.params.to.toHex()}`;
  let depositor = Depositor.load(depositorId);

  if (!depositor) {
    depositor = new Depositor(depositorId);
    depositor.createdTimestamp = event.block.timestamp;
  }

  depositor.depositedAmount1 = depositor.depositedAmount1.plus(
    event.params.amount1
  );
  depositor.account = event.params.to.toHexString();
  depositor.executor = event.transaction.from.toHexString();
  depositor.depositCaller = event.params.sender.toHexString();
  depositor.vault = event.address.toHexString();
  depositor.updatedTimestamp = event.block.timestamp;
  depositor.liquidityAmount0 = depositor.liquidityAmount0.plus(
    event.params.amount0
  );
  depositor.liquidityAmount1 = depositor.liquidityAmount1.plus(
    event.params.amount1
  );
  depositor.shares = depositor.shares.plus(event.params.shares);
  depositor.save();

  let deposit = new VaultDeposit(id);
  deposit.vault = event.address.toHexString();
  deposit.amount0 = event.params.amount0.toBigDecimal();
  deposit.amount1 = event.params.amount1.toBigDecimal();
  deposit.executor = event.transaction.from.toHexString();
  deposit.sender = event.params.to.toHexString();
  deposit.blockNumber = event.block.number;
  deposit.depositCaller = event.params.sender.toHexString();
  deposit.shares = event.params.shares;
  deposit.transactionHash = event.transaction.hash.toHexString();
  deposit.token0 = "";
  deposit.token1 = "";

  // deposit.to = event.params.to.toHex();

  deposit.timeStamp = event.block.timestamp;
  // add from
  deposit.save();

  let vault = Vault.load(event.address.toHexString());

  if (!vault) {
    return;
  }

  // update vault balances
  const steerPeriphery = SteerPeriphery.bind(STEER_PERIPHERY_ADDRESS);
  const steerPeripheryVaultDetailsResult = steerPeriphery.try_vaultDetailsByAddress(
    event.address
  );
  if (!steerPeripheryVaultDetailsResult.reverted) {
    const vaultData = steerPeripheryVaultDetailsResult.value;
    vault.totalLPTokensIssued = vaultData.totalLPTokensIssued;
    vault.token0Balance = vaultData.token0Balance;
    vault.token1Balance = vaultData.token1Balance;
  } else {
    const algebraSteerPeripheryVaultDetailsResult = steerPeriphery.try_algebraVaultDetailsByAddress(
      event.address
    );

    if (!algebraSteerPeripheryVaultDetailsResult.reverted) {
      const vaultData = algebraSteerPeripheryVaultDetailsResult.value;
      vault.totalLPTokensIssued = vaultData.totalLPTokensIssued;
      vault.token0Balance = vaultData.token0Balance;
      vault.token1Balance = vaultData.token1Balance;
    }
  }

  vault.totalValueLockedToken0 = vault.totalValueLockedToken0.plus(
    event.params.amount0.toBigDecimal()
  );
  vault.totalValueLockedToken1 = vault.totalValueLockedToken1.plus(
    event.params.amount1.toBigDecimal()
  );

  vault.totalAmount0 = vault.totalAmount0.plus(
    event.params.amount0.toBigDecimal()
  );
  vault.totalAmount1 = vault.totalAmount1.plus(
    event.params.amount1.toBigDecimal()
  );

  vault.save();

  deposit.token0 = vault.token0;
  deposit.token1 = vault.token1;

  // deposit.to = event.params.to.toHex();

  deposit.timeStamp = event.block.timestamp;
  // add from
  deposit.save();
}

export function handleVaultWithdraw(event: Withdraw): void {
  const ids: Array<string> = [
    event.transaction.hash.toHexString(),
    event.transactionLogIndex.toString(),
  ];

  const id = getUniqueId(ids);

  let withdraw = new VaultWithdraw(id);
  withdraw.vault = event.address.toHexString();
  withdraw.amount0 = event.params.amount0.toBigDecimal();
  withdraw.amount1 = event.params.amount1.toBigDecimal();
  withdraw.sender = event.transaction.from.toHex();
  withdraw.transactionHash = event.transaction.hash.toHexString();
  withdraw.shares = event.params.shares;
  
  withdraw.blockNumber = event.block.number;
  let vault = Vault.load(event.address.toHex());
  if (!vault) {
    return;
  }

  const depositorId = `${event.address.toHexString()}-${event.transaction.from.toHexString()}`;
  let depositor = Depositor.load(depositorId);

  if (!depositor) {
    depositor = new Depositor(depositorId);
    depositor.createdTimestamp = event.block.timestamp;
  }

  depositor.withdrawnAmount0 = depositor.withdrawnAmount0.plus(
    event.params.amount0
  );
  depositor.withdrawnAmount1 = depositor.withdrawnAmount1.plus(
    event.params.amount1
  );
  depositor.account = event.transaction.from.toHexString();
  depositor.vault = event.address.toHexString();
  depositor.updatedTimestamp = event.block.timestamp;
  depositor.liquidityAmount0 = depositor.liquidityAmount0.minus(
    event.params.amount0
  );
  depositor.liquidityAmount1 = depositor.liquidityAmount1.minus(
    event.params.amount1
  );
  depositor.shares = depositor.shares.minus(event.params.shares);
  depositor.save();
  // update vault balances
  const steerPeriphery = SteerPeriphery.bind(STEER_PERIPHERY_ADDRESS);
  const steerPeripheryVaultDetailsResult = steerPeriphery.try_vaultDetailsByAddress(
    event.address
  );
  if (!steerPeripheryVaultDetailsResult.reverted) {
    const vaultData = steerPeripheryVaultDetailsResult.value;
    vault.totalLPTokensIssued = vaultData.totalLPTokensIssued;
    vault.token0Balance = vaultData.token0Balance;
    vault.token1Balance = vaultData.token1Balance;
  } else {
    const algebraSteerPeripheryVaultDetailsResult = steerPeriphery.try_algebraVaultDetailsByAddress(
      event.address
    );

    if (!algebraSteerPeripheryVaultDetailsResult.reverted) {
      const vaultData = algebraSteerPeripheryVaultDetailsResult.value;
      vault.totalLPTokensIssued = vaultData.totalLPTokensIssued;
      vault.token0Balance = vaultData.token0Balance;
      vault.token1Balance = vaultData.token1Balance;
    }
  }

  vault.totalValueLockedToken0 = vault.totalValueLockedToken0.minus(
    event.params.amount0.toBigDecimal()
  );
  vault.totalValueLockedToken1 = vault.totalValueLockedToken1.minus(
    event.params.amount1.toBigDecimal()
  );

  vault.totalAmount0 = vault.totalAmount0.minus(
    event.params.amount0.toBigDecimal()
  );
  vault.totalAmount1 = vault.totalAmount1.minus(
    event.params.amount1.toBigDecimal()
  );

  vault.save();

  withdraw.token0 = vault.token0;
  withdraw.token1 = vault.token1;
  withdraw.timeStamp = event.block.timestamp;
  withdraw.save();
}

export function handleSinglePositionVaultPositions(event: Snapshot): void {
  const ids: Array<string> = [
    event.transaction.hash.toHexString(),
    event.transactionLogIndex.toString(),
  ];

  const id = getUniqueId(ids);

  let lowerTick: Array<BigInt> = [];
  let upperTick: Array<BigInt> = [];
  let relativeWeight: Array<BigInt> = [];

  const vaultContract = SinglePositionContract.bind(event.address);
  // get upper tick
  upperTick = [BigInt.fromI32(vaultContract.upperTick())];
  // get lower tick
  lowerTick = [BigInt.fromI32(vaultContract.lowerTick())];

  const positions = new VaultPosition(id);

  positions.upperTick = upperTick;
  positions.lowerTick = lowerTick;
  positions.relativeWeight = relativeWeight;
  positions.timestamp = event.block.timestamp;
  positions.vault = event.address.toHexString();
  positions.save();
}

export function handleMultiPositionVaultPositions(event: Snapshot): void {
  const ids: Array<string> = [
    event.transaction.hash.toHexString(),
    event.transactionLogIndex.toString(),
  ];

    const id = getUniqueId(ids);

    const vaultContract = VaultContract.bind(event.address);

    const oldVaultPositions = vaultContract.try_getPositions();
    if (!oldVaultPositions.reverted) {
      const vaultPositions = vaultContract.getPositions();

      let lowerTick: Array<BigInt> = [];
      let upperTick: Array<BigInt> = [];
      let relativeWeight: Array<BigInt> = [];

      // get lower tick and upper tick from vault positions
      for (let counter = 0; counter < vaultPositions.value0.length; counter++) {
        lowerTick.push(BigInt.fromI32(vaultPositions.value0[counter]));
      }

      // upper tick value
      for (let counter = 0; counter < vaultPositions.value1.length; counter++) {
        upperTick.push(BigInt.fromI32(vaultPositions.value1[counter]));
      }

      // upper tick value
      for (let counter = 0; counter < vaultPositions.value2.length; counter++) {
        relativeWeight.push(BigInt.fromI32(vaultPositions.value2[counter]));
      }

      const positions = new VaultPosition(id);

      positions.upperTick = upperTick;
      positions.lowerTick = lowerTick;
      positions.relativeWeight = relativeWeight;
      positions.timestamp = event.block.timestamp;
      positions.vault = event.address.toHexString();
      positions.save();
    }
}

export function handleVaultSnapshot(event: Snapshot): void {
  let vault = Vault.load(event.address.toHexString());
  if (!vault) {
    vault = new Vault(event.address.toHexString());
    vault.lastSnapshot = event.block.timestamp;
    vault.totalValueLockedToken0 = BigDecimal.zero();
    vault.totalValueLockedToken1 = BigDecimal.zero();
    vault.totalAmount0 = BigDecimal.zero();
    vault.totalAmount1 = BigDecimal.zero();
  }

  // vault.totalAmount0 = event.params.totalAmount0.toBigDecimal();
  // vault.totalAmount1 = event.params.totalAmount1.toBigDecimal();

  // const apyOutput: ApyOutput = calculateApy(
  //   event.params.sqrtPriceX96,
  //   event.params.totalAmount0,
  //   event.params.totalAmount1,
  //   event.params.totalSupply,
  //   event.block.timestamp,
  //   vault.lastSnapshot,
  //   vault.lastTotalT0ValuePerLPT
  // );

  vault.lastTotalT0ValuePerLPT = BigDecimal.zero();

  vault.annualPercentageYield = BigDecimal.zero();

  if (BEACONS_SINGLE_POSITIONS.indexOf(vault.beaconName) > -1) {
    handleSinglePositionVaultPositions(event);
  } else {
    handleMultiPositionVaultPositions(event);
  }

  const vaultContract = VaultContract.bind(event.address);

  vault.accruedStrategistFees0 = BigInt.zero();
  vault.accruedStrategistFees1 = BigInt.zero();

  vault.lastSnapshot = event.block.timestamp;

  const steerPeriphery = SteerPeriphery.bind(STEER_PERIPHERY_ADDRESS);

  const steerPeripheryVaultDetailsResult = steerPeriphery.try_vaultDetailsByAddress(
    event.address
  );

  // update vault details on every snapshot
  if (!steerPeripheryVaultDetailsResult.reverted) {
    const vaultData = steerPeripheryVaultDetailsResult.value;
    vault.totalLPTokensIssued = vaultData.totalLPTokensIssued;
    vault.token0Balance = vaultData.token0Balance;
    vault.token1Balance = vaultData.token1Balance;
  } else {
    const algebraSteerPeripheryVaultDetailsResult = steerPeriphery.try_algebraVaultDetailsByAddress(
      event.address
    );
    if (!algebraSteerPeripheryVaultDetailsResult.reverted) {
      const vaultData = algebraSteerPeripheryVaultDetailsResult.value;
      vault.totalLPTokensIssued = vaultData.totalLPTokensIssued;
      vault.token0Balance = vaultData.token0Balance;
      vault.token1Balance = vaultData.token1Balance;
    }
  }

  log.info("Saved vault here : ", []);

  let steer = new LiquiditySteer(
    event.address
      .toHexString()
      .concat("-")
      .concat(event.block.timestamp.toString())
  );
  steer.vault = event.address.toHexString();
  // change tick to sqrtPricex96
  steer.tick = event.params.sqrtPriceX96;
  steer.timeStamp = event.block.timestamp;
  steer.save();
  log.info("Saved liquidity here : ", []);

  const vaultSnapshotIds: Array<string> = [
    event.transaction.hash.toHexString(),
    event.transactionLogIndex.toString(),
  ];

  const vaultSnapshotId = getUniqueId(vaultSnapshotIds);
  const vaultSnapshot = new VaultSnapshot(vaultSnapshotId);

  vaultSnapshot.vaultAddress = event.address.toHexString();
  vaultSnapshot.totalAmount0 = event.params.totalAmount0;
  vaultSnapshot.totalAmount1 = event.params.totalAmount1;
  vaultSnapshot.sqrtPriceX96 = event.params.sqrtPriceX96;
  vaultSnapshot.totalSupply = event.params.totalSupply;
  vaultSnapshot.timestamp = event.block.timestamp;
  vaultSnapshot.fees0 = vault.fees0;
  vaultSnapshot.fees1 = vault.fees1;
  vaultSnapshot.transactionHash = event.transaction.hash.toHexString();

  vault.totalSnapshots = vault.totalSnapshots.plus(BigInt.fromI32(1));

  let now = event.block.timestamp.toI32();
  let day = 86400;
  let month = 30 * day;
  let year = 365 * day;
  let week = 7 * day;

  let prevVaultSnapshot = PrevVaultSnapshot.load(vault.id);

  // daily/monthly/yearly snapshots
  let previousDailySnapshot = PrevDailyVaultSnapshot.load(
    vault.id + "-" + (((now / day) as i32) * day).toString()
  );
  let previousMonthlySnapshot = PrevMonthlyVaultSnapshot.load(
    vault.id + "-" + (((now / month) as i32) * month).toString()
  );
  let previousYearlySnapshot = PrevAnnualVaultSnapshot.load(
    vault.id + "-" + (((now / year) as i32) * year).toString()
  );

  let previousWeeklySnapshot = PrevWeeklyVaultSnapshot.load(
    vault.id + "-seven-day"
  );

  if (
    !previousWeeklySnapshot ||
    previousWeeklySnapshot.timestamp
      .plus(BigInt.fromI32(week))
      .lt(vaultSnapshot.timestamp)
  ) {
    previousWeeklySnapshot = new PrevWeeklyVaultSnapshot(
      vault.id + "-seven-day"
    );

    previousWeeklySnapshot.vaultAddress = vault.id;
    previousWeeklySnapshot.totalAmount0 = vaultSnapshot.totalAmount0;
    previousWeeklySnapshot.totalAmount1 = vaultSnapshot.totalAmount1;
    previousWeeklySnapshot.sqrtPriceX96 = vaultSnapshot.sqrtPriceX96;
    previousWeeklySnapshot.totalSupply = vaultSnapshot.totalSupply;
    previousWeeklySnapshot.timestamp = vaultSnapshot.timestamp;
    previousWeeklySnapshot.fees0 = vault.fees0;
    previousWeeklySnapshot.fees1 = vault.fees1;
    previousWeeklySnapshot.totalSnapshots = BigInt.zero();
  }

  if (!prevVaultSnapshot) {
    prevVaultSnapshot = new PrevVaultSnapshot(vault.id);
    prevVaultSnapshot.vaultAddress = vault.id;
    prevVaultSnapshot.totalAmount0 = vaultSnapshot.totalAmount0;
    prevVaultSnapshot.totalAmount1 = vaultSnapshot.totalAmount1;
    prevVaultSnapshot.sqrtPriceX96 = vaultSnapshot.sqrtPriceX96;
    prevVaultSnapshot.totalSupply = vaultSnapshot.totalSupply;
    prevVaultSnapshot.timestamp = vaultSnapshot.timestamp;
    prevVaultSnapshot.fees0 = vault.fees0;
    prevVaultSnapshot.fees1 = vault.fees1;
    prevVaultSnapshot.save();
  }

  const feeArrOutput: FeeArrAmounts = getFeeArr(
    vaultSnapshot,
    prevVaultSnapshot,
    vault,
    "yearly"
  );

  vault.averageFeeArrPerSecond = feeArrOutput.averageAprPerSecond;
  vault.annualFeeARR = feeArrOutput.yearlyAPR;
  vault.weeklyFeeAPR = feeArrOutput.weeklyFeeApr;
  vault.dailyFeeAPR = feeArrOutput.dailyFeeApr;

  vaultSnapshot.annualFeeAPR = feeArrOutput.yearlyAPR;

  vaultSnapshot.weeklyFeeAPR = feeArrOutput.weeklyFeeApr;

  vaultSnapshot.dailyFeeAPR = feeArrOutput.dailyFeeApr;

  vaultSnapshot.save();

  if (
    vaultSnapshot.totalAmount0.gt(BigInt.zero()) &&
    vaultSnapshot.totalAmount1.gt(BigInt.zero())
  ) {
    // load previous daily snapshot
    if (!previousDailySnapshot) {
      previousDailySnapshot = new PrevDailyVaultSnapshot(
        vault.pool + "-" + (((now / day) as i32) * day).toString()
      );
      previousDailySnapshot.vaultAddress = vault.id;
      previousDailySnapshot.totalAmount0 = vaultSnapshot.totalAmount0;
      previousDailySnapshot.totalAmount1 = vaultSnapshot.totalAmount1;
      previousDailySnapshot.sqrtPriceX96 = vaultSnapshot.sqrtPriceX96;
      previousDailySnapshot.totalSupply = vaultSnapshot.totalSupply;
      previousDailySnapshot.timestamp = vaultSnapshot.timestamp;
      previousDailySnapshot.fees0 = vault.fees0;
      previousDailySnapshot.fees1 = vault.fees1;
      previousDailySnapshot.save();
    }

    // load previous monthly snapshot
    if (!previousMonthlySnapshot) {
      previousMonthlySnapshot = new PrevMonthlyVaultSnapshot(
        vault.pool + "-" + (((now / month) as i32) * month).toString()
      );
      previousMonthlySnapshot.vaultAddress = vault.id;
      previousMonthlySnapshot.totalAmount0 = vaultSnapshot.totalAmount0;
      previousMonthlySnapshot.totalAmount1 = vaultSnapshot.totalAmount1;
      previousMonthlySnapshot.sqrtPriceX96 = vaultSnapshot.sqrtPriceX96;
      previousMonthlySnapshot.totalSupply = vaultSnapshot.totalSupply;
      previousMonthlySnapshot.timestamp = vaultSnapshot.timestamp;
      previousMonthlySnapshot.fees0 = vault.fees0;
      previousMonthlySnapshot.fees1 = vault.fees1;
      previousMonthlySnapshot.save();
    }

    // load previous yearly snapshot
    if (!previousYearlySnapshot) {
      previousYearlySnapshot = new PrevAnnualVaultSnapshot(
        vault.pool + "-" + (((now / year) as i32) * year).toString()
      );
      previousYearlySnapshot.vaultAddress = vault.id;
      previousYearlySnapshot.totalAmount0 = vaultSnapshot.totalAmount0;
      previousYearlySnapshot.totalAmount1 = vaultSnapshot.totalAmount1;
      previousYearlySnapshot.sqrtPriceX96 = vaultSnapshot.sqrtPriceX96;
      previousYearlySnapshot.totalSupply = vaultSnapshot.totalSupply;
      previousYearlySnapshot.timestamp = vaultSnapshot.timestamp;
      previousYearlySnapshot.fees0 = vault.fees0;
      previousYearlySnapshot.fees1 = vault.fees1;
      previousYearlySnapshot.save();
    }
  }
  log.info("Saved Snapshot here : ", []);

  vault.annualPercentageYield = BigDecimal.zero();

  if (previousDailySnapshot) {
    // vault.annualPercentageDailyYield = calculateHourlyApy(
    //   vaultSnapshot,
    //   previousDailySnapshot
    // );

    vault.annualPercentageDailyYield = BigDecimal.zero();
  }

  if (previousMonthlySnapshot) {
    // vault.annualPercentageMonthlyYield = calculateMonthlyApy(
    //   vaultSnapshot,
    //   previousMonthlySnapshot
    // );
    vault.annualPercentageMonthlyYield = BigDecimal.zero();
  }

  if (previousYearlySnapshot) {
    // vault.annualPercentageYearlyYield = calculateYearlyApy(
    //   vaultSnapshot,
    //   previousYearlySnapshot
    // );

    vault.annualPercentageYearlyYield = BigDecimal.zero();
  }

  // calculate weekly aprs
  if (previousWeeklySnapshot) {
    previousWeeklySnapshot.totalSnapshots = previousWeeklySnapshot.totalSnapshots.plus(
      BigInt.fromI32(1)
    );

    const weeklyApr: FeeArrAmounts = getWeeklyAprs(
      vaultSnapshot,
      prevVaultSnapshot,
      previousWeeklySnapshot,
      vault
    );

    if (
      feeArrOutput.weeklyFeeApr.gt(BigDecimal.zero()) &&
      weeklyApr.weeklyFeeApr.equals(BigDecimal.zero())
    ) {
      vault.weeklyFeeAPR = feeArrOutput.weeklyFeeApr;
    } else {
      vault.weeklyFeeAPR = weeklyApr.weeklyFeeApr;
    }
    previousWeeklySnapshot.averageFeeArrPerSecond =
      weeklyApr.averageAprPerSecond;
    previousWeeklySnapshot.weeklyFeeApr = weeklyApr.weeklyFeeApr;
    previousWeeklySnapshot.save();
  }

  vault.save();

  prevVaultSnapshot.totalAmount0 = vaultSnapshot.totalAmount0;
  prevVaultSnapshot.totalAmount1 = vaultSnapshot.totalAmount1;
  prevVaultSnapshot.sqrtPriceX96 = vaultSnapshot.sqrtPriceX96;
  prevVaultSnapshot.totalSupply = vaultSnapshot.totalSupply;
  prevVaultSnapshot.timestamp = vaultSnapshot.timestamp;
  prevVaultSnapshot.fees0 = vault.fees0;
  prevVaultSnapshot.fees1 = vault.fees1;
  prevVaultSnapshot.vaultAddress = vault.id;

  prevVaultSnapshot.save();

  //  1. token1PerToken0 = 1.0001 ^ tick
  //  2. valueOfBalance1InTermsOfT0 = balance1 / token1PerToken0
  //  3. valueOfFees1InTermsOfT0 = fees1 / token1PerToken0
  //  4. totalBalValue = balance0 + valueofBalance1InTermsOfT0
  //  5. totalFeesValue = fees0 + valueofFees1InTermsOfT0
  //  6. duration = timestamp(this event) - timestamp(last event)
  //  7. year duration = (year in seconds, or whatever unit timestamp is measured in anyways)
  //  8. fractionOfYear = yearDuration / duration
  //  9. apy = (1 + (totalFeesValue / totalBalValue)) ^ fractionOfYear
}

export function handleBeaconRegistered(event: BeaconRegistered): void {
  const vaultBeacon = new VaultBeacon(event.params._name);
  vaultBeacon.address = event.params._address.toHexString();
  vaultBeacon.ipfsHash = event.params._ipfsHash;
  vaultBeacon.name = event.params._name;
  vaultBeacon.timestamp = event.block.timestamp;
  vaultBeacon.updateTimestamp = event.block.timestamp;
  vaultBeacon.status = "registered";
  vaultBeacon.save();
}

export function handleBeaconUpdated(event: BeaconConfigUpdated): void {
  const vaultBeacon = VaultBeacon.load(event.params._name);
  if (vaultBeacon) {
    vaultBeacon.ipfsHash = event.params._ipfsHash;
    vaultBeacon.name = event.params._name;
    vaultBeacon.updateTimestamp = event.block.timestamp;
    vaultBeacon.save();
  }
}

export function handleBundleDeregistered(event: BeaconDeregistered): void {
  const vaultBeacon = VaultBeacon.load(event.params._name);
  if (vaultBeacon) {
    vaultBeacon.status = "deregistered";
    vaultBeacon.updateTimestamp = event.block.timestamp;
    vaultBeacon.save();
  }
}

export function handleVaultFeesEvent(event: FeesEarned): void {
  const vault = Vault.load(event.address.toHexString());

  if (!vault) {
    return;
  }

  if (vault) {
    vault.fees0 = vault.fees0.plus(event.params.amount0Earned);
    vault.fees1 = vault.fees1.plus(event.params.amount1Earned);
    vault.save();
  }
}

// export function handleVaultTransfer(event: Transfer): void {
//   const ids: Array<string> = [
//     event.transaction.hash.toHexString(),
//     event.transactionLogIndex.toString(),
//   ];

//   const id = getUniqueId(ids);

//   let vaultTransfer = VaultTransfer.load(id);

//   if (vaultTransfer) {
//     return 
//   }

//   vaultTransfer = new VaultTransfer(id);
//   vaultTransfer.from = event.params.from.toHexString();
//   vaultTransfer.to = event.params.to.toHexString()
//   vaultTransfer.timestamp = event.block.timestamp;
//   vaultTransfer.value = event.params.value;
//   vaultTransfer.blockNumber = event.block.number
//   vaultTransfer.save();
// }
