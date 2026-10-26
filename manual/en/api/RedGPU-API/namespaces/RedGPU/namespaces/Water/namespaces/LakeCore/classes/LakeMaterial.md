[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Water](../../../README.md) / [LakeCore](../README.md) / LakeMaterial

# Class: LakeMaterial

Defined in: [src/water/lakeCore/LakeMaterial.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L19)

Material class representing lake water refraction, depth extinction, underwater caustics, and screen-space reflection (SSR).

Automatically created internally when a `Lake` instance is constructed.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Correct access method
const lake = new RedGPU.Water.Lake(redGPUContext);
const material = lake.material;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/water/lake/lakeMaterial/" style="width:100%; height:500px;"></iframe>

## See

- [Basic lake example](https://redcamel.github.io/RedGPU/examples/3d/water/lake/basicLake/)
 - [Lake material example](https://redcamel.github.io/RedGPU/examples/3d/water/lake/lakeMaterial/)

## Extends

- [`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md)

## Constructors



***

### Constructor

> **new LakeMaterial**(`redGPUContext`, `baseColor?`, `deepColor?`, `opacity?`): `LakeMaterial`

Defined in: [src/water/lakeCore/LakeMaterial.ts:226](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L226)

Creates a `LakeMaterial` instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` instance |
| `baseColor?` | `string` | `'#18d8b6'` | Shallow water color HEX string (default: `'#18d8b6'`) |
| `deepColor?` | `string` | `'#065279'` | Deep water color HEX string (default: `'#065279'`) |
| `opacity?` | `number` | `1.0` | Water surface opacity (range: `0` ~ `1`, default: `1.0`) |

#### Returns

`LakeMaterial`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`constructor`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#constructor)

## Properties



***

### baseColor

> **baseColor**: [`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L24)

Base color of shallow water. (Default: `'#18d8b6'`)

***

***

### causticsScale

> **causticsScale**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:134](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L134)

Underwater caustics pattern scale multiplier. (Range: `0.1` ~ `5`, default: `1.0`)

***

***

### causticsSpeed

> **causticsSpeed**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:139](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L139)

Underwater caustics animation speed. (Range: `0` ~ `5`, default: `1.0`)

***

***

### causticsStrength

> **causticsStrength**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:129](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L129)

Underwater caustics strength. (Range: `0` ~ `2`, default: `1.0`)

***

***

### debugMaxDepth

> **debugMaxDepth**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L114)

Reference maximum depth for depth debug visualization. (Default: `5.0`)

***

***

### debugMode

> **debugMode**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L109)

Debug visualization mode. (Default: `0`)

***

***

### deepColor

> **deepColor**: [`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L29)

Color at deep water depth. (Default: `'#065279'`)

***

***

### depthFadeDistance

> **depthFadeDistance**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:94](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L94)

Depth distance over which the shoreline fades out. (Default: `0.8`)

***

***

### enableSSR

> **enableSSR**: `boolean`

Defined in: [src/water/lakeCore/LakeMaterial.ts:144](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L144)

Whether screen-space reflection (SSR) is enabled. (Default: `true`)

***

***

### extinctionFactor

> **extinctionFactor**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L84)

Light extinction factor over depth. (Default: `0.22`)

***

***

### flowRateScale

> **flowRateScale**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L74)

Flow speed multiplier of the normal textures. (Default: `0.025`)

***

***

### invertNormalDetailY

> **invertNormalDetailY**: `boolean`

Defined in: [src/water/lakeCore/LakeMaterial.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L124)

Whether to invert the Y channel of the detail normal texture. (Default: `false`)

***

***

### invertNormalY

> **invertNormalY**: `boolean`

Defined in: [src/water/lakeCore/LakeMaterial.ts:119](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L119)

Whether to invert the Y channel of the primary normal texture. (Default: `false`)

***

***

### normalDetailScale

> **normalDetailScale**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L59)

Strength of the detail normal texture. (Range: `0` ~ `1`, default: `0.5`)

***

***

### normalDetailTexture

> **normalDetailTexture**: [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L44)

Detail normal texture representing fine ripples.

***

***

### normalDetailTiling

> **normalDetailTiling**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L69)

Tiling repeat count of the detail normal texture per `100m` world scale. (Default: `40.0`)

***

***

### normalScale

> **normalScale**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L54)

Strength of the primary normal texture. (Range: `0` ~ `1`, default: `1.0`)

***

***

### normalTexture

> **normalTexture**: [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:34](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L34)

Primary normal texture representing surface undulation.

***

***

### normalTextureSampler

> **normalTextureSampler**: [`Sampler`](../../../../Resource/classes/Sampler.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:39](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L39)

Sampler for normal textures.

***

***

### normalTiling

> **normalTiling**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L64)

Tiling repeat count of the primary normal texture per `100m` world scale. (Default: `20.0`)

***

***

### refractionStrength

> **refractionStrength**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L79)

Refraction distortion strength of the underwater background. (Range: `0` ~ `1`, default: `1.0`)

***

***

### rippleDomainCenter

> **rippleDomainCenter**: \[`number`, `number`\]

Defined in: [src/water/lakeCore/LakeMaterial.ts:169](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L169)

World XZ center coordinates of the interaction ripple domain. (Default: `[0.0, 0.0]`)

***

***

### rippleDomainSize

> **rippleDomainSize**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:174](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L174)

Side length of the interaction ripple domain in world units. (Min: `1.0`, default: `20.0`)

***

***

### rippleNormalStrength

> **rippleNormalStrength**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:179](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L179)

Strength of interaction ripples applied to the surface normal. (Min: `0.0`, default: `1.0`)

***

***

### rippleTexture

> **rippleTexture**: `GPUTexture` \| [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md) \| [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L49)

Ripple normal texture storing the interaction wave simulation result.

***

***

### roughness

> **roughness**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:99](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L99)

Surface roughness. (Range: `0` ~ `1`, default: `0.07`)

***

***

### specularFactor

> **specularFactor**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L104)

Specular reflection strength. (Range: `0` ~ `2`, default: `1.0`)

***

***

### ssrMaxDistance

> **ssrMaxDistance**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:149](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L149)

Maximum SSR ray marching distance. (Range: `2` ~ `300`, default: `100.0`)

***

***

### ssrStepCount

> **ssrStepCount**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:154](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L154)

Number of SSR ray marching steps. (Default: `64`)

***

***

### ssrThickness

> **ssrThickness**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:159](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L159)

Depth thickness for SSR hit testing. (Range: `0.05` ~ `5`, default: `1.0`)

***

***

### turbidity

> **turbidity**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:164](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L164)

Water turbidity. (Range: `0` ~ `1`, default: `0.35`)

***

## Accessors



## Methods



***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABitmapBaseMaterial.ts#L24)

List of texture packing callback functions executed when updating fragment state

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`__packingList`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#__packinglist)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L74)

Flag indicating whether the pipeline needs updating

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`dirtyPipeline`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#dirtypipeline)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../../../../Material/namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L69)

Fragment GPU render pipeline information object

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuRenderInfo`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#gpurenderinfo)

***

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L42)

Flag indicating whether it is a material instance

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`isInstanceofMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#isinstanceofmaterial)

***

***

### opacity

> **opacity**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/LakeMaterial.ts#L89)

Water surface opacity. (Range: `0` ~ `1`, default: `1.0`)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`opacity`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#opacity)

***

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L32)

Tint color of the material (ColorRGBA)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`tint`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#tint)

***

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L79)

Whether transparent rendering is enabled for the material

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`transparent`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#transparent)

***

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L64)

Whether to use 2-pass rendering

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`use2PathRender`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#use2pathrender)

***

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L37)

Whether to apply tint color

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`useTint`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#usetint)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`antialiasingManager`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#antialiasingmanager)

***

***

### blendAlphaState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:277](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L277)

Returns the alpha blend state object.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

Alpha BlendState instance

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendAlphaState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#blendalphastate)

***

***

### blendColorState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendColorState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L265)

Returns the color blend state object.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

Color BlendState instance

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendColorState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#blendcolorstate)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L61)

Gets or sets the cache key.

##### Returns

`string`

Cache key string

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`cacheKey`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`commandEncoderManager`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#commandencodermanager)

***

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L217)

Returns the fragment bind group descriptor name.

##### Returns

`string`

Bind group descriptor name

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_bind_group_descriptor_name)

***

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L205)

Returns the fragment shader module name.

##### Returns

`string`

Fragment shader module name

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_shader_module_name)

***

***

### globalFragmentSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:305](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L305)

Returns the allocated slot index within the global fragment SSBO.

##### Returns

`number`

Allocated slot index (`-1` if unallocated)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`globalFragmentSlotIndex`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#globalfragmentslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L89)

Returns the associated GPUDevice.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuDevice`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`instanceId`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#instanceid)

***

***

### MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:193](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L193)

Returns the material module name.

##### Returns

`string`

Module name

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`MODULE_NAME`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#module_name)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`name`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`redGPUContext`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`resourceManager`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L77)

Returns the resource manager key.

##### Returns

`string`

Resource manager key string

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`resourceManagerKey`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L49)

Returns the revision (update count) of the resource.

##### Returns

`number`

Resource revision number

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`revision`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#revision)

***

***

### SHADER\_INFO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L241)

Returns the complete parsed WGSL shader information.

##### Returns

`any`

Parsed shader information object

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`SHADER_INFO`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#shader_info)

***

***

### STORAGE\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:229](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L229)

Returns the parsed shader storage structure information.

##### Returns

`any`

Storage structure information

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`STORAGE_STRUCT`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#storage_struct)

***

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L160)

Returns the key name of the currently set tint blend mode or sets a new mode.

##### Throws

Throws an Error if an invalid tint blend mode value or key is specified

##### Returns

`string`

Tint blend mode key string (e.g., `'MULTIPLY'`)

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:168](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L168)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"COLOR"` \| `"NORMAL"` \| `"SUBTRACT"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../../../Material/type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`tintBlendMode`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#tintblendmode)

***

***

### UNIFORM\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L253)

Returns the parsed shader uniform structure information.

##### Returns

`any`

Uniform structure information

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`UNIFORM_STRUCT`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#uniform_struct)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`uuid`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#uuid)

***

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L289)

Returns or sets the color write mask (GPUColorWrite) state.

##### Returns

`number`

GPUFlagsConstant value

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:293](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`writeMaskState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#writemaskstate)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L102)

Adds a pipeline dirty listener to be called when the resource changes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to register |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`__addDirtyPipelineListener`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L115)

Removes a registered pipeline dirty listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to remove |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`__removeDirtyPipelineListener`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#__removedirtypipelinelistener)

***

***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:461](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L461)

Synchronizes basic material properties (uniforms, colors, tint, etc.) to the uniform buffer and global SSBO.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateBaseProperty`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#_updatebaseproperty)

***

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:357](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L357)

Checks shader variants and updates the fragment bind group and render state.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateFragmentState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#_updatefragmentstate)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:510](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L510)

Destroys the material instance and releases allocated uniform buffers and global fragment slots.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`destroy`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#destroy)

***

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:430](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L430)

Creates and returns a GPU fragment render state (GPUFragmentState) object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint?` | `string` | `'main'` | Fragment shader entry point function name (default: `'main'`) |

#### Returns

`GPUFragmentState`

Configured GPUFragmentState object

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`getFragmentRenderState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#getfragmentrenderstate)

***

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:502](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L502)

Returns the GPUSampler from a Sampler instance, or the default GPUSampler if not provided.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler instance |

#### Returns

`GPUSampler`

GPUSampler instance

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`getGPUResourceSampler`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#getgpuresourcesampler)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:313](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L313)

Initializes GPU fragment render pipeline information and uniform buffers.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`initGPURenderInfos`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#initgpurenderinfos)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L131)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Whether to reset the listener list after notification (default: false) |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`notifyUpdate`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#notifyupdate)

***

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABitmapBaseMaterial.ts#L80)

Updates pipeline dirty listeners upon sampler change and refreshes the fragment state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Previously bound Sampler instance |
| `newSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | New Sampler instance to bind |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateSampler`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#updatesampler)

***

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABitmapBaseMaterial.ts#L63)

Updates pipeline dirty listeners upon texture change and refreshes the fragment state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | `any` | Previously bound texture object |
| `texture` | `any` | New texture object to bind |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateTexture`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#updatetexture)

</details>
