[**RedGPU API v4.5.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / bakeFoliageImpostor

# Function: bakeFoliageImpostor()

> **bakeFoliageImpostor**(`redGPUContext`, `renderUnits`, `bakeName?`): [`FoliageBakeResult`](../interfaces/FoliageBakeResult.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:219](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L219)

Renders the specified render units from hemi-octahedral grid viewpoints to bake atlas textures (BaseColor, Normal, ORM) for far-distance impostors.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` instance |
| `renderUnits` | [`FoliageRenderUnit`](../classes/FoliageRenderUnit.md)[] | `undefined` | Array of source render units to bake |
| `bakeName?` | `string` | `'Foliage'` | Label prefix for created GPU resources (default: `'Foliage'`) |

## Returns

[`FoliageBakeResult`](../interfaces/FoliageBakeResult.md)

Baked atlas textures and bounding dimension information (`FoliageBakeResult`)
