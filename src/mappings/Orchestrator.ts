import { BigInt } from "@graphprotocol/graph-ts";
import {
  ActionExecuted,
  ActionFailed,
  Vote as voteEvent,
} from "../../generated/Orchestrator/Orchestrator";

import { OrchestratorAction, Vote } from "../types/schema";

export function handleActionExecuted(event: ActionExecuted): void {
  let orchestrator = OrchestratorAction.load(
    event.transaction.hash.toHexString()
  );

  if (orchestrator == null) {
    orchestrator = new OrchestratorAction(
      event.transaction.hash.toHexString()
    );
    orchestrator.from = event.params.from.toHex();

    orchestrator.timestamp = event.block.timestamp;
    orchestrator.vault = '';
    orchestrator.gasUsed = BigInt.zero();

  }

 
  orchestrator.transactionHash = event.transaction.hash.toHexString();
  orchestrator.hash = event.params.actionHash.toHexString();

  orchestrator.from = event.params.from.toHex();
  orchestrator.lastUpdated = event.block.timestamp;
  orchestrator.status = "executed";

  // if we have received recipients
  // if (orchestrator.recipients.length > 0) {
  //     // create orchestor rewards and snapshots
  //     createOrchestratorRewards(
  //         event.params._rewardPerRequest,
  //         orchestrator.recipients,
  //         event.block.timestamp
  //     )
  // }

  orchestrator.save();
}

export function handleActionFailed(event: ActionFailed): void {
  let orchestrator = OrchestratorAction.load(
    event.transaction.hash.toHexString()
  );


  if (orchestrator == null) {
    orchestrator = new OrchestratorAction(
      event.transaction.hash.toHexString()
    );
    orchestrator.timestamp = event.block.timestamp;
    orchestrator.vault = '';
    orchestrator.gasUsed = BigInt.zero();
  }

  orchestrator.hash = event.params.actionHash.toHexString();
  orchestrator.transactionHash = event.transaction.hash.toHexString();
  orchestrator.lastUpdated = event.block.timestamp;
  orchestrator.status = "failed";
  orchestrator.save();
}

export function handleVote(event: voteEvent): void {
  /**
     * this.set("timestamp", Value.fromBigInt(BigInt.zero()));
    this.set("from", Value.fromString(""));
    this.set("state", Value.fromString(""));
    this.set("status", Value.fromString(""));vote
    this.set('recipients', Value.fromStringArray([]));
    this.set('hash', Value.fromString(''))
     */
  let vote = new Vote(
    event.params.from
      .toHex()
      .concat("-")
      .concat(event.block.timestamp.toHex())
  );

  let orchestrator = OrchestratorAction.load(
    event.transaction.hash.toHexString()
  );

  if (orchestrator == null) {
    orchestrator = new OrchestratorAction(
      event.transaction.hash.toHexString()
    );
    orchestrator.timestamp = event.block.timestamp;
    orchestrator.vault = '';
    orchestrator.gasUsed = BigInt.zero();
  }

  orchestrator.state = "vote";
  orchestrator.from = event.params.from.toHex();
  orchestrator.recipients = [];
  orchestrator.hash = event.params.actionHash.toHexString();
  orchestrator.transactionHash = event.transaction.hash.toHexString();
  

  orchestrator.lastUpdated = event.block.timestamp;
  orchestrator.status = "vote";
  orchestrator.save();

  vote.timestamp = event.block.timestamp;
  vote.by = event.params.from.toHex();
  vote.action = event.params.actionHash.toHexString();

  vote.save();
}
