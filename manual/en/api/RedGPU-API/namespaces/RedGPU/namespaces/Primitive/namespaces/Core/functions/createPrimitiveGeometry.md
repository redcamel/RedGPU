[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / createPrimitiveGeometry

# Function: createPrimitiveGeometry()

> **createPrimitiveGeometry**(`redGPUContext`, `interleaveData`, `indexData`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/createPrimitiveGeometry.ts:33](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/primitive/core/createPrimitiveGeometry.ts#L33)


Creates primitive geometry based on vertex and index data.

### Example
```typescript
const geometry = RedGPU.Core.createPrimitiveGeometry(redGPUContext, interleaveData, indexData, "UniqueKey");
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `interleaveData` | `number`[] | Array of vertex data in interleaved format |
| `indexData` | `number`[] | Array of index data |
| `uniqueKey` | `string` | Unique key for caching |

## Returns

[`Geometry`](../../../../../classes/Geometry.md)


Created Geometry instance
