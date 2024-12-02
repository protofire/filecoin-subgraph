import { BigInt, Address, log } from '@graphprotocol/graph-ts';
import { OrchestratorReward, OrchestratorRewardSnapshot, OrchestratorRewardTracker } from './../types/schema';


// get days before timestamp to compre with tracker
export function get6DaysBeforeTimestamp(timestamp: BigInt):BigInt {
    const  date = new Date(timestamp.toI64());
    date.setUTCHours(0);
    date.setUTCDate(date.getUTCDate() - 6);

    const acceptedPastTimestamp = BigInt.fromU64(date.getTime());
    return acceptedPastTimestamp;
}

export function createOrchestratorRewards(
    rewardPerRequest: BigInt,
    receipients: Array<string>,
    timeStamp: BigInt
): void {

    const totalReciepents = BigInt.fromU32(receipients.length);
    
    const rewardPerPerson = rewardPerRequest.div(totalReciepents);
    
    /*
        Create tracker entry to start tracker for rewards
        Functionality:
            1. Create tracker on first load
            2. Tracker will only have on entry
        GraphEntit Fields:
        1. timeStamp -> Will be the event timestamp on creation
           / It will be updated every 6 days
        2. Id: (Contact id six_days_tracker)
        3. rewards: (Ids of all rewards linked as per subgraph.graphql one to many relationship)
    */    

    // set the tracker id to six_days_tracker
    const trackerId = "six_days_tracker";
    let tracker = OrchestratorRewardTracker.load(trackerId)

    if (!tracker) {
        // create the tracker if tracker with given id not exists
        tracker = new OrchestratorRewardTracker(trackerId)
        tracker.timeStamp = timeStamp;
        tracker.save();
    } 

    // iterate all receipeints
    for (let counter=0;counter<receipients.length;counter++) {

        const rewardAddress = receipients[counter];
        const reward = rewardPerPerson;
        
        // create orchestrator reward entity
        let orchestratorReward = OrchestratorReward.load(rewardAddress);
        if(!orchestratorReward) {
            orchestratorReward = new OrchestratorReward(rewardAddress);
            orchestratorReward.reward = reward;
            orchestratorReward.address = rewardAddress;
            orchestratorReward.timeStamp = timeStamp
            orchestratorReward.updatedTimeStamp = timeStamp
            orchestratorReward.trackerId = trackerId
        } else {
            orchestratorReward.address = rewardAddress;
            // add previously obtained reward from current reward received by recipients
            orchestratorReward.reward = orchestratorReward.reward.plus(reward);
            orchestratorReward.updatedTimeStamp = timeStamp
        }

        orchestratorReward.save()
    }

    // Load the tracker after rewards are saved
    // We have to load it again as new reward being added and it will populate rewards array
    tracker = OrchestratorRewardTracker.load(trackerId)

    if (tracker) {
        // get 6 days before rewards
        const prevSnapShotTimeStamp = get6DaysBeforeTimestamp(timeStamp);
        
        // if tracker timestamp has surpassed 6 days then move the updated rewards to snapshot
        if (tracker.timeStamp.lt(prevSnapShotTimeStamp)) {
            for (let recordCounter=0;recordCounter<tracker.rewards.length;recordCounter++) {
                const rewardAddress = tracker.rewards[recordCounter];
                
                let orchestratorReward = OrchestratorReward.load(rewardAddress);
                if (orchestratorReward) {
                    createOrchestratorRewardStore(orchestratorReward);
                }
            }
        }
    }
}

// create orchestraor reward snapshot
function createOrchestratorRewardStore(
    orchestratorReward: OrchestratorReward
): void {

    // Id of each entry is recipient id
    let orchestratorSnapshots = OrchestratorRewardSnapshot.load(
        orchestratorReward.address
    )
    
    if (!orchestratorSnapshots) {
        orchestratorSnapshots = new OrchestratorRewardSnapshot(orchestratorReward.address);
        orchestratorSnapshots.timeStamp = orchestratorReward.timeStamp;
    }

    orchestratorSnapshots.updatedTimeStamp = orchestratorReward.updatedTimeStamp;
    // save rewards for each address after 6 days addition
    orchestratorSnapshots.address = orchestratorReward.address;
    orchestratorSnapshots.reward = orchestratorReward.reward;

    orchestratorSnapshots.save()
}