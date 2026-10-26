[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / assembleScatterRenderUnits

# Function: assembleScatterRenderUnits()

> **assembleScatterRenderUnits**(`redGPUContext`, `roots`, `options?`): [`ScatterAssemblyResult`](../interfaces/ScatterAssemblyResult.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:314](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L314)

Traverses one or more `Mesh` hierarchies to merge vertex and index buffers by identical material, producing a list of `ScatterRenderUnit` instances and bounding metrics optimized for scatter instanced rendering.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |
| `roots` | [`Mesh`](../../../../../../Display/classes/Mesh.md) \| [`Mesh`](../../../../../../Display/classes/Mesh.md)[] | Root `Mesh` or `Mesh[]` array to merge |
| `options?` | [`ScatterAssemblyOptions`](../interfaces/ScatterAssemblyOptions.md) | Options for pivot preservation, XZ center alignment, shadow merged geometry, and render unit generation (optional) |

## Returns

[`ScatterAssemblyResult`](../interfaces/ScatterAssemblyResult.md)

`ScatterAssemblyResult` object containing merged render units, unified geometry, and bounding volume metrics
