
import {
    StrategyCreated,
    Transfer,
    StrategyRegistry as StrategyRegistryContract,
} from '../../generated/StrategyRegistry/StrategyRegistry';


import { getOrCreateCreator } from '../utils/creator';

import {
    Strategy,
} from "../types/schema";



export function handleStrategyCreated(event: StrategyCreated): void {
    getOrCreateCreator(event.params.owner.toHex())

    let strategy = new Strategy(event.params.tokenId.toHexString());
    strategy.creator = event.params.owner.toHex()
    strategy.admin = event.params.owner.toHex()
    strategy.name = event.params.name

    let factoryContract = StrategyRegistryContract.bind(event.address)
    strategy.executionBundle = factoryContract.getRegisteredStrategy(event.params.tokenId).execBundle;

    // strategy.from = event.params.admin.toHex();
    
    strategy.createdAt = event.block.timestamp
    
    strategy.save()
}


export function handleTransfer(event: Transfer): void {
// Initializes and gets the URI of the Strategy Token 
    let factoryContract = StrategyRegistryContract.bind(event.address)
    let strategyURI = factoryContract.tokenURI(event.params.tokenId)
// Loads the Strategy by its address
    let strategy = Strategy.load(strategyURI)
    if (strategy == null) {
       return 
    }
    
    // strategy.from = event.params.from.toHex();

    strategy.admin = event.params.to.toHex()

    strategy.save()
 
}


