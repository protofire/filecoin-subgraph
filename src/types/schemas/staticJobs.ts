
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


export class Job extends Entity {
    constructor(id: string) {
      super();
      this.set("id", Value.fromString(id));
  
      this.set("name", Value.fromString(''));
      this.set("jobInfo", Value.fromStringArray(['']));
      this.set("targetAddresses", Value.fromStringArray(['']));
      this.set("ipfsHash", Value.fromString(''));

      this.set("jobHash", Value.fromString(''));
      
  
      this.set("status", Value.fromBigInt(BigInt.zero()));
      this.set('failedCounts', Value.fromBigInt(BigInt.zero()));
  
      this.set("timestamp", Value.fromBigInt(BigInt.zero()));
      this.set("updateTimestamp", Value.fromBigInt(BigInt.zero()));

      this.set('vaultAddress', Value.fromString(''));

      this.set('gasUsed', Value.fromBigInt(BigInt.zero()));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save Job entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.STRING,
          "Cannot save Job entity with non-string ID. " +
            'Considering using .toHex() to convert the "id" to a string.'
        );
        store.set("Job", id.toString(), this);
      }
    }
  
    static load(id: string): Job | null {
      return changetype<Job | null>(store.get("Job", id));
    }
  
    get id(): string {
      let value = this.get("id");
      return value!.toString();
    }
  
    set id(value: string) {
      this.set("id", Value.fromString(value));
    }
  
    get jobInfo(): Array<string> {
      let value = this.get('jobInfo');
      return value!.toStringArray();
    }

    set jobInfo(value: Array<string>) {
      this.set('jobInfo', Value.fromStringArray(value));
    }
  
    get ipfsHash(): string {
      let value = this.get("ipfsHash");
      return value!.toString();
    }
  
    set ipfsHash(value: string) {
      this.set("ipfsHash", Value.fromString(value));
    }

    get jobHash(): string {
      let value = this.get('jobHash');
      return value!.toString();
    }
    
    set jobHash(value: string) {
      this.set('jobHash', Value.fromString(value));
    }
  
    get name(): string {
      let value = this.get("name");
      return value!.toString();
    }
  
    set name(value: string) {
      this.set("name", Value.fromString(value));
    }

    get vaultAddress(): string {
      let value = this.get("vaultAddress");
      return value!.toString();
    }
  
    set vaultAddress(value: string) {
      this.set("vaultAddress", Value.fromString(value));
    }
  
    get status(): BigInt {
      let value = this.get("status");
      return value!.toBigInt();
    }
  
    set status(value: BigInt) {
      this.set("status", Value.fromBigInt(value));
    }
  
    set failedCounts(value: BigInt) {
      this.set('failedCounts', Value.fromBigInt(value));
    }
  
    get failedCounts(): BigInt {
      let value = this.get("timestamp");
      return value!.toBigInt();
    }
  
    get targetAddresses(): Array<string> {
      let value = this.get('targetAddresses');
      return value!.toStringArray();
    }

    set targetAddresses(value: Array<string>) {
      this.set('targetAddresses', Value.fromStringArray(value));
    }

    get timestamp(): BigInt {
      let value = this.get("timestamp");
      return value!.toBigInt();
    }
  
    set timestamp(value: BigInt) {
      this.set("timestamp", Value.fromBigInt(value));
    }
  
    get updateTimestamp(): BigInt {
      let value = this.get("updateTimestamp");
      return value!.toBigInt();
    }
  
    set updateTimestamp(value: BigInt) {
      this.set("updateTimestamp", Value.fromBigInt(value));
    }

    get gasUsed(): BigInt {
      let value = this.get('gasUsed');
      return value!.toBigInt();
    }

    set gasUsed(value: BigInt) {
      this.set("gasUsed", Value.fromBigInt(value));
    }
  }
  
  
  /** 
   * 
   * JobExecution Tasks
   * 
  */
  export class JobExecution extends Entity {
    constructor(id: string) {
      super();
      this.set("id", Value.fromString(id));
  
      this.set("jobHash", Value.fromString(''));
      this.set("jobIdString", Value.fromString(''));
      this.set("executor", Value.fromString(''));
      this.set("status", Value.fromString(''));
      this.set("timestamp", Value.fromBigInt(BigInt.zero()));
      this.set("updateTimestamp", Value.fromBigInt(BigInt.zero()));
      this.set("jobId", Value.fromString(''));
    }
  
    save(): void {
      let id = this.get("id");
      assert(id != null, "Cannot save JobExecution entity without an ID");
      if (id) {
        assert(
          id.kind == ValueKind.STRING,
          "Cannot save JobExecution entity with non-string ID. " +
            'Considering using .toHex() to convert the "id" to a string.'
        );
        store.set("JobExecution", id.toString(), this);
      }
    }
  
    static load(id: string): JobExecution | null {
      return changetype<JobExecution | null>(store.get("JobExecution", id));
    }
  
    get id(): string {
      let value = this.get("id");
      return value!.toString();
    }
  
    set id(value: string) {
      this.set("id", Value.fromString(value));
    }
  
    get jobHash(): string {
      let value = this.get("jobHash");
      return value!.toString();
    }
  
    set jobHash(value: string) {
      this.set("jobHash", Value.fromString(value));
    }

    get jobIdString(): string {
      let value = this.get("jobIdString");
      return value!.toString();
    }
  
    set jobIdString(value: string) {
      this.set("jobIdString", Value.fromString(value));
    }
    
    get jobId(): string {
      let value = this.get("jobId");
      return value!.toString();
    }
  
    set jobId(value: string) {
      this.set("jobId", Value.fromString(value));
    }

    get executor(): string {
      let value = this.get("executor");
      return value!.toString();
    }
  
    set executor(value: string) {
      this.set("executor", Value.fromString(value));
    }
  
    get status(): string {
      let value = this.get("status");
      return value!.toString();
    }
  
    set status(value: string) {
      this.set("status", Value.fromString(value));
    }
  
  
    get timestamp(): BigInt {
      let value = this.get("timestamp");
      return value!.toBigInt();
    }
  
    set timestamp(value: BigInt) {
      this.set("timestamp", Value.fromBigInt(value));
    }
  
    get updateTimestamp(): BigInt {
      let value = this.get("updateTimestamp");
      return value!.toBigInt();
    }
  
    set updateTimestamp(value: BigInt) {
      this.set("updateTimestamp", Value.fromBigInt(value));
    }
  }
  