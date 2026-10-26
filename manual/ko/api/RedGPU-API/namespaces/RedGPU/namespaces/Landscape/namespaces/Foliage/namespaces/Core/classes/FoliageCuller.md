[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageCuller

# Class: FoliageCuller

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/culling/FoliageCuller.ts#L23)

식생(Foliage) 인스턴스에 대한 절두체(Frustum), HZB 오클루전, 거리 기반 LOD 선택 및 그림자 캐스케이드 컬링을 GPU 컴퓨트 셰이더로 수행하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md)

## Constructors



***

### Constructor

> **new FoliageCuller**(`redGPUContext`, `megaBuffer?`): `FoliageCuller`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/culling/FoliageCuller.ts#L44)

`FoliageCuller` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |
| `megaBuffer?` | [`FoliageMegaBuffer`](FoliageMegaBuffer.md) | 식생 통합 GPU 버퍼를 관리하는 `FoliageMegaBuffer` 인스턴스 (선택) |

#### Returns

`FoliageCuller`

#### Overrides

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#constructor)

## Accessors



***

### baker

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **baker**(): [`FoliageInstanceBaker`](FoliageInstanceBaker.md)

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/culling/FoliageCuller.ts#L59)

식생 인스턴스 베이커(`FoliageInstanceBaker`) 인스턴스를 반환합니다.

##### Returns

[`FoliageInstanceBaker`](FoliageInstanceBaker.md)

`FoliageInstanceBaker` 인스턴스

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/culling/FoliageCuller.ts#L188)

컬링 파이프라인, 베이커 및 내부 참조 리소스를 해제합니다.

#### Returns

`void`

#### Overrides

[`AScatterCuller`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterCuller.md#destroy)

***

***

### dispatchPass()

> **dispatchPass**(`computePass`): `void`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:130](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/culling/FoliageCuller.ts#L130)

컴퓨트 패스 인코더에 통합 식생 컬링 컴퓨트 셰이더 디스패치 명령을 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `computePass` | `GPUComputePassEncoder` | 대상 `GPUComputePassEncoder` 인스턴스 |

#### Returns

`void`

***

***

### recordResetCommands()

> **recordResetCommands**(`encoder`): `void`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/culling/FoliageCuller.ts#L116)

메인 및 그림자 간접 드로우 버퍼(Indirect Buffer) 카운터를 초기화하는 커맨드를 인코더에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `encoder` | `GPUCommandEncoder` | 대상 `GPUCommandEncoder` 인스턴스 |

#### Returns

`void`

***

***

### update()

> **update**(`foliageList`, `renderViewStateData`): `void`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/culling/FoliageCuller.ts#L74)

현재 프레임의 카메라 뷰 행렬, FOV, HZB 텍스처 및 캐스케이드 절두체 정보를 통합 글로벌 컬링 유니폼 버퍼에 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `foliageList` | [`Foliage`](../../../classes/Foliage.md)[] | 활성 식생(`Foliage`) 타입 배열 |
| `renderViewStateData` | [`RenderViewStateData`](../../../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | 현재 프레임의 렌더 뷰 상태 데이터 |

#### Returns

`void`

***

***

### updateAndDispatch()

> **updateAndDispatch**(`foliageList`, `renderViewStateData`): `void`

Defined in: [src/landscape/foliage/core/culling/FoliageCuller.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/culling/FoliageCuller.ts#L160)

글로벌 컬링 유니폼을 갱신하고 `CommandEncoderManager`의 프리프로세스 패스에 간접 버퍼 초기화 및 컬링 디스패치를 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `foliageList` | [`Foliage`](../../../classes/Foliage.md)[] | 활성 식생(`Foliage`) 타입 배열 |
| `renderViewStateData` | [`RenderViewStateData`](../../../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | 현재 프레임의 렌더 뷰 상태 데이터 |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterCuller.ts#L52)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterCuller.ts#L40)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

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

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:133](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterCuller.ts#L133)

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

Defined in: [src/landscape/core/scatter/AScatterCuller.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterCuller.ts#L82)

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

***

</details>
