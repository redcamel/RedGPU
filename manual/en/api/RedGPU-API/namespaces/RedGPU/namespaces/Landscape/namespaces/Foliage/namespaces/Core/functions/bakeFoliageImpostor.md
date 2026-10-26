[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / bakeFoliageImpostor

# Function: bakeFoliageImpostor()

> **bakeFoliageImpostor**(`redGPUContext`, `renderUnits`, `bakeName?`): [`FoliageBakeResult`](../interfaces/FoliageBakeResult.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L217)

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
