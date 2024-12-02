import {
    Bundle,
} from '../types/schema';

import { Bytes } from '@graphprotocol/graph-ts';
import { BundleRegistered } from '../../generated/BundleRegistry/BundleRegistry';

export function handleBundleRegistered(event: BundleRegistered): void {

    
    const id = event.params.bundle;  
    // const id = event.params.creator.toHexString()+"-"+event.params.host;
    const bundle = new Bundle(id);
    bundle.createdAt = event.block.timestamp;
    bundle.hash = event.params.hash.toHexString();
    bundle.bundle = event.params.bundle;
    bundle.host = event.params.host;
    bundle.source = event.params.source;
    bundle.output = event.params.output;
    bundle.active = event.params.active;
    bundle.infoHash = event.params.infoHash;
    bundle.creator = event.params.creator.toHexString();
    bundle.save()
}