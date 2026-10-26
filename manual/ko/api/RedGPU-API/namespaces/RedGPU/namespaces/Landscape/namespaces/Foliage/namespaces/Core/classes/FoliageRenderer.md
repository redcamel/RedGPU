[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageRenderer

# Class: FoliageRenderer

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:33](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L33)

GPU 인다이렉트 드로우(`drawIndexedIndirect`)와 렌더 번들(`GPURenderBundle`) 캐싱을 활용하여 대량 폴리지 인스턴스의 Depth Prepass, 메인 패스, 그림자 패스 렌더링을 수행하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md)\<`FoliageMainBundleCacheEntry`\>

## Constructors



***

### Constructor

> **new FoliageRenderer**(`redGPUContext`, `pipelineRegistry`, `renderUnitVertexBindGroupLayout?`, `renderUnitDynamicBindGroup?`): `FoliageRenderer`

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L77)

`FoliageRenderer` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |
| `pipelineRegistry` | [`FoliagePipelineRegistry`](FoliagePipelineRegistry.md) | 폴리지 파이프라인 레지스트리 |
| `renderUnitVertexBindGroupLayout?` | `GPUBindGroupLayout` | 렌더 유닛 정점 바인드 그룹 레이아웃 (선택) |
| `renderUnitDynamicBindGroup?` | `GPUBindGroup` | 공유 렌더 유닛 다이내믹 바인드 그룹 (선택) |

#### Returns

`FoliageRenderer`

#### Overrides

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#constructor)

## Accessors



## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:116](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L116)

렌더러가 보유한 캐시 및 내부 참조를 모두 정리하고 파기합니다.

#### Returns

`void`

#### Overrides

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#destroy)

***

***

### markAllBundlesDirty()

> **markAllBundlesDirty**(): `void`

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L106)

그림자, Depth Prepass, 메인 패스의 모든 캐싱된 렌더 번들을 무효화합니다.

#### Returns

`void`

#### Overrides

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`markAllBundlesDirty`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#markallbundlesdirty)

***

***

### render()

> **render**(`view`, `passEncoder`, `typeList`): `void`

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L148)

지정된 뷰와 렌더 패스 인코더에 활성화된 폴리지 타입 목록을 메인 렌더링(Depth Prepass 포함)합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../../../Display/classes/View3D.md) | 렌더링할 대상 `View3D` 인스턴스 |
| `passEncoder` | `GPURenderPassEncoder` | 대상 렌더 패스 인코더 |
| `typeList` | [`Foliage`](../../../classes/Foliage.md)[] | 렌더링할 `Foliage` 타입 배열 |

#### Returns

`void`

***

***

### renderShadow()

> **renderShadow**(`view`, `passEncoder`, `typeList`): `void`

Defined in: [src/landscape/foliage/core/renderer/FoliageRenderer.ts:258](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/renderer/FoliageRenderer.ts#L258)

방향성 조명 그림자(Directional Shadow / CSM) 패스에 폴리지 인스턴스들을 렌더링합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../../../Display/classes/View3D.md) | 렌더링할 대상 `View3D` 인스턴스 |
| `passEncoder` | `GPURenderPassEncoder` | 그림자 렌더 패스 인코더 |
| `typeList` | [`Foliage`](../../../classes/Foliage.md)[] | 렌더링할 `Foliage` 타입 배열 |

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

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`antialiasingManager`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#antialiasingmanager)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`commandEncoderManager`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#commandencodermanager)

***

***

### dynamicOffsetArray

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dynamicOffsetArray**(): `Uint32Array`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L51)

동적 유니폼 오프셋 바인딩 시 임시 배열 할당을 방지하기 위한 재사용 가능한 1요소 `Uint32Array`를 반환합니다.

##### Returns

`Uint32Array`

동적 유니폼 오프셋용 1요소 `Uint32Array`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`dynamicOffsetArray`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#dynamicoffsetarray)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`gpuDevice`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#gpudevice)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`instanceId`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#instanceid)

***

***

### mainBundlesByView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mainBundlesByView**(): `WeakMap`\<[`View3D`](../../../../../../Display/classes/View3D.md), `TMainBundleCache`\>

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L63)

`View3D`를 키로 하여 메인 렌더 번들 캐시를 관리하는 `WeakMap<View3D, TMainBundleCache>`를 반환합니다.

##### Returns

`WeakMap`\<[`View3D`](../../../../../../Display/classes/View3D.md), `TMainBundleCache`\>

뷰별 메인 렌더 번들 캐시 (`WeakMap<View3D, TMainBundleCache>`)

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`mainBundlesByView`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#mainbundlesbyview)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`name`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#name)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`redGPUContext`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#redgpucontext)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`resourceManager`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#resourcemanager)

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

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`uuid`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#uuid)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### executeSingleBundle()

> **executeSingleBundle**(`passEncoder`, `bundle`): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L78)

사전 할당된 고정 튜플 배열을 재사용하여 단일 `GPURenderBundle`을 Zero-GC로 실행합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `passEncoder` | `GPURenderPassEncoder` | 번들을 실행할 대상 렌더 패스 인코더 |
| `bundle` | `GPURenderBundle` | 실행할 `GPURenderBundle` 인스턴스 |

#### Returns

`void`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`executeSingleBundle`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#executesinglebundle)

***

***

### getShadowBundle()

> **getShadowBundle**(`cascadeIndex`): `GPURenderBundle`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:94](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L94)

지정된 그림자 캐스케이드 인덱스에 캐싱된 `GPURenderBundle`을 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | 조회할 그림자 캐스케이드 인덱스 (`0`~`3`) |

#### Returns

`GPURenderBundle`

캐싱된 `GPURenderBundle` 또는 없을 경우 `null`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`getShadowBundle`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#getshadowbundle)

***

***

### isShadowBundleValid()

> **isShadowBundleValid**(`cascadeIndex`, `systemBG`): `boolean`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:133](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L133)

지정된 그림자 캐스케이드의 렌더 번들이 현재 시스템 바인드 그룹과 일치하고 유효한지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | 확인할 그림자 캐스케이드 인덱스 (`0`~`3`) |
| `systemBG` | `GPUBindGroup` | 현재 프레임의 시스템 유니폼 바인드 그룹 |

#### Returns

`boolean`

캐싱된 그림자 번들의 유효 여부

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`isShadowBundleValid`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#isshadowbundlevalid)

***

***

### markMainBundleDirty()

> **markMainBundleDirty**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:166](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L166)

모든 뷰의 메인 패스 렌더 번들 캐시를 무효화합니다.

#### Returns

`void`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`markMainBundleDirty`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#markmainbundledirty)

***

***

### markShadowBundleDirty()

> **markShadowBundleDirty**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L146)

모든 그림자 캐스케이드 렌더 번들 캐시를 무효화하고 `onShadowBundleDirty` 훅을 호출합니다.

#### Returns

`void`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`markShadowBundleDirty`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#markshadowbundledirty)

***

***

### onShadowBundleDirty()

> **onShadowBundleDirty**(): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:159](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L159)

그림자 렌더 번들이 무효화될 때 서브클래스에서 추가 상태를 초기화하기 위한 훅 메서드입니다.

#### Returns

`void`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`onShadowBundleDirty`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#onshadowbundledirty)

***

***

### setShadowBundle()

> **setShadowBundle**(`cascadeIndex`, `bundle`, `systemBG`): `void`

Defined in: [src/landscape/core/scatter/AScatterRenderer.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterRenderer.ts#L112)

지정된 그림자 캐스케이드 인덱스에 `GPURenderBundle`과 시스템 바인드 그룹 참조를 캐싱합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cascadeIndex` | `number` | 대상 그림자 캐스케이드 인덱스 (`0`~`3`) |
| `bundle` | `GPURenderBundle` | 저장할 `GPURenderBundle` 또는 `null` |
| `systemBG` | `GPUBindGroup` | 번들 기록에 사용된 시스템 유니폼 바인드 그룹 |

#### Returns

`void`

#### Inherited from

[`AScatterRenderer`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md).[`setShadowBundle`](../../../../Core/namespaces/Scatter/classes/AScatterRenderer.md#setshadowbundle)

</details>
