[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Grass](../../../README.md) / [Core](../README.md) / GrassSlotPooler

# Class: GrassSlotPooler

Defined in: [src/landscape/grass/core/buffer/GrassSlotPooler.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/buffer/GrassSlotPooler.ts#L18)

잔디(Grass) 타입별 렌더링 유니폼 파라미터 슬롯을 메가 UBO로 풀링 및 관리하는 시스템 내부 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md)

## Constructors



***

### Constructor

> **new GrassSlotPooler**(`redGPUContext`): `GrassSlotPooler`

Defined in: [src/landscape/grass/core/buffer/GrassSlotPooler.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/buffer/GrassSlotPooler.ts#L33)

`GrassSlotPooler` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |

#### Returns

`GrassSlotPooler`

#### Overrides

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#constructor)

## Landscape



## Other



***

### PARAMS\_SIZE\_BYTES

> `static` **PARAMS\_SIZE\_BYTES**: `number` = `96`

Defined in: [src/landscape/grass/core/buffer/GrassSlotPooler.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/buffer/GrassSlotPooler.ts#L23)

슬롯당 유효 유니폼 파라미터 크기 (바이트 단위)

***

***

### writeGrassSlot()

> **writeGrassSlot**(`slot`, `grass`, `hasValidVbt`): `void`

Defined in: [src/landscape/grass/core/buffer/GrassSlotPooler.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/buffer/GrassSlotPooler.ts#L56)

지정된 슬롯에 잔디 타입의 렌더링 및 셰이딩 파라미터를 기록하고 GPU 버퍼에 업로드합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slot` | `number` | 기록할 대상 슬롯 인덱스 |
| `grass` | [`Grass`](../../../classes/Grass.md) | 잔디(Grass) 타입 인스턴스 |
| `hasValidVbt` | `boolean` | 지형 베이스 컬러 텍스처(VBT) 유효 여부 |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### SLOT\_STRIDE\_FLOATS

> `static` **SLOT\_STRIDE\_FLOATS**: `number` = `64`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L24)

슬롯당 `Float32` 요소 개수 (`64`)입니다.

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`SLOT_STRIDE_FLOATS`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#slot_stride_floats)

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#antialiasingmanager)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#commandencodermanager)

***

***

### cpuBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuBuffer**(): `Float32Array`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L127)

전체 슬롯 데이터의 CPU 측 `Float32Array` 버퍼를 반환합니다.

##### Returns

`Float32Array`

CPU 슬롯 `Float32Array` 버퍼

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`cpuBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#cpubuffer)

***

***

### cpuUint32View

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuUint32View**(): `Uint32Array`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:139](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L139)

전체 슬롯 데이터의 CPU 측 `Uint32Array` 뷰를 반환합니다.

##### Returns

`Uint32Array`

CPU 슬롯 `Uint32Array` 뷰

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`cpuUint32View`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#cpuuint32view)

***

***

### gpuBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L115)

전체 슬롯 데이터를 보관하는 통합 유니폼 `GPUBuffer`를 반환합니다.

##### Returns

`GPUBuffer`

통합 유니폼 `GPUBuffer` 또는 파기 시 `null`

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`gpuBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#gpubuffer)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#gpudevice)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`instanceId`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#instanceid)

***

***

### maxSlots

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxSlots**(): `number`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:91](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L91)

풀이 수용할 수 있는 최대 슬롯 개수를 반환합니다.

##### Returns

`number`

최대 슬롯 개수

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`maxSlots`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#maxslots)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#name)

***

***

### paramsSizeBytes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **paramsSizeBytes**(): `number`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L103)

단일 슬롯 내 실제 유니폼 파라미터의 바이트 크기를 반환합니다.

##### Returns

`number`

슬롯 파라미터 바이트 크기

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`paramsSizeBytes`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#paramssizebytes)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`redGPUContext`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#redgpucontext)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`resourceManager`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#resourcemanager)

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

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`uuid`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#uuid)

***

***

### allocateSlot()

> **allocateSlot**(): `number`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:151](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L151)

가용 스택에서 빈 UBO 슬롯 인덱스를 하나 할당받아 반환합니다.

#### Returns

`number`

할당된 슬롯 인덱스 (`0` 이상) 또는 슬롯 고갈 시 `-1`

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`allocateSlot`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#allocateslot)

***

***

### clear()

> **clear**(): `void`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L186)

모든 슬롯의 데이터를 초기화하고 전체 슬롯을 미할당 상태로 되돌립니다.

#### Returns

`void`

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`clear`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#clear)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:203](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L203)

슬롯 풀의 GPU 버퍼를 파기하고 내부 상태를 초기화합니다.

#### Returns

`void`

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#destroy)

***

***

### freeSlot()

> **freeSlot**(`slot`): `void`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:168](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L168)

사용이 끝난 UBO 슬롯의 데이터를 0으로 초기화하고 가용 스택에 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slot` | `number` | 반환할 슬롯 인덱스 |

#### Returns

`void`

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`freeSlot`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#freeslot)

***

***

### uploadSlotBytes()

> **uploadSlotBytes**(`slot`, `byteLength`): `void`

Defined in: [src/landscape/core/scatter/AScatterSlotPooler.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterSlotPooler.ts#L223)

지정된 슬롯의 CPU 버퍼 데이터를 GPU 유니폼 버퍼의 해당 오프셋 위치로 업로드합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slot` | `number` | 업로드할 대상 슬롯 인덱스 |
| `byteLength` | `number` | 복사할 바이트 길이 |

#### Returns

`void`

#### Inherited from

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`uploadSlotBytes`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#uploadslotbytes)

***

</details>
