import { BigInt } from "@graphprotocol/graph-ts";
import { log } from "@graphprotocol/graph-ts";
import { Job, JobExecution, LeaderBoard, Vault } from "../types/schema";
import { getUniqueId } from "../utils/conversions";
import {
  JobExecuted,
  JobRegistered,
  JobToggledByCreator,
} from "../DynamicJobs/DynamicJobs";

/**
 *
 * @param event JobRegistered event handler
 */
export function handleJobRegistered(event: JobRegistered): void {
  const id = `${event.params.jobHash.toHexString()}-${event.address.toHexString()}`;

  let job = Job.load(id);

  // check if job already exists
  if (job == null) {
    job = new Job(id);
    job.vaultAddress = event.address.toHexString();

    const vault = Vault.load(job.vaultAddress);
    if (vault) {
      let leaderBoard = LeaderBoard.load(vault.deployer);
      if (leaderBoard) {
        leaderBoard.numStaticJobs = leaderBoard.numStaticJobs.plus(
          BigInt.fromI32(1)
        );
      } else {
        leaderBoard = new LeaderBoard(vault.deployer);
        leaderBoard.address = vault.deployer;
        leaderBoard.numStaticJobs = leaderBoard.numStaticJobs.plus(
          BigInt.fromI32(1)
        );
        leaderBoard.timestamp = event.block.timestamp;
      }

      leaderBoard.save();
    }
    // add vault to dynamic jobs

    // job.vaultId = event.address.toHexString();
    job.failedCounts = BigInt.zero();
    job.ipfsHash = event.params.ipfsForJobDetails;
    // job.jobHash = event.params.jobHash.toHexString();
    job.jobHash = id;
    job.name = event.params.name;
    job.status = BigInt.fromString("3");
    const jobInfo: Array<string> = [];

    for (let counter = 0; counter < event.params.jobInfo.length; counter++) {
      jobInfo.push(event.params.jobInfo[counter].toHexString());
    }

    const targetAddresses: Array<string> = [];

    for (
      let counter = 0;
      counter < event.params.targetAddresses.length;
      counter++
    ) {
      targetAddresses.push(event.params.targetAddresses[counter].toHexString());
    }

    job.jobInfo = jobInfo;
    job.targetAddresses = targetAddresses;
    job.timestamp = event.block.timestamp;
    job.updateTimestamp = event.block.timestamp;
    job.save();
  }
}

/**
 *
 * @param event JobExecuted event handler
 */
export function handleJobExecuted(event: JobExecuted): void {
  const ids: Array<string> = [
    event.params.jobHash.toHexString(),
    event.transaction.hash.toHexString(),
    event.transactionLogIndex.toString(),
  ];

  const id = getUniqueId(ids);

  const jobExecution = new JobExecution(id);

  const jobId = `${event.params.jobHash.toHexString()}-${event.address.toHexString()}`;

  // storing job execution
  jobExecution.executor = event.params.executor.toHexString();
  jobExecution.timestamp = event.block.timestamp;
  jobExecution.updateTimestamp = event.block.timestamp;
  // jobExecution.jobHash = event.params.jobHash.toHexString();
  jobExecution.jobHash = jobId;
  jobExecution.jobIdString = jobId;
  jobExecution.jobId = jobId;
  jobExecution.status = "2";

  log.info(`Event params ${event.params.executor} ${event.params.jobHash}`, []);
  log.info(`Job Hash : ${jobExecution.jobHash}`, []);

  const job = Job.load(jobId);

  if (job) {
    job.status = BigInt.fromString("2");
    job.updateTimestamp = event.block.timestamp;
    job.failedCounts = BigInt.zero();
    job.save();
  }

  jobExecution.save();
}

export function handleToggleByCreator(event: JobToggledByCreator): void {
  const jobId = `${event.params.jobHash.toHexString()}-${event.address.toHexString()}`;

  let job = Job.load(jobId);

  if (job) {
    if (event.params.toggle.equals(BigInt.fromString("1"))) {
      // job is paused
      job.status = BigInt.fromString("1");
    } else if (event.params.toggle.equals(BigInt.fromString("2"))) {
      job.status = BigInt.fromString("2");
    }
    job.save();
  }
}
