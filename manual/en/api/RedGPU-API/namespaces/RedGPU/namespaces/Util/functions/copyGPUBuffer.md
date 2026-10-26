[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / copyGPUBuffer

# Function: copyGPUBuffer()

> **copyGPUBuffer**(`commandEncoder`, `srcBuffer`, `dstBuffer`): `void`

Defined in: [src/utils/copyGPUBuffer.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/copyGPUBuffer.ts#L27)

Records a command on the command encoder that copies data from a source `GPUBuffer` to a destination `GPUBuffer`.

The copy size is the smaller of the two buffer sizes and must be a multiple of 4 bytes. Both buffers must be different instances.

### Example
```typescript
RedGPU.Util.copyGPUBuffer(commandEncoder, srcBuffer, dstBuffer);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | Command encoder to record the copy command |
| `srcBuffer` | `GPUBuffer` | Source `GPUBuffer` |
| `dstBuffer` | `GPUBuffer` | Destination `GPUBuffer` |

## Returns

`void`

## Throws

If argument types are invalid, both buffers are identical, or the copy size is not a multiple of 4
