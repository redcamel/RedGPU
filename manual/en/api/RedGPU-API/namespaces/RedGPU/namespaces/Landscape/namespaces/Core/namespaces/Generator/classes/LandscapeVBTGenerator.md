[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Generator](../README.md) / LandscapeVBTGenerator

# Class: LandscapeVBTGenerator

Defined in: [src/landscape/core/generator/LandscapeVBTGenerator.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVBTGenerator.ts#L22)

Class that composites multiple terrain material layers to generate Virtual Blend Texture (VBT: BaseColor, Normal, ORM) atlases and mipmap chains.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- `ALandscapeAtlasGenerator`

## Constructors



***

### Constructor

> **new LandscapeVBTGenerator**(`redGPUContext`): `LandscapeVBTGenerator`

Defined in: [src/landscape/core/generator/LandscapeVBTGenerator.ts:46](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVBTGenerator.ts#L46)

Initializes a `LandscapeVBTGenerator` instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |

#### Returns

`LandscapeVBTGenerator`

#### Overrides

`ALandscapeAtlasGenerator.constructor`

## Accessors



## Methods



***

### bakeAtlas()

> **bakeAtlas**(`vntAtlas`, `vbtBaseColorArray`, `vbtNormalArray`, `vbtORMArray`, `material`, `singleTilePixels?`): `void`

Defined in: [src/landscape/core/generator/LandscapeVBTGenerator.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVBTGenerator.ts#L75)

Bakes the full VBT atlases (BaseColor, Normal, ORM) and mipmaps based on the VNT atlas and layer data of `LandscapeMaterial`.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `vntAtlas` | [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md) | `undefined` | Virtual Normal Texture (VNT) atlas |
| `vbtBaseColorArray` | [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md) | `undefined` | VBT BaseColor atlas texture to store the baked result |
| `vbtNormalArray` | [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md) | `undefined` | VBT Normal atlas texture to store the baked result |
| `vbtORMArray` | [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md) | `undefined` | VBT ORM (Occlusion, Roughness, Metallic) atlas texture to store the baked result |
| `material` | [`LandscapeMaterial`](../../../../../classes/LandscapeMaterial.md) | `undefined` | `LandscapeMaterial` instance containing layer information to composite |
| `singleTilePixels?` | `number` | `256` | Pixel resolution per single tile (default: `256`) |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/generator/LandscapeVBTGenerator.ts:162](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/LandscapeVBTGenerator.ts#L162)

Releases all GPU buffers and caches used for VBT baking and tile mipmap generation.

#### Returns

`void`

#### Overrides

`ALandscapeAtlasGenerator.destroy`

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

`ALandscapeAtlasGenerator.antialiasingManager`

***

***

### bindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L66)

Returns the bind group layout of the atlas baking compute pipeline.

##### Returns

`GPUBindGroupLayout`

Bind group layout or `null`

#### Inherited from

`ALandscapeAtlasGenerator.bindGroupLayout`

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

`ALandscapeAtlasGenerator.commandEncoderManager`

***

***

### computePipeline

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **computePipeline**(): `GPUComputePipeline`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L54)

Returns the base compute pipeline used for atlas baking.

##### Returns

`GPUComputePipeline`

Compute pipeline or `null`

#### Inherited from

`ALandscapeAtlasGenerator.computePipeline`

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

`ALandscapeAtlasGenerator.gpuDevice`

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

`ALandscapeAtlasGenerator.instanceId`

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

`ALandscapeAtlasGenerator.name`

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

`ALandscapeAtlasGenerator.redGPUContext`

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

`ALandscapeAtlasGenerator.resourceManager`

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

`ALandscapeAtlasGenerator.uuid`

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### acquireUniformBuffer()

> **acquireUniformBuffer**(`byteLength`): `GPUBuffer`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:81](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L81)

Acquires and returns an available uniform buffer with at least the specified byte length from the pool for the current frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `byteLength` | `number` | Minimum required uniform buffer size in bytes |

#### Returns

`GPUBuffer`

Allocated `GPUBuffer` instance

#### Inherited from

`ALandscapeAtlasGenerator.acquireUniformBuffer`

***

***

### dispatchBakePass()

> **dispatchBakePass**(`bindGroup`, `pixelW`, `pixelH`, `pixelX`, `pixelZ`): `void`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:136](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L136)

Dispatches an atlas baking compute pass with the specified bind group and pixel region dimensions.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bindGroup` | `GPUBindGroup` | `GPUBindGroup` instance to bind |
| `pixelW` | `number` | Width of the baking region in pixels |
| `pixelH` | `number` | Height of the baking region in pixels |
| `pixelX` | `number` | Starting X pixel offset of the baking region |
| `pixelZ` | `number` | Starting Z(Y) pixel offset of the baking region |

#### Returns

`void`

#### Inherited from

`ALandscapeAtlasGenerator.dispatchBakePass`

***

***

### initBaseComputePipeline()

> **initBaseComputePipeline**(`shaderModuleKey`, `shaderCode`, `layoutEntries`, `defaultUniformByteLength?`): `void`

Defined in: [src/landscape/core/generator/ALandscapeAtlasGenerator.ts:178](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/generator/ALandscapeAtlasGenerator.ts#L178)

Initializes the base compute pipeline and uniform buffer pool based on the shader module and bind group layout entries.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shaderModuleKey` | `string` | `undefined` | Shader module cache key to register in the resource manager |
| `shaderCode` | `string` | `undefined` | WGSL compute shader source code |
| `layoutEntries` | `GPUBindGroupLayoutEntry`[] | `undefined` | Array of bind group layout entries (`Array<GPUBindGroupLayoutEntry>`) |
| `defaultUniformByteLength?` | `number` | `16` | Default byte length for initial uniform buffer slots (default: `16`) |

#### Returns

`void`

#### Inherited from

`ALandscapeAtlasGenerator.initBaseComputePipeline`

</details>
