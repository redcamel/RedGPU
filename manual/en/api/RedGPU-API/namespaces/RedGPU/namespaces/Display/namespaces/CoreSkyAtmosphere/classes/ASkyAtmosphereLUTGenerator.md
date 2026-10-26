[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyAtmosphere](../README.md) / ASkyAtmosphereLUTGenerator

# Abstract Class: ASkyAtmosphereLUTGenerator

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:19](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L19)

Abstract base class for atmospheric scattering LUT (Look-Up Table) generators that bake physically based atmospheric scattering calculations into textures using compute shaders.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`TransmittanceGenerator`](TransmittanceGenerator.md)
- [`SkyViewGenerator`](SkyViewGenerator.md)
- [`MultiScatteringGenerator`](MultiScatteringGenerator.md)
- [`AerialPerspectiveGenerator`](AerialPerspectiveGenerator.md)

## Constructors



***

### Constructor

> **new ASkyAtmosphereLUTGenerator**(`redGPUContext`, `sharedUniformBuffer`, `sampler`, `label`, `width`, `height`, `depth?`): `ASkyAtmosphereLUTGenerator`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L54)

Initializes an ASkyAtmosphereLUTGenerator instance.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext instance |
| `sharedUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | `undefined` | Shared uniform buffer for atmospheric parameters |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | `undefined` | Sampler for LUT sampling |
| `label` | `string` | `undefined` | Generator identification label |
| `width` | `number` | `undefined` | LUT texture width |
| `height` | `number` | `undefined` | LUT texture height |
| `depth?` | `number` | `1` | LUT texture depth or layer count (default: 1) |

#### Returns

`ASkyAtmosphereLUTGenerator`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### height

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **height**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L115)

Returns the height of the LUT texture.

##### Returns

`number`

Texture height

***

***

### lutTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `abstract` **lutTexture**(): [`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md) \| [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L127)

Returns the generated LUT texture object.

##### Returns

[`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md) \| [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

LUT texture object

***

***

### sampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sampler**(): [`Sampler`](../../../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:91](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L91)

Returns the sampler for LUT sampling.

##### Returns

[`Sampler`](../../../../Resource/classes/Sampler.md)

Sampler instance

***

***

### sharedUniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sharedUniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L79)

Returns the shared uniform buffer for atmospheric parameters.

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Shared uniform buffer

***

***

### width

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **width**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L103)

Returns the width of the LUT texture.

##### Returns

`number`

Texture width

## Methods



***

### createBindGroup()

> **createBindGroup**(`label`, `pipeline`, `entries`): `GPUBindGroup`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:254](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L254)

Creates a bind group based on the first layout of the compute pipeline.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `label` | `string` | Bind group label |
| `pipeline` | `GPUComputePipeline` | Reference compute pipeline |
| `entries` | `GPUBindGroupEntry`[] | Array of bind group entries |

#### Returns

`GPUBindGroup`

Created GPUBindGroup

***

***

### createComputePipeline()

> **createComputePipeline**(`label`, `shaderCode`): `GPUComputePipeline`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:225](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L225)

Creates a compute pipeline from WGSL shader code.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `label` | `string` | Pipeline label |
| `shaderCode` | `string` | WGSL shader source code |

#### Returns

`GPUComputePipeline`

Created GPUComputePipeline

***

***

### createLUTTexture()

> **createLUTTexture**(`is3D?`, `format?`): `GPUTexture`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:187](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L187)

Creates a GPU texture for storing the LUT.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `is3D?` | `boolean` | `false` | Whether to create a 3D texture (default: false) |
| `format?` | `GPUTextureFormat` | `'rgba16float'` | Texture format (default: `'rgba16float'`) |

#### Returns

`GPUTexture`

Created GPUTexture

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:202](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L202)

Releases the generator and internal LUT resources.

#### Returns

`void`

***

***

### executeComputePass()

> **executeComputePass**(`pipeline`, `bindGroup`, `workgroupSizeX?`, `workgroupSizeY?`, `workgroupSizeZ?`, `notifyUpdate?`): `void`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:152](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L152)

Executes a compute pass to update the LUT data.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `pipeline` | `GPUComputePipeline` | `undefined` | Compute pipeline to execute |
| `bindGroup` | `GPUBindGroup` | `undefined` | Resource bind group to bind |
| `workgroupSizeX?` | `number` | `8` | X-axis workgroup size (default: 8) |
| `workgroupSizeY?` | `number` | `8` | Y-axis workgroup size (default: 8) |
| `workgroupSizeZ?` | `number` | `1` | Z-axis workgroup size (default: 1) |
| `notifyUpdate?` | `boolean` | `true` | Whether to automatically call `lutTexture.notifyUpdate()` after pass execution (default: true) |

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

***

</details>
