[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandBatchStats

# Interface: CommandBatchStats

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:63](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/commandEncoderManager/CommandEncoderManager.ts#L63)

Batch submission statistics

## Properties

### deferredDestroyCount

> **deferredDestroyCount**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:73](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/commandEncoderManager/CommandEncoderManager.ts#L73)

Number of resources deferred destroyed after this submission

***

### phases

> **phases**: `Record`\<`string`, [`CommandPhaseStats`](CommandPhaseStats.md)\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:68](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/commandEncoderManager/CommandEncoderManager.ts#L68)

Detailed statistics record per phase
