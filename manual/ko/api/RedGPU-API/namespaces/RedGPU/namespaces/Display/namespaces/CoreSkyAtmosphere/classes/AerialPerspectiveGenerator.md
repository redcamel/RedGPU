[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyAtmosphere](../README.md) / AerialPerspectiveGenerator

# Class: AerialPerspectiveGenerator

Defined in: [src/display/skyAtmosphere/core/generator/aerialPerspective/AerialPerspectiveGenerator.ts:23](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/aerialPerspective/AerialPerspectiveGenerator.ts#L23)

AerialPerspectiveGenerator는 에리얼 퍼스펙티브(Aerial Perspective) LUT를 생성합니다.

카메라와 물체 사이의 거리에 따른 대기 산란 및 투과율 감쇠를 3D LUT에 저장합니다. 이를 통해 씬 내의 일반 오브젝트들에 거리 기반 안개 효과와 공기감을 실시간으로 적용할 수 있습니다.

## Extends

- [`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md)

## Constructors

### Constructor

> **new AerialPerspectiveGenerator**(`redGPUContext`, `sharedUniformBuffer`, `sampler`): `AerialPerspectiveGenerator`

Defined in: [src/display/skyAtmosphere/core/generator/aerialPerspective/AerialPerspectiveGenerator.ts:29](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/aerialPerspective/AerialPerspectiveGenerator.ts#L29)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) |
| `sharedUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) |

#### Returns

`AerialPerspectiveGenerator`

#### Overrides

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`constructor`](ASkyAtmosphereLUTGenerator.md#constructor)

## Properties

### lutTexture

#### Get Signature

> **get** **lutTexture**(): [`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md)

Defined in: [src/display/skyAtmosphere/core/generator/aerialPerspective/AerialPerspectiveGenerator.ts:34](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/aerialPerspective/AerialPerspectiveGenerator.ts#L34)

##### Returns

[`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md)

#### Overrides

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`lutTexture`](ASkyAtmosphereLUTGenerator.md#luttexture)

***

### render()

> **render**(`view`, `transmittance`, `multiScat`): `void`

Defined in: [src/display/skyAtmosphere/core/generator/aerialPerspective/AerialPerspectiveGenerator.ts:38](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/aerialPerspective/AerialPerspectiveGenerator.ts#L38)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) |
| `transmittance` | [`DirectTexture`](../../../../Resource/classes/DirectTexture.md) |
| `multiScat` | [`DirectTexture`](../../../../Resource/classes/DirectTexture.md) |

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`instanceId`](ASkyAtmosphereLUTGenerator.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`antialiasingManager`](ASkyAtmosphereLUTGenerator.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`commandEncoderManager`](ASkyAtmosphereLUTGenerator.md#commandencodermanager)

***

### depth

#### Get Signature

> **get** **depth**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:60](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L60)

##### Returns

`number`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`depth`](ASkyAtmosphereLUTGenerator.md#depth)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`gpuDevice`](ASkyAtmosphereLUTGenerator.md#gpudevice)

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:56](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L56)

##### Returns

`number`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`height`](ASkyAtmosphereLUTGenerator.md#height)

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:48](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L48)

##### Returns

`string`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`label`](ASkyAtmosphereLUTGenerator.md#label)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`name`](ASkyAtmosphereLUTGenerator.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`redGPUContext`](ASkyAtmosphereLUTGenerator.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`resourceManager`](ASkyAtmosphereLUTGenerator.md#resourcemanager)

***

### sampler

#### Get Signature

> **get** **sampler**(): [`Sampler`](../../../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:44](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L44)

##### Returns

[`Sampler`](../../../../Resource/classes/Sampler.md)

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`sampler`](ASkyAtmosphereLUTGenerator.md#sampler)

***

### sharedUniformBuffer

#### Get Signature

> **get** **sharedUniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L40)

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`sharedUniformBuffer`](ASkyAtmosphereLUTGenerator.md#shareduniformbuffer)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`uuid`](ASkyAtmosphereLUTGenerator.md#uuid)

***

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L52)

##### Returns

`number`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`width`](ASkyAtmosphereLUTGenerator.md#width)

## Methods

### createBindGroup()

> `protected` **createBindGroup**(`label`, `pipeline`, `entries`): `GPUBindGroup`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:107](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L107)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `label` | `string` |
| `pipeline` | `GPUComputePipeline` |
| `entries` | `GPUBindGroupEntry`[] |

#### Returns

`GPUBindGroup`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createBindGroup`](ASkyAtmosphereLUTGenerator.md#createbindgroup)

***

### createComputePipeline()

> `protected` **createComputePipeline**(`label`, `shaderCode`): `GPUComputePipeline`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:95](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L95)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `label` | `string` |
| `shaderCode` | `string` |

#### Returns

`GPUComputePipeline`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createComputePipeline`](ASkyAtmosphereLUTGenerator.md#createcomputepipeline)

***

### createLUTTexture()

> **createLUTTexture**(`is3D?`, `format?`): `GPUTexture`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:84](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L84)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `is3D` | `boolean` | `false` |
| `format` | `GPUTextureFormat` | `'rgba16float'` |

#### Returns

`GPUTexture`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createLUTTexture`](ASkyAtmosphereLUTGenerator.md#createluttexture)

***

### executeComputePass()

> **executeComputePass**(`pipeline`, `bindGroup`, `workgroupSize?`): `void`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L66)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pipeline` | `GPUComputePipeline` |
| `bindGroup` | `GPUBindGroup` |
| `workgroupSize` | \[`number`, `number`, `number`\] |

#### Returns

`void`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`executeComputePass`](ASkyAtmosphereLUTGenerator.md#executecomputepass)

***


</details>
