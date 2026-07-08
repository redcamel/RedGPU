[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Resource](../README.md) / GlobalStorageBufferManager

# Class: GlobalStorageBufferManager

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:16](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L16)

WebGPU의 성능 극대화를 목표로 하는 글로벌 SSBO(Storage Buffer) 아키텍처에서 버텍스 단계(Vertex Stage) 및 프래그먼트 단계(Fragment Stage)에 필요한 다양한 속성 정보(Properties)를 정밀하게 통제하고, CPU-GPU 데이터 업로드를 전담할 범용 글로벌 버퍼 매니저입니다.

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new GlobalStorageBufferManager**(`redGPUContext`, `elementSize`, `initialSlotCount?`, `label?`): `GlobalStorageBufferManager`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:123](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L123)

GlobalStorageBufferManager 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `undefined` | RedGPUContext 컨텍스트 인스턴스
| `elementSize` | `number` | `undefined` | 단일 슬롯 원소의 바이트 크기
| `initialSlotCount` | `number` | `1024` | 최초 슬롯 수용량 (기본값: 1024)
| `label` | `string` | `"GLOBAL_STORAGE_BUFFER"` | 버퍼 식별용 레이블 (기본값: 'GLOBAL_STORAGE_BUFFER')

#### Returns

`GlobalStorageBufferManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### RESIZE\_LINEAR\_ADDITION\_BYTES

> `readonly` `static` **RESIZE\_LINEAR\_ADDITION\_BYTES**: `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:27](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L27)

임계 크기 초과 후 선형 증가 시 가산할 고정 메모리 바이트 크기 (8MB)

***

### RESIZE\_THRESHOLD\_BYTES

> `readonly` `static` **RESIZE\_THRESHOLD\_BYTES**: `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:21](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L21)

기하급수 성장(2배)에서 선형 성장으로 전환되는 임계 버퍼 크기 (32MB)

## Accessors

### activeSlotCount

#### Get Signature

> **get** **activeSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:205](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L205)

현재 할당되어 사용 중인 슬롯의 개수를 반환합니다.

##### Returns

`number`

***

### cpuData

#### Get Signature

> **get** **cpuData**(): `ArrayBuffer`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:173](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L173)

CPU 측 백킹 미러 버퍼 메모리 공간(ArrayBuffer)을 반환합니다. (디버그 및 테스트 용도)

##### Returns

`ArrayBuffer`

***

### dirtyMax

#### Get Signature

> **get** **dirtyMax**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:189](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L189)

현재 더티로 추적된 슬롯의 최대 인덱스를 반환합니다. (디버그 및 테스트 용도)

##### Returns

`number`

***

### dirtyMin

#### Get Signature

> **get** **dirtyMin**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:181](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L181)

현재 더티로 추적된 슬롯의 최소 인덱스를 반환합니다. (디버그 및 테스트 용도)

##### Returns

`number`

***

### elementSize

#### Get Signature

> **get** **elementSize**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:157](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L157)

단일 슬롯 원소의 바이트 크기를 반환합니다.

##### Returns

`number`

***

### gpuBuffer

#### Get Signature

> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:141](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L141)

GPUBuffer 리소스 인스턴스를 반환합니다.

##### Returns

`GPUBuffer`

***

### label

#### Get Signature

> **get** **label**(): `string`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:165](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L165)

버퍼 식별 레이블을 반환합니다.

##### Returns

`string`

***

### remainingSlotCount

#### Get Signature

> **get** **remainingSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:213](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L213)

남은 사용 가능한 슬롯의 개수를 반환합니다.

##### Returns

`number`

***

### safeMaxBufferSize

#### Get Signature

> **get** **safeMaxBufferSize**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:197](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L197)

테스트 및 디버깅을 위해 하드웨어 허용 최대 버퍼 바이트 크기 값을 반환합니다.

##### Returns

`number`

***

### totalSlotCount

#### Get Signature

> **get** **totalSlotCount**(): `number`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:149](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L149)

버퍼가 수용할 수 있는 전체 슬롯 개수(용량)를 반환합니다.

##### Returns

`number`

***

### allocateSlot()

> **allocateSlot**(): [`BufferSlot`](../interfaces/BufferSlot.md)

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:237](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L237)

버퍼 슬롯을 할당합니다. 해제 대기 중인 빈 슬롯 인덱스가 있다면 우선 재사용합니다.

#### Returns

[`BufferSlot`](../interfaces/BufferSlot.md)

할당된 슬롯의 인덱스 및 바이트 오프셋 정보

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:99](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L99)

#### Returns

`void`

***

### flush()

> **flush**(): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:336](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L336)

더티 트래킹 범위(실제 데이터가 수정된 구간)만 선별하여 GPU 메모리로 업로드합니다.

#### Returns

`void`

***

### freeSlot()

> **freeSlot**(`index`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:274](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L274)

할당받았던 슬롯 인덱스를 반환하여 재사용 대기 풀에 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | 반환할 슬롯의 인덱스 번호

#### Returns

`void`

***

### setOnResize()

> **setOnResize**(`callback`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:225](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L225)

리사이즈 콜백을 등록합니다. 버퍼 용량 한도 초과로 동적 리사이징이 실행된 후 호출됩니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `callback` | (`manager`) => `void` | 리사이즈 실행 후 호출될 콜백 함수

#### Returns

`void`

***

### updateFloatData()

> **updateFloatData**(`index`, `data`, `floatOffsetInsideElement?`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:292](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L292)

특정 슬롯 인덱스 영역에 Float32 데이터를 기록하고 해당 범위를 더티로 추적합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `undefined` | 데이터를 갱신할 슬롯의 인덱스 번호
| `data` | `Float32Array` | `undefined` | 업로드할 Float32 데이터 배열
| `floatOffsetInsideElement` | `number` | `0` | 해당 슬롯 내부에서의 추가 float 단위 오프셋 (기본값: 0)

#### Returns

`void`

***

### updateUintData()

> **updateUintData**(`index`, `data`, `uintOffsetInsideElement?`): `void`

Defined in: [src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts:319](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/resources/buffer/globalStorageBufferManager/GlobalStorageBufferManager.ts#L319)

특정 슬롯 인덱스 영역에 Uint32 데이터를 기록하고 해당 범위를 더티로 추적합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `index` | `number` | `undefined` | 데이터를 갱신할 슬롯의 인덱스 번호
| `data` | `Uint32Array` | `undefined` | 업로드할 Uint32 데이터 배열
| `uintOffsetInsideElement` | `number` | `0` | 해당 슬롯 내부에서의 추가 uint 단위 오프셋 (기본값: 0)

#### Returns

`void`


***

## 상속받은 멤버

<details>
<summary>상속받은 속성 및 메서드 보기 (클릭하여 확장)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L18)

클래스별 인스턴스 순번 ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L76)

안티앨리어싱 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L88)

커맨드 인코더 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L52)

WebGPU 디바이스 객체를 반환합니다. (단축 경로)

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L58)

객체의 이름을 반환합니다. 설정된 이름이 없으면 클래스명과 인스턴스 ID를 조합하여 자동으로 생성합니다.

##### Returns

`string`

객체 이름

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L70)

객체의 이름을 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | 설정할 객체 이름

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L40)

RedGPUContext 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/RedGPUObject.ts#L64)

리소스 매니저 인스턴스를 반환합니다. (단축 경로)

##### Returns

[`ResourceManager`](../namespaces/Core/classes/ResourceManager.md)

ResourceManager 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/f1f8a3916d21f1c1632cf87591e942c59ff251ca/src/base/BaseObject.ts#L46)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

## Methods


</details>
