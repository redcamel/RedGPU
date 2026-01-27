[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyGPUBuffer

# Function: copyGPUBuffer()

> **copyGPUBuffer**(`gpuDevice`, `srcBuffer`, `dstBuffer`): `void`

Defined in: [src/utils/copyGPUBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/59415c8774b29a62399e4dd370644ac1171feba4/src/utils/copyGPUBuffer.ts#L24)

GPUBuffer 간 데이터를 복사합니다.


srcBuffer의 데이터를 dstBuffer로 복사합니다. 크기는 두 버퍼 중 작은 쪽을 따릅니다.


* ### Example
```typescript
RedGPU.Util.copyGPUBuffer(device, sourceBuffer, destinationBuffer);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `gpuDevice` | `GPUDevice` | 복사 작업에 사용할 GPU 디바이스
| `srcBuffer` | `GPUBuffer` | 복사할 소스 버퍼
| `dstBuffer` | `GPUBuffer` | 복사 대상 버퍼

## Returns

`void`
