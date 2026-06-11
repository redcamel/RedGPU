[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyGPUBuffer

# Function: copyGPUBuffer()

> **copyGPUBuffer**(`commandEncoder`, `srcBuffer`, `dstBuffer`): `void`

Defined in: [src/utils/copyGPUBuffer.ts:18](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/utils/copyGPUBuffer.ts#L18)

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
