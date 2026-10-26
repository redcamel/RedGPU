[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / OBB

# Class: OBB

Defined in: [src/bound/OBB.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L19)

3차원 방향성 경계 상자(Oriented Bounding Box) 클래스입니다.

중심 좌표, 세 축의 반치수(Half Extents), 방향 행렬(`mat4`)을 기반으로 회전된 경계 상자를 정의하며 분리축 정리(SAT) 기반 교차 판정 및 점 포함 여부를 검사합니다.

### Example
```typescript
const obb = new RedGPU.Bound.OBB([0, 0, 0], [1, 1, 1], orientationMatrix);
const intersects = obb.intersects(otherOBB);
```

## Constructors

### Constructor

> **new OBB**(`center`, `halfExtents`, `orientation`): `OBB`

Defined in: [src/bound/OBB.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L90)

`OBB` 인스턴스를 생성합니다.

#### Example
```typescript
const obb = new RedGPU.Bound.OBB([0, 0, 0], [1, 2, 1], orientationMatrix);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `center` | \[`number`, `number`, `number`\] | 중심 좌표 `[x, y, z]` |
| `halfExtents` | \[`number`, `number`, `number`\] | 각 축의 반치수 `[x, y, z]` |
| `orientation` | [`mat4`](../../Math/type-aliases/mat4.md) | 4x4 방향 행렬(`mat4`) |

#### Returns

`OBB`

## Properties

### center

> <span class="readonly-badge">readonly</span> **center**: \[`number`, `number`, `number`\]

Defined in: [src/bound/OBB.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L59)

경계 상자의 중심 좌표 `[x, y, z]` 튜플입니다.

***

### centerX

> <span class="readonly-badge">readonly</span> **centerX**: `number`

Defined in: [src/bound/OBB.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L24)

X축 중심 좌표입니다.

***

### centerY

> <span class="readonly-badge">readonly</span> **centerY**: `number`

Defined in: [src/bound/OBB.ts:29](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L29)

Y축 중심 좌표입니다.

***

### centerZ

> <span class="readonly-badge">readonly</span> **centerZ**: `number`

Defined in: [src/bound/OBB.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L34)

Z축 중심 좌표입니다.

***

### geometryRadius

> <span class="readonly-badge">readonly</span> **geometryRadius**: `number`

Defined in: [src/bound/OBB.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L69)

경계 상자의 중심에서 꼭짓점까지의 유클리드 거리(외접 구 반지름)입니다.

***

### halfExtents

> <span class="readonly-badge">readonly</span> **halfExtents**: \[`number`, `number`, `number`\]

Defined in: [src/bound/OBB.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L64)

경계 상자의 세 축 반치수 `[x, y, z]` 튜플입니다.

***

### halfExtentX

> <span class="readonly-badge">readonly</span> **halfExtentX**: `number`

Defined in: [src/bound/OBB.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L39)

로컬 X축 방향의 반치수(Half Extent)입니다.

***

### halfExtentY

> <span class="readonly-badge">readonly</span> **halfExtentY**: `number`

Defined in: [src/bound/OBB.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L44)

로컬 Y축 방향의 반치수(Half Extent)입니다.

***

### halfExtentZ

> <span class="readonly-badge">readonly</span> **halfExtentZ**: `number`

Defined in: [src/bound/OBB.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L49)

로컬 Z축 방향의 반치수(Half Extent)입니다.

***

### orientation

> <span class="readonly-badge">readonly</span> **orientation**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/bound/OBB.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L54)

경계 상자의 회전 방향을 나타내는 4x4 행렬(`mat4`)입니다.

## Methods

### clone()

> **clone**(): `OBB`

Defined in: [src/bound/OBB.ts:204](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L204)

현재 `OBB`와 동일한 속성을 가진 새 `OBB` 인스턴스를 복제하여 반환합니다.

#### Example
```typescript
const clonedOBB = obb.clone();
```

#### Returns

`OBB`

복제된 `OBB` 인스턴스

***

### contains()

> **contains**(`pointOrX`, `y?`, `z?`): `boolean`

Defined in: [src/bound/OBB.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L173)

지정한 3차원 좌표 또는 점이 `OBB` 내부에 포함되는지 확인합니다.

#### Example
```typescript
const isInside = obb.contains(0, 0, 0);
const isPointInside = obb.contains([0, 0, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pointOrX` | `number` \| \[`number`, `number`, `number`\] | `[x, y, z]` 좌표 튜플 배열 또는 X축 좌표 |
| `y?` | `number` | Y축 좌표 (`pointOrX`가 숫자인 경우 사용) |
| `z?` | `number` | Z축 좌표 (`pointOrX`가 숫자인 경우 사용) |

#### Returns

`boolean`

포함 시 `true`, 그렇지 않으면 `false`

***

### intersects()

> **intersects**(`other`): `boolean`

Defined in: [src/bound/OBB.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L127)

분리축 정리(SAT)를 사용하여 다른 `OBB` 인스턴스와의 교차 여부를 판정합니다.

#### Example
```typescript
const isIntersecting = obb.intersects(otherOBB);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `OBB` | 교차 여부를 검사할 대상 `OBB` 인스턴스 |

#### Returns

`boolean`

교차 시 `true`, 그렇지 않으면 `false`
