[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / createPrimitiveGeometry

# Function: createPrimitiveGeometry()

> **createPrimitiveGeometry**(`redGPUContext`, `interleaveData`, `indexData`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/createPrimitiveGeometry.ts:38](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/primitive/core/createPrimitiveGeometry.ts#L38)

Creates a primitive `Geometry` instance from interleaved vertex data and index arrays.

### Example
```typescript
const geometry = RedGPU.Primitive.Core.createPrimitiveGeometry(
    redGPUContext,
    interleaveData,
    indexData,
    'CUSTOM_KEY'
);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `interleaveData` | `number`[] | Interleaved vertex data array (`Array<number>`) |
| `indexData` | `number`[] | Vertex index data array (`Array<number>`) |
| `uniqueKey` | `string` | Unique key used for buffer labeling and caching |

## Returns

[`Geometry`](../../../../../classes/Geometry.md)

Created `Geometry` instance
