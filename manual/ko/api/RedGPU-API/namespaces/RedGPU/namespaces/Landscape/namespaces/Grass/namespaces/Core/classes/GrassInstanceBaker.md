[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Grass](../../../README.md) / [Core](../README.md) / GrassInstanceBaker

# Class: GrassInstanceBaker

Defined in: [src/landscape/grass/core/baking/GrassInstanceBaker.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/baking/GrassInstanceBaker.ts#L27)

컴퓨트 셰이더를 사용하여 지형(Landscape) 표면에 잔디(Grass) 인스턴스를 베이킹하는 시스템 내부 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md)

## Constructors



***

### Constructor

> **new GrassInstanceBaker**(`redGPUContext`): `GrassInstanceBaker`

Defined in: [src/landscape/grass/core/baking/GrassInstanceBaker.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/baking/GrassInstanceBaker.ts#L45)

`GrassInstanceBaker` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |

#### Returns

`GrassInstanceBaker`

#### Overrides

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#constructor)

## Accessors



## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/grass/core/baking/GrassInstanceBaker.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/baking/GrassInstanceBaker.ts#L217)

베이커가 점유한 GPU 버퍼 및 캐시 리소스를 해제합니다.

#### Returns

`void`

#### Overrides

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#destroy)

***

***

### dispatchBake()

> **dispatchBake**(`megaBuffer`, `landscape`, `grass`, `centerX?`, `centerZ?`): `void`

Defined in: [src/landscape/grass/core/baking/GrassInstanceBaker.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/baking/GrassInstanceBaker.ts#L73)

중심 좌표를 기준으로 반경 내 셀에 대해 잔디 인스턴스 베이킹 컴퓨트 패스를 디스패치합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `megaBuffer` | [`GrassMegaBuffer`](GrassMegaBuffer.md) | `undefined` | 잔디 인스턴스 데이터를 저장할 GrassMegaBuffer 인스턴스 |
| `landscape` | [`Landscape`](../../../../../classes/Landscape.md) | `undefined` | 지형(Landscape) 인스턴스 |
| `grass` | [`Grass`](../../../classes/Grass.md) | `undefined` | 베이킹할 잔디(Grass) 타입 인스턴스 |
| `centerX?` | `number` | `0` | 베이킹 중심 X 월드 좌표 (기본값: 0) |
| `centerZ?` | `number` | `0` | 베이킹 중심 Z 월드 좌표 (기본값: 0) |

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#antialiasingmanager)

***

***

### bindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:95](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L95)

인스턴스 베이킹 셰이더의 바인드 그룹 레이아웃을 반환합니다.

##### Returns

`GPUBindGroupLayout`

바인드 그룹 레이아웃(`GPUBindGroupLayout`) 또는 미초기화 시 `null`

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`bindGroupLayout`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#bindgrouplayout)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#commandencodermanager)

***

***

### computePipeline

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **computePipeline**(): `GPUComputePipeline`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L83)

인스턴스 베이킹용 WebGPU 컴퓨트 파이프라인을 반환합니다.

##### Returns

`GPUComputePipeline`

컴퓨트 파이프라인(`GPUComputePipeline`) 또는 미초기화 시 `null`

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`computePipeline`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#computepipeline)

***

***

### defaultSampler

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **defaultSampler**(): `GPUSampler`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L119)

지형 텍스처 샘플링에 사용되는 기본 GPU 샘플러를 반환합니다.

##### Returns

`GPUSampler`

기본 샘플러(`GPUSampler`) 또는 미초기화 시 `null`

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`defaultSampler`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#defaultsampler)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#gpudevice)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`instanceId`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#instanceid)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`redGPUContext`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`resourceManager`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#resourcemanager)

***

***

### uniformGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uniformGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:107](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L107)

베이킹 파라미터 전송에 사용되는 유니폼 GPU 버퍼를 반환합니다.

##### Returns

`GPUBuffer`

유니폼 버퍼(`GPUBuffer`) 또는 미초기화 시 `null`

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`uniformGPUBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#uniformgpubuffer)

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

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`uuid`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#uuid)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### getOrCreateBindGroup()

> **getOrCreateBindGroup**(`typeId`, `labelPrefix`, `rawBuffer`, `vhtView`, `vbtView`, `weightView`, `tasksBuffer`): `GPUBindGroup`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L166)

타입 ID와 리소스 조합에 대응하는 베이킹용 GPU 바인드 그룹을 캐시에서 조회하거나 새로 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeId` | `number` | 스캐터 타입 식별자 ID |
| `labelPrefix` | `string` | 생성될 바인드 그룹의 디버그 라벨 접두사 |
| `rawBuffer` | `GPUBuffer` | 베이킹된 원시 인스턴스 데이터를 저장할 스토리지 버퍼 |
| `vhtView` | `GPUTextureView` | 가상 높이 텍스처(VHT) 뷰 |
| `vbtView` | `GPUTextureView` | 가상 블렌드 텍스처(VBT) 뷰 |
| `weightView` | `GPUTextureView` | 대상 레이어의 가중치 맵 텍스처 뷰 |
| `tasksBuffer` | `GPUBuffer` | 베이킹 작업(Task) 목록이 담긴 GPU 버퍼 |

#### Returns

`GPUBindGroup`

생성되었거나 캐시된 `GPUBindGroup` 또는 파이프라인 미초기화 시 `null`

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`getOrCreateBindGroup`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#getorcreatebindgroup)

***

***

### initComputePipeline()

> **initComputePipeline**(`shaderCode`, `label`, `uniformByteLength?`): `void`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:229](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L229)

베이킹 컴퓨트 셰이더 모듈, 바인드 그룹 레이아웃, 파이프라인 및 유니폼 버퍼를 초기화합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shaderCode` | `string` | `undefined` | 베이킹 컴퓨트 WGSL 셰이더 소스 코드 |
| `label` | `string` | `undefined` | GPU 리소스 디버그 라벨 접두사 |
| `uniformByteLength?` | `number` | `256` | 베이킹 유니폼 버퍼의 바이트 크기 (기본값: `256`) |

#### Returns

`void`

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`initComputePipeline`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#initcomputepipeline)

***

***

### resolveWeightLayer()

> **resolveWeightLayer**(`landscape`, `targetLayer?`): `ResolvedWeightLayerInfo`

Defined in: [src/landscape/core/scatter/AScatterInstanceBaker.ts:290](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterInstanceBaker.ts#L290)

대상 지형 레이어 이름 또는 인덱스를 기반으로 가중치 텍스처 뷰 및 채널 정보를 해석하여 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `landscape` | [`Landscape`](../../../../../classes/Landscape.md) | 레이어 목록을 보유한 대상 `Landscape` 인스턴스 |
| `targetLayer?` | `string` \| `number` | 참조할 지형 레이어의 이름(`string`) 또는 인덱스(`number`) |

#### Returns

`ResolvedWeightLayerInfo`

해석된 가중치 레이어 정보 객체 (`ResolvedWeightLayerInfo`)

#### Inherited from

[`AScatterInstanceBaker`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md).[`resolveWeightLayer`](../../../../Core/namespaces/Scatter/classes/AScatterInstanceBaker.md#resolveweightlayer)

</details>
