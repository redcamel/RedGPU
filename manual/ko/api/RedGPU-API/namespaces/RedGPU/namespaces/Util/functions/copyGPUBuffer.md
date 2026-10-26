[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyGPUBuffer

# Function: copyGPUBuffer()

> **copyGPUBuffer**(`commandEncoder`, `srcBuffer`, `dstBuffer`): `void`

Defined in: [src/utils/copyGPUBuffer.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/copyGPUBuffer.ts#L27)

소스 `GPUBuffer`의 데이터를 대상 `GPUBuffer`로 복사하는 명령을 커맨드 인코더에 기록합니다.

복사 크기는 두 버퍼 크기 중 작은 값이며 4바이트의 배수여야 합니다. 두 버퍼는 서로 다른 인스턴스여야 합니다.

### Example
```typescript
RedGPU.Util.copyGPUBuffer(commandEncoder, srcBuffer, dstBuffer);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | 복사 명령을 기록할 커맨드 인코더 |
| `srcBuffer` | `GPUBuffer` | 소스 `GPUBuffer` |
| `dstBuffer` | `GPUBuffer` | 대상 `GPUBuffer` |

## Returns

`void`

## Throws

인자 타입이 잘못되었거나, 두 버퍼가 동일하거나, 복사 크기가 4의 배수가 아닌 경우
