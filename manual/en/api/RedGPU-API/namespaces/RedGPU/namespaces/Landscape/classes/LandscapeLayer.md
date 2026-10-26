[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Landscape](../README.md) / LandscapeLayer

# Class: LandscapeLayer

Defined in: [src/landscape/LandscapeLayer.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L131)

Class that defines the textures, UV transform, PBR properties, and weight channel of an individual material layer used in terrain multi-layer splatting. Automatically created internally via `landscape.addLayer()`.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Add and reference a new splatting layer on the landscape
const rockLayer = landscape.addLayer({
    name: 'Rock',
    baseColorTexture: './assets/rock_diff.jpg',
    normalTexture: './assets/rock_norm.jpg',
    uvScale: [30, 30],
    roughness: 0.85
});
```

## See

[Multi-Layer Splatting example](https://redcamel.github.io/RedGPU/examples/3d/landscape/multiLayerSplatting/)

## Constructors

### Constructor

> **new LandscapeLayer**(`redGPUContextOrOptions`, `options?`): `LandscapeLayer`

Defined in: [src/landscape/LandscapeLayer.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L188)

Creates a `LandscapeLayer` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContextOrOptions` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) \| [`LandscapeLayerOptions`](../interfaces/LandscapeLayerOptions.md) | `RedGPUContext` instance or `LandscapeLayerOptions` configuration object |
| `options?` | [`LandscapeLayerOptions`](../interfaces/LandscapeLayerOptions.md) | `LandscapeLayerOptions` configuration object when `RedGPUContext` is passed as the first argument |

#### Returns

`LandscapeLayer`

## Properties

### onChange?

> `optional` **onChange?**: () => `void`

Defined in: [src/landscape/LandscapeLayer.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L170)

Callback function invoked when a layer's texture or baking-related property changes.

#### Returns

`void`

***

### onUniformChange?

> `optional` **onUniformChange?**: () => `void`

Defined in: [src/landscape/LandscapeLayer.ts:175](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L175)

Callback function invoked when only uniform buffer data needs to be updated without VBT rebaking.

#### Returns

`void`

***

### UNIFORM\_FLOAT\_COUNT

> <span class="readonly-badge">readonly</span> `static` **UNIFORM\_FLOAT\_COUNT**: `16` = `16`

Defined in: [src/landscape/LandscapeLayer.ts:165](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L165)

Number of `f32` elements occupied by a single layer uniform struct (16 floats = 64 bytes).

## Accessors

### aoIntensity

#### Get Signature

> **get** **aoIntensity**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:573](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L573)

Gets or sets the ambient occlusion (AO) intensity of the layer.

##### Returns

`number`

AO intensity

#### Set Signature

> **set** **aoIntensity**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:552](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L552)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### baseColorTexture

#### Get Signature

> **get** **baseColorTexture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:316](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L316)

Gets or sets the base color texture of the layer.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

`BitmapTexture` instance or `undefined`

#### Set Signature

> **set** **baseColorTexture**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:292](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L292)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) |

##### Returns

`void`

***

### enabled

#### Get Signature

> **get** **enabled**(): `boolean`

Defined in: [src/landscape/LandscapeLayer.ts:416](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L416)

Gets or sets whether the layer is enabled.

##### Returns

`boolean`

Enabled state (`boolean`)

#### Set Signature

> **set** **enabled**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:420](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L420)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

***

### heightBlendFactor

#### Get Signature

> **get** **heightBlendFactor**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:585](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L585)

Gets or sets the height-based layer blending contrast factor (range: `0.0 to 5.0`).

##### Returns

`number`

Height blend factor

#### Set Signature

> **set** **heightBlendFactor**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:589](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L589)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### name

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **name**(): `string`

Defined in: [src/landscape/LandscapeLayer.ts:288](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L288)

Returns the unique name of the layer.

##### Returns

`string`

Layer name

***

### nearUVScaleMultiplier

#### Get Signature

> **get** **nearUVScaleMultiplier**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:474](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L474)

Gets or sets the UV scale multiplier applied to the near-detail region. (Minimum: `0.1`)

##### Returns

`number`

Near-detail UV scale multiplier

#### Set Signature

> **set** **nearUVScaleMultiplier**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:478](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L478)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### normalIntensity

#### Get Signature

> **get** **normalIntensity**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:542](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L542)

Gets or sets the normal map intensity of the layer.

##### Returns

`number`

Normal map intensity

#### Set Signature

> **set** **normalIntensity**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:546](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L546)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### normalTexture

#### Get Signature

> **get** **normalTexture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:344](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L344)

Gets or sets the normal texture of the layer.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

`BitmapTexture` instance or `undefined`

#### Set Signature

> **set** **normalTexture**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:320](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L320)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) |

##### Returns

`void`

***

### ormTexture

#### Get Signature

> **get** **ormTexture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:372](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L372)

Gets or sets the ORM (Occlusion, Roughness, Metallic) texture of the layer.

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

`BitmapTexture` instance or `undefined`

#### Set Signature

> **set** **ormTexture**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:348](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L348)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) |

##### Returns

`void`

***

### roughness

#### Get Signature

> **get** **roughness**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:524](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L524)

Gets or sets the surface roughness factor of the layer.

##### Returns

`number`

Roughness factor

#### Set Signature

> **set** **roughness**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:528](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L528)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### stochasticScale

#### Get Signature

> **get** **stochasticScale**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:629](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L629)

Gets or sets the stochastic tiling cell scale (minimum: `0.01`).

##### Returns

`number`

Stochastic tiling scale

#### Set Signature

> **set** **stochasticScale**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:633](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L633)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### stochasticTiling

#### Get Signature

> **get** **stochasticTiling**(): `boolean`

Defined in: [src/landscape/LandscapeLayer.ts:609](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L609)

Gets or sets whether stochastic tiling is enabled to suppress repetitive patterns.

##### Returns

`boolean`

Whether stochastic tiling is enabled

#### Set Signature

> **set** **stochasticTiling**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:613](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L613)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

***

### uvOffset

#### Get Signature

> **get** **uvOffset**(): \[`number`, `number`\]

Defined in: [src/landscape/LandscapeLayer.ts:454](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L454)

Gets or sets the UV offset `[u, v]` of the layer texture.

##### Returns

\[`number`, `number`\]

UV offset tuple `[number, number]`

#### Set Signature

> **set** **uvOffset**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:458](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L458)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | \[`number`, `number`\] |

##### Returns

`void`

***

### uvScale

#### Get Signature

> **get** **uvScale**(): \[`number`, `number`\]

Defined in: [src/landscape/LandscapeLayer.ts:434](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L434)

Gets or sets the UV tiling scale `[u, v]` of the layer texture.

##### Returns

\[`number`, `number`\]

UV scale tuple `[number, number]`

#### Set Signature

> **set** **uvScale**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:438](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L438)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | \[`number`, `number`\] |

##### Returns

`void`

***

### weightChannel

#### Get Signature

> **get** **weightChannel**(): [`LandscapeWeightMapChannel`](../type-aliases/LandscapeWeightMapChannel.md)

Defined in: [src/landscape/LandscapeLayer.ts:493](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L493)

Gets or sets the color channel identifier referenced in the weight texture.

##### Returns

[`LandscapeWeightMapChannel`](../type-aliases/LandscapeWeightMapChannel.md)

Weight channel identifier (`LandscapeWeightMapChannel`)

#### Set Signature

> **set** **weightChannel**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:497](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L497)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | [`LandscapeWeightMapChannel`](../type-aliases/LandscapeWeightMapChannel.md) |

##### Returns

`void`

***

### weightChannelIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **weightChannelIndex**(): `number`

Defined in: [src/landscape/LandscapeLayer.ts:512](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L512)

Returns the numeric index (0: R, 1: G, 2: B, 3: A) of the currently configured weight channel.

##### Returns

`number`

Channel index (`0 to 3`)

***

### weightMapCPUSampler

#### Get Signature

> **get** **weightMapCPUSampler**(): [`LandscapeWeightMapCPUSampler`](../namespaces/Core/namespaces/Cache/classes/LandscapeWeightMapCPUSampler.md)

Defined in: [src/landscape/LandscapeLayer.ts:649](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L649)

Gets or sets the CPU-side weight map sampler for the layer.

##### Returns

[`LandscapeWeightMapCPUSampler`](../namespaces/Core/namespaces/Cache/classes/LandscapeWeightMapCPUSampler.md)

`LandscapeWeightMapCPUSampler` instance or `undefined`

#### Set Signature

> **set** **weightMapCPUSampler**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:653](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L653)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | [`LandscapeWeightMapCPUSampler`](../namespaces/Core/namespaces/Cache/classes/LandscapeWeightMapCPUSampler.md) |

##### Returns

`void`

***

### weightTexture

#### Get Signature

> **get** **weightTexture**(): [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:404](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L404)

Gets or sets the splatting weight texture of the layer. (Supports a single shared RGBA weight map across the terrain)

##### Returns

[`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

`BitmapTexture` instance or `undefined`

#### Set Signature

> **set** **weightTexture**(`val`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:376](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L376)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) |

##### Returns

`void`

## Methods

### getWeightAtUV()

> **getWeightAtUV**(`u`, `v`): `number`

Defined in: [src/landscape/LandscapeLayer.ts:718](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L718)

Returns the splatting weight of this layer at the specified normalized terrain UV coordinates (`0.0 to 1.0`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `u` | `number` | Normalized U coordinate (`0.0 to 1.0`) |
| `v` | `number` | Normalized V coordinate (`0.0 to 1.0`) |

#### Returns

`number`

Sampled weight value (`0.0 to 1.0`)

***

### resolvePendingTextures()

> **resolvePendingTextures**(`context`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:684](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L684)

Instantiates pending string URL texture paths into `BitmapTexture` instances using the provided `RedGPUContext`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance to use for texture creation |

#### Returns

`void`

***

### writeUniformData()

> **writeUniformData**(`targetBuffer`, `offset`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:736](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L736)

Writes the current layer's property data into the target `Float32Array` uniform buffer at the specified offset.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetBuffer` | `Float32Array` | Target `Float32Array` buffer to write into |
| `offset` | `number` | Array element index offset to start writing at |

#### Returns

`void`

***

### writeZeroUniformData()

> `static` **writeZeroUniformData**(`targetBuffer`, `offset`): `void`

Defined in: [src/landscape/LandscapeLayer.ts:672](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L672)

Fills a single layer uniform region (16 floats) with zeros starting at the specified offset in the target `Float32Array` buffer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetBuffer` | `Float32Array` | Target `Float32Array` buffer to write into |
| `offset` | `number` | Array element index offset to start writing at |

#### Returns

`void`
