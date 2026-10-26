[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Grass](../../../README.md) / [Core](../README.md) / GrassMegaBuffer

# Class: GrassMegaBuffer

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L45)

잔디 인스턴스 원본 버퍼, 컬링 결과 버퍼, 간접 드로우 인자 버퍼를 통합 관리하는 시스템 내부 메가 버퍼 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md)

## Constructors



***

### Constructor

> **new GrassMegaBuffer**(`redGPUContext`, `initialCapacity?`, `maxTypes?`): `GrassMegaBuffer`

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L65)

`GrassMegaBuffer` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` 인스턴스 |
| `initialCapacity?` | `number` | `131072` | 초기 최대 인스턴스 수용량 (기본값: `131072`) |
| `maxTypes?` | `number` | `64` | 지원할 최대 잔디 타입 수 (기본값: `64`) |

#### Returns

`GrassMegaBuffer`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#constructor)

## Accessors



***

### isReady

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isReady**(): `boolean`

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L99)

메가 버퍼 및 컬링 결과 버퍼가 모두 준비되었는지 여부를 반환합니다.

##### Returns

`boolean`

준비 완료 여부

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`isReady`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#isready)

***

## Methods



***

### allocateType()

> **allocateType**(`typeId`, `maxInstances`, `renderUnits`): `GrassTypeAllocation`

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L120)

특정 잔디 타입을 위한 메가 버퍼 세그먼트와 근거리/원거리 간접 드로우 슬롯을 할당합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeId` | `number` | 잔디 타입 고유 식별자 |
| `maxInstances` | `number` | 할당할 최대 인스턴스 수 |
| `renderUnits` | `object`[] | 서브메시 렌더 유닛의 인덱스 수 및 시작 인덱스 배열 |

#### Returns

`GrassTypeAllocation`

할당된 잔디 타입 세그먼트 정보(`GrassTypeAllocation`)

***

***

### freeType()

> **freeType**(`typeId`): `void`

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L184)

지정된 잔디 타입의 할당 정보와 타입 파라미터 버퍼 데이터를 해제 및 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeId` | `number` | 해제할 잔디 타입 고유 식별자 |

#### Returns

`void`

***

***

### getAllocation()

> **getAllocation**(`typeId`): `GrassTypeAllocation`

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L221)

지정된 잔디 타입 ID의 할당 정보를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeId` | `number` | 조회할 잔디 타입 고유 식별자 |

#### Returns

`GrassTypeAllocation`

할당 정보 객체(`GrassTypeAllocation`) 또는 미할당 시 `undefined`

***

***

### getOrCreateUnifiedCullingBindGroup()

> **getOrCreateUnifiedCullingBindGroup**(`bindGroupLayout`, `globalUniformBuffer`): `GPUBindGroup`

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:326](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L326)

통합 컬링 컴퓨트 패스용 바인드 그룹을 반환하거나 새로 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `bindGroupLayout` | `GPUBindGroupLayout` | 컬링 파이프라인 바인드 그룹 레이아웃 |
| `globalUniformBuffer` | `GPUBuffer` | 컬링 글로벌 유니폼 GPU 버퍼 |

#### Returns

`GPUBindGroup`

생성된 `GPUBindGroup` 또는 버퍼 미준비 시 `null`

***

***

### invalidateUnifiedCullingBindGroup()

> **invalidateUnifiedCullingBindGroup**(): `void`

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:306](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L306)

캐싱된 통합 컬링 바인드 그룹을 무효화합니다.

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`invalidateUnifiedCullingBindGroup`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#invalidateunifiedcullingbindgroup)

***

***

### onDestroy()

> **onDestroy**(): `void`

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:397](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L397)

메가 버퍼 파기 시 바인드 그룹 캐시와 할당 맵을 정리합니다.

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onDestroy`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#ondestroy)

***

***

### onResizeBuffers()

> **onResizeBuffers**(`newCapacity`): `void`

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:376](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L376)

메가 버퍼 용량 확장 시 컬링 결과 GPU 버퍼를 새 용량에 맞춰 재생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newCapacity` | `number` | 변경된 최대 인스턴스 수용량 |

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onResizeBuffers`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#onresizebuffers)

***

***

### updateTypeParams()

> **updateTypeParams**(`typeId`, `grass`, `alloc`): `void`

Defined in: [src/landscape/grass/core/buffer/GrassMegaBuffer.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/buffer/GrassMegaBuffer.ts#L239)

특정 잔디 타입의 컬링 거리 및 오프셋 파라미터를 GPU 버퍼에 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `typeId` | `number` | 잔디 타입 고유 식별자 |
| `grass` | [`Grass`](../../../classes/Grass.md) | 잔디(`Grass`) 타입 인스턴스 |
| `alloc` | `GrassTypeAllocation` | 해당 잔디 타입의 할당 정보 |

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#antialiasingmanager)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#commandencodermanager)

***

***

### cpuTypeParamsBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuTypeParamsBuffer**(): `Float32Array`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L261)

CPU 측 타입 파라미터 `Float32Array` 버퍼를 반환합니다.

##### Returns

`Float32Array`

CPU 타입 파라미터 `Float32Array` 버퍼

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`cpuTypeParamsBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#cputypeparamsbuffer)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`cpuTypeParamsUint32`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#cputypeparamsuint32)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`culledGPUBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#culledgpubuffer)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#gpudevice)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`indirectGPUBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#indirectgpubuffer)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`instanceCapacity`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#instancecapacity)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`instanceId`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#instanceid)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`maxRenderUnits`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#maxrenderunits)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`maxTypes`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#maxtypes)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#name)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onRecreated`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#onrecreated)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`rawGPUBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#rawgpubuffer)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`redGPUContext`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#redgpucontext)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`resourceManager`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#resourcemanager)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`strideBytes`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#stridebytes)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`totalAllocatedInstances`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#totalallocatedinstances)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`totalIndirectDrawCalls`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#totalindirectdrawcalls)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`typeParamFloats`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#typeparamfloats)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`typeParamsGPUBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#typeparamsgpubuffer)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`uuid`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#uuid)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### allocateBaseSegment()

> **allocateBaseSegment**(`typeIdOrName`, `maxInstances`, `renderUnitCount`, `culledMultiplier?`): [`ScatterBaseSegmentAllocation`](../../../../Core/namespaces/Scatter/interfaces/ScatterBaseSegmentAllocation.md)

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

[`ScatterBaseSegmentAllocation`](../../../../Core/namespaces/Scatter/interfaces/ScatterBaseSegmentAllocation.md)

할당된 세그먼트 오프셋 및 용량 정보 (`ScatterBaseSegmentAllocation`)

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`allocateBaseSegment`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#allocatebasesegment)

***

***

### clearBaseAllocations()

> **clearBaseAllocations**(): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:581](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L581)

할당된 원시/컬링 인스턴스 카운터 및 인다이렉트 드로우 카운터를 `0`으로 초기화합니다.

#### Returns

`void`

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`clearBaseAllocations`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#clearbaseallocations)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:643](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterMegaBuffer.ts#L643)

메가 버퍼가 보유한 모든 기본 및 파생 GPU 버퍼들을 파기합니다.

#### Returns

`void`

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#destroy)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`ensureCapacity`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#ensurecapacity)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onResetMultiIndirectCommands`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#onresetmultiindirectcommands)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`registerIndirectDrawSlot`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#registerindirectdrawslot)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`resetMultiIndirectCommands`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#resetmultiindirectcommands)

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

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`syncIndirectResetTemplateToGPU`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#syncindirectresettemplatetogpu)

***

</details>
