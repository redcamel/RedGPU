[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [BaseObject](../README.md) / RedGPUObject

# Abstract Class: RedGPUObject

Defined in: [src/base/RedGPUObject.ts:15](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L15)

GPU 컨텍스트를 사용하는 모든 엔진 객체의 기반 클래스입니다.

RedGPUContext 및 관련 매니저들(ResourceManager, AntialiasingManager 등)에 대한 공통 접근 경로를 제공합니다.

## Extends

- [`BaseObject`](BaseObject.md)

## Extended by

- [`GLTFLoader`](../../../classes/GLTFLoader.md)
- [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)
- [`SkyBox`](../../Display/classes/SkyBox.md)
- [`SkyAtmosphere`](../../Display/classes/SkyAtmosphere.md)
- [`PackedTexture`](../../Resource/classes/PackedTexture.md)
- [`DownSampleCubeMapGenerator`](../../Resource/classes/DownSampleCubeMapGenerator.md)
- [`MipmapGenerator`](../../Resource/classes/MipmapGenerator.md)
- [`IBL`](../../Resource/classes/IBL.md)
- [`PickingManager`](../../Picking/classes/PickingManager.md)
- [`AController`](../../Camera/namespaces/Core/classes/AController.md)
- [`AutoExposure`](../../Camera/namespaces/Core/classes/AutoExposure.md)
- [`RedGPUContextSizeManager`](../../Context/namespaces/Core/classes/RedGPUContextSizeManager.md)
- [`RedGPUContextObserver`](../../Context/namespaces/Core/classes/RedGPUContextObserver.md)
- [`SkyAtmosphereBackground`](../../Display/namespaces/CoreSkyAtmosphere/classes/SkyAtmosphereBackground.md)
- [`SkyLight`](../../Display/namespaces/CoreSkyAtmosphere/classes/SkyLight.md)
- [`ASkyAtmosphereLUTGenerator`](../../Display/namespaces/CoreSkyAtmosphere/classes/ASkyAtmosphereLUTGenerator.md)
- [`ViewTransform`](../../Display/namespaces/CoreView/classes/ViewTransform.md)
- [`ViewRenderTextureManager`](../../Display/namespaces/CoreView/classes/ViewRenderTextureManager.md)
- [`ResourceBase`](../../Resource/namespaces/Core/classes/ResourceBase.md)
- [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)
- [`BRDFGenerator`](../../Resource/namespaces/CoreIBL/classes/BRDFGenerator.md)
- [`IrradianceGenerator`](../../Resource/namespaces/CoreIBL/classes/IrradianceGenerator.md)
- [`PrefilterGenerator`](../../Resource/namespaces/CoreIBL/classes/PrefilterGenerator.md)
- [`EquirectangularToCubeGenerator`](../../Resource/namespaces/CoreIBL/classes/EquirectangularToCubeGenerator.md)
- [`ASinglePassPostEffect`](../../PostEffect/namespaces/Core/classes/ASinglePassPostEffect.md)
- [`PostEffectTexturePool`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md)

## Constructors

### Constructor

> `protected` **new RedGPUObject**(`redGPUContext`): `RedGPUObject`

Defined in: [src/base/RedGPUObject.ts:26](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L26)

RedGPUObject 생성자입니다. (추상 클래스로 직접 인스턴스 생성은 불가합니다)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | 사용할 RedGPUContext 인스턴스

#### Returns

`RedGPUObject`

#### Overrides

[`BaseObject`](BaseObject.md).[`constructor`](BaseObject.md#constructor)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

***


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`BaseObject`](BaseObject.md).[`name`](BaseObject.md#name)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`BaseObject`](BaseObject.md).[`uuid`](BaseObject.md#uuid)


</details>
