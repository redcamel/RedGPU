[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyAtmosphere](../README.md) / ASkyAtmosphereLUTGenerator

# Abstract Class: ASkyAtmosphereLUTGenerator

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:15](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L15)

ASkyAtmosphereLUTGenerator는 대기 산란용 LUT(Look Up Table) 생성을 위한 추상 베이스 클래스입니다.

컴퓨트 셰이더를 사용하여 물리 연산 결과를 텍스처에 베이킹하는 공통 로직을 제공합니다.

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`TransmittanceGenerator`](TransmittanceGenerator.md)
- [`SkyViewGenerator`](SkyViewGenerator.md)
- [`MultiScatteringGenerator`](MultiScatteringGenerator.md)
- [`AerialPerspectiveGenerator`](AerialPerspectiveGenerator.md)

## Constructors

### Constructor

> `protected` **new ASkyAtmosphereLUTGenerator**(`redGPUContext`, `sharedUniformBuffer`, `sampler`, `label`, `width`, `height`, `depth?`): `ASkyAtmosphereLUTGenerator`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:23](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L23)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` |
| `sharedUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | `undefined` |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | `undefined` |
| `label` | `string` | `undefined` |
| `width` | `number` | `undefined` |
| `height` | `number` | `undefined` |
| `depth` | `number` | `1` |

#### Returns

`ASkyAtmosphereLUTGenerator`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### depth

#### Get Signature

> **get** **depth**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:60](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L60)

##### Returns

`number`

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:56](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L56)

##### Returns

`number`

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:48](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L48)

##### Returns

`string`

***

### lutTexture

#### Get Signature

> **get** `abstract` **lutTexture**(): [`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md) \| [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:64](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L64)

##### Returns

[`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md) \| [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

***

### sampler

#### Get Signature

> **get** **sampler**(): [`Sampler`](../../../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:44](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L44)

##### Returns

[`Sampler`](../../../../Resource/classes/Sampler.md)

***

### sharedUniformBuffer

#### Get Signature

> **get** **sharedUniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:40](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L40)

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

***

### width

#### Get Signature

> **get** **width**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:52](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L52)

##### Returns

`number`

## Methods

### createBindGroup()

> `protected` **createBindGroup**(`label`, `pipeline`, `entries`): `GPUBindGroup`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:107](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L107)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `label` | `string` |
| `pipeline` | `GPUComputePipeline` |
| `entries` | `GPUBindGroupEntry`[] |

#### Returns

`GPUBindGroup`

***

### createComputePipeline()

> `protected` **createComputePipeline**(`label`, `shaderCode`): `GPUComputePipeline`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:95](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L95)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `label` | `string` |
| `shaderCode` | `string` |

#### Returns

`GPUComputePipeline`

***

### createLUTTexture()

> **createLUTTexture**(`is3D?`, `format?`): `GPUTexture`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:84](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L84)

#### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `is3D` | `boolean` | `false` |
| `format` | `GPUTextureFormat` | `'rgba16float'` |

#### Returns

`GPUTexture`

***

### executeComputePass()

> **executeComputePass**(`pipeline`, `bindGroup`, `workgroupSize?`): `void`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:66](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L66)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `pipeline` | `GPUComputePipeline` |
| `bindGroup` | `GPUBindGroup` |
| `workgroupSize` | \[`number`, `number`, `number`\] |

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L71)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
