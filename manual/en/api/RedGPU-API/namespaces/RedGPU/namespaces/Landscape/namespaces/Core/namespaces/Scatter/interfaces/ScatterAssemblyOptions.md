[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterAssemblyOptions

# Interface: ScatterAssemblyOptions

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L93)

Options interface controlling pivot preservation, center alignment, and shadow-only merged geometry generation when assembling scatter render units.

## Properties

### centerXZ?

> `optional` **centerXZ?**: `boolean`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L104)

Whether to align the XZ center of the bounding box to the origin (`0, 0`) (default: `false`)

***

### createRenderUnits?

> `optional` **createRenderUnits?**: `boolean`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L116)

Whether to instantiate the default `ScatterRenderUnit[]` array (default: `true`)

***

### generateShadowMergedGeometry?

> `optional` **generateShadowMergedGeometry?**: `boolean`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:110](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L110)

Whether to also generate a position-only (`POSITION_ONLY`) single merged geometry for the shadow pass (default: `false`)

***

### preservePivot?

> `optional` **preservePivot?**: `boolean`

Defined in: [src/landscape/core/scatter/assembleScatterRenderUnits.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/assembleScatterRenderUnits.ts#L98)

Whether to preserve the original mesh's Y-axis pivot (default: `true`)
