[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / assembleFoliageRenderUnits

# Function: assembleFoliageRenderUnits()

> **assembleFoliageRenderUnits**(`redGPUContext`, `options`, `slotPooler?`): [`FoliageAssemblyResult`](../interfaces/FoliageAssemblyResult.md)

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:199](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L199)

Merges LOD meshes defined in foliage options and bakes an octahedral impostor to assemble render unit lists.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |
| `options` | [`FoliageOptions`](../../../interfaces/FoliageOptions.md) | Foliage creation and LOD configuration options |
| `slotPooler?` | [`FoliageSlotPooler`](../classes/FoliageSlotPooler.md) | Render unit dynamic uniform slot pooler (optional) |

## Returns

[`FoliageAssemblyResult`](../interfaces/FoliageAssemblyResult.md)

Result object containing assembled render units, shadow units, LOD info, and bounding dimensions (`FoliageAssemblyResult`)
