[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / CommandBatchStats

# Interface: CommandBatchStats

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/CommandEncoderManager.ts#L68)

전체 단계 일괄 제출(`submitAll`) 결과 통계 정보를 정의하는 인터페이스입니다.

## Properties

### deferredDestroyCount

> **deferredDestroyCount**: `number`

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/CommandEncoderManager.ts#L78)

제출 완료 후 지연 파괴(Deferred Destroy)된 리소스의 개수

***

### phases

> **phases**: `Record`\<`string`, [`CommandPhaseStats`](CommandPhaseStats.md)\>

Defined in: [src/commandEncoderManager/CommandEncoderManager.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/CommandEncoderManager.ts#L73)

각 단계(Phase)별 상세 통계 정보 레코드 (`Record<string, CommandPhaseStats>`)
