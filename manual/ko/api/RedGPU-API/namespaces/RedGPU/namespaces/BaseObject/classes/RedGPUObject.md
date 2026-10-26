[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [BaseObject](../README.md) / RedGPUObject

# Abstract Class: RedGPUObject

Defined in: [src/base/RedGPUObject.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L19)

`RedGPUContext`를 기반으로 동작하는 모든 엔진 객체의 추상 베이스 클래스로, 디바이스 및 주요 매니저에 대한 공통 접근자를 제공합니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
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

새로운 RedGPUObject 인스턴스를 초기화하고 `RedGPUContext`의 유효성을 검증합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | 바인딩할 `RedGPUContext` 인스턴스 |

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

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`BaseObject`](BaseObject.md).[`instanceId`](BaseObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

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

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`BaseObject`](BaseObject.md).[`uuid`](BaseObject.md#uuid)

</details>
