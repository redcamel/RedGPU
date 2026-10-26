[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreSkyAtmosphere](../README.md) / ASkyAtmosphereLUTGenerator

# Abstract Class: ASkyAtmosphereLUTGenerator

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L19)

컴퓨트 셰이더를 통해 물리 기반 대기 산란 연산 결과를 텍스처에 베이킹하는 대기 산란용 LUT(Look-Up Table) 생성기의 추상 베이스 클래스입니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
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

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L54)

ASkyAtmosphereLUTGenerator 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `sharedUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | `undefined` | 대기 파라미터 공유 유니폼 버퍼 |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | `undefined` | LUT 샘플링용 샘플러 |
| `label` | `string` | `undefined` | 생성기 구분 레이블 |
| `width` | `number` | `undefined` | LUT 텍스처 너비 |
| `height` | `number` | `undefined` | LUT 텍스처 높이 |
| `depth?` | `number` | `1` | LUT 텍스처 깊이 또는 레이어 수 (기본값: 1) |

#### Returns

`ASkyAtmosphereLUTGenerator`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### height

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **height**(): `number`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L115)

LUT 텍스처의 높이를 반환합니다.

##### Returns

`number`

텍스처 높이

***

***

### lutTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `abstract` **lutTexture**(): [`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md) \| [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L127)

생성된 LUT 텍스처 객체를 반환합니다.

##### Returns

[`DirectCubeTexture`](../../../../Resource/classes/DirectCubeTexture.md) \| [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

LUT 텍스처 객체

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

## Methods



***

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

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts:202](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/skyAtmosphere/core/generator/ASkyAtmosphereLUTGenerator.ts#L202)

생성기 및 내부 LUT 리소스를 해제합니다.

#### Returns

`void`

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
