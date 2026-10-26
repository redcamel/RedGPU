[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Grass](../README.md) / GrassOptions

# Interface: GrassOptions

Defined in: [src/landscape/grass/core/Grass.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L18)

Configuration options interface for creating and initializing a `Grass` type.

## Extends

- [`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md)

## Properties



***

### alphaCutoff?

> `optional` **alphaCutoff?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L43)

Alpha cutoff threshold (`0.01` to `1.0`, default: `0.2`)

***

***

### baseColorTexture?

> `optional` **baseColorTexture?**: `string` \| [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/grass/core/Grass.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L28)

Grass base color texture URL string or `BitmapTexture` instance

***

***

### exposureBoost?

> `optional` **exposureBoost?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L63)

Brightness exposure boost multiplier (default: `1.0`)

***

***

### maxInstances?

> `optional` **maxInstances?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:83](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L83)

Maximum instance capacity to allocate

***

***

### maxScale?

> `optional` **maxScale?**: \[`number`, `number`\] \| \[`number`, `number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:38](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L38)

Maximum random instance scale `[width, height]` or `[x, y, z]` (default: `[1.3, 1.4]`)

***

***

### mesh

> **mesh**: [`Mesh`](../../../../Display/classes/Mesh.md)

Defined in: [src/landscape/grass/core/Grass.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L23)

Source `Mesh` instance from which grass blade geometry and material are extracted

***

***

### minScale?

> `optional` **minScale?**: \[`number`, `number`\] \| \[`number`, `number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L33)

Minimum random instance scale `[width, height]` or `[x, y, z]` (default: `[0.7, 0.7]`)

***

***

### minY?

> `optional` **minY?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L68)

Mesh local bounding minimum Y offset (automatically calculated from mesh geometry if omitted)

***

***

### receiveShadow?

> `optional` **receiveShadow?**: `boolean`

Defined in: [src/landscape/grass/core/Grass.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L73)

Whether the grass surface receives shadows (default: `true`)

***

***

### roughness?

> `optional` **roughness?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L48)

Surface roughness factor (`0.04` to `1.0`, default: `0.55`)

***

***

### shadowStrength?

> `optional` **shadowStrength?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L78)

Darkness strength of received shadows (`0.0` to `1.0`, default: `1.0`)

***

***

### subsurfaceColor?

> `optional` **subsurfaceColor?**: \[`number`, `number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:58](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L58)

Subsurface scattering RGB color `[r, g, b]` (`0.0` to `1.0`, default: `[0.35, 0.65, 0.15]`)

***

***

### subsurfaceStrength?

> `optional` **subsurfaceStrength?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L53)

Subsurface scattering transmission strength (`0.0` to `3.0`, default: `0.25`)

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### bottomOffset?

> `optional` **bottomOffset?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L36)

Bottom height offset of the instance relative to the terrain surface (default: `0.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`bottomOffset`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#bottomoffset)

***

***

### castShadow?

> `optional` **castShadow?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L48)

Whether directional light shadow casting is enabled (default: `true`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`castShadow`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#castshadow)

***

***

### cullingDistance?

> `optional` **cullingDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L24)

Maximum visibility distance from the camera at which instances are culled (default: `200.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`cullingDistance`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#cullingdistance)

***

***

### densityMultiplier?

> `optional` **densityMultiplier?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L84)

Density multiplier applied to the base density (default: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityMultiplier`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densitymultiplier)

***

***

### densityPerHectare?

> `optional` **densityPerHectare?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L78)

Base placement density per hectare (10,000㎡) (default: `1000.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityPerHectare`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densityperhectare)

***

***

### densityScaleByWeight?

> `optional` **densityScaleByWeight?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:72](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L72)

Whether to scale instance size proportionally to the layer weight (default: `true`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityScaleByWeight`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densityscalebyweight)

***

***

### groundBlendStrength?

> `optional` **groundBlendStrength?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L90)

Ground blending strength with terrain surface color and normal (`0.0`~`1.0`, default: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`groundBlendStrength`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#groundblendstrength)

***

***

### height?

> `optional` **height?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L42)

Base height of the instance (default: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`height`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#height)

***

***

### maxSlope?

> `optional` **maxSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L66)

Maximum terrain slope angle at which instances can be placed (in degrees, default: `45.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`maxSlope`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#maxslope)

***

***

### minSlope?

> `optional` **minSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L60)

Minimum terrain slope angle at which instances can be placed (in degrees, default: `0.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`minSlope`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#minslope)

***

***

### name

> **name**: `string`

Defined in: [src/landscape/core/scatter/AScatterType.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L18)

Unique identifier name of the scatter type

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`name`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#name)

***

***

### shadowCullDistance?

> `optional` **shadowCullDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L30)

Maximum distance at which instances are culled in the shadow pass (default: `50.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`shadowCullDistance`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#shadowculldistance)

***

***

### targetLayer?

> `optional` **targetLayer?**: `string` \| `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L54)

Name or index of the target terrain layer from which to reference placement density

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`targetLayer`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#targetlayer)

</details>
