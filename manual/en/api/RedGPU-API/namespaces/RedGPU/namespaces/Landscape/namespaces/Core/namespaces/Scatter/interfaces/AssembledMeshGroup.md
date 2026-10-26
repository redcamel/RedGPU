[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AssembledMeshGroup

# Interface: AssembledMeshGroup

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L59)

Interface containing geometry and index range information of a submesh group merged by identical material.

## Properties

### firstIndex

> **firstIndex**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L84)

Starting index offset within the unified index buffer

***

### geometry

> **geometry**: [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L69)

Merged unified or group `Geometry` instance

***

### indexCount

> **indexCount**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L79)

Total index count within the group

***

### material

> **material**: `any`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L64)

Material instance applied to the group

***

### vertexCount

> **vertexCount**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L74)

Total vertex count within the group
