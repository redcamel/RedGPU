[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / AScatterMegaBuffer

# Abstract Class: AScatterMegaBuffer

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L104)

스캐터 시스템의 원시 인스턴스 버퍼, 컬링 결과 버퍼, 타입 파라미터 버퍼 및 인다이렉트 드로우 버퍼를 통합 관리하는 추상 메가 버퍼 클래스입니다.

::: warning
이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`FoliageMegaBuffer`](../../../../Foliage/namespaces/Core/classes/FoliageMegaBuffer.md)
- [`GrassMegaBuffer`](../../../../Grass/namespaces/Core/classes/GrassMegaBuffer.md)

## Constructors



***

### Constructor

> **new AScatterMegaBuffer**(`redGPUContext`, `reflectionConfig`, `initialCapacity`, `maxTypes`, `maxRenderUnits`): `AScatterMegaBuffer`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:151](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L151)

`AScatterMegaBuffer` 인스턴스를 초기화하고 기본 GPU 버퍼들을 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |
| `reflectionConfig` | [`ScatterShaderReflectionConfig`](../interfaces/ScatterShaderReflectionConfig.md) | 구조체 크기 추출을 위한 셰이더 리플렉션 설정 |
| `initialCapacity` | `number` | 초기 확보할 인스턴스 수용량 |
| `maxTypes` | `number` | 지원할 최대 스캐터 타입 수 |
| `maxRenderUnits` | `number` | 지원할 최대 인다이렉트 렌더 유닛 슬롯 수 |

#### Returns

`AScatterMegaBuffer`

#### Throws

셰이더 리플렉션에서 인스턴스 또는 타입 파라미터 구조체 크기를 찾지 못한 경우 `Error` 발생

#### Overrides

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### cpuTypeParamsBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuTypeParamsBuffer**(): `Float32Array`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L261)

CPU 측 타입 파라미터 `Float32Array` 버퍼를 반환합니다.

##### Returns

`Float32Array`

CPU 타입 파라미터 `Float32Array` 버퍼

***

***

### cpuTypeParamsUint32

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuTypeParamsUint32**(): `Uint32Array`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:273](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L273)

CPU 측 타입 파라미터 버퍼의 `Uint32Array` 뷰를 반환합니다.

##### Returns

`Uint32Array`

CPU 타입 파라미터 `Uint32Array` 뷰

***

***

### culledGPUBuffer

#### Get Signature

> **get** **culledGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:309](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L309)

메인 패스 컬링 결과 인스턴스 데이터를 보관하는 GPU 버퍼를 반환하거나 설정합니다.

##### Returns

`GPUBuffer`

컬링된 인스턴스 `GPUBuffer` 또는 미할당 시 `null`

#### Set Signature

> **set** **culledGPUBuffer**(`buffer`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L313)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `buffer` | `GPUBuffer` |

##### Returns

`void`

***

***

### indirectGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indirectGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:325](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L325)

메인 패스 `drawIndexedIndirect` 명령 인자들을 보관하는 GPU 버퍼를 반환합니다.

##### Returns

`GPUBuffer`

인다이렉트 드로우 `GPUBuffer` 또는 파기 시 `null`

***

***

### instanceCapacity

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceCapacity**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:249](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L249)

현재 할당된 최대 인스턴스 수용량(Capacity)을 반환합니다.

##### Returns

`number`

현재 최대 인스턴스 수용량

***

***

### isReady

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isReady**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:285](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L285)

필수 GPU 버퍼(원시 버퍼 및 인다이렉트 버퍼)가 모두 생성되어 준비되었는지 여부를 반환합니다.

##### Returns

`boolean`

버퍼 준비 완료 여부

***

***

### maxRenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxRenderUnits**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:225](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L225)

메가 버퍼가 지원하는 최대 렌더 유닛 슬롯 수를 반환합니다.

##### Returns

`number`

최대 렌더 유닛 슬롯 수

***

***

### maxTypes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxTypes**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:237](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L237)

메가 버퍼가 지원하는 최대 스캐터 타입 수를 반환합니다.

##### Returns

`number`

최대 스캐터 타입 수

***

***

### onRecreated

#### Get Signature

> **get** **onRecreated**(): () => `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:349](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L349)

용량 확장으로 인해 GPU 버퍼가 재생성되었을 때 호출되는 콜백 함수를 반환하거나 설정합니다.

##### Returns

재생성 콜백 함수(`(() => void)`) 또는 `null`

() => `void`

#### Set Signature

> **set** **onRecreated**(`cb`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:353](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L353)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `cb` | () => `void` |

##### Returns

`void`

***

***

### rawGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rawGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:297](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L297)

베이킹된 원시(Raw) 인스턴스 데이터를 보관하는 GPU 버퍼를 반환합니다.

##### Returns

`GPUBuffer`

원시 인스턴스 `GPUBuffer` 또는 파기 시 `null`

***

***

### strideBytes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **strideBytes**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L201)

단일 인스턴스 데이터의 바이트 단위 스트라이드 크기를 반환합니다.

##### Returns

`number`

인스턴스당 바이트 스트라이드

***

***

### totalAllocatedInstances

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalAllocatedInstances**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:365](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L365)

현재까지 세그먼트로 할당된 총 원시 인스턴스 수를 반환합니다.

##### Returns

`number`

할당된 총 원시 인스턴스 수

***

***

### totalIndirectDrawCalls

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **totalIndirectDrawCalls**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:377](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L377)

현재까지 할당된 총 인다이렉트 드로우콜 슬롯 수를 반환합니다.

##### Returns

`number`

할당된 총 인다이렉트 드로우콜 슬롯 수

***

***

### typeParamFloats

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **typeParamFloats**(): `number`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:213](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L213)

단일 타입 파라미터 구조체의 `Float32` 요소 개수를 반환합니다.

##### Returns

`number`

타입 파라미터당 `Float32` 요소 수

***

***

### typeParamsGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **typeParamsGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:337](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L337)

타입별 컬링 파라미터를 보관하는 GPU 버퍼를 반환합니다.

##### Returns

`GPUBuffer`

타입 파라미터 `GPUBuffer` 또는 미사용 시 `null`

***

## Methods



***

### allocateBaseSegment()

> **allocateBaseSegment**(`typeIdOrName`, `maxInstances`, `renderUnitCount`, `culledMultiplier?`): [`ScatterBaseSegmentAllocation`](../interfaces/ScatterBaseSegmentAllocation.md)

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:401](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L401)

스캐터 타입을 위한 원시/컬링/인다이렉트 버퍼 세그먼트 영역을 할당하고 할당 정보를 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `typeIdOrName` | `string` \| `number` | `undefined` | 스캐터 타입의 숫자 ID 또는 문자열 이름 |
| `maxInstances` | `number` | `undefined` | 요청할 최대 인스턴스 개수 |
| `renderUnitCount` | `number` | `undefined` | 할당할 인다이렉트 드로우 슬롯(렌더 유닛) 개수 |
| `culledMultiplier?` | `number` | `2` | 원시 인스턴스 대비 컬링 버퍼 배수 (기본값: `2`) |

#### Returns

[`ScatterBaseSegmentAllocation`](../interfaces/ScatterBaseSegmentAllocation.md)

할당된 세그먼트 오프셋 및 용량 정보 (`ScatterBaseSegmentAllocation`)

***

***

### clearBaseAllocations()

> **clearBaseAllocations**(): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:581](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L581)

할당된 원시/컬링 인스턴스 카운터 및 인다이렉트 드로우 카운터를 `0`으로 초기화합니다.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:643](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L643)

메가 버퍼가 보유한 모든 기본 및 파생 GPU 버퍼들을 파기합니다.

#### Returns

`void`

***

***

### ensureCapacity()

> **ensureCapacity**(`requiredCapacity`): `boolean`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:598](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L598)

요청된 인스턴스 수용량을 충족하도록 메가 버퍼 크기를 점검하고, 부족할 경우 GPU 버퍼를 확장 재할당합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `requiredCapacity` | `number` | 필요한 총 인스턴스 수용량 |

#### Returns

`boolean`

버퍼 확장이 실제로 수행되었는지 여부 (`true`: 재할당됨, `false`: 기존 용량 유지)

***

***

### invalidateUnifiedCullingBindGroup()

> `abstract` **invalidateUnifiedCullingBindGroup**(): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:665](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L665)

통합 컬링 바인드 그룹 캐시를 무효화합니다.

#### Returns

`void`

***

***

### onDestroy()

> `abstract` **onDestroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:681](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L681)

메가 버퍼 파기 시 서브클래스 전용 리소스를 정리하기 위한 추상 훅 메서드입니다.

#### Returns

`void`

***

***

### onResetMultiIndirectCommands()

> **onResetMultiIndirectCommands**(`commandEncoder`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:574](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L574)

`resetMultiIndirectCommands` 실행 시 서브클래스에서 추가 인다이렉트 버퍼(예: 그림자 캐스케이드 버퍼)를 리셋하기 위한 훅 메서드입니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | 전달된 `GPUCommandEncoder` 또는 `null` |

#### Returns

`void`

***

***

### onResizeBuffers()

> `abstract` **onResizeBuffers**(`newCapacity`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:675](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L675)

수용량 확장 시 서브클래스 전용 GPU 버퍼들을 재할당하기 위한 추상 훅 메서드입니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newCapacity` | `number` | 확장된 새 인스턴스 수용량 |

#### Returns

`void`

***

***

### registerIndirectDrawSlot()

> **registerIndirectDrawSlot**(`slotIndex`, `indexCount`, `firstIndex?`, `baseVertex?`, `firstInstance?`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:453](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L453)

지정된 인다이렉트 드로우 슬롯의 초기 템플릿 인자(`indexCount`, `firstIndex`, `baseVertex`, `firstInstance`)를 CPU 템플릿 버퍼에 기록합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `slotIndex` | `number` | `undefined` | 기록할 인다이렉트 슬롯 인덱스 |
| `indexCount` | `number` | `undefined` | 드로우할 인덱스 개수 |
| `firstIndex?` | `number` | `0` | 시작 인덱스 오프셋 (기본값: `0`) |
| `baseVertex?` | `number` | `0` | 정점 버퍼 기준 오프셋 (기본값: `0`) |
| `firstInstance?` | `number` | `0` | 시작 인스턴스 오프셋 (기본값: `0`) |

#### Returns

`void`

***

***

### resetMultiIndirectCommands()

> **resetMultiIndirectCommands**(`commandEncoder?`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:539](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L539)

매 프레임 컬링 패스 실행 전에 인다이렉트 드로우 버퍼의 인스턴스 카운트들을 템플릿 상태로 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder?` | `GPUCommandEncoder` | 버퍼 간 복사 명령을 기록할 `GPUCommandEncoder` (생략 시 `queue.writeBuffer` 사용) |

#### Returns

`void`

***

***

### syncIndirectResetTemplateToGPU()

> **syncIndirectResetTemplateToGPU**(`slotIndex?`, `slotCount?`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:480](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L480)

CPU 인다이렉트 리셋 템플릿 데이터를 인다이렉트 GPU 버퍼 및 템플릿 GPU 버퍼로 동기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `slotIndex?` | `number` | 부분 갱신할 시작 슬롯 인덱스 (생략 시 전체 갱신) |
| `slotCount?` | `number` | 부분 갱신할 슬롯 개수 (생략 시 전체 갱신) |

#### Returns

`void`

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../../../BaseObject/classes/RedGPUObject.md#name)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../../../BaseObject/classes/RedGPUObject.md#uuid)

</details>
