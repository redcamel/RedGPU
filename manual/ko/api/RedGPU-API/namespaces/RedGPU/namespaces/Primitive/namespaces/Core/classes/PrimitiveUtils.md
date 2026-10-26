[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / PrimitiveUtils

# Class: PrimitiveUtils

Defined in: [src/primitive/core/PrimitiveUtils.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L18)

기본 도형(Primitive)의 정점, 인덱스, 법선, 탄젠트 데이터를 생성하는 정적 유틸리티 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new PrimitiveUtils**(): `PrimitiveUtils`

#### Returns

`PrimitiveUtils`

## Methods

### calculateTangents()

> `static` **calculateTangents**(`interleaveData`, `indexData`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:1087](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L1087)

인터리브 정점 배열과 인덱스 배열로부터 정점 탄젠트(`vertexTangent`)를 계산하여 제자리에 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `interleaveData` | `number`[] | 인터리브 정점 데이터 배열 (`Array<number>`) |
| `indexData` | `number`[] | 인덱스 데이터 배열 (`Array<number>`) |

#### Returns

`void`

***

### finalize()

> `static` **finalize**(`redGPUContext`, `interleaveData`, `indexData`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L60)

인터리브 정점 데이터에 탄젠트를 계산하여 반영한 뒤 `Geometry` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `interleaveData` | `number`[] | 인터리브 정점 데이터 배열 (`Array<number>`) |
| `indexData` | `number`[] | 인덱스 데이터 배열 (`Array<number>`) |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateBoxData()

> `static` **generateBoxData**(`redGPUContext`, `width`, `height`, `depth`, `widthSegments`, `heightSegments`, `depthSegments`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L154)

직육면체(Box) 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `width` | `number` | 가로 길이 |
| `height` | `number` | 세로 길이 |
| `depth` | `number` | 깊이 길이 |
| `widthSegments` | `number` | 가로 방향 세그먼트 수 |
| `heightSegments` | `number` | 세로 방향 세그먼트 수 |
| `depthSegments` | `number` | 깊이 방향 세그먼트 수 |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateCapsuleData()

> `static` **generateCapsuleData**(`redGPUContext`, `radius`, `height`, `radialSegments`, `heightSegments`, `capSegments`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:1032](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L1032)

캡슐(Capsule) 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `radius` | `number` | 캡슐 반지름 |
| `height` | `number` | 원기둥 몸통 높이 |
| `radialSegments` | `number` | 둘레 방향 세그먼트 수 |
| `heightSegments` | `number` | 몸통 높이 방향 세그먼트 수 |
| `capSegments` | `number` | 반구 캡 세그먼트 수 |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateCircleEntryData()

> `static` **generateCircleEntryData**(`redGPUContext`, `radius`, `radialSegments`, `thetaStart`, `thetaLength`, `isRadial`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:611](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L611)

원판(Circle) 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `radius` | `number` | 원 반지름 |
| `radialSegments` | `number` | 둘레 방향 세그먼트 수 |
| `thetaStart` | `number` | 시작 각도 (라디안) |
| `thetaLength` | `number` | 원호 각도 범위 (라디안) |
| `isRadial` | `boolean` | 방사형 UV 매핑 여부 |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateConeData()

> `static` **generateConeData**(`redGPUContext`, `radius`, `height`, `radialSegments`, `heightSegments`, `capBottom`, `thetaStart`, `thetaLength`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:498](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L498)

원뿔(Cone) 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `radius` | `number` | 하단 밑면 반지름 |
| `height` | `number` | 원뿔 높이 |
| `radialSegments` | `number` | 둘레 방향 세그먼트 수 |
| `heightSegments` | `number` | 높이 방향 세그먼트 수 |
| `capBottom` | `boolean` | 하단 밑면 캡 생성 여부 |
| `thetaStart` | `number` | 시작 각도 (라디안) |
| `thetaLength` | `number` | 원호 각도 범위 (라디안) |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateCylinderData()

> `static` **generateCylinderData**(`redGPUContext`, `radiusTop`, `radiusBottom`, `height`, `radialSegments`, `heightSegments`, `capTop`, `capBottom`, `thetaStart`, `thetaLength`, `isRadialTop`, `isRadialBottom`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:446](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L446)

원기둥(Cylinder) 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `radiusTop` | `number` | 상단 반지름 |
| `radiusBottom` | `number` | 하단 반지름 |
| `height` | `number` | 원기둥 높이 |
| `radialSegments` | `number` | 둘레 방향 세그먼트 수 |
| `heightSegments` | `number` | 높이 방향 세그먼트 수 |
| `capTop` | `boolean` | 상단 캡 생성 여부 |
| `capBottom` | `boolean` | 하단 캡 생성 여부 |
| `thetaStart` | `number` | 시작 각도 (라디안) |
| `thetaLength` | `number` | 원호 각도 범위 (라디안) |
| `isRadialTop` | `boolean` | 상단 캡의 방사형 UV 매핑 여부 |
| `isRadialBottom` | `boolean` | 하단 캡의 방사형 UV 매핑 여부 |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateCylinderTorsoData()

> `static` **generateCylinderTorsoData**(`interleaveData`, `indexData`, `radiusTop`, `radiusBottom`, `height`, `radialSegments`, `heightSegments`, `thetaStart`, `thetaLength`, `center`, `uV`, `vV`, `axisVector?`, `skipIndices?`, `uvVStart?`, `uvVEnd?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:975](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L975)

원기둥 옆면(Torso) 정점 및 인덱스 데이터를 버퍼 배열에 추가합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | 인터리브 정점 데이터 배열 (`Array<number>`) |
| `indexData` | `number`[] | `undefined` | 인덱스 데이터 배열 (`Array<number>`) |
| `radiusTop` | `number` | `undefined` | 상단 반지름 |
| `radiusBottom` | `number` | `undefined` | 하단 반지름 |
| `height` | `number` | `undefined` | 몸통 높이 |
| `radialSegments` | `number` | `undefined` | 둘레 방향 세그먼트 수 |
| `heightSegments` | `number` | `undefined` | 높이 방향 세그먼트 수 |
| `thetaStart` | `number` | `undefined` | 시작 각도 (라디안) |
| `thetaLength` | `number` | `undefined` | 원호 각도 범위 (라디안) |
| `center` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | 중심 좌표 |
| `center.x` | `number` | `undefined` | - |
| `center.y` | `number` | `undefined` | - |
| `center.z` | `number` | `undefined` | - |
| `uV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | 가로(U) 기저 벡터 |
| `uV.x` | `number` | `undefined` | - |
| `uV.y` | `number` | `undefined` | - |
| `uV.z` | `number` | `undefined` | - |
| `vV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | 세로(V) 기저 벡터 |
| `vV.x` | `number` | `undefined` | - |
| `vV.y` | `number` | `undefined` | - |
| `vV.z` | `number` | `undefined` | - |
| `axisVector?` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `...` | 높이 중심축 벡터 |
| `axisVector.x` | `number` | `undefined` | - |
| `axisVector.y` | `number` | `undefined` | - |
| `axisVector.z` | `number` | `undefined` | - |
| `skipIndices?` | `boolean` | `false` | 인덱스 생성 생략 여부 (기본값: `false`) |
| `uvVStart?` | `number` | `0` | V 텍스처 좌표 시작값 (기본값: 0) |
| `uvVEnd?` | `number` | `1` | V 텍스처 좌표 종료값 (기본값: 1) |

#### Returns

`void`

***

### generateGrid()

> `static` **generateGrid**(`interleaveData`, `indexData`, `resolutionX`, `resolutionY`, `vertexCallback`, `skipIndices?`, `reverseIndices?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:91](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L91)

2D UV 그리드를 순회하며 정점 콜백을 실행하고 그리드 인덱스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | 인터리브 정점 데이터 배열 (`Array<number>`) |
| `indexData` | `number`[] | `undefined` | 인덱스 데이터 배열 (`Array<number>`) |
| `resolutionX` | `number` | `undefined` | 가로(X) 방향 분할 수 |
| `resolutionY` | `number` | `undefined` | 세로(Y) 방향 분할 수 |
| `vertexCallback` | (`u`, `v`, `ix`, `iy`) => `void` | `undefined` | 각 그리드 정점마다 호출되는 콜백 함수 |
| `skipIndices?` | `boolean` | `false` | 인덱스 생성 생략 여부 (기본값: `false`) |
| `reverseIndices?` | `boolean` | `false` | 인덱스 와인딩 순서 반전 여부 (기본값: `false`) |

#### Returns

`void`

***

### generateGridIndices()

> `static` **generateGridIndices**(`indexData`, `vertexOffset`, `gridX`, `gridY`, `gridX1`, `reverse?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:1066](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L1066)

2D 그리드 정점 오프셋과 해상도를 기반으로 삼각형 인덱스 배열을 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `indexData` | `number`[] | `undefined` | 인덱스를 추가할 대상 배열 (`Array<number>`) |
| `vertexOffset` | `number` | `undefined` | 시작 정점 인덱스 오프셋 |
| `gridX` | `number` | `undefined` | 가로 셀 개수 |
| `gridY` | `number` | `undefined` | 세로 셀 개수 |
| `gridX1` | `number` | `undefined` | 한 행당 정점 개수 (`gridX + 1`) |
| `reverse?` | `boolean` | `false` | 삼각형 와인딩 순서 반전 여부 (기본값: `false`) |

#### Returns

`void`

***

### generateGroundData()

> `static` **generateGroundData**(`redGPUContext`, `width`, `height`, `widthSegments`, `heightSegments`, `flipY`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:571](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L571)

XZ 평면 기준의 Ground 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `width` | `number` | 가로(X축) 길이 |
| `height` | `number` | 세로(Z축) 길이 |
| `widthSegments` | `number` | 가로 방향 세그먼트 수 |
| `heightSegments` | `number` | 세로 방향 세그먼트 수 |
| `flipY` | `boolean` | V 텍스처 좌표 반전 여부 |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generatePlaneData()

> `static` **generatePlaneData**(`interleaveData`, `indexData`, `width`, `height`, `mainSegmentsX`, `mainSegmentsY`, `center`, `uV`, `vV`, `normal`, `radius?`, `radiusSegments?`, `boxDim?`, `flipY?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:282](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L282)

기저 벡터와 중심점을 기준으로 평면(또는 둥근 박스 면) 정점 및 인덱스 데이터를 버퍼 배열에 추가합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | 인터리브 정점 데이터 배열 (`Array<number>`) |
| `indexData` | `number`[] | `undefined` | 인덱스 데이터 배열 (`Array<number>`) |
| `width` | `number` | `undefined` | 평면 너비 |
| `height` | `number` | `undefined` | 평면 높이 |
| `mainSegmentsX` | `number` | `undefined` | 가로 방향 기본 세그먼트 수 |
| `mainSegmentsY` | `number` | `undefined` | 세로 방향 기본 세그먼트 수 |
| `center` | `any` | `undefined` | 평면 중심 좌표 |
| `uV` | `any` | `undefined` | 가로(U) 방향 기저 벡터 |
| `vV` | `any` | `undefined` | 세로(V) 방향 기저 벡터 |
| `normal` | `any` | `undefined` | 평면 법선 벡터 |
| `radius?` | `number` | `0` | 모서리 라운딩 반지름 (기본값: 0) |
| `radiusSegments?` | `number` | `0` | 모서리 라운딩 세그먼트 수 (기본값: 0) |
| `boxDim?` | `any` | `null` | 둥근 박스 치수 정보 (기본값: `null`) |
| `flipY?` | `boolean` | `false` | V 텍스처 좌표 반전 여부 (기본값: `false`) |

#### Returns

`void`

***

### generatePlaneEntryData()

> `static` **generatePlaneEntryData**(`redGPUContext`, `width`, `height`, `widthSegments`, `heightSegments`, `flipY`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:531](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L531)

XY 평면 기준의 Plane 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `width` | `number` | 가로 너비 |
| `height` | `number` | 세로 높이 |
| `widthSegments` | `number` | 가로 방향 세그먼트 수 |
| `heightSegments` | `number` | 세로 방향 세그먼트 수 |
| `flipY` | `boolean` | V 텍스처 좌표 반전 여부 |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateRingData()

> `static` **generateRingData**(`interleaveData`, `indexData`, `innerRadius`, `outerRadius`, `thetaSegments`, `phiSegments`, `thetaStart`, `thetaLength`, `center`, `uV`, `vV`, `normal`, `isFront?`, `isRadial?`, `uvVStart?`, `uvVEnd?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:847](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L847)

고리(Ring) 또는 원판 캡 형태의 정점 및 인덱스 데이터를 버퍼 배열에 추가합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | 인터리브 정점 데이터 배열 (`Array<number>`) |
| `indexData` | `number`[] | `undefined` | 인덱스 데이터 배열 (`Array<number>`) |
| `innerRadius` | `number` | `undefined` | 내부 반지름 |
| `outerRadius` | `number` | `undefined` | 외부 반지름 |
| `thetaSegments` | `number` | `undefined` | 둘레 방향 세그먼트 수 |
| `phiSegments` | `number` | `undefined` | 반지름 방향 세그먼트 수 |
| `thetaStart` | `number` | `undefined` | 시작 각도 (라디안) |
| `thetaLength` | `number` | `undefined` | 원호 각도 범위 (라디안) |
| `center` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | 중심 좌표 |
| `center.x` | `number` | `undefined` | - |
| `center.y` | `number` | `undefined` | - |
| `center.z` | `number` | `undefined` | - |
| `uV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | 가로(U) 기저 벡터 |
| `uV.x` | `number` | `undefined` | - |
| `uV.y` | `number` | `undefined` | - |
| `uV.z` | `number` | `undefined` | - |
| `vV` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | 세로(V) 기저 벡터 |
| `vV.x` | `number` | `undefined` | - |
| `vV.y` | `number` | `undefined` | - |
| `vV.z` | `number` | `undefined` | - |
| `normal` | \{ `x`: `number`; `y`: `number`; `z`: `number`; \} | `undefined` | 법선 벡터 |
| `normal.x` | `number` | `undefined` | - |
| `normal.y` | `number` | `undefined` | - |
| `normal.z` | `number` | `undefined` | - |
| `isFront?` | `boolean` | `true` | 전면 와인딩 여부 (기본값: `true`) |
| `isRadial?` | `boolean` | `false` | 방사형 UV 매핑 여부 (기본값: `false`) |
| `uvVStart?` | `number` | `0` | V 텍스처 좌표 시작값 (기본값: 0) |
| `uvVEnd?` | `number` | `1` | V 텍스처 좌표 종료값 (기본값: 1) |

#### Returns

`void`

***

### generateRingEntryData()

> `static` **generateRingEntryData**(`redGPUContext`, `innerRadius`, `outerRadius`, `thetaSegments`, `phiSegments`, `thetaStart`, `thetaLength`, `isRadial`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:653](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L653)

고리(Ring) 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `innerRadius` | `number` | 내부 반지름 |
| `outerRadius` | `number` | 외부 반지름 |
| `thetaSegments` | `number` | 둘레 방향 세그먼트 수 |
| `phiSegments` | `number` | 반지름 방향 세그먼트 수 |
| `thetaStart` | `number` | 시작 각도 (라디안) |
| `thetaLength` | `number` | 원호 각도 범위 (라디안) |
| `isRadial` | `boolean` | 방사형 UV 매핑 여부 |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateRoundedBoxData()

> `static` **generateRoundedBoxData**(`redGPUContext`, `width`, `height`, `depth`, `widthSegments`, `heightSegments`, `depthSegments`, `radius`, `radiusSegments`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:196](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L196)

모서리가 둥근 직육면체(RoundedBox) 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `width` | `number` | 가로 길이 |
| `height` | `number` | 세로 길이 |
| `depth` | `number` | 깊이 길이 |
| `widthSegments` | `number` | 가로 방향 세그먼트 수 |
| `heightSegments` | `number` | 세로 방향 세그먼트 수 |
| `depthSegments` | `number` | 깊이 방향 세그먼트 수 |
| `radius` | `number` | 모서리 곡률 반지름 |
| `radiusSegments` | `number` | 모서리 곡면 분할 세그먼트 수 |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateSphereData()

> `static` **generateSphereData**(`redGPUContext`, `radius`, `widthSegments`, `heightSegments`, `phiStart`, `phiLength`, `thetaStart`, `thetaLength`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:392](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L392)

구(Sphere) 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `radius` | `number` | 구 반지름 |
| `widthSegments` | `number` | 수평 방향 세그먼트 수 |
| `heightSegments` | `number` | 수직 방향 세그먼트 수 |
| `phiStart` | `number` | 수평 시작 각도 (라디안) |
| `phiLength` | `number` | 수평 원호 각도 범위 (라디안) |
| `thetaStart` | `number` | 수직 시작 각도 (라디안) |
| `thetaLength` | `number` | 수직 원호 각도 범위 (라디안) |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateSphericalData()

> `static` **generateSphericalData**(`interleaveData`, `indexData`, `radius`, `widthSegments`, `heightSegments`, `phiStart`, `phiLength`, `thetaStart`, `thetaLength`, `yOffset?`, `uvVStart?`, `uvVEnd?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:912](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L912)

구면(Spherical) 좌표계 기반의 정점 및 인덱스 데이터를 버퍼 배열에 추가합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | 인터리브 정점 데이터 배열 (`Array<number>`) |
| `indexData` | `number`[] | `undefined` | 인덱스 데이터 배열 (`Array<number>` 또는 `null`) |
| `radius` | `number` | `undefined` | 구 반지름 |
| `widthSegments` | `number` | `undefined` | 수평 방향 세그먼트 수 |
| `heightSegments` | `number` | `undefined` | 수직 방향 세그먼트 수 |
| `phiStart` | `number` | `undefined` | 수평 시작 각도 (라디안) |
| `phiLength` | `number` | `undefined` | 수평 원호 각도 범위 (라디안) |
| `thetaStart` | `number` | `undefined` | 수직 시작 각도 (라디안) |
| `thetaLength` | `number` | `undefined` | 수직 원호 각도 범위 (라디안) |
| `yOffset?` | `number` | `0` | Y축 위치 오프셋 (기본값: 0) |
| `uvVStart?` | `number` | `0` | V 텍스처 좌표 시작값 (기본값: 0) |
| `uvVEnd?` | `number` | `1` | V 텍스처 좌표 종료값 (기본값: 1) |

#### Returns

`void`

***

### generateTorusData()

> `static` **generateTorusData**(`redGPUContext`, `radius`, `thickness`, `radialSegments`, `tubularSegments`, `thetaStart`, `thetaLength`, `capStart`, `capEnd`, `isRadialCapStart`, `isRadialCapEnd`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:704](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L704)

토러스(Torus) 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `radius` | `number` | 중심 원 반지름 |
| `thickness` | `number` | 튜브 단면 반지름 |
| `radialSegments` | `number` | 둘레 방향 세그먼트 수 |
| `tubularSegments` | `number` | 튜브 단면 세그먼트 수 |
| `thetaStart` | `number` | 시작 각도 (라디안) |
| `thetaLength` | `number` | 원호 각도 범위 (라디안) |
| `capStart` | `boolean` | 시작 단면 캡 생성 여부 |
| `capEnd` | `boolean` | 끝 단면 캡 생성 여부 |
| `isRadialCapStart` | `boolean` | 시작 단면 캡의 방사형 UV 적용 여부 |
| `isRadialCapEnd` | `boolean` | 끝 단면 캡의 방사형 UV 적용 여부 |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### generateTorusKnotData()

> `static` **generateTorusKnotData**(`redGPUContext`, `radius`, `tubeRadius`, `tubularSegments`, `radialSegments`, `windingsAroundAxis`, `windingsAroundCircle`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:769](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L769)

매듭 토러스(TorusKnot) 지오메트리 데이터를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `radius` | `number` | 전체 반지름 |
| `tubeRadius` | `number` | 튜브 단면 반지름 |
| `tubularSegments` | `number` | 둘레 방향 세그먼트 수 |
| `radialSegments` | `number` | 단면 방향 세그먼트 수 |
| `windingsAroundAxis` | `number` | 중심축 기준 회전 횟수 p |
| `windingsAroundCircle` | `number` | 토러스 내부 원 기준 회전 횟수 q |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

생성된 `Geometry` 인스턴스

***

### getEmptyGeometry()

> `static` **getEmptyGeometry**(`redGPUContext`, `uniqueKey`): [`Geometry`](../../../../../classes/Geometry.md)

Defined in: [src/primitive/core/PrimitiveUtils.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L116)

유효하지 않은 치수일 때 사용할 최소 정점의 빈 `Geometry` 인스턴스를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |
| `uniqueKey` | `string` | 캐싱용 고유 키 |

#### Returns

[`Geometry`](../../../../../classes/Geometry.md)

빈 `Geometry` 인스턴스

***

### interleavePacker()

> `static` **interleavePacker**(`interleaveData`, `px`, `py`, `pz`, `nx`, `ny`, `nz`, `u`, `v`, `tx?`, `ty?`, `tz?`, `tw?`): `void`

Defined in: [src/primitive/core/PrimitiveUtils.ts:1157](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/PrimitiveUtils.ts#L1157)

단일 정점의 위치, 법선, UV, 탄젠트 성분을 인터리브 배열에 순서대로 추가합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `interleaveData` | `number`[] | `undefined` | 인터리브 정점 데이터 배열 (`Array<number>`) |
| `px` | `number` | `undefined` | 위치 X |
| `py` | `number` | `undefined` | 위치 Y |
| `pz` | `number` | `undefined` | 위치 Z |
| `nx` | `number` | `undefined` | 법선 X |
| `ny` | `number` | `undefined` | 법선 Y |
| `nz` | `number` | `undefined` | 법선 Z |
| `u` | `number` | `undefined` | 텍스처 좌표 U |
| `v` | `number` | `undefined` | 텍스처 좌표 V |
| `tx?` | `number` | `0` | 탄젠트 X (기본값: 0) |
| `ty?` | `number` | `0` | 탄젠트 Y (기본값: 0) |
| `tz?` | `number` | `0` | 탄젠트 Z (기본값: 0) |
| `tw?` | `number` | `1` | 탄젠트 W 부호 (기본값: 1) |

#### Returns

`void`
