[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [BaseObject](../README.md) / RedGPUObject

# Abstract Class: RedGPUObject

Defined in: [src/base/RedGPUObject.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L19)

Abstract base class for all engine objects operating on `RedGPUContext`, providing common getters for the GPU device and core managers.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`BaseObject`](BaseObject.md)

## Extended by

- [`GLTFLoader`](../../../classes/GLTFLoader.md)
- [`SimpleCharacterController`](../../Charactor/classes/SimpleCharacterController.md)
- [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)
- [`SkyBox`](../../Display/classes/SkyBox.md)
- [`SkyAtmosphere`](../../Display/classes/SkyAtmosphere.md)
- [`SpriteSheetInfo`](../../Display/classes/SpriteSheetInfo.md)
- [`GlobalStorageBufferManager`](../../Resource/classes/GlobalStorageBufferManager.md)
- [`PackedTexture`](../../Resource/classes/PackedTexture.md)
- [`DownSampleCubeMapGenerator`](../../Resource/classes/DownSampleCubeMapGenerator.md)
- [`MipmapGenerator`](../../Resource/classes/MipmapGenerator.md)
- [`IBL`](../../Resource/classes/IBL.md)
- [`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)
- [`PickingManager`](../../Picking/classes/PickingManager.md)
- [`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)
- [`Landscape`](../../Landscape/classes/Landscape.md)
- [`AController`](../../Camera/namespaces/Core/classes/AController.md)
- [`AutoExposure`](../../Camera/namespaces/Core/classes/AutoExposure.md)
- [`RedGPUContextDetector`](../../Context/namespaces/Core/classes/RedGPUContextDetector.md)
- [`RedGPUContextSizeManager`](../../Context/namespaces/Core/classes/RedGPUContextSizeManager.md)
- [`RedGPUContextObserver`](../../Context/namespaces/Core/classes/RedGPUContextObserver.md)
- [`DrawDebuggerMesh`](../../Display/namespaces/DrawDebugger/classes/DrawDebuggerMesh.md)
- [`ADrawDebuggerLight`](../../Display/namespaces/DrawDebugger/classes/ADrawDebuggerLight.md)
- [`SkyAtmosphereBackground`](../../Display/namespaces/CoreSkyAtmosphere/classes/SkyAtmosphereBackground.md)
- [`SkyLight`](../../Display/namespaces/CoreSkyAtmosphere/classes/SkyLight.md)
- [`ASkyAtmosphereLUTGenerator`](../../Display/namespaces/CoreSkyAtmosphere/classes/ASkyAtmosphereLUTGenerator.md)
- [`ViewTransform`](../../Display/namespaces/CoreView/classes/ViewTransform.md)
- [`ViewRenderTextureManager`](../../Display/namespaces/CoreView/classes/ViewRenderTextureManager.md)
- [`Primitive`](../../Primitive/namespaces/Core/classes/Primitive.md)
- [`ResourceBase`](../../Resource/namespaces/Core/classes/ResourceBase.md)
- [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)
- [`BRDFGenerator`](../../Resource/namespaces/CoreIBL/classes/BRDFGenerator.md)
- [`IrradianceGenerator`](../../Resource/namespaces/CoreIBL/classes/IrradianceGenerator.md)
- [`PrefilterGenerator`](../../Resource/namespaces/CoreIBL/classes/PrefilterGenerator.md)
- [`EquirectangularToCubeGenerator`](../../Resource/namespaces/CoreIBL/classes/EquirectangularToCubeGenerator.md)
- [`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md)
- [`PostEffectTexturePool`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md)
- [`PassClusterLightBound`](../../Light/namespaces/Core/namespaces/ClusterLight/classes/PassClusterLightBound.md)
- [`PassClustersLight`](../../Light/namespaces/Core/namespaces/ClusterLight/classes/PassClustersLight.md)
- [`ClusterLightManager`](../../Light/namespaces/Core/namespaces/ClusterLight/classes/ClusterLightManager.md)
- [`AScatterManager`](../../Landscape/namespaces/Core/namespaces/Scatter/classes/AScatterManager.md)
- [`AScatterCuller`](../../Landscape/namespaces/Core/namespaces/Scatter/classes/AScatterCuller.md)
- [`AScatterType`](../../Landscape/namespaces/Core/namespaces/Scatter/classes/AScatterType.md)
- [`AScatterSlotPooler`](../../Landscape/namespaces/Core/namespaces/Scatter/classes/AScatterSlotPooler.md)
- [`AScatterRenderer`](../../Landscape/namespaces/Core/namespaces/Scatter/classes/AScatterRenderer.md)
- [`AScatterMegaBuffer`](../../Landscape/namespaces/Core/namespaces/Scatter/classes/AScatterMegaBuffer.md)
- [`AScatterInstanceBaker`](../../Landscape/namespaces/Core/namespaces/Scatter/classes/AScatterInstanceBaker.md)
- [`LandscapeRenderer`](../../Landscape/namespaces/Core/namespaces/Renderer/classes/LandscapeRenderer.md)
- [`FoliagePipelineRegistry`](../../Landscape/namespaces/Foliage/namespaces/Core/classes/FoliagePipelineRegistry.md)
- [`LakeInteractionManager`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeInteractionManager.md)
- [`LakeCapturePass`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeCapturePass.md)
- [`LakeWaveSimulator`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md)

## Constructors



***

### Constructor

> **new RedGPUObject**(`redGPUContext`): `RedGPUObject`

Defined in: [src/base/RedGPUObject.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L30)

Initializes a new RedGPUObject instance and validates the provided `RedGPUContext`.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance to bind |

#### Returns

`RedGPUObject`

#### Overrides

[`BaseObject`](BaseObject.md).[`constructor`](BaseObject.md#constructor)

## Accessors



***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

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

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`BaseObject`](BaseObject.md).[`instanceId`](BaseObject.md#instanceid)

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

[`BaseObject`](BaseObject.md).[`name`](BaseObject.md#name)

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

[`BaseObject`](BaseObject.md).[`uuid`](BaseObject.md#uuid)

</details>
