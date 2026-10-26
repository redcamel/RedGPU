[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Grass](../../../README.md) / [Core](../README.md) / GrassCuller

# Class: GrassCuller

Defined in: [src/landscape/grass/core/culling/GrassCuller.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/culling/GrassCuller.ts#L18)

컴퓨트 셰이더를 통해 잔디 인스턴스의 절두체 및 거리 기반 GPU 컬링을 수행하는 시스템 내부 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md)

## Constructors



***

### Constructor

> **new GrassCuller**(`redGPUContext`): `GrassCuller`

Defined in: [src/landscape/grass/core/culling/GrassCuller.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/culling/GrassCuller.ts#L33)

`GrassCuller` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |

#### Returns

`GrassCuller`

#### Overrides

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#constructor)

## Accessors



## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/grass/core/culling/GrassCuller.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/culling/GrassCuller.ts#L99)

컬러가 점유한 GPU 유니폼 버퍼 및 파이프라인 리소스를 해제합니다.

#### Returns

`void`

#### Overrides

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#destroy)

***

***

### dispatchPass()

> **dispatchPass**(`computePass`, `megaBuffer`, `renderViewStateData`): `void`

Defined in: [src/landscape/grass/core/culling/GrassCuller.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/culling/GrassCuller.ts#L62)

현재 뷰의 카메라 및 절두체 정보를 업데이트하고 잔디 컬링 컴퓨트 패스를 디스패치합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `computePass` | `GPUComputePassEncoder` | 대상 `GPUComputePassEncoder` 인스턴스 |
| `megaBuffer` | [`GrassMegaBuffer`](GrassMegaBuffer.md) | 잔디 메가 버퍼 인스턴스 |
| `renderViewStateData` | [`RenderViewStateData`](../../../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | 현재 렌더링 뷰 상태 데이터 |

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#antialiasingmanager)

***

***

### bindGroupLayout

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bindGroupLayout**(): `GPUBindGroupLayout`

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterCuller.ts#L52)

컴퓨트 컬링 셰이더의 바인드 그룹 레이아웃을 반환합니다.

##### Returns

`GPUBindGroupLayout`

바인드 그룹 레이아웃(`GPUBindGroupLayout`) 또는 미초기화 시 `null`

#### Inherited from

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`bindGroupLayout`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#bindgrouplayout)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#commandencodermanager)

***

***

### computePipeline

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **computePipeline**(): `GPUComputePipeline`

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterCuller.ts#L40)

생성된 WebGPU 컴퓨트 파이프라인을 반환합니다.

##### Returns

`GPUComputePipeline`

컴퓨트 파이프라인(`GPUComputePipeline`) 또는 미초기화 시 `null`

#### Inherited from

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`computePipeline`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#computepipeline)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#gpudevice)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`instanceId`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#instanceid)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#name)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`redGPUContext`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#redgpucontext)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`resourceManager`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#resourcemanager)

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

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`uuid`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#uuid)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### dispatchCompute()

> **dispatchCompute**(`computePass`, `bindGroup`, `totalInstances`, `workgroupSize?`): `void`

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:133](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterCuller.ts#L133)

전체 인스턴스 수와 워크그룹 크기를 기준으로 컴퓨트 컬링 워크그룹을 디스패치합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `computePass` | `GPUComputePassEncoder` | `undefined` | 대상 GPU 컴퓨트 패스 인코더 |
| `bindGroup` | `GPUBindGroup` | `undefined` | 바인딩할 컬링용 GPU 바인드 그룹 |
| `totalInstances` | `number` | `undefined` | 컬링 대상 전체 인스턴스 수 |
| `workgroupSize?` | `number` | `64` | 컴퓨트 셰이더 워크그룹 크기 (기본값: `64`) |

#### Returns

`void`

#### Inherited from

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`dispatchCompute`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#dispatchcompute)

***

***

### initComputePipeline()

> **initComputePipeline**(`shaderName`, `shaderSource`, `labelPrefix`, `entryPoint?`): `void`

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterCuller.ts#L82)

WGSL 컴퓨트 셰이더 소스를 파싱하여 바인드 그룹 레이아웃과 컴퓨트 파이프라인을 초기화합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shaderName` | `string` | `undefined` | 리소스 매니저에 등록할 셰이더 모듈 식별자 이름 |
| `shaderSource` | `string` | `undefined` | 컴퓨트 컬링용 WGSL 셰이더 소스 코드 |
| `labelPrefix` | `string` | `undefined` | 파이프라인 및 레이아웃 디버그 라벨 접두사 |
| `entryPoint?` | `string` | `'main'` | 컴퓨트 셰이더 진입점 함수 이름 (기본값: `'main'`) |

#### Returns

`void`

#### Inherited from

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`initComputePipeline`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#initcomputepipeline)

</details>
