import { Creator } from "../types/schema"
import { BigInt } from "@graphprotocol/graph-ts";

export function getOrCreateCreator(id: string ): Creator {
   
    let creator = Creator.load(id)

    if (creator == null ) {
        creator = new Creator(id)
        creator.totalValueLocked = BigInt.fromI32(0).toBigDecimal();
        creator.revenue = BigInt.fromI32(0).toBigDecimal();
        creator.totalYield = BigInt.fromI32(0).toBigDecimal();
    }
    
    creator.save()
    return creator;

}

export function getCreatorStrategies(address: string): Array<string> {

   let strategies:Array<string> = []
   
   let creator = Creator.load(address)

   if (creator == null ) {
         creator = new Creator(address)
   } 

   strategies = creator.strategies
      
      
   return strategies
}