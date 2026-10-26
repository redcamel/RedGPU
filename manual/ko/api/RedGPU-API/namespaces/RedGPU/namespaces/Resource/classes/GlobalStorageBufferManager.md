[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / GlobalStorageBufferManager

# Class: GlobalStorageBufferManager

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L31)

글로벌 SSBO(Storage Buffer)의 슬롯 할당·해제와 CPU→GPU 데이터 업로드를 관리하는 매니저입니다.

변경된 슬롯 범위만 업로드(더티 트래킹)하며, 용량 초과 시 32MB까지는 2배, 이후에는 8MB씩 선형 확장합니다 (최대 128MB).

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// 올바른 접근 방법
const globalVertexSSBO = redGPUContext.globalVertexSSBO;
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new GlobalStorageBufferManager**(`redGPUContext`, `elementSize`, `initialSlotCount?`, `label?`): `GlobalStorageBufferManager`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:82](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L82)

지정한 슬롯 크기와 수용량으로 GPU 스토리지 버퍼와 CPU 미러 버퍼를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 인스턴스 |
| `elementSize` | `number` | `undefined` | 단일 슬롯 원소의 바이트 크기 |
| `initialSlotCount?` | `number` | `1024` | 초기 슬롯 수용량 (기본값: 1024) |
| `label?` | `string` | `"GLOBAL_STORAGE_BUFFER"` | 버퍼 디버그 레이블 (기본값: 'GLOBAL_STORAGE_BUFFER') |

#### Returns

`GlobalStorageBufferManager`

#### Throws

초기 버퍼 크기가 하드웨어 허용 최대 크기(최대 128MB)를 초과하면 에러를 발생시킵니다.

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### RESIZE\_LINEAR\_ADDITION\_BYTES

> <span class="readonly-badge">readonly</span> `static` **RESIZE\_LINEAR\_ADDITION\_BYTES**: `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L42)

임계 크기 초과 후 선형 성장 시 추가되는 바이트 크기 (8MB)

***

***

### RESIZE\_THRESHOLD\_BYTES

> <span class="readonly-badge">readonly</span> `static` **RESIZE\_THRESHOLD\_BYTES**: `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L36)

2배 성장에서 선형 성장으로 전환되는 임계 버퍼 크기 (32MB)

## Accessors



***

### activeSlotCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:200](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L200)

현재 사용 중인 슬롯 개수를 반환합니다.

##### Returns

`number`

사용 중인 슬롯 개수

***

***

### cpuData

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuData**(): `ArrayBuffer`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:152](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L152)

CPU 측 미러 버퍼를 반환합니다. (디버그·테스트 용도)

##### Returns

`ArrayBuffer`

CPU 미러 `ArrayBuffer`

***

***

### dirtyMax

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dirtyMax**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:176](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L176)

더티로 추적 중인 최대 슬롯 인덱스를 반환합니다. (디버그·테스트 용도)

##### Returns

`number`

최대 더티 인덱스 (없으면 -Infinity)

***

***

### dirtyMin

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dirtyMin**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:164](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L164)

더티로 추적 중인 최소 슬롯 인덱스를 반환합니다. (디버그·테스트 용도)

##### Returns

`number`

최소 더티 인덱스 (없으면 Infinity)

***

***

### elementSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **elementSize**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:128](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L128)

단일 슬롯 원소의 바이트 크기를 반환합니다.

##### Returns

`number`

슬롯 바이트 크기

***

***

### gpuBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L104)

GPU 스토리지 버퍼를 반환합니다. 리사이즈 시 새 버퍼로 교체됩니다.

##### Returns

`GPUBuffer`

GPUBuffer 객체

***

***

### label

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **label**(): `string`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:140](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L140)

버퍼 디버그 레이블을 반환합니다.

##### Returns

`string`

레이블 문자열

***

***

### remainingSlotCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **remainingSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:212](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L212)

남은 사용 가능 슬롯 개수를 반환합니다.

##### Returns

`number`

남은 슬롯 개수

***

***

### safeMaxBufferSize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **safeMaxBufferSize**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L188)

허용되는 최대 버퍼 바이트 크기를 반환합니다. (`maxStorageBufferBindingSize`와 128MB 중 작은 값)

##### Returns

`number`

최대 버퍼 바이트 크기

***

***

### totalSlotCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L116)

버퍼의 전체 슬롯 수용량을 반환합니다.

##### Returns

`number`

전체 슬롯 개수

***

## Methods



***

### allocateSlot()

> **allocateSlot**(): [`BufferSlot`](../interfaces/BufferSlot.md)

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:257](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L257)

버퍼 슬롯을 할당합니다. 해제된 슬롯이 있으면 우선 재사용하고, 용량이 부족하면 버퍼를 확장합니다.

#### Example
```typescript
const slot = redGPUContext.globalVertexSSBO.allocateSlot();
console.log(slot.index, slot.byteOffset);
```

#### Returns

[`BufferSlot`](../interfaces/BufferSlot.md)

할당된 슬롯의 인덱스와 바이트 오프셋

#### Throws

확장 후 크기가 최대 허용 크기를 초과하면 에러를 발생시킵니다.

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L220)

GPU 버퍼를 파괴하고 CPU 미러 데이터와 슬롯 풀을 해제합니다.

#### Returns

`void`

***

***

### flush()

> **flush**(): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:360](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L360)

더티 슬롯 범위만 GPU 버퍼로 업로드하고 더티 상태를 초기화합니다.

#### Returns

`void`

***

***

### freeSlot()

> **freeSlot**(`index`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:292](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L292)

슬롯 인덱스를 재사용 풀에 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 반환할 슬롯 인덱스 |

#### Returns

`void`

***

***

### setOnResize()

> **setOnResize**(`callback`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:236](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L236)

버퍼 리사이즈 완료 후 호출될 콜백을 등록합니다. 주로 바인드 그룹 재생성에 사용됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`manager`) => `void` | 리사이즈 후 호출될 콜백 함수 |

#### Returns

`void`

***

***

### updateFloatData()

> **updateFloatData**(`index`, `data`, `floatOffsetInsideElement?`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:313](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L313)

슬롯에 Float32 데이터를 CPU 미러 버퍼에 기록하고 더티로 표시합니다. 실제 업로드는 `flush()`에서 수행됩니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `undefined` | 대상 슬롯 인덱스 |
| `data` | `Float32Array` | `undefined` | 기록할 `Float32Array` 데이터 |
| `floatOffsetInsideElement?` | `number` | `0` | 슬롯 내부 float 단위 오프셋 (기본값: 0) |

#### Returns

`void`

#### Throws

오프셋과 데이터 길이의 합이 슬롯 크기를 초과하면 에러를 발생시킵니다.

***

***

### updateUintData()

> **updateUintData**(`index`, `data`, `uintOffsetInsideElement?`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:343](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L343)

슬롯에 Uint32 데이터를 CPU 미러 버퍼에 기록하고 더티로 표시합니다. 실제 업로드는 `flush()`에서 수행됩니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `undefined` | 대상 슬롯 인덱스 |
| `data` | `Uint32Array` | `undefined` | 기록할 `Uint32Array` 데이터 |
| `uintOffsetInsideElement?` | `number` | `0` | 슬롯 내부 uint 단위 오프셋 (기본값: 0) |

#### Returns

`void`

#### Throws

오프셋과 데이터 길이의 합이 슬롯 크기를 초과하면 에러를 발생시킵니다.

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
