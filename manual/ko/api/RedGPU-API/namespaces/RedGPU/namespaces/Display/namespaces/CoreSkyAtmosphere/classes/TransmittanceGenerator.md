[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyAtmosphere](../README.md) / TransmittanceGenerator

# Class: TransmittanceGenerator

Defined in: [src/display/skyAtmosphere/core/generator/transmittance/TransmittanceGenerator.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/transmittance/TransmittanceGenerator.ts#L20)

대기의 고도와 시야각에 따른 빛의 감쇠율을 저장하는 대기 투과율(Transmittance) 2D LUT 생성기입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md)

## Constructors



***

### Constructor

> **new TransmittanceGenerator**(`redGPUContext`, `sharedUniformBuffer`): `TransmittanceGenerator`

Defined in: [src/display/skyAtmosphere/core/generator/transmittance/TransmittanceGenerator.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/transmittance/TransmittanceGenerator.ts#L36)

TransmittanceGenerator 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `sharedUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | 대기 파라미터 공유 유니폼 버퍼 |

#### Returns

`TransmittanceGenerator`

#### Overrides

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`constructor`](ASkyAtmosphereLUTGenerator.md#constructor)

## Accessors



***

### lutTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lutTexture**(): [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/core/generator/transmittance/TransmittanceGenerator.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/transmittance/TransmittanceGenerator.ts#L49)

생성된 대기 투과율(Transmittance) LUT 텍스처를 반환합니다.

##### Returns

[`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

DirectTexture 인스턴스

#### Overrides

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`lutTexture`](ASkyAtmosphereLUTGenerator.md#luttexture)

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyAtmosphere/core/generator/transmittance/TransmittanceGenerator.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/transmittance/TransmittanceGenerator.ts#L65)

생성기 및 내부 리소스를 해제합니다.

#### Returns

`void`

#### Overrides

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`destroy`](ASkyAtmosphereLUTGenerator.md#destroy)

***

***

### render()

> **render**(): `void`

Defined in: [src/display/skyAtmosphere/core/generator/transmittance/TransmittanceGenerator.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/transmittance/TransmittanceGenerator.ts#L57)

공유 대기 파라미터를 기반으로 투과율 LUT를 계산합니다.

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`antialiasingManager`](ASkyAtmosphereLUTGenerator.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`commandEncoderManager`](ASkyAtmosphereLUTGenerator.md#commandencodermanager)

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

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`gpuDevice`](ASkyAtmosphereLUTGenerator.md#gpudevice)

***

***

### height

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **height**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L115)

LUT 텍스처의 높이를 반환합니다.

##### Returns

`number`

텍스처 높이

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`height`](ASkyAtmosphereLUTGenerator.md#height)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`instanceId`](ASkyAtmosphereLUTGenerator.md#instanceid)

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

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`name`](ASkyAtmosphereLUTGenerator.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`redGPUContext`](ASkyAtmosphereLUTGenerator.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`resourceManager`](ASkyAtmosphereLUTGenerator.md#resourcemanager)

***

***

### sampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sampler**(): [`Sampler`](../../../../Resource/classes/Sampler.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L91)

LUT 샘플링용 샘플러를 반환합니다.

##### Returns

[`Sampler`](../../../../Resource/classes/Sampler.md)

Sampler 인스턴스

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`sampler`](ASkyAtmosphereLUTGenerator.md#sampler)

***

***

### sharedUniformBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **sharedUniformBuffer**(): [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L79)

대기 파라미터 공유 유니폼 버퍼를 반환합니다.

##### Returns

[`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

공유 유니폼 버퍼

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`sharedUniformBuffer`](ASkyAtmosphereLUTGenerator.md#shareduniformbuffer)

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

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`uuid`](ASkyAtmosphereLUTGenerator.md#uuid)

***

***

### width

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **width**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L103)

LUT 텍스처의 너비를 반환합니다.

##### Returns

`number`

텍스처 너비

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`width`](ASkyAtmosphereLUTGenerator.md#width)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### createBindGroup()

> **createBindGroup**(`label`, `pipeline`, `entries`): `GPUBindGroup`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:254](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L254)

컴퓨트 파이프라인의 첫 번째 레이아웃을 기반으로 바인드 그룹을 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `label` | `string` | 바인드 그룹 레이블 |
| `pipeline` | `GPUComputePipeline` | 기준 컴퓨트 파이프라인 |
| `entries` | `GPUBindGroupEntry`[] | 바인드 그룹 엔트리 배열 |

#### Returns

`GPUBindGroup`

생성된 GPUBindGroup

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createBindGroup`](ASkyAtmosphereLUTGenerator.md#createbindgroup)

***

***

### createComputePipeline()

> **createComputePipeline**(`label`, `shaderCode`): `GPUComputePipeline`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L225)

WGSL 셰이더 코드로부터 컴퓨트 파이프라인을 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `label` | `string` | 파이프라인 레이블 |
| `shaderCode` | `string` | WGSL 셰이더 소스 코드 |

#### Returns

`GPUComputePipeline`

생성된 GPUComputePipeline

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createComputePipeline`](ASkyAtmosphereLUTGenerator.md#createcomputepipeline)

***

***

### createLUTTexture()

> **createLUTTexture**(`is3D?`, `format?`): `GPUTexture`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:187](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L187)

LUT 저장용 GPU 텍스처를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `is3D?` | `boolean` | `false` | 3D 텍스처 생성 여부 (기본값: false) |
| `format?` | `GPUTextureFormat` | `'rgba16float'` | 텍스처 포맷 (기본값: `'rgba16float'`) |

#### Returns

`GPUTexture`

생성된 GPUTexture

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`createLUTTexture`](ASkyAtmosphereLUTGenerator.md#createluttexture)

***

***

### executeComputePass()

> **executeComputePass**(`pipeline`, `bindGroup`, `workgroupSizeX?`, `workgroupSizeY?`, `workgroupSizeZ?`, `notifyUpdate?`): `void`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:152](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L152)

컴퓨트 패스를 실행하여 LUT 데이터를 갱신합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `pipeline` | `GPUComputePipeline` | `undefined` | 실행할 컴퓨트 파이프라인 |
| `bindGroup` | `GPUBindGroup` | `undefined` | 바인딩할 리소스 바인드 그룹 |
| `workgroupSizeX?` | `number` | `8` | X축 워크그룹 크기 (기본값: 8) |
| `workgroupSizeY?` | `number` | `8` | Y축 워크그룹 크기 (기본값: 8) |
| `workgroupSizeZ?` | `number` | `1` | Z축 워크그룹 크기 (기본값: 1) |
| `notifyUpdate?` | `boolean` | `true` | 패스 실행 후 `lutTexture.notifyUpdate()` 자동 호출 여부 (기본값: true) |

#### Returns

`void`

#### Inherited from

[`ASkyAtmosphereLUTGenerator`](ASkyAtmosphereLUTGenerator.md).[`executeComputePass`](ASkyAtmosphereLUTGenerator.md#executecomputepass)

***

</details>
