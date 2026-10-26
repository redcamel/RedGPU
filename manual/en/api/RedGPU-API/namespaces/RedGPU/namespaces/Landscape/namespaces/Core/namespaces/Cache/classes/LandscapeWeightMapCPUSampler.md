[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Cache](../README.md) / LandscapeWeightMapCPUSampler

# Class: LandscapeWeightMapCPUSampler

Defined in: [src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts#L36)

Class that loads terrain layer weight map images into CPU memory and performs bilinear interpolation sampling.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new LandscapeWeightMapCPUSampler**(): `LandscapeWeightMapCPUSampler`

#### Returns

`LandscapeWeightMapCPUSampler`

## Methods

### clear()

> **clear**(): `void`

Defined in: [src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts:179](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts#L179)

Clears all cached weight map data and ongoing loading states.

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts#L188)

Releases the internal cache resources of the sampler.

#### Returns

`void`

***

### getWeight()

> **getWeight**(`src`, `u`, `v`, `channelIndex?`): `number`

Defined in: [src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts:140](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts#L140)

Returns the bilinearly interpolated weight value at the normalized UV coordinates (`0.0` to `1.0`) and channel index.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `src` | `string` | `undefined` | Weight map image path (URL) |
| `u` | `number` | `undefined` | Normalized U coordinate (`0.0` to `1.0`) |
| `v` | `number` | `undefined` | Normalized V coordinate (`0.0` to `1.0`) |
| `channelIndex?` | `number` | `0` | Color channel index to sample (`0`: R, `1`: G, `2`: B, `3`: A, default: `0`) |

#### Returns

`number`

Sampled weight value (`0.0` to `1.0`)

***

### load()

> **load**(`src`): `Promise`\<[`WeightMapPixelData`](../interfaces/WeightMapPixelData.md)\>

Defined in: [src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/cache/LandscapeWeightMapCPUSampler.ts#L51)

Asynchronously loads and caches weight map pixel data from the specified image path.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `src` | `string` | Weight map image path (URL) |

#### Returns

`Promise`\<[`WeightMapPixelData`](../interfaces/WeightMapPixelData.md)\>

Loaded pixel data (`Promise<WeightMapPixelData | null>`)
