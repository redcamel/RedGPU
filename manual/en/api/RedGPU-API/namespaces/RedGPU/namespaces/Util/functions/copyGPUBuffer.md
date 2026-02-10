[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyGPUBuffer

# Function: copyGPUBuffer()

> **copyGPUBuffer**(`gpuDevice`, `srcBuffer`, `dstBuffer`): `void`

Defined in: [src/utils/copyGPUBuffer.ts:24](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/utils/copyGPUBuffer.ts#L24)


Copies data between GPUBuffers.


Copies data from srcBuffer to dstBuffer. Size is determined by the smaller buffer.

* ### Example
```typescript
RedGPU.Util.copyGPUBuffer(device, sourceBuffer, destinationBuffer);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `gpuDevice` | `GPUDevice` | GPU device to use for the copy operation |
| `srcBuffer` | `GPUBuffer` | Source buffer to copy from |
| `dstBuffer` | `GPUBuffer` | Destination buffer to copy to |

## Returns

`void`
