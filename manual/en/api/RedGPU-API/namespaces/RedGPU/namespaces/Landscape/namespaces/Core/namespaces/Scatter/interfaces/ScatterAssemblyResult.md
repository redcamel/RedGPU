[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterAssemblyResult

# Interface: ScatterAssemblyResult

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:125](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L125)

Result interface containing render units, unified geometry, and bounding volume metrics produced by `assembleScatterRenderUnits` after merging a mesh hierarchy.

## Properties

### boundingHeight

> **boundingHeight**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L160)

Total Y-axis height of the bounding box (`maxY - minY`)

***

### boundingRadius

> **boundingRadius**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L155)

Maximum bounding sphere radius of all vertices from the origin

***

### groups

> **groups**: [`AssembledMeshGroup`](AssembledMeshGroup.md)[]

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:130](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L130)

List of mesh groups (`AssembledMeshGroup[]`) merged by material

***

### minY

> **minY**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L170)

Minimum Y coordinate of the bounding box after alignment

***

### renderUnits

> **renderUnits**: [`ScatterRenderUnit`](../classes/ScatterRenderUnit.md)[]

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:135](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L135)

Array of `ScatterRenderUnit[]` instances to use for scatter rendering

***

### shadowMergedGeometry?

> `optional` **shadowMergedGeometry?**: [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:165](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L165)

Position-only `Geometry` instance merged for the shadow pass (when generated)

***

### totalIndexCount

> **totalIndexCount**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L150)

Total merged index count

***

### totalVertexCount

> **totalVertexCount**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:145](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L145)

Total merged vertex count

***

### unifiedGeometry

> **unifiedGeometry**: [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:140](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L140)

Unified `Geometry` instance with vertices and indices of all groups merged into one
