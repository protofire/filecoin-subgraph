import {ManagerAdded, PermissionsAdded, PermissionsRemoved} from '../../generated/WhitelistRegistry/WhitelistRegistry';


import {WhiteListManager, WhiteListVaultPermission} from '../types/schema';

export function handleWhitelistManagerAdded(event: ManagerAdded): void {
    let whiteListManager = WhiteListManager.load(event.params.manager.toHexString());

    if (!whiteListManager) {
        
        whiteListManager = new WhiteListManager(event.params.manager.toHexString());
        whiteListManager.vault = event.params.vaultAddress.toHexString();
        whiteListManager.address = event.params.manager.toHexString();
        whiteListManager.timestamp = event.block.timestamp;
    }

    whiteListManager.save();
}

export function handleWhitelistPermissionsAdded(event: PermissionsAdded): void {

    let whiteListVaultPermissions = WhiteListVaultPermission.load(event.params.vault.toHexString());
    
    let addresses: Array<string> = [];

    if(!whiteListVaultPermissions) {
        whiteListVaultPermissions = new WhiteListVaultPermission(event.params.vault.toHexString());
        whiteListVaultPermissions.timestamp = event.block.timestamp;
        
        addresses = whiteListVaultPermissions.addresses;
    }

    whiteListVaultPermissions.vault = event.params.vault.toHexString();
    whiteListVaultPermissions.manager = event.params.whitelistManager.toHexString();
    

    for(let index=0; index<event.params.addressesAdded.length; index++){
        const addressAdded = event.params.addressesAdded[index].toHexString();
        if (addresses.indexOf(addressAdded) < 0) {
            addresses.push(addressAdded);
        }
    }

    whiteListVaultPermissions.addresses = addresses;
    whiteListVaultPermissions.updatedTimestamp = event.block.timestamp;

    whiteListVaultPermissions.save();
}

export function handleWhitelistPermissionsRemoved(event: PermissionsRemoved): void {

    let whiteListVaultPermissions = WhiteListVaultPermission.load(event.params.vault.toHexString());
    
    if(whiteListVaultPermissions) {
        const addresses: Array<string> = whiteListVaultPermissions.addresses;
        const newAddresses: Array<string> = [];

        const removedAddresses: Array<string> = [];

        for(let index=0;index<event.params.addressesRemoved.length; index++){
            removedAddresses.push(event.params.addressesRemoved[index].toHexString());
        }

        for(let counter=0;counter<addresses.length;counter++) {
            if (removedAddresses.indexOf(addresses[counter]) < 0)  {
                newAddresses.push(addresses[counter]);
            }
        }

        whiteListVaultPermissions.addresses = newAddresses;
        whiteListVaultPermissions.updatedTimestamp = event.block.timestamp;
        whiteListVaultPermissions.save();
    }
}