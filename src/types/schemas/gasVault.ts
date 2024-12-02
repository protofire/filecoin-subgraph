

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


export class VaultGasUsed extends Entity {
    constructor(id: string) {
      super();
      this.set("id", Value.fromString(id));
  
      this.set("vault", Value.fromString(''));
      this.set("amount", Value.fromBigInt(BigInt.zero()));
      this.set("actionHash", Value.fromString(""));
      this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save VaultGasUsed entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.STRING,
          "Cannot save VaultGasUsed entity with non-string ID. " +
            'Considering using .toHex() to convert the "id" to a string.'
        );
        store.set("VaultGasUsed", id.toString(), this);
      }
    }
  
    static load(id: string): VaultGasUsed | null {
      return changetype<VaultGasUsed | null>(store.get("VaultGasUsed", id));
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
  
  
    get vault(): string {
      let value = this.get("vault");
      return value!.toString();
    }
  
    set vault(value: string) {
      this.set("vault", Value.fromString(value));
    }
  
    get amount(): BigInt {
      let value = this.get("amount");
      return value!.toBigInt();
    }
  
    set amount(value: BigInt) {
      this.set("amount", Value.fromBigInt(value));
    }
  
    get actionHash(): string {
      let value = this.get("actionHash");
      return value!.toString();
    }
  
    set actionHash(value: string) {
      this.set("actionHash", Value.fromString(value));
    }
  
  }
  
  
  export class VaultGasDeposited extends Entity {
    constructor(id: string) {
      super();
      this.set("id", Value.fromString(id));
  
      this.set("origin", Value.fromString(''));
      this.set("vault", Value.fromString(''));
      this.set("amount", Value.fromBigInt(BigInt.zero()));
      this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save VaultGasDeposited entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.STRING,
          "Cannot save VaultGasDeposited entity with non-string ID. " +
            'Considering using .toHex() to convert the "id" to a string.'
        );
        store.set("VaultGasDeposited", id.toString(), this);
      }
    }
  
    static load(id: string): VaultGasDeposited | null {
      return changetype<VaultGasDeposited | null>(store.get("VaultGasDeposited", id));
    }
  
    get id(): string {
      let value = this.get("id");
      return value!.toString();
    }
  
    set id(value: string) {
      this.set("id", Value.fromString(value));
    }

    get origin(): string {
      let value = this.get("origin");
      return value!.toString();
    }
  
    set origin(value: string) {
      this.set("origin", Value.fromString(value));
    }

    get vault(): string {
      let value = this.get("vault");
      return value!.toString();
    }
  
    set vault(value: string) {
      this.set("vault", Value.fromString(value));
    }
  
    get amount(): BigInt {
      let value = this.get("amount");
      return value!.toBigInt();
    }
  
    set amount(value: BigInt) {
      this.set("amount", Value.fromBigInt(value));
    }

    get timestamp(): BigInt {
      let value = this.get("timestamp");
      return value!.toBigInt();
    }
  
    set timestamp(value: BigInt) {
      this.set("timestamp", Value.fromBigInt(value));
    }
  }
  
  
  export class VaultGasWithdrawn extends Entity {
    constructor(id: string) {
      super();
      this.set("id", Value.fromString(id));
  
      this.set("vault", Value.fromString(''));
      this.set("to", Value.fromString(''));
      this.set("amount", Value.fromBigInt(BigInt.zero()));
      this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save VaultGasWithdrawn entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.STRING,
          "Cannot save VaultGasWithdrawn entity with non-string ID. " +
            'Considering using .toHex() to convert the "id" to a string.'
        );
        store.set("VaultGasWithdrawn", id.toString(), this);
      }
    }
  
    static load(id: string): VaultGasWithdrawn | null {
      return changetype<VaultGasWithdrawn | null>(store.get("VaultGasWithdrawn", id));
    }
  
    get id(): string {
      let value = this.get("id");
      return value!.toString();
    }
  
    set id(value: string) {
      this.set("id", Value.fromString(value));
    }


    get to(): string {
      let value = this.get("to");
      return value!.toString();
    }
  
    set to(value: string) {
      this.set("to", Value.fromString(value));
    }

    get vault(): string {
      let value = this.get("vault");
      return value!.toString();
    }
  
    set vault(value: string) {
      this.set("vault", Value.fromString(value));
    }

    get timestamp(): BigInt {
      let value = this.get("timestamp");
      return value!.toBigInt();
    }
  
    set timestamp(value: BigInt) {
      this.set("timestamp", Value.fromBigInt(value));
    }

    get amount(): BigInt {
      let value = this.get("amount");
      return value!.toBigInt();
    }
  
    set amount(value: BigInt) {
      this.set("amount", Value.fromBigInt(value));
    }
  }