[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageMegaBuffer

# Class: FoliageMegaBuffer

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:39](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L39)

모든 식생(Foliage) 타입의 원시 인스턴스, 메인/그림자 컬링 출력 버퍼, 간접 드로우 버퍼 및 컬링 유니폼을 단일 통합 버퍼 체계로 관리하는 메가 버퍼 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md)

## Constructors



***

### Constructor

> **new FoliageMegaBuffer**(`redGPUContext`, `initialCapacity?`, `maxTypes?`): `FoliageMegaBuffer`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L77)

`FoliageMegaBuffer` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` 인스턴스 |
| `initialCapacity?` | `number` | `65536` | 초기 최대 인스턴스 수용량 (기본값: `65536`) |
| `maxTypes?` | `number` | `64` | 지원할 최대 식생 타입 수 (기본값: `64`) |

#### Returns

`FoliageMegaBuffer`

#### Throws

`foliageCullWGSL`에서 `FoliageCullingUniforms` 구조체 크기를 리플렉션하지 못한 경우 Error 발생

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#constructor)

## Accessors



***

### isReady

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isReady**(): `boolean`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:152](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L152)

모든 내부 GPU 버퍼가 정상적으로 생성되어 사용 가능한 상태인지 반환합니다.

##### Returns

`boolean`

메가 버퍼 준비 완료 여부

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`isReady`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#isready)

***

***

### shadowCulledGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowCulledGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:128](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L128)

그림자 캐스케이드용 컬링 결과 인스턴스 GPU 버퍼를 반환합니다.

##### Returns

`GPUBuffer`

그림자 컬링 인스턴스 `GPUBuffer` 또는 `null`

***

***

### shadowIndirectGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowIndirectGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:140](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L140)

그림자 캐스케이드용 간접 드로우(Indirect Draw) GPU 버퍼를 반환합니다.

##### Returns

`GPUBuffer`

그림자 간접 드로우 `GPUBuffer` 또는 `null`

***

## Methods



***

### allocateType()

> **allocateType**(`name`, `maxInstances`, `renderUnits`, `shadowMergedRenderUnits?`, `lodInfoList?`): `FoliageTypeAllocation`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:182](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L182)

새로운 식생 타입을 위한 인스턴스 세그먼트 및 간접 드로우 슬롯을 할당합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `string` | 식생 타입 고유 이름 |
| `maxInstances` | `number` | 할당할 최대 인스턴스 수 |
| `renderUnits` | [`FoliageRenderUnit`](FoliageRenderUnit.md)[] | 메인 패스용 렌더 유닛 목록 |
| `shadowMergedRenderUnits?` | [`FoliageRenderUnit`](FoliageRenderUnit.md)[] | 그림자 패스 전용 병합 렌더 유닛 목록 (선택) |
| `lodInfoList?` | [`FoliageLODInfo`](../interfaces/FoliageLODInfo.md)[] | LOD 단계별 메타데이터 목록 (선택) |

#### Returns

`FoliageTypeAllocation`

할당된 식생 타입 세그먼트 정보(`FoliageTypeAllocation`)

#### Throws

최대 지원 식생 타입 수(`maxTypes`)를 초과할 경우 Error 발생

***

***

### getOrCreateUnifiedCullingBindGroup()

> **getOrCreateUnifiedCullingBindGroup**(`layout`, `hzbTextureView?`, `hzbSampler?`): `GPUBindGroup`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:499](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L499)

통합 식생 컬링 컴퓨트 패스를 위한 `GPUBindGroup`을 조회하거나 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `layout` | `GPUBindGroupLayout` | 컬링 파이프라인의 `GPUBindGroupLayout` |
| `hzbTextureView?` | `GPUTextureView` | 계층적 Z-버퍼(HZB) 텍스처 뷰 (선택) |
| `hzbSampler?` | `GPUSampler` | HZB 샘플러 (선택) |

#### Returns

`GPUBindGroup`

생성 또는 캐시된 `GPUBindGroup` 인스턴스 (버퍼 미준비 시 `null`)

***

***

### invalidateUnifiedCullingBindGroup()

> **invalidateUnifiedCullingBindGroup**(): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:556](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L556)

캐싱된 통합 컬링 바인드 그룹을 무효화합니다.

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`invalidateUnifiedCullingBindGroup`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#invalidateunifiedcullingbindgroup)

***

***

### onDestroy()

> **onDestroy**(): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:669](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L669)

메가 버퍼가 파괴될 때 그림자 및 글로벌 유니폼 관련 GPU 리소스를 정리합니다.

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onDestroy`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#ondestroy)

***

***

### onResetMultiIndirectCommands()

> **onResetMultiIndirectCommands**(`commandEncoder`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:693](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L693)

그림자 간접 드로우 버퍼를 리셋 템플릿 버퍼로부터 복사하여 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `commandEncoder` | `GPUCommandEncoder` | 복사에 사용할 `GPUCommandEncoder` 인스턴스 (`null`인 경우 큐 직접 쓰기 수행) |

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onResetMultiIndirectCommands`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#onresetmultiindirectcommands)

***

***

### onResizeBuffers()

> **onResizeBuffers**(`newCapacity`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:631](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L631)

메가 버퍼 수용량이 확장될 때 메인 및 그림자 컬링 출력 GPU 버퍼를 재할당합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `newCapacity` | `number` | 확장된 새 인스턴스 수용량 |

#### Returns

`void`

#### Overrides

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`onResizeBuffers`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#onresizebuffers)

***

***

### updateTypeParams()

> **updateTypeParams**(`allocation`, `cullingDistance`, `fadeStartDistance`, `boundingRadius`, `bottomOffset`, `lodInfoList`, `shadowCullDistance?`, `height?`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:399](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L399)

특정 식생 타입의 컬링 거리, 페이드 구간, 바운딩 치수 및 LOD 전환 거리 정보를 타입 파라미터 버퍼에 기록합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `allocation` | `FoliageTypeAllocation` | `undefined` | 대상 식생 타입 세그먼트 할당 정보 |
| `cullingDistance` | `number` | `undefined` | 최대 컬링 거리(월드 단위) |
| `fadeStartDistance` | `number` | `undefined` | 디더링 페이드 아웃 시작 거리(월드 단위) |
| `boundingRadius` | `number` | `undefined` | 바운딩 스피어 반경(월드 단위) |
| `bottomOffset` | `number` | `undefined` | 하단 수직 오프셋(월드 단위) |
| `lodInfoList` | [`FoliageLODInfo`](../interfaces/FoliageLODInfo.md)[] | `undefined` | LOD 단계별 메타데이터 배열 |
| `shadowCullDistance?` | `number` | `300.0` | 그림자 최대 컬링 거리 (기본값: `300.0`) |
| `height?` | `number` | `2.0` | 식생 기준 높이 (기본값: `2.0`) |

#### Returns

`void`

***

***

### updateUnifiedGlobalUniforms()

> **updateUnifiedGlobalUniforms**(`renderViewStateData`, `fovFactor`, `viewProjectionMatrix?`, `depthBias?`): `void`

Defined in: [src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts:263](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/buffer/FoliageMegaBuffer.ts#L263)

카메라 위치, 절두체 평면, 그림자 캐스케이드 정보 및 타입별 인스턴스 수를 통합 글로벌 유니폼 버퍼에 업데이트합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `renderViewStateData` | [`RenderViewStateData`](../../../../../../Display/namespaces/CoreView/classes/RenderViewStateData.md) | `undefined` | 현재 프레임의 렌더 뷰 상태 데이터 |
| `fovFactor` | `number` | `undefined` | 카메라 시야각 탄젠트 계수(`tan(fov * 0.5)`) |
| `viewProjectionMatrix?` | [`mat4`](../../../../../../Math/type-aliases/mat4.md) | `null` | 뷰-프로젝션 결합 행렬(`mat4` 또는 `null`) |
| `depthBias?` | `number` | `0.002` | HZB 오클루전 테스트 깊이 바이어스 (기본값: `0.002`) |

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#antialiasingmanager)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#commandencodermanager)

***

***

### cpuTypeParamsBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cpuTypeParamsBuffer**(): `Float32Array`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:261](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L261)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:273](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L273)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:309](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L309)

메인 패스 컬링 결과 인스턴스 데이터를 보관하는 GPU 버퍼를 반환하거나 설정합니다.

##### Returns

`GPUBuffer`

컬링된 인스턴스 `GPUBuffer` 또는 미할당 시 `null`

#### Set Signature

> **set** **culledGPUBuffer**(`buffer`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:313](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L313)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `buffer` | `GPUBuffer` |

##### Returns

`void`

#### Inherited from

[`GrassMegaBuffer`](../../../../Grass/namespaces/Core/classes/GrassMegaBuffer.md).[`culledGPUBuffer`](../../../../Grass/namespaces/Core/classes/GrassMegaBuffer.md#culledgpubuffer)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#gpudevice)

***

***

### indirectGPUBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indirectGPUBuffer**(): `GPUBuffer`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:325](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L325)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:249](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L249)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:225](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L225)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:237](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L237)

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

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#name)

***

***

### onRecreated

#### Get Signature

> **get** **onRecreated**(): () => `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:349](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L349)

용량 확장으로 인해 GPU 버퍼가 재생성되었을 때 호출되는 콜백 함수를 반환하거나 설정합니다.

##### Returns

재생성 콜백 함수(`(() => void)`) 또는 `null`

() => `void`

#### Set Signature

> **set** **onRecreated**(`cb`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:353](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L353)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:297](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L297)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:201](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L201)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:365](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L365)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:377](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L377)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L213)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:337](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L337)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:401](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L401)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:581](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L581)

할당된 원시/컬링 인스턴스 카운터 및 인다이렉트 드로우 카운터를 `0`으로 초기화합니다.

#### Returns

`void`

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`clearBaseAllocations`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#clearbaseallocations)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:643](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L643)

메가 버퍼가 보유한 모든 기본 및 파생 GPU 버퍼들을 파기합니다.

#### Returns

`void`

#### Inherited from

[`AScatterMegaBuffer`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterMegaBuffer.md#destroy)

***

***

### ensureCapacity()

> **ensureCapacity**(`requiredCapacity`): `boolean`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:598](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L598)

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

### registerIndirectDrawSlot()

> **registerIndirectDrawSlot**(`slotIndex`, `indexCount`, `firstIndex?`, `baseVertex?`, `firstInstance?`): `void`

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:453](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L453)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:539](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L539)

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

Defined in: [src/landscape/core/scatter/AScatterMegaBuffer.ts:480](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterMegaBuffer.ts#L480)

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
