[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageSlotPooler

# Class: FoliageSlotPooler

Defined in: [src/landscape/foliage/core/buffer/FoliageSlotPooler.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageSlotPooler.ts#L18)

식생(Foliage) 렌더 유닛별 동적 유니폼 슬롯 할당 및 데이터를 관리하는 풀러 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md)

## Constructors



***

### Constructor

> **new FoliageSlotPooler**(`redGPUContext`): `FoliageSlotPooler`

Defined in: [src/landscape/foliage/core/buffer/FoliageSlotPooler.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageSlotPooler.ts#L27)

`FoliageSlotPooler` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |

#### Returns

`FoliageSlotPooler`

#### Overrides

[`AScatterSlotPooler`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterSlotPooler.md#constructor)

## Landscape



## Other



***

### flushSlotBytes()

> **flushSlotBytes**(`slot`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageSlotPooler.ts:207](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageSlotPooler.ts#L207)

지정된 슬롯의 CPU 버퍼 데이터를 GPU 메가 유니폼 버퍼에 업로드합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slot` | `number` | 업로드할 대상 슬롯 인덱스 |

#### Returns

`void`

***

***

### updateGroundBlendParams()

> **updateGroundBlendParams**(`slot`, `strength`, `range`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageSlotPooler.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageSlotPooler.ts#L186)

지정된 슬롯의 CPU 버퍼에 지형 블렌딩 파라미터를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slot` | `number` | 대상 슬롯 인덱스 |
| `strength` | `number` | 지형 블렌딩 강도 |
| `range` | `number` | 지형 블렌딩 적용 높이 범위 |

#### Returns

`void`

***

***

### updateReceiveShadow()

> **updateReceiveShadow**(`slot`, `receiveShadow`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageSlotPooler.ts:224](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageSlotPooler.ts#L224)

지정된 슬롯의 그림자 수신 여부를 갱신하고 즉시 GPU 버퍼에 업로드합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slot` | `number` | 대상 슬롯 인덱스 |
| `receiveShadow` | `boolean` | 그림자 수신 여부 |

#### Returns

`void`

***

***

### updateWindParams()

> **updateWindParams**(`slot`, `trunkBendScale`, `leafFlutterScale`, `foliageHeight`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageSlotPooler.ts:157](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageSlotPooler.ts#L157)

지정된 슬롯의 CPU 버퍼에 바람 관련 파라미터를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slot` | `number` | 대상 슬롯 인덱스 |
| `trunkBendScale` | `number` | 줄기 굽힘 배율 |
| `leafFlutterScale` | `number` | 잎사귀 흔들림 배율 |
| `foliageHeight` | `number` | 식생 기준 높이 |

#### Returns

`void`

***

***

### writePBRRenderUnitSlot()

> **writePBRRenderUnitSlot**(`slot`, `globalSlot`, `receiveShadow`, `isMasked`, `applyGroundBlend`, `groundBlendStrength?`, `groundBlendRange?`, `trunkBendScale?`, `foliageHeight?`, `leafFlutterScale?`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageSlotPooler.ts:71](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageSlotPooler.ts#L71)

PBR 식생 렌더 유닛 슬롯의 전체 유니폼 파라미터를 기록하고 GPU 버퍼에 업로드합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `slot` | `number` | `undefined` | 대상 슬롯 인덱스 |
| `globalSlot` | `number` | `undefined` | 전역 프래그먼트 머티리얼 슬롯 인덱스 |
| `receiveShadow` | `boolean` | `undefined` | 그림자 수신 여부 |
| `isMasked` | `boolean` | `undefined` | 알파 마스크(컷오프) 적용 여부 |
| `applyGroundBlend` | `boolean` | `undefined` | 지형 표면 블렌딩 적용 여부 |
| `groundBlendStrength?` | `number` | `0.8` | 지형 블렌딩 강도 (기본값: `0.8`) |
| `groundBlendRange?` | `number` | `1.5` | 지형 블렌딩 적용 높이 범위 (기본값: `1.5`) |
| `trunkBendScale?` | `number` | `1.0` | 바람에 의한 줄기 굽힘 배율 (기본값: `1.0`) |
| `foliageHeight?` | `number` | `5.0` | 식생 기준 높이 (기본값: `5.0`) |
| `leafFlutterScale?` | `number` | `1.0` | 바람에 의한 잎사귀 흔들림 배율 (기본값: `1.0`) |

#### Returns

`void`

***

***

### writeShadowRenderUnitSlot()

> **writeShadowRenderUnitSlot**(`slot`, `trunkBendScale?`, `foliageHeight?`, `leafFlutterScale?`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageSlotPooler.ts:117](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageSlotPooler.ts#L117)

그림자 패스 전용 식생 렌더 유닛 슬롯의 유니폼 파라미터를 기록하고 GPU 버퍼에 업로드합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `slot` | `number` | `undefined` | 대상 슬롯 인덱스 |
| `trunkBendScale?` | `number` | `1.0` | 바람에 의한 줄기 굽힘 배율 (기본값: `1.0`) |
| `foliageHeight?` | `number` | `5.0` | 식생 기준 높이 (기본값: `5.0`) |
| `leafFlutterScale?` | `number` | `1.0` | 바람에 의한 잎사귀 흔들림 배율 (기본값: `1.0`) |

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
