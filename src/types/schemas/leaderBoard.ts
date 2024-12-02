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


  export class LeaderBoard extends Entity {
    constructor(id: string) {
      super();
      this.set("id", Value.fromString(id));
  
      this.set("address", Value.fromString(""));
      this.set("numApps", Value.fromBigInt(BigInt.zero()));
      this.set("numStaticJobs", Value.fromBigInt(BigInt.zero()));
      this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save LeaderBoard entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.STRING,
          `Entities of type LeaderBoard must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
        );
        store.set("LeaderBoard", id.toString(), this);
      }
    }
  
    static load(id: string): LeaderBoard | null {
      return changetype<LeaderBoard | null>(
        store.get("LeaderBoard", id)
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
    
    get numApps(): BigInt {
      let value = this.get("numApps");
      return value!.toBigInt();
    }
  
    set numApps(value: BigInt) {
      this.set("numApps", Value.fromBigInt(value));
    }

    get numStaticJobs(): BigInt {
      let value = this.get("numStaticJobs");
      return value!.toBigInt();
    }
  
    set numStaticJobs(value: BigInt) {
      this.set("numStaticJobs", Value.fromBigInt(value));
    }
   
  
    get timestamp(): BigInt {
      let value = this.get("timestamp");
      return value!.toBigInt();
    }
  
    set timestamp(value: BigInt) {
      this.set("timestamp", Value.fromBigInt(value));
    }
  
  }