
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


export class WhiteListManager extends Entity {
    constructor(id: string) {
      super();
      this.set("id", Value.fromString(id));
  
      this.set("address", Value.fromString(""));
      this.set("vault", Value.fromString(""));
      this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save WhiteListManager entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.STRING,
          `Entities of type WhiteListManager must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("WhiteListManager", id.toString(), this);
      }
    }
  
    static load(id: string): WhiteListManager | null {
      return changetype<WhiteListManager | null>(
        store.get("WhiteListManager", id)
      );
    }
  
    get id(): string {
      let value = this.get("id");
      return value!.toString();
    }
  
    set id(value: string) {
      this.set("id", Value.fromString(value));
    }
  
    get address(): string {
      let value = this.get("address");
      return value!.toString();
    }
  
    set address(value: string) {
      this.set("address", Value.fromString(value));
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
  
    get permission(): string {
      let value = this.get("permission");
      return value!.toString();
    }
  
    set permission(value: string) {
      this.set("permission", Value.fromString(value));
    }
  }
  
  export class WhiteListVaultPermission extends Entity {
    constructor(id: string) {
      super();
      this.set("id", Value.fromString(id));
  
      this.set("manager", Value.fromString(""));
      this.set("vault", Value.fromString(""));
      this.set("addresses", Value.fromStringArray(['']));
      this.set("timestamp", Value.fromBigInt(BigInt.zero()));
      this.set("updatedTimestamp", Value.fromBigInt(BigInt.zero()));
    }
  
    save(): void {
      let id = this.get("id");
      assert(
        id != null,
        "Cannot save WhiteListVaultPermission entity without an ID"
      );
      if (id) {
        assert(
          id.kind == ValueKind.STRING,
          `Entities of type WhiteListVaultPermission must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("WhiteListVaultPermission", id.toString(), this);
      }
    }
  
    static load(id: string): WhiteListVaultPermission | null {
      return changetype<WhiteListVaultPermission | null>(
        store.get("WhiteListVaultPermission", id)
      );
    }
  
    get id(): string {
      let value = this.get("id");
      return value!.toString();
    }
  
    set id(value: string) {
      this.set("id", Value.fromString(value));
    }
  
    get manager(): string {
      let value = this.get("manager");
      return value!.toString();
    }
  
    set manager(value: string) {
      this.set("manager", Value.fromString(value));
    }
  
    get vault(): string {
      let value = this.get("vault");
      return value!.toString();
    }
  
    set vault(value: string) {
      this.set("vault", Value.fromString(value));
    }
  
    get addresses(): Array<string> {
      let value = this.get("addresses");
      return value!.toStringArray();
    }
  
    set addresses(value: Array<string>) {
      this.set("addresses", Value.fromStringArray(value));
    }
  
    get timestamp(): BigInt {
      let value = this.get("timestamp");
      return value!.toBigInt();
    }
  
    set timestamp(value: BigInt) {
      this.set("timestamp", Value.fromBigInt(value));
    }
  
    get updatedTimestamp(): BigInt {
      let value = this.get("updatedTimestamp");
      return value!.toBigInt();
    }
  
    set updatedTimestamp(value: BigInt) {
      this.set("updatedTimestamp", Value.fromBigInt(value));
    }
  }
  