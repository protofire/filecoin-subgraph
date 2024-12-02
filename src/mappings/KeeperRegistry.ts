import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

import {PermissionChanged, LeaveQueued}  from '../../generated/KeeperRegistry/KeeperRegistry';

import { KeeperRegistry as keeperRegistryContract } from '../../generated/KeeperRegistry/KeeperRegistry';

import {
    Keeper
} from '../types/schema';

import {
    createKeeperChangeEvent
} from '../utils/keeperUtils';


export function handlePermissionChanged(event: PermissionChanged): void {
    
    let keeperContract = keeperRegistryContract.bind(event.address)
    let keeper = Keeper.load(event.params._subject.toHex())
    let keeperChangeEvent = createKeeperChangeEvent(event)

    if (keeper == null) {

        keeper = new Keeper(event.params._subject.toHex())
    }
    let res = keeperContract.try_registry(event.params._subject);
    
    let version = res.value.value0
    keeper.bondHeld = version.toBigDecimal();
    keeper.index = res.value.value1

    // keeper.bondHeld = BigDecimal.fromString('1.2');
    // keeper.index = BigInt.fromI32(12);

       //  TODO: Add bond held
    //    keeper.bond

    keeper.status = keeperChangeEvent.action;
    // keeper.status = 'PermissionChanged';
    keeper.save()

}


export function handleLeaveQueued(event: LeaveQueued): void {

    let keeperContract = keeperRegistryContract.bind(event.address)

    let keeper = Keeper.load(event.params.keeper.toHex())

    if (keeper == null) {
        keeper = new Keeper(event.params.keeper.toHexString())
    }
        
    let res = keeperContract.try_registry(event.params.keeper);
    let version = res.value.value0

    keeper.bondHeld = version.toBigDecimal();
    keeper.index = res.value.value1
        // TODO: Add bond held
    keeper.save()
}