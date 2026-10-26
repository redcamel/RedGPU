[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / DownSampleCubeMapGenerator

# Class: DownSampleCubeMapGenerator

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L18)

Generator class responsible for cubemap downsampling and mipmap generation.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new DownSampleCubeMapGenerator**(`redGPUContext`): `DownSampleCubeMapGenerator`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L36)

Creates an instance of DownSampleCubeMapGenerator.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`DownSampleCubeMapGenerator`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



## Methods



***

### createBindGroup()

> **createBindGroup**(`bindGroupLayout`, `sourceView`, `targetView`, `uniformBuffer`): `GPUBindGroup`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L117)

Creates or retrieves from cache the bind group to be used for cubemap downsampling.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bindGroupLayout` | `GPUBindGroupLayout` | Bind group layout |
| `sourceView` | `GPUTextureView` | Source cubemap texture view |
| `targetView` | `GPUTextureView` | Target 2D array texture view |
| `uniformBuffer` | `GPUBuffer` | Mip level parameter uniform buffer |

#### Returns

`GPUBindGroup`

Created or cached bind group

***

***

### createSourceTextureView()

> **createSourceTextureView**(`sourceCubemap`, `sourceMipLevel`): `GPUTextureView`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L54)

Creates or retrieves from cache the source cubemap texture view for the specified mip level.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sourceCubemap` | `GPUTexture` | Source cubemap GPUTexture |
| `sourceMipLevel` | `number` | Source mip level index |

#### Returns

`GPUTextureView`

Cubemap texture view

***

***

### createTargetTextureView()

> **createTargetTextureView**(`targetCubemap`, `targetMipLevel`): `GPUTextureView`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L82)

Creates or retrieves from cache the target 2D array texture view for the specified mip level.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetCubemap` | `GPUTexture` | Target cubemap GPUTexture |
| `targetMipLevel` | `number` | Target mip level index |

#### Returns

`GPUTextureView`

2D array texture view

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:201](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L201)

Releases all caches and GPU resources.

#### Returns

`void`

***

***

### downsampleCubemap()

> **downsampleCubemap**(`sourceCubemap`, `targetSize?`, `format?`): `Promise`\<`GPUTexture`\>

Defined in: [src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts:158](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/texture/core/downSampleCubeMapGenerator/DownSampleCubeMapGenerator.ts#L158)

Performs cubemap downsampling.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sourceCubemap` | `GPUTexture` | `undefined` | Source cubemap texture |
| `targetSize?` | `number` | `256` | Target size (default: 256) |
| `format?` | `GPUTextureFormat` | `'rgba16float'` | Texture format (default: 'rgba16float') |

#### Returns

`Promise`\<`GPUTexture`\>

Downsampled cubemap GPUTexture

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

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

[`LakeWaveSimulator`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md).[`name`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
