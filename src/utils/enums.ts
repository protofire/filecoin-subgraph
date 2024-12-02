import { BigInt } from "@graphprotocol/graph-ts";


export function getActionState(value: BigInt): string {  
    switch (value.toI32()) {
        case 0: return "PENDING";
        case 1: return "APPROVED";
        case 2: return "COMPLETED";
    }
    throw new Error("unknown state");
}


export function getPermissionType(value: BigInt): string { 
    switch (value.toI32()) {
        case 0: return "NONE";
        case 1: return "FULL";
        case 2: return "SLASHED";
    }
    throw new Error("unknown state");
}