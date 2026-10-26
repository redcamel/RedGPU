[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / IBL

# Class: IBL

Defined in: [src/resources/texture/ibl/IBL.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L25)

Class that provides IBL (Image-Based Lighting) by generating environment, irradiance, and prefilter cube maps from an environment map source.

HDR sources are converted to a cube map internally, and all maps are regenerated asynchronously when the source changes.

***

### Example
```typescript
const ibl = new RedGPU.Resource.IBL(redGPUContext, '/assets/hdr/environment.hdr');
view.ibl = ibl;
```

## See

- [SkyBox IBL example](https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/skyboxWithIbl/)
 - [IBL test example](https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/iblTest/)
 - [IBL texture size example](https://redcamel.github.io/RedGPU/examples/3d/skybox/ibl/iblTextureSize/)

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new IBL**(`redGPUContext`, `srcInfo`, `luminance?`, `environmentSize?`, `prefilterSize?`, `irradianceSize?`): `IBL`

Defined in: [src/resources/texture/ibl/IBL.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L75)

Creates an IBL instance and starts loading the environment map source.

#### Example
```typescript
// Using an HDR file
const ibl = new RedGPU.Resource.IBL(redGPUContext, '/assets/hdr/environment.hdr');

// Using 6 face images (px, nx, py, ny, pz, nz)
const iblCube = new RedGPU.Resource.IBL(redGPUContext, [
    'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'
]);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `srcInfo` | `string` \| \[`string`, `string`, `string`, `string`, `string`, `string`\] | `undefined` | Environment map source (HDR URL string or array of 6 image URLs) |
| `luminance?` | `number` | `25000` | Physical luminance (unit: cd/m², default: 25000) |
| `environmentSize?` | `number` | `1024` | Face size of the environment cube map (pixels, default: 1024) |
| `prefilterSize?` | `number` | `512` | Face size of the prefilter cube map (pixels, default: 512) |
| `irradianceSize?` | `number` | `64` | Face size of the irradiance cube map (pixels, default: 64) |

#### Returns

`IBL`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### environmentSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **environmentSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:114](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L114)

Returns the face size of the environment cube map in pixels.

##### Returns

`number`

Environment map size

***

***

### environmentTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **environmentTexture**(): [`DirectCubeTexture`](DirectCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:162](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L162)

Returns the environment cube texture converted from the source environment map.

##### Returns

[`DirectCubeTexture`](DirectCubeTexture.md)

Environment cube texture

***

***

### intensityMultiplier

#### Get Signature

> **get** **intensityMultiplier**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:186](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L186)

Gets or sets the IBL intensity multiplier for artist control. (default: 1.0)

##### Returns

`number`

Intensity multiplier

#### Set Signature

> **set** **intensityMultiplier**(`value`): `void`

Defined in: [src/resources/texture/ibl/IBL.ts:190](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L190)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### irradianceSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **irradianceSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L138)

Returns the face size of the irradiance cube map in pixels.

##### Returns

`number`

Irradiance map size

***

***

### irradianceTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **irradianceTexture**(): [`DirectCubeTexture`](DirectCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L150)

Returns the irradiance cube texture used for diffuse lighting.

##### Returns

[`DirectCubeTexture`](DirectCubeTexture.md)

Irradiance cube texture

***

***

### luminance

#### Get Signature

> **get** **luminance**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:202](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L202)

Gets or sets the physical luminance of the environment light. (unit: cd/m²)

##### Returns

`number`

Physical luminance

#### Set Signature

> **set** **luminance**(`value`): `void`

Defined in: [src/resources/texture/ibl/IBL.ts:206](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L206)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### prefilterSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prefilterSize**(): `number`

Defined in: [src/resources/texture/ibl/IBL.ts:126](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L126)

Returns the face size of the prefilter cube map in pixels.

##### Returns

`number`

Prefilter map size

***

***

### prefilterTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prefilterTexture**(): [`DirectCubeTexture`](DirectCubeTexture.md)

Defined in: [src/resources/texture/ibl/IBL.ts:174](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/texture/ibl/IBL.ts#L174)

Returns the roughness-based prefilter cube texture used for specular lighting.

##### Returns

[`DirectCubeTexture`](DirectCubeTexture.md)

Prefilter cube texture

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
