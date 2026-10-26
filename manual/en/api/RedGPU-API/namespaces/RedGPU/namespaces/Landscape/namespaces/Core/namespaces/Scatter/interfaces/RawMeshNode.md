[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / RawMeshNode

# Interface: RawMeshNode

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L25)

Interface containing geometry, material, and relative transformation matrix information of an individual raw mesh node extracted through hierarchy traversal.

## Properties

### currentRelativeMatrix

> **currentRelativeMatrix**: [`mat4`](../../../../../../Math/type-aliases/mat4.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L40)

Accumulated relative transformation matrix (`mat4`) from the root

***

### geometry

> **geometry**: [`Geometry`](../../../../../../../classes/Geometry.md) \| [`Primitive`](../../../../../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L30)

`Geometry` or `Primitive` instance attached to the mesh

***

### material

> **material**: `any`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L35)

Material instance assigned to the mesh

***

### normalMatrix

> **normalMatrix**: [`mat4`](../../../../../../Math/type-aliases/mat4.md)

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L45)

Inverse-transpose normal matrix (`mat4`) for transforming normals and tangents

***

### rawStride

> **rawStride**: `number`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L50)

Number of `Float32` elements per vertex in the source vertex buffer
