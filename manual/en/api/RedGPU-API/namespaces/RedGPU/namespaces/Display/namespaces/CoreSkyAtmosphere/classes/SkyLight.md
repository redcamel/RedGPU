[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyAtmosphere](../README.md) / SkyLight

# Class: SkyLight

Defined in: [src/display/skyAtmosphere/core/skyLight/SkyLight.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/skyLight/SkyLight.ts#L21)

Class that generates diffuse (Irradiance) and specular (Reflection) cubemaps for real-time indirect lighting (IBL) based on SkyAtmosphere's atmospheric scattering data.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new SkyLight**(`redGPUContext`, `sharedUniformBuffer`, `sampler`): `SkyLight`

Defined in: [src/display/skyAtmosphere/core/skyLight/SkyLight.ts:39](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/skyLight/SkyLight.ts#L39)

Creates a SkyLight instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `sharedUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | Shared uniform buffer for atmospheric parameters |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler for atmospheric scattering sampling |

#### Returns

`SkyLight`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### irradianceLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **irradianceLUT**(): [`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/core/skyLight/SkyLight.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/skyLight/SkyLight.ts#L53)

Returns the Irradiance cube texture for indirect diffuse lighting.

##### Returns

[`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md)

Irradiance cube texture

***

***

### reflectionLUT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **reflectionLUT**(): [`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/core/skyLight/SkyLight.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/skyLight/SkyLight.ts#L65)

Returns the Reflection cube texture for indirect specular lighting.

##### Returns

[`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md)

Reflection cube texture

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyAtmosphere/core/skyLight/SkyLight.ts:87](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/skyLight/SkyLight.ts#L87)

Releases the SkyLight instance and internal IBL generator resources.

#### Returns

`void`

***

***

### update()

> **update**(`skyAtmosphere`): `void`

Defined in: [src/display/skyAtmosphere/core/skyLight/SkyLight.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/skyLight/SkyLight.ts#L77)

Bakes diffuse and specular IBL cubemaps based on SkyAtmosphere's LUT data.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `skyAtmosphere` | [`SkyAtmosphere`](../../../classes/SkyAtmosphere.md) | Source SkyAtmosphere instance |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
