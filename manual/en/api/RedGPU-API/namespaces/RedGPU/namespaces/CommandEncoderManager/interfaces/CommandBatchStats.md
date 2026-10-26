[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandBatchStats

# Interface: CommandBatchStats

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L68)

Interface defining the batch submission (`submitAll`) statistics across all phases.

## Properties

### deferredDestroyCount

> **deferredDestroyCount**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L78)

Number of resources destroyed via deferred destruction after submission

***

### phases

> **phases**: `Record`\<`string`, [`CommandPhaseStats`](CommandPhaseStats.md)\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/commandEncoderManager/CommandEncoderManager.ts#L73)

Detailed statistics record per phase (`Record<string, CommandPhaseStats>`)
