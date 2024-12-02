import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal,
} from "@graphprotocol/graph-ts";

export class PrevVaultSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("vaultAddress", Value.fromString(""));
    this.set("totalAmount0", Value.fromBigInt(BigInt.zero()));
    this.set("totalAmount1", Value.fromBigInt(BigInt.zero()));
    this.set("sqrtPriceX96", Value.fromBigInt(BigInt.zero()));
    this.set("totalSupply", Value.fromBigInt(BigInt.zero()));
    this.set("fees1", Value.fromBigInt(BigInt.zero()));
    this.set("fees0", Value.fromBigInt(BigInt.zero()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save PrevVaultSnapshot entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save PrevVaultSnapshot entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("PrevVaultSnapshot", id.toString(), this);
    }
  }

  static load(id: string): PrevVaultSnapshot | null {
    return changetype<PrevVaultSnapshot | null>(
      store.get("PrevVaultSnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get vaultAddress(): string {
    let value = this.get("vaultAddress");
    return value!.toString();
  }

  set vaultAddress(value: string) {
    this.set("vaultAddress", Value.fromString(value));
  }

  get totalAmount0(): BigInt {
    let value = this.get("totalAmount0");
    return value!.toBigInt();
  }

  set totalAmount0(value: BigInt) {
    this.set("totalAmount0", Value.fromBigInt(value));
  }

  get totalAmount1(): BigInt {
    let value = this.get("totalAmount1");
    return value!.toBigInt();
  }

  set totalAmount1(value: BigInt) {
    this.set("totalAmount1", Value.fromBigInt(value));
  }

  get sqrtPriceX96(): BigInt {
    let value = this.get("sqrtPriceX96");
    return value!.toBigInt();
  }

  set sqrtPriceX96(value: BigInt) {
    this.set("sqrtPriceX96", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value!.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get fees0(): BigInt {
    let value = this.get("fees0");
    return value!.toBigInt();
  }

  set fees0(value: BigInt) {
    this.set("fees0", Value.fromBigInt(value));
  }

  get fees1(): BigInt {
    let value = this.get("fees1");
    return value!.toBigInt();
  }

  set fees1(value: BigInt) {
    this.set("fees1", Value.fromBigInt(value));
  }
}

export class PrevDailyVaultSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("vaultAddress", Value.fromString(""));
    this.set("totalAmount0", Value.fromBigInt(BigInt.zero()));
    this.set("totalAmount1", Value.fromBigInt(BigInt.zero()));
    this.set("sqrtPriceX96", Value.fromBigInt(BigInt.zero()));
    this.set("totalSupply", Value.fromBigInt(BigInt.zero()));
    this.set("fees1", Value.fromBigInt(BigInt.zero()));
    this.set("fees0", Value.fromBigInt(BigInt.zero()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save PrevDailyVaultSnapshot entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save PrevDailyVaultSnapshot entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("PrevDailyVaultSnapshot", id.toString(), this);
    }
  }

  static load(id: string): PrevDailyVaultSnapshot | null {
    return changetype<PrevDailyVaultSnapshot | null>(
      store.get("PrevDailyVaultSnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get vaultAddress(): string {
    let value = this.get("vaultAddress");
    return value!.toString();
  }

  set vaultAddress(value: string) {
    this.set("vaultAddress", Value.fromString(value));
  }

  get totalAmount0(): BigInt {
    let value = this.get("totalAmount0");
    return value!.toBigInt();
  }

  set totalAmount0(value: BigInt) {
    this.set("totalAmount0", Value.fromBigInt(value));
  }

  get totalAmount1(): BigInt {
    let value = this.get("totalAmount1");
    return value!.toBigInt();
  }

  set totalAmount1(value: BigInt) {
    this.set("totalAmount1", Value.fromBigInt(value));
  }

  get sqrtPriceX96(): BigInt {
    let value = this.get("sqrtPriceX96");
    return value!.toBigInt();
  }

  set sqrtPriceX96(value: BigInt) {
    this.set("sqrtPriceX96", Value.fromBigInt(value));
  }

  get fees0(): BigInt {
    let value = this.get("fees0");
    return value!.toBigInt();
  }

  set fees0(value: BigInt) {
    this.set("fees0", Value.fromBigInt(value));
  }

  get fees1(): BigInt {
    let value = this.get("fees1");
    return value!.toBigInt();
  }

  set fees1(value: BigInt) {
    this.set("fees1", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value!.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }
}

export class PrevMonthlyVaultSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("vaultAddress", Value.fromString(""));
    this.set("totalAmount0", Value.fromBigInt(BigInt.zero()));
    this.set("totalAmount1", Value.fromBigInt(BigInt.zero()));
    this.set("sqrtPriceX96", Value.fromBigInt(BigInt.zero()));
    this.set("totalSupply", Value.fromBigInt(BigInt.zero()));
    this.set("fees1", Value.fromBigInt(BigInt.zero()));
    this.set("fees0", Value.fromBigInt(BigInt.zero()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save PrevMonthlyVaultSnapshot entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save PrevMonthlyVaultSnapshot entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("PrevMonthlyVaultSnapshot", id.toString(), this);
    }
  }

  static load(id: string): PrevMonthlyVaultSnapshot | null {
    return changetype<PrevMonthlyVaultSnapshot | null>(
      store.get("PrevMonthlyVaultSnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get vaultAddress(): string {
    let value = this.get("vaultAddress");
    return value!.toString();
  }

  set vaultAddress(value: string) {
    this.set("vaultAddress", Value.fromString(value));
  }

  get totalAmount0(): BigInt {
    let value = this.get("totalAmount0");
    return value!.toBigInt();
  }

  set totalAmount0(value: BigInt) {
    this.set("totalAmount0", Value.fromBigInt(value));
  }

  get totalAmount1(): BigInt {
    let value = this.get("totalAmount1");
    return value!.toBigInt();
  }

  set totalAmount1(value: BigInt) {
    this.set("totalAmount1", Value.fromBigInt(value));
  }

  get sqrtPriceX96(): BigInt {
    let value = this.get("sqrtPriceX96");
    return value!.toBigInt();
  }

  set sqrtPriceX96(value: BigInt) {
    this.set("sqrtPriceX96", Value.fromBigInt(value));
  }

  get fees0(): BigInt {
    let value = this.get("fees0");
    return value!.toBigInt();
  }

  set fees0(value: BigInt) {
    this.set("fees0", Value.fromBigInt(value));
  }

  get fees1(): BigInt {
    let value = this.get("fees1");
    return value!.toBigInt();
  }

  set fees1(value: BigInt) {
    this.set("fees1", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value!.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }
}

export class PrevAnnualVaultSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("vaultAddress", Value.fromString(""));
    this.set("totalAmount0", Value.fromBigInt(BigInt.zero()));
    this.set("totalAmount1", Value.fromBigInt(BigInt.zero()));
    this.set("sqrtPriceX96", Value.fromBigInt(BigInt.zero()));
    this.set("totalSupply", Value.fromBigInt(BigInt.zero()));
    this.set("fees1", Value.fromBigInt(BigInt.zero()));
    this.set("fees0", Value.fromBigInt(BigInt.zero()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save PrevAnnualVaultSnapshot entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save PrevAnnualVaultSnapshot entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("PrevAnnualVaultSnapshot", id.toString(), this);
    }
  }

  static load(id: string): PrevAnnualVaultSnapshot | null {
    return changetype<PrevAnnualVaultSnapshot | null>(
      store.get("PrevAnnualVaultSnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get vaultAddress(): string {
    let value = this.get("vaultAddress");
    return value!.toString();
  }

  set vaultAddress(value: string) {
    this.set("vaultAddress", Value.fromString(value));
  }

  get totalAmount0(): BigInt {
    let value = this.get("totalAmount0");
    return value!.toBigInt();
  }

  set totalAmount0(value: BigInt) {
    this.set("totalAmount0", Value.fromBigInt(value));
  }

  get totalAmount1(): BigInt {
    let value = this.get("totalAmount1");
    return value!.toBigInt();
  }

  set totalAmount1(value: BigInt) {
    this.set("totalAmount1", Value.fromBigInt(value));
  }

  get sqrtPriceX96(): BigInt {
    let value = this.get("sqrtPriceX96");
    return value!.toBigInt();
  }

  set sqrtPriceX96(value: BigInt) {
    this.set("sqrtPriceX96", Value.fromBigInt(value));
  }

  get fees0(): BigInt {
    let value = this.get("fees0");
    return value!.toBigInt();
  }

  set fees0(value: BigInt) {
    this.set("fees0", Value.fromBigInt(value));
  }

  get fees1(): BigInt {
    let value = this.get("fees1");
    return value!.toBigInt();
  }

  set fees1(value: BigInt) {
    this.set("fees1", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value!.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }
}


export class PrevWeeklyVaultSnapshot extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));

    this.set("vaultAddress", Value.fromString(""));
    this.set("totalAmount0", Value.fromBigInt(BigInt.zero()));
    this.set("totalAmount1", Value.fromBigInt(BigInt.zero()));
    this.set("sqrtPriceX96", Value.fromBigInt(BigInt.zero()));
    this.set("totalSupply", Value.fromBigInt(BigInt.zero()));
    this.set("fees1", Value.fromBigInt(BigInt.zero()));
    this.set("fees0", Value.fromBigInt(BigInt.zero()));
    this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    this.set("averageFeeArrPerSecond", Value.fromBigDecimal(BigDecimal.zero()));
    this.set("totalSnapshots", Value.fromBigInt(BigInt.zero()));
    this.set('weeklyFeeApr', Value.fromBigDecimal(BigDecimal.zero()));
  }

  save(): void {
    let id = this.get("id");
    assert(
      id != null,
      "Cannot save PrevWeeklyVaultSnapshot entity without an ID"
    );
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save PrevWeeklyVaultSnapshot entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("PrevWeeklyVaultSnapshot", id.toString(), this);
    }
  }

  static load(id: string): PrevWeeklyVaultSnapshot | null {
    return changetype<PrevWeeklyVaultSnapshot | null>(
      store.get("PrevWeeklyVaultSnapshot", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value!.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get vaultAddress(): string {
    let value = this.get("vaultAddress");
    return value!.toString();
  }

  set vaultAddress(value: string) {
    this.set("vaultAddress", Value.fromString(value));
  }

  get totalAmount0(): BigInt {
    let value = this.get("totalAmount0");
    return value!.toBigInt();
  }

  set totalAmount0(value: BigInt) {
    this.set("totalAmount0", Value.fromBigInt(value));
  }

  get totalAmount1(): BigInt {
    let value = this.get("totalAmount1");
    return value!.toBigInt();
  }

  set totalAmount1(value: BigInt) {
    this.set("totalAmount1", Value.fromBigInt(value));
  }

  get sqrtPriceX96(): BigInt {
    let value = this.get("sqrtPriceX96");
    return value!.toBigInt();
  }

  set sqrtPriceX96(value: BigInt) {
    this.set("sqrtPriceX96", Value.fromBigInt(value));
  }

  get fees0(): BigInt {
    let value = this.get("fees0");
    return value!.toBigInt();
  }

  set fees0(value: BigInt) {
    this.set("fees0", Value.fromBigInt(value));
  }

  get fees1(): BigInt {
    let value = this.get("fees1");
    return value!.toBigInt();
  }

  set fees1(value: BigInt) {
    this.set("fees1", Value.fromBigInt(value));
  }

  get totalSupply(): BigInt {
    let value = this.get("totalSupply");
    return value!.toBigInt();
  }

  set totalSupply(value: BigInt) {
    this.set("totalSupply", Value.fromBigInt(value));
  }

  get averageFeeArrPerSecond(): BigDecimal {
    let value = this.get('averageFeeArrPerSecond');
    return value!.toBigDecimal();
  }

  set averageFeeArrPerSecond(value: BigDecimal) {
    this.set('averageFeeArrPerSecond', Value.fromBigDecimal(value));
  }

  get totalSnapshots(): BigInt {
    let value = this.get('totalSnapshots');
    return value!.toBigInt();
  }

  set totalSnapshots(value: BigInt) {
    this.set('totalSnapshots', Value.fromBigInt(value));
  } 

  get weeklyFeeApr(): BigDecimal {
    let value = this.get('weeklyFeeApr');
    return value!.toBigDecimal();
  }

  set weeklyFeeApr(value: BigDecimal) {
    this.set('weeklyFeeApr', Value.fromBigDecimal(value));
  }
}
