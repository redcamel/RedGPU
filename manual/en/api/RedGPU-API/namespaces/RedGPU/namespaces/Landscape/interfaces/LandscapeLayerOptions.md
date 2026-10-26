[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Landscape](../README.md) / LandscapeLayerOptions

# Interface: LandscapeLayerOptions

Defined in: [src/landscape/LandscapeLayer.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L21)

Configuration options interface passed when creating a `LandscapeLayer`.

## Properties

### aoIntensity?

> `optional` **aoIntensity?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:88](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L88)

Ambient occlusion (AO) intensity (default: `1.0`)

***

### baseColorTexture?

> `optional` **baseColorTexture?**: `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L36)

Base color texture instance or image URL

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [src/landscape/LandscapeLayer.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L31)

Whether the layer is enabled (default: `true`)

***

### heightBlendFactor?

> `optional` **heightBlendFactor?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L93)

Height-based layer blending contrast factor (range: `0.0 to 5.0`, default: `1.0`)

***

### name

> **name**: `string`

Defined in: [src/landscape/LandscapeLayer.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L26)

Unique name of the layer

***

### nearUVScaleMultiplier?

> `optional` **nearUVScaleMultiplier?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:67](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L67)

UV scale multiplier applied to the near-detail region (default: `2.0`)

***

### normalIntensity?

> `optional` **normalIntensity?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:83](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L83)

Normal map intensity (default: `1.0`)

***

### normalTexture?

> `optional` **normalTexture?**: `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L41)

Normal texture instance or image URL

***

### ormTexture?

> `optional` **ormTexture?**: `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L46)

ORM (Occlusion, Roughness, Metallic) texture instance or image URL

***

### roughness?

> `optional` **roughness?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L78)

Surface roughness factor (default: `1.0`)

***

### stochasticScale?

> `optional` **stochasticScale?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L103)

Stochastic tiling cell scale (minimum: `0.01`, default: `1.0`)

***

### stochasticTiling?

> `optional` **stochasticTiling?**: `boolean`

Defined in: [src/landscape/LandscapeLayer.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L98)

Whether to use stochastic tiling to suppress repetitive patterns (default: `true`)

***

### uvOffset?

> `optional` **uvOffset?**: \[`number`, `number`\]

Defined in: [src/landscape/LandscapeLayer.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L62)

Texture UV offset `[u, v]` (default: `[0.0, 0.0]`)

***

### uvScale?

> `optional` **uvScale?**: \[`number`, `number`\]

Defined in: [src/landscape/LandscapeLayer.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L57)

Texture UV tiling scale `[u, v]` (default: `[20.0, 20.0]`)

***

### weightChannel?

> `optional` **weightChannel?**: [`LandscapeWeightMapChannel`](../type-aliases/LandscapeWeightMapChannel.md)

Defined in: [src/landscape/LandscapeLayer.ts:72](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L72)

Color channel to reference in the weight texture (default: `'R'`)

***

### weightTexture?

> `optional` **weightTexture?**: `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L51)

Splatting weight texture instance or image URL (shares a single RGBA weight map across the terrain, referencing R/G/B/A channels via `weightChannel`)
