[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AScatterTypeInitOptions

# Interface: AScatterTypeInitOptions

Defined in: [src/landscape/core/scatter/AScatterType.ts:13](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L13)

Initialization options interface commonly passed when creating a scatter type.

## Extended by

- [`FoliageOptions`](../../../../Foliage/interfaces/FoliageOptions.md)
- [`GrassOptions`](../../../../Grass/interfaces/GrassOptions.md)

## Properties

### bottomOffset?

> `optional` **bottomOffset?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L36)

Bottom height offset of the instance relative to the terrain surface (default: `0.0`)

***

### castShadow?

> `optional` **castShadow?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L48)

Whether directional light shadow casting is enabled (default: `true`)

***

### cullingDistance?

> `optional` **cullingDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L24)

Maximum visibility distance from the camera at which instances are culled (default: `200.0`)

***

### densityMultiplier?

> `optional` **densityMultiplier?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L84)

Density multiplier applied to the base density (default: `1.0`)

***

### densityPerHectare?

> `optional` **densityPerHectare?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L78)

Base placement density per hectare (10,000㎡) (default: `1000.0`)

***

### densityScaleByWeight?

> `optional` **densityScaleByWeight?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:72](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L72)

Whether to scale instance size proportionally to the layer weight (default: `true`)

***

### groundBlendStrength?

> `optional` **groundBlendStrength?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L90)

Ground blending strength with terrain surface color and normal (`0.0`~`1.0`, default: `1.0`)

***

### height?

> `optional` **height?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L42)

Base height of the instance (default: `1.0`)

***

### maxSlope?

> `optional` **maxSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L66)

Maximum terrain slope angle at which instances can be placed (in degrees, default: `45.0`)

***

### minSlope?

> `optional` **minSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L60)

Minimum terrain slope angle at which instances can be placed (in degrees, default: `0.0`)

***

### name

> **name**: `string`

Defined in: [src/landscape/core/scatter/AScatterType.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L18)

Unique identifier name of the scatter type

***

### shadowCullDistance?

> `optional` **shadowCullDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L30)

Maximum distance at which instances are culled in the shadow pass (default: `50.0`)

***

### targetLayer?

> `optional` **targetLayer?**: `string` \| `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L54)

Name or index of the target terrain layer from which to reference placement density
