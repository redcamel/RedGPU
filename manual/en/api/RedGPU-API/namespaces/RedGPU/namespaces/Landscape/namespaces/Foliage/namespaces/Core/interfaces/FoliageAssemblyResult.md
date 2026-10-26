[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageAssemblyResult

# Interface: FoliageAssemblyResult

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:153](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L153)

Result data interface for foliage mesh assembly and impostor baking.

## Properties

### boundingHeight

> **boundingHeight**: `number`

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:178](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L178)

Overall bounding height of the foliage in meters

***

### boundingRadius

> **boundingRadius**: `number`

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L173)

Overall bounding sphere radius of the foliage in meters

***

### lodInfoList

> **lodInfoList**: [`FoliageLODInfo`](FoliageLODInfo.md)[]

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:168](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L168)

List of distance and render unit range metadata per LOD level

***

### renderUnits

> **renderUnits**: [`FoliageRenderUnit`](../classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:158](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L158)

List of render units for main and depth prepass rendering

***

### shadowMergedRenderUnits

> **shadowMergedRenderUnits**: [`FoliageRenderUnit`](../classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/assembleFoliageRenderUnits.ts:163](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/assembleFoliageRenderUnits.ts#L163)

List of merged render units dedicated to the shadow pass
