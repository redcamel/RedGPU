[**RedGPU API v4.2.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyGPUBuffer

# Function: copyGPUBuffer()

> **copyGPUBuffer**(`commandEncoder`, `srcBuffer`, `dstBuffer`): `void`

Defined in: [src/utils/copyGPUBuffer.ts:18](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/utils/copyGPUBuffer.ts#L18)

Copies data between GPUBuffers.

Copies data from the source buffer to the destination buffer, using the smaller of the two buffer sizes.

* ### Example
```typescript
RedGPU.Util.copyGPUBuffer(commandEncoder, sourceBuffer, destinationBuffer);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | Command Encoder |
| `srcBuffer` | `GPUBuffer` | Source GPUBuffer |
| `dstBuffer` | `GPUBuffer` | Destination GPUBuffer |

## Returns

`void`
