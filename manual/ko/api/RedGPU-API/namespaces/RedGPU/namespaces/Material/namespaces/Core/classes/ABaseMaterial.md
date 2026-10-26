[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / ABaseMaterial

# Abstract Class: ABaseMaterial

Defined in: [src/material/core/ABaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L22)

모든 머티리얼의 공통 기반이 되는 추상 클래스입니다.

프래그먼트 셰이더 모듈, 바인드 그룹 레이아웃, 블렌드 상태 및 공통 유니폼(투명도, 틴트)을 관리합니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md)

## Extended by

- [`ColorMaterial`](../../../classes/ColorMaterial.md)
- [`ABitmapBaseMaterial`](ABitmapBaseMaterial.md)

## Constructors



***

### Constructor

> `protected` **new ABaseMaterial**(`redGPUContext`, `moduleName`, `fragmentSource`, `targetGroupIndex`): `ABaseMaterial`

Defined in: [src/material/core/ABaseMaterial.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L117)

ABaseMaterial 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `moduleName` | `string` | 머티리얼 모듈 고유 이름 |
| `fragmentSource` | `string` | 프래그먼트 셰이더 WGSL 소스 코드 |
| `targetGroupIndex` | `number` | 바인드 그룹 타겟 인덱스 |

#### Returns

`ABaseMaterial`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`constructor`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#constructor)

## Properties



***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L74)

파이프라인 갱신 필요 여부 플래그

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L69)

프래그먼트 GPU 렌더 파이프라인 정보 객체

***

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L42)

머티리얼 인스턴스 여부 플래그

***

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L27)

머티리얼의 불투명도 (0.0 ~ 1.0)

***

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L32)

머티리얼의 틴트 컬러 (ColorRGBA)

***

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L79)

머티리얼 투명 렌더링 활성화 여부

***

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L64)

2패스 렌더링 사용 여부

***

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L37)

틴트 컬러 적용 여부

## Accessors



***

### blendAlphaState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:277](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L277)

알파 블렌드 상태 객체를 반환합니다.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

알파 BlendState 인스턴스

***

***

### blendColorState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendColorState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L265)

컬러 블렌드 상태 객체를 반환합니다.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

컬러 BlendState 인스턴스

***

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L217)

프래그먼트 바인드 그룹 디스크립터 이름을 반환합니다.

##### Returns

`string`

바인드 그룹 디스크립터 이름

***

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L205)

프래그먼트 셰이더 모듈 이름을 반환합니다.

##### Returns

`string`

프래그먼트 셰이더 모듈 이름

***

***

### globalFragmentSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:305](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L305)

글로벌 프래그먼트 SSBO 내 할당된 슬롯 인덱스를 반환합니다.

##### Returns

`number`

할당된 슬롯 인덱스 (미할당 시 `-1`)

***

***

### MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:193](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L193)

머티리얼 모듈 이름을 반환합니다.

##### Returns

`string`

모듈 이름

***

***

### SHADER\_INFO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L241)

파싱된 WGSL 셰이더 전체 정보를 반환합니다.

##### Returns

`any`

파싱된 셰이더 정보 객체

***

***

### STORAGE\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:229](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L229)

파싱된 셰이더 스토리지 구조체 정보를 반환합니다.

##### Returns

`any`

스토리지 구조체 정보

***

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L160)

현재 설정된 틴트 블렌드 모드의 키 이름을 반환하거나 새로운 모드를 설정합니다.

##### Throws

유효하지 않은 틴트 블렌드 모드 값 또는 키가 지정된 경우 Error 발생

##### Returns

`string`

틴트 블렌드 모드 키 문자열 (예: `'MULTIPLY'`)

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:168](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L168)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"COLOR"` \| `"NORMAL"` \| `"SUBTRACT"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../../type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

***

***

### UNIFORM\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L253)

파싱된 셰이더 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

***

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L289)

컬러 쓰기 마스크(GPUColorWrite) 상태를 반환하거나 설정합니다.

##### Returns

`number`

GPUFlagsConstant 값

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:293](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods



***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:461](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L461)

머티리얼의 기본 속성(유니폼, 컬러, 틴트 등)을 유니폼 버퍼 및 글로벌 SSBO에 동기화합니다.

#### Returns

`void`

***

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:357](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L357)

셰이더 바리안트를 점검하고 프래그먼트 바인드 그룹 및 렌더 상태를 갱신합니다.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:510](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L510)

머티리얼 인스턴스를 파기하고 할당된 유니폼 버퍼 및 글로벌 프래그먼트 슬롯을 해제합니다.

#### Returns

`void`

***

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:430](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L430)

GPU 프래그먼트 렌더 상태(GPUFragmentState) 객체를 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint?` | `string` | `'main'` | 프래그먼트 셰이더 엔트리 포인트 함수 이름 (기본값: `'main'`) |

#### Returns

`GPUFragmentState`

구성된 GPUFragmentState 객체

***

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:502](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L502)

Sampler 인스턴스로부터 GPUSampler를 반환하며, 없을 경우 기본 GPUSampler를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler 인스턴스 |

#### Returns

`GPUSampler`

GPUSampler 인스턴스

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:313](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/ABaseMaterial.ts#L313)

GPU 프래그먼트 렌더 파이프라인 정보와 유니폼 버퍼를 초기화합니다.

#### Returns

`void`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`antialiasingManager`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#antialiasingmanager)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L61)

캐시 키를 반환하거나 설정합니다.

##### Returns

`string`

캐시 키 문자열

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`cacheKey`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`commandEncoderManager`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L89)

연관된 GPUDevice를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`gpuDevice`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#gpudevice)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`instanceId`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#instanceid)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`name`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`redGPUContext`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManager`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L77)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

리소스 매니저 키 문자열

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`resourceManagerKey`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L49)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

리소스 리비전 번호

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`revision`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#revision)

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

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`uuid`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#uuid)

***

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L102)

리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 등록할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`__addDirtyPipelineListener`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L115)

등록된 파이프라인 더티 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`__removeDirtyPipelineListener`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#__removedirtypipelinelistener)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/ResourceBase.ts#L131)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | 알림 실행 후 리스너 목록 초기화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ResourceBase`](../../../../Resource/namespaces/Core/classes/ResourceBase.md).[`notifyUpdate`](../../../../Resource/namespaces/Core/classes/ResourceBase.md#notifyupdate)

</details>
