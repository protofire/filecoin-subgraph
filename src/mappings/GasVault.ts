import { ByteArray, crypto } from "@graphprotocol/graph-ts";
import {
  EtherUsed,
  Withdrawn,
  Deposited,
} from "../../generated/GasVault/GasVault";
import {
  Job,
  OrchestratorAction,
  Vault,
  VaultGasDeposited,
  VaultGasUsed,
  VaultGasWithdrawn,
} from "../types/schema";
import { getUniqueId } from "../utils/conversions";

export function handleEtherUsed(event: EtherUsed): void {
  const ids: Array<string> = [
    event.transaction.hash.toHexString(),
    event.transactionLogIndex.toString(),
  ];
  // create a unique id
  const id = getUniqueId(ids);

  const gasUsed = new VaultGasUsed(id);

  // Increment gas usage on each action
  const vault = Vault.load(event.params.account.toHexString());
  if (vault) {
    vault.gasUsed = vault.gasUsed.plus(event.params.amount);
    vault.save();
  }

  const orchestratorAction = OrchestratorAction.load(
    event.transaction.hash.toHexString()
  );

  if (orchestratorAction) {
    orchestratorAction.vault = event.params.account.toHexString();
    orchestratorAction.gasUsed = event.params.amount;
    orchestratorAction.save();
  }

  gasUsed.vault = event.params.account.toHexString();
  gasUsed.amount = event.params.amount;
  gasUsed.timestamp = event.block.timestamp;
  gasUsed.actionHash = event.params.jobHash.toHexString();

  // Check if job is available with the same hash then add gasUsed for given vault
  const jobId = `${event.params.jobHash.toHexString()}-${event.params.account.toHexString()}`;
  const job = Job.load(jobId);

  if (job) {
    // increment gasUsed
    job.gasUsed = job.gasUsed.plus(event.params.amount);
    job.save();
  }

  gasUsed.save();
}

export function handleGasDeposited(event: Deposited): void {
  const ids: Array<string> = [
    event.transaction.hash.toHexString(),
    event.transactionLogIndex.toString(),
  ];
  // create a unique id
  const id = getUniqueId(ids);

  const gasDeposited = new VaultGasDeposited(id);

  // Add gas deposited on vault with previous one
  const vault = Vault.load(event.params.target.toHexString());
  if (vault) {
    vault.gasDeposited = vault.gasDeposited.plus(event.params.amount);
    vault.save();
  }

  gasDeposited.amount = event.params.amount;
  gasDeposited.vault = event.params.target.toHexString();
  gasDeposited.origin = event.params.origin.toHexString();
  gasDeposited.timestamp = event.block.timestamp;
  gasDeposited.save();
}

export function handleGasWithdrawn(event: Withdrawn): void {
  const ids: Array<string> = [
    event.transaction.hash.toHexString(),
    event.transactionLogIndex.toString(),
  ];
  // create a unique id
  const id = getUniqueId(ids);

  const gasWithdrawn = new VaultGasWithdrawn(id);

  // Minus gas withdraw on vault with previous deposited gas
  const vault = Vault.load(event.params.targetAddress.toHexString());
  if (vault) {
    vault.gasDeposited = vault.gasDeposited.minus(event.params.amount);
    vault.save();
  }

  gasWithdrawn.vault = event.params.targetAddress.toHexString();
  gasWithdrawn.to = event.params.to.toHexString();
  gasWithdrawn.timestamp = event.block.timestamp;
  gasWithdrawn.amount = event.params.amount;

  gasWithdrawn.save();
}
