[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Foliage](../README.md) / FoliageOptions

# Interface: FoliageOptions

Defined in: [src/landscape/foliage/core/Foliage.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L213)

식생(`Foliage`) 타입 생성 및 초기화를 위한 설정 옵션 인터페이스입니다.

## Extends

- [`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md)

## Properties



***

### alignFactor?

> `optional` **alignFactor?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:283](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L283)

지형 법선 정렬 반영 비율 (`0.0` ~ `1.0`, 기본값: `1.0`)

***

***

### alignToNormal?

> `optional` **alignToNormal?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:277](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L277)

지형 표면 법선(Normal) 방향으로 인스턴스 정렬 여부 (기본값: `false`)

***

***

### groundBlendRange?

> `optional` **groundBlendRange?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:289](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L289)

지형 하단 색상 블렌딩이 적용되는 높이 범위 (미터 단위, 기본값: `1.5`)

***

***

### leafFlutterScale?

> `optional` **leafFlutterScale?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:271](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L271)

바람에 의한 잎사귀 떨림 강도 배율 (기본값: `1.0`)

***

***

### lods

> **lods**: [`FoliageLODConfig`](FoliageLODConfig.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:218](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L218)

거리별 LOD 메시 구성 목록

***

***

### maxInstances?

> `optional` **maxInstances?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:229](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L229)

할당할 최대 인스턴스 수용량 (미지정 시 밀도와 반경 기반으로 자동 계산)

***

***

### maxScale?

> `optional` **maxScale?**: \[`number`, `number`, `number`\]

Defined in: [src/landscape/foliage/core/Foliage.ts:241](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L241)

인스턴스 랜덤 스케일 최댓값 `[x, y, z]` (기본값: `[1.0, 1.0, 1.0]`)

***

***

### minScale?

> `optional` **minScale?**: \[`number`, `number`, `number`\]

Defined in: [src/landscape/foliage/core/Foliage.ts:235](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L235)

인스턴스 랜덤 스케일 최솟값 `[x, y, z]` (기본값: `[1.0, 1.0, 1.0]`)

***

***

### preservePivot?

> `optional` **preservePivot?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:259](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L259)

메시 결합 시 원본 피벗(Pivot) 보존 여부

***

***

### randomRotationY?

> `optional` **randomRotationY?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:247](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L247)

Y축 기준 랜덤 회전 적용 여부 (기본값: `true`)

***

***

### receiveShadow?

> `optional` **receiveShadow?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:223](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L223)

식생 표면의 그림자 수신 여부 (기본값: `true`)

***

***

### trunkBendScale?

> `optional` **trunkBendScale?**: `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:265](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L265)

바람에 의한 줄기/기둥 흔들림 강도 배율 (기본값: `1.0`)

***

***

### useImpostor?

> `optional` **useImpostor?**: `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:253](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/Foliage.ts#L253)

원거리 옥타헤드럴 임포스터(Octahedral Impostor) LOD 자동 생성 및 사용 여부 (기본값: `true`)

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### bottomOffset?

> `optional` **bottomOffset?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L36)

지형 표면 대비 인스턴스 하단 높이 오프셋 (기본값: `0.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`bottomOffset`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#bottomoffset)

***

***

### castShadow?

> `optional` **castShadow?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L48)

디렉셔널 라이트 그림자 투사 활성화 여부 (기본값: `true`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`castShadow`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#castshadow)

***

***

### cullingDistance?

> `optional` **cullingDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L24)

카메라로부터 인스턴스가 컬링되는 최대 가시 거리 (기본값: `200.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`cullingDistance`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#cullingdistance)

***

***

### densityMultiplier?

> `optional` **densityMultiplier?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:84](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L84)

기준 밀도에 곱해지는 밀도 배율 (기본값: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityMultiplier`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densitymultiplier)

***

***

### densityPerHectare?

> `optional` **densityPerHectare?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L78)

헥타르(10,000㎡)당 기준 배치 밀도 (기본값: `1000.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityPerHectare`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densityperhectare)

***

***

### densityScaleByWeight?

> `optional` **densityScaleByWeight?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:72](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L72)

레이어 가중치에 비례하여 인스턴스 스케일을 조절할지 여부 (기본값: `true`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityScaleByWeight`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densityscalebyweight)

***

***

### groundBlendStrength?

> `optional` **groundBlendStrength?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L90)

지형 표면 색상 및 법선과의 하단 블렌딩 강도 (`0.0`~`1.0`, 기본값: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`groundBlendStrength`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#groundblendstrength)

***

***

### height?

> `optional` **height?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L42)

인스턴스의 기준 높이 (기본값: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`height`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#height)

***

***

### maxSlope?

> `optional` **maxSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L66)

인스턴스가 배치될 수 있는 최대 지형 경사각 (단위: 도, 기본값: `45.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`maxSlope`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#maxslope)

***

***

### minSlope?

> `optional` **minSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L60)

인스턴스가 배치될 수 있는 최소 지형 경사각 (단위: 도, 기본값: `0.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`minSlope`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#minslope)

***

***

### name

> **name**: `string`

Defined in: [src/landscape/core/scatter/AScatterType.ts:18](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L18)

스캐터 타입의 고유 식별 이름

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`name`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#name)

***

***

### shadowCullDistance?

> `optional` **shadowCullDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L30)

그림자 패스에서 인스턴스가 컬링되는 최대 거리 (기본값: `50.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`shadowCullDistance`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#shadowculldistance)

***

***

### targetLayer?

> `optional` **targetLayer?**: `string` \| `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:54](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/AScatterType.ts#L54)

배치 밀도를 참조할 대상 지형 레이어의 이름 또는 인덱스

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`targetLayer`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#targetlayer)

***

</details>
