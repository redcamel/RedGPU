[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Grass](../README.md) / Grass

# Class: Grass

Defined in: [src/landscape/grass/core/Grass.ts:110](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L110)

지형(`Landscape`) 위에 대규모로 배치되는 단일 잔디(Grass) 타입의 지오메트리, 셰이딩 속성 및 베이킹 파라미터를 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// 밀도 및 컬링 거리를 지정하여 잔디 타입 추가
const grass = landscape.grassManager.addType({
    name: 'MeadowGrass',
    mesh: grassMesh,
    densityPerHectare: 50000,
    cullingDistance: 80
});
```

## See

[Foliage and Impostors example](https://redcamel.github.io/RedGPU/examples/3d/landscape/foliageAndImpostors/)

## Extends

- [`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md)\<`GrassTypeAllocation`\>

## Constructors



***

### Constructor

> **new Grass**(`redGPUContext`, `options`): `Grass`

Defined in: [src/landscape/grass/core/Grass.ts:144](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L144)

`Grass` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |
| `options` | [`GrassOptions`](../interfaces/GrassOptions.md) | 잔디 타입 초기화 옵션 |

#### Returns

`Grass`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`constructor`](../../Core/namespaces/Scatter/classes/AScatterType.md#constructor)

## Accessors



***

### activeInstanceCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeInstanceCount**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:630](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L630)

현재 베이킹되어 활성화된 총 잔디 인스턴스 수를 반환합니다.

##### Returns

`number`

활성 인스턴스 수

***

***

### alphaCutoff

#### Get Signature

> **get** **alphaCutoff**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:440](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L440)

알파 컷오프 임계값(`0.01` ~ `1.0`)을 반환하거나 설정합니다.

##### Returns

`number`

알파 컷오프 값

#### Set Signature

> **set** **alphaCutoff**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:425](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L425)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

***

### bakeRadius

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bakeRadius**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:607](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L607)

카메라 주변 잔디 인스턴스가 베이킹되는 반경(미터 단위)을 반환합니다.

##### Returns

`number`

베이킹 반경 (미터)

***

***

### baseColorTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **baseColorTexture**(): [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/grass/core/Grass.ts:318](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L318)

잔디의 베이스 컬러 `BitmapTexture`를 반환합니다.

##### Returns

[`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

`BitmapTexture` 인스턴스

***

***

### baseColorTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **baseColorTextureView**(): `GPUTextureView`

Defined in: [src/landscape/grass/core/Grass.ts:329](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L329)

잔디 베이스 컬러 텍스처의 `GPUTextureView`를 반환합니다.

##### Returns

`GPUTextureView`

`GPUTextureView` 인스턴스

***

***

### exposureBoost

#### Get Signature

> **get** **exposureBoost**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:421](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L421)

밝기 노출 부스트 배율을 반환하거나 설정합니다.

##### Returns

`number`

노출 부스트 배율

#### Set Signature

> **set** **exposureBoost**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:395](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L395)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

***

### farDistance

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **farDistance**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:307](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L307)

근거리(Near)와 원거리(Far) 잔디 버킷이 분리되는 기준 거리(미터 단위)를 반환합니다.

##### Returns

`number`

근/원거리 분리 기준 거리 (미터)

***

***

### geometry

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **geometry**(): [`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

Defined in: [src/landscape/grass/core/Grass.ts:274](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L274)

어셈블리되어 통합된 잔디 `Geometry` 또는 `Primitive` 인스턴스를 반환합니다.

##### Returns

[`Geometry`](../../../../../classes/Geometry.md) \| [`Primitive`](../../../../Primitive/namespaces/Core/classes/Primitive.md)

`Geometry` 또는 `Primitive` 인스턴스

***

***

### instancesPerCell

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instancesPerCell**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:343](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L343)

잔디 그리드 셀(Cell) 하나당 생성되는 인스턴스 개수를 반환합니다.

##### Returns

`number`

셀당 인스턴스 개수

***

***

### maxInstances

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxInstances**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:619](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L619)

이 잔디 타입에 할당된 최대 인스턴스 수용량을 반환합니다.

##### Returns

`number`

최대 인스턴스 수 또는 미할당 시 `undefined`

***

***

### maxScale

#### Get Signature

> **get** **maxScale**(): \[`number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:391](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L391)

인스턴스 랜덤 스케일의 최댓값 `[width, height]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`\]

최대 스케일 튜플 `[width, height]`

#### Set Signature

> **set** **maxScale**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:371](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L371)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`\] \| \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### mesh

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mesh**(): [`Mesh`](../../../../Display/classes/Mesh.md)

Defined in: [src/landscape/grass/core/Grass.ts:285](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L285)

잔디 생성에 사용된 원본 `Mesh` 인스턴스를 반환합니다.

##### Returns

[`Mesh`](../../../../Display/classes/Mesh.md)

원본 `Mesh` 인스턴스

***

***

### minScale

#### Get Signature

> **get** **minScale**(): \[`number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:367](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L367)

인스턴스 랜덤 스케일의 최솟값 `[width, height]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`\]

최소 스케일 튜플 `[width, height]`

#### Set Signature

> **set** **minScale**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:347](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L347)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`\] \| \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### minY

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **minY**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:410](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L410)

메시 로컬 바운딩의 최소 Y 오프셋을 반환합니다.

##### Returns

`number`

최소 Y 오프셋

***

***

### onRepopulateRequired

#### Set Signature

> **set** **onRepopulateRequired**(`cb`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:596](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L596)

인스턴스 리베이크(재배치)가 필요할 때 호출될 콜백 함수를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cb` | (`typeId`) => `void` | 타입 ID를 인자로 받는 콜백 함수 또는 `null` |

##### Returns

`void`

***

***

### onUniformDirty

#### Set Signature

> **set** **onUniformDirty**(`cb`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:584](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L584)

유니폼 파라미터 변경 시 호출될 콜백 함수를 설정합니다.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `cb` | (`typeId`) => `void` | 타입 ID를 인자로 받는 콜백 함수 또는 `null` |

##### Returns

`void`

***

***

### receiveShadow

#### Get Signature

> **get** **receiveShadow**(): `boolean`

Defined in: [src/landscape/grass/core/Grass.ts:523](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L523)

잔디 표면의 그림자 수신 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

그림자 수신 여부

#### Set Signature

> **set** **receiveShadow**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:508](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L508)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `boolean` |

##### Returns

`void`

***

***

### renderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderUnits**(): [`ScatterRenderUnit`](../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md)[]

Defined in: [src/landscape/grass/core/Grass.ts:296](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L296)

잔디 렌더링에 사용되는 `ScatterRenderUnit` 배열을 반환합니다.

##### Returns

[`ScatterRenderUnit`](../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md)[]

`ScatterRenderUnit` 배열

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`renderUnits`](../../Core/namespaces/Scatter/classes/AScatterType.md#renderunits)

***

***

### roughness

#### Get Signature

> **get** **roughness**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:459](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L459)

표면 거칠기(Roughness) 계수(`0.04` ~ `1.0`)를 반환하거나 설정합니다.

##### Returns

`number`

거칠기 계수

#### Set Signature

> **set** **roughness**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:444](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L444)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

***

### shadowCullDistance

#### Get Signature

> **get** **shadowCullDistance**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:553](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L553)

잔디 그림자가 렌더링되는 최대 컬링 거리를 반환합니다 (`farDistance`로부터 자동 파생).

##### Returns

`number`

그림자 컬링 거리 (미터)

#### Set Signature

> **set** **shadowCullDistance**(`_val`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:557](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L557)

그림자 패스 인스턴스 컬링 거리를 반환하거나 설정합니다 (`0` 이상).

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `_val` | `number` |

##### Returns

`void`

그림자 패스 컬링 거리

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`shadowCullDistance`](../../Core/namespaces/Scatter/classes/AScatterType.md#shadowculldistance)

***

***

### shadowFadeStartDistance

#### Get Signature

> **get** **shadowFadeStartDistance**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:568](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L568)

잔디 그림자 페이드아웃이 시작되는 거리를 반환합니다 (`shadowCullDistance * 0.5`).

##### Returns

`number`

그림자 페이드 시작 거리 (미터)

#### Set Signature

> **set** **shadowFadeStartDistance**(`_val`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:572](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L572)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `_val` | `number` |

##### Returns

`void`

***

***

### shadowStrength

#### Get Signature

> **get** **shadowStrength**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:542](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L542)

수신된 그림자의 어두움 강도(`0.0` ~ `1.0`)를 반환하거나 설정합니다.

##### Returns

`number`

그림자 강도

#### Set Signature

> **set** **shadowStrength**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:527](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L527)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

***

### slotIndex

#### Get Signature

> **get** **slotIndex**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:641](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L641)

`GrassSlotPooler`에서 할당된 UBO 슬롯 인덱스를 반환하거나 설정합니다.

##### Returns

`number`

할당된 슬롯 인덱스 (미할당 시 `-1`)

#### Set Signature

> **set** **slotIndex**(`val`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:718](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L718)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### subsurfaceColor

#### Get Signature

> **get** **subsurfaceColor**(): \[`number`, `number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:504](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L504)

서브서피스 스캐터링 RGB 색상 `[r, g, b]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`, `number`\]

서브서피스 RGB 색상 튜플 `[r, g, b]`

#### Set Signature

> **set** **subsurfaceColor**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:482](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L482)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### subsurfaceStrength

#### Get Signature

> **get** **subsurfaceStrength**(): `number`

Defined in: [src/landscape/grass/core/Grass.ts:478](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L478)

서브서피스 스캐터링(Subsurface Scattering) 투과 강도(`0.0` ~ `3.0`)를 반환하거나 설정합니다.

##### Returns

`number`

서브서피스 투과 강도

#### Set Signature

> **set** **subsurfaceStrength**(`v`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:463](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L463)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

## Methods



***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/grass/core/Grass.ts:703](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L703)

잔디 타입이 소유한 통합 지오메트리 및 관련 리소스를 해제합니다.

#### Returns

`void`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`destroy`](../../Core/namespaces/Scatter/classes/AScatterType.md#destroy)

***

***

### onParameterChanged()

> **onParameterChanged**(`prop`): `void`

Defined in: [src/landscape/grass/core/Grass.ts:653](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/grass/core/Grass.ts#L653)

스캐터 또는 재질 속성이 변경되었을 때 호출되어 리베이크 또는 UBO 갱신을 트리거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prop` | `string` | 변경된 속성 이름 |

#### Returns

`void`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`onParameterChanged`](../../Core/namespaces/Scatter/classes/AScatterType.md#onparameterchanged)

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### allocation

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **allocation**(): `TAllocation`

Defined in: [src/landscape/core/scatter/AScatterType.ts:211](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L211)

메가 버퍼에서 이 타입에 할당된 세그먼트 정보(`TAllocation | null`)를 반환합니다.

##### Returns

`TAllocation`

세그먼트 할당 정보(`TAllocation`) 또는 미할당 시 `null`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`allocation`](../../Core/namespaces/Scatter/classes/AScatterType.md#allocation)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`antialiasingManager`](../../Core/namespaces/Scatter/classes/AScatterType.md#antialiasingmanager)

***

***

### bottomOffset

#### Get Signature

> **get** **bottomOffset**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:235](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L235)

지형 표면으로부터의 인스턴스 하단 높이 오프셋을 반환하거나 설정합니다.

##### Returns

`number`

하단 높이 오프셋

#### Set Signature

> **set** **bottomOffset**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:259](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L259)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`bottomOffset`](../../Core/namespaces/Scatter/classes/AScatterType.md#bottomoffset)

***

***

### castShadow

#### Get Signature

> **get** **castShadow**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:414](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L414)

디렉셔널 라이트 그림자 투사 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

그림자 투사 활성화 여부

#### Set Signature

> **set** **castShadow**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:438](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L438)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`castShadow`](../../Core/namespaces/Scatter/classes/AScatterType.md#castshadow)

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

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`commandEncoderManager`](../../Core/namespaces/Scatter/classes/AScatterType.md#commandencodermanager)

***

***

### cullingDistance

#### Get Signature

> **get** **cullingDistance**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:255](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L255)

메인 패스 인스턴스 가시 컬링 거리를 반환하거나 설정합니다 (`0` 이상).

##### Returns

`number`

메인 패스 가시 컬링 거리

#### Set Signature

> **set** **cullingDistance**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:279](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L279)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`cullingDistance`](../../Core/namespaces/Scatter/classes/AScatterType.md#cullingdistance)

***

***

### densityMultiplier

#### Get Signature

> **get** **densityMultiplier**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:394](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L394)

기준 밀도에 곱해지는 밀도 배율을 반환하거나 설정합니다 (`0.0` 이상).

##### Returns

`number`

밀도 배율

#### Set Signature

> **set** **densityMultiplier**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:418](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L418)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`densityMultiplier`](../../Core/namespaces/Scatter/classes/AScatterType.md#densitymultiplier)

***

***

### densityPerHectare

#### Get Signature

> **get** **densityPerHectare**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:374](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L374)

헥타르(10,000㎡)당 기준 인스턴스 밀도를 반환하거나 설정합니다 (`0.0` 이상).

##### Returns

`number`

헥타르당 기준 배치 밀도

#### Set Signature

> **set** **densityPerHectare**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:398](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L398)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`densityPerHectare`](../../Core/namespaces/Scatter/classes/AScatterType.md#densityperhectare)

***

***

### densityScaleByWeight

#### Get Signature

> **get** **densityScaleByWeight**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:354](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L354)

지형 레이어 가중치에 따라 인스턴스 스케일을 조절할지 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

가중치 기반 스케일 조절 여부

#### Set Signature

> **set** **densityScaleByWeight**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:378](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L378)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`densityScaleByWeight`](../../Core/namespaces/Scatter/classes/AScatterType.md#densityscalebyweight)

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

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`gpuDevice`](../../Core/namespaces/Scatter/classes/AScatterType.md#gpudevice)

***

***

### groundBlendStrength

#### Get Signature

> **get** **groundBlendStrength**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:434](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L434)

지형 표면과의 하단 블렌딩 강도(`0.0`~`1.0`)를 반환하거나 설정합니다.

##### Returns

`number`

하단 블렌딩 강도 (`0.0`~`1.0`)

#### Set Signature

> **set** **groundBlendStrength**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:461](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L461)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`groundBlendStrength`](../../Core/namespaces/Scatter/classes/AScatterType.md#groundblendstrength)

***

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L223)

스캐터 인스턴스의 기준 높이를 반환하거나 설정합니다 (`0.01` 이상).

##### Returns

`number`

인스턴스 기준 높이

#### Set Signature

> **set** **height**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:239](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L239)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`height`](../../Core/namespaces/Scatter/classes/AScatterType.md#height)

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

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`instanceId`](../../Core/namespaces/Scatter/classes/AScatterType.md#instanceid)

***

***

### maxSlope

#### Get Signature

> **get** **maxSlope**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:334](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L334)

인스턴스 배치가 허용되는 최대 지형 경사각(도, `0.0`~`90.0`)을 반환하거나 설정합니다.

##### Returns

`number`

최대 지형 경사각 (단위: 도)

#### Set Signature

> **set** **maxSlope**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:358](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L358)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`maxSlope`](../../Core/namespaces/Scatter/classes/AScatterType.md#maxslope)

***

***

### minSlope

#### Get Signature

> **get** **minSlope**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:315](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L315)

인스턴스 배치가 허용되는 최소 지형 경사각(도, `0.0`~`90.0`)을 반환하거나 설정합니다.

##### Returns

`number`

최소 지형 경사각 (단위: 도)

#### Set Signature

> **set** **minSlope**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:338](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L338)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`minSlope`](../../Core/namespaces/Scatter/classes/AScatterType.md#minslope)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/landscape/core/scatter/AScatterType.ts:166](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L166)

스캐터 타입의 고유 이름을 반환합니다. 생성 이후에는 변경할 수 없습니다.

##### Returns

`string`

스캐터 타입의 고유 이름

#### Set Signature

> **set** **name**(`_value`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L170)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `_value` | `string` |

##### Returns

`void`

객체 이름 문자열

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`name`](../../Core/namespaces/Scatter/classes/AScatterType.md#name)

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

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`redGPUContext`](../../Core/namespaces/Scatter/classes/AScatterType.md#redgpucontext)

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

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`resourceManager`](../../Core/namespaces/Scatter/classes/AScatterType.md#resourcemanager)

***

***

### targetLayer

#### Get Signature

> **get** **targetLayer**(): `string` \| `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:295](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L295)

배치 밀도 가중치를 참조할 대상 지형 레이어 이름 또는 인덱스를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

대상 레이어 이름(`string`), 인덱스(`number`) 또는 `undefined`

#### Set Signature

> **set** **targetLayer**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:319](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L319)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`targetLayer`](../../Core/namespaces/Scatter/classes/AScatterType.md#targetlayer)

***

***

### typeId

#### Get Signature

> **get** **typeId**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:182](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L182)

스캐터 타입에 할당된 고유 숫자 ID를 반환하거나 설정합니다.

##### Returns

`number`

스캐터 타입 숫자 ID

#### Set Signature

> **set** **typeId**(`value`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:186](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`typeId`](../../Core/namespaces/Scatter/classes/AScatterType.md#typeid)

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

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`uuid`](../../Core/namespaces/Scatter/classes/AScatterType.md#uuid)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### bindAllocation()

> **bindAllocation**(`allocation`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:454](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L454)

메가 버퍼 세그먼트 할당 정보를 이 스캐터 타입에 바인딩합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `allocation` | `GrassTypeAllocation` | 바인딩할 세그먼트 할당 정보 또는 `null` |

#### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`bindAllocation`](../../Core/namespaces/Scatter/classes/AScatterType.md#bindallocation)

***

***

### setRawScatterProperties()

> **setRawScatterProperties**(`values`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:477](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L477)

`onParameterChanged` 콜백을 트리거하지 않고 스캐터 속성들의 내부 원시 값을 일괄 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `values` | \{ `bottomOffset?`: `number`; `castShadow?`: `boolean`; `cullingDistance?`: `number`; `densityMultiplier?`: `number`; `densityPerHectare?`: `number`; `densityScaleByWeight?`: `boolean`; `groundBlendStrength?`: `number`; `height?`: `number`; `maxSlope?`: `number`; `minSlope?`: `number`; `shadowCullDistance?`: `number`; `targetLayer?`: `string` \| `number`; \} | 일괄 설정할 스캐터 속성 값 객체 |
| `values.bottomOffset?` | `number` | - |
| `values.castShadow?` | `boolean` | - |
| `values.cullingDistance?` | `number` | - |
| `values.densityMultiplier?` | `number` | - |
| `values.densityPerHectare?` | `number` | - |
| `values.densityScaleByWeight?` | `boolean` | - |
| `values.groundBlendStrength?` | `number` | - |
| `values.height?` | `number` | - |
| `values.maxSlope?` | `number` | - |
| `values.minSlope?` | `number` | - |
| `values.shadowCullDistance?` | `number` | - |
| `values.targetLayer?` | `string` \| `number` | - |

#### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`setRawScatterProperties`](../../Core/namespaces/Scatter/classes/AScatterType.md#setrawscatterproperties)

</details>
