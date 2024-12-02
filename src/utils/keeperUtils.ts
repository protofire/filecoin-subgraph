import { PermissionChanged, LeaveQueued  } from '../../generated/KeeperRegistry/KeeperRegistry';
import { QueueTimeline , PermissionUpdate } from './../types/schema';


export function createKeeperChangeEvent( event : PermissionChanged  ) : PermissionUpdate {

   let keeperStatus = new PermissionUpdate(event.params._subject.toHex())
    keeperStatus.action = event.params._permissionType.toString()// Not the best way to do this //The type // to be fixed
    keeperStatus.keeper = event.params._subject.toHex()
    keeperStatus.timeStamp = event.block.timestamp
    keeperStatus.save()

   return keeperStatus

}

export function createKeeperQueuedEvent( event: LeaveQueued) : QueueTimeline {

    let keeperQueued = new QueueTimeline(event.params.keeper.toHex())
    
    keeperQueued.keeper = event.params.keeper.toHex()
    keeperQueued.timeDelay = event.params.leaveTimestamp;
    keeperQueued.queued = true
 
    keeperQueued.save()
    
    return keeperQueued
}