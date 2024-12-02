import { RunnerAmountChanged } from '../types/RunnerRegistry/runnerRegistry';
import { Runner } from "../types/schema";

export function handleRunnerAmountChanged(event: RunnerAmountChanged): void {

    let runner = Runner.load(event.params.runner.toHex());
    if (runner == null) {
        runner = new Runner(event.params.runner.toHex());
        runner.createdAt = event.block.timestamp;
    }
    runner.bondHeld = event.params.amount;
    runner.save()

}