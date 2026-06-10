[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyGPUBuffer

# Function: copyGPUBuffer()

> **copyGPUBuffer**(`commandEncoder`, `srcBuffer`, `dstBuffer`): `void`

Defined in: [src/utils/copyGPUBuffer.ts:18](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/utils/copyGPUBuffer.ts#L18)

GPUBuffer 간 데이터를 복사합니다.

소스 버퍼의 데이터를 대상 버퍼로 복사하며, 복사 크기는 두 버퍼 중 작은 쪽을 기준으로 합니다.

* ### Example
```typescript
RedGPU.Util.copyGPUBuffer(commandEncoder, sourceBuffer, destinationBuffer);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | 커맨드 인코더
| `srcBuffer` | `GPUBuffer` | 소스 GPUBuffer
| `dstBuffer` | `GPUBuffer` | 대상 GPUBuffer

## Returns

`void`
