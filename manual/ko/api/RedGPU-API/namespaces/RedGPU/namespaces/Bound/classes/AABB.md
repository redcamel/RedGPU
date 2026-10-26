[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / AABB

# Class: AABB

Defined in: [src/bound/AABB.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L18)

3차원 축 정렬 경계 상자(Axis-Aligned Bounding Box) 클래스입니다.

각 축의 최소·최대 좌표를 기반으로 경계 영역의 중심, 크기, 반지름을 계산하며 교차 판정 및 점 포함 여부를 검사합니다.

### Example
```typescript
const aabb = new RedGPU.Bound.AABB(-1, 1, -1, 1, -1, 1);
const intersects = aabb.intersects(otherAABB);
```

## Constructors

### Constructor

> **new AABB**(`minX?`, `maxX?`, `minY?`, `maxY?`, `minZ?`, `maxZ?`): `AABB`

Defined in: [src/bound/AABB.ts:113](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L113)

`AABB` 인스턴스를 생성합니다.

#### Example
```typescript
const aabb = new RedGPU.Bound.AABB(-5, 5, -5, 5, -5, 5);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `minX?` | `number` | `0` | X축 최소값 (기본값: `0`) |
| `maxX?` | `number` | `0` | X축 최대값 (기본값: `0`) |
| `minY?` | `number` | `0` | Y축 최소값 (기본값: `0`) |
| `maxY?` | `number` | `0` | Y축 최대값 (기본값: `0`) |
| `minZ?` | `number` | `0` | Z축 최소값 (기본값: `0`) |
| `maxZ?` | `number` | `0` | Z축 최대값 (기본값: `0`) |

#### Returns

`AABB`

## Properties

### centerX

> <span class="readonly-badge">readonly</span> **centerX**: `number`

Defined in: [src/bound/AABB.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L53)

X축 중심 좌표입니다.

***

### centerY

> <span class="readonly-badge">readonly</span> **centerY**: `number`

Defined in: [src/bound/AABB.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L58)

Y축 중심 좌표입니다.

***

### centerZ

> <span class="readonly-badge">readonly</span> **centerZ**: `number`

Defined in: [src/bound/AABB.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L63)

Z축 중심 좌표입니다.

***

### geometryRadius

> <span class="readonly-badge">readonly</span> **geometryRadius**: `number`

Defined in: [src/bound/AABB.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L83)

경계 상자의 중심에서 꼭짓점까지의 유클리드 거리(외접 구 반지름)입니다.

***

### maxX

> <span class="readonly-badge">readonly</span> **maxX**: `number`

Defined in: [src/bound/AABB.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L28)

X축 최대 좌표입니다.

***

### maxY

> <span class="readonly-badge">readonly</span> **maxY**: `number`

Defined in: [src/bound/AABB.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L38)

Y축 최대 좌표입니다.

***

### maxZ

> <span class="readonly-badge">readonly</span> **maxZ**: `number`

Defined in: [src/bound/AABB.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L48)

Z축 최대 좌표입니다.

***

### minX

> <span class="readonly-badge">readonly</span> **minX**: `number`

Defined in: [src/bound/AABB.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L23)

X축 최소 좌표입니다.

***

### minY

> <span class="readonly-badge">readonly</span> **minY**: `number`

Defined in: [src/bound/AABB.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L33)

Y축 최소 좌표입니다.

***

### minZ

> <span class="readonly-badge">readonly</span> **minZ**: `number`

Defined in: [src/bound/AABB.ts:43](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L43)

Z축 최소 좌표입니다.

***

### xSize

> <span class="readonly-badge">readonly</span> **xSize**: `number`

Defined in: [src/bound/AABB.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L68)

X축 방향 전체 크기(`maxX - minX`)입니다.

***

### ySize

> <span class="readonly-badge">readonly</span> **ySize**: `number`

Defined in: [src/bound/AABB.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L73)

Y축 방향 전체 크기(`maxY - minY`)입니다.

***

### zSize

> <span class="readonly-badge">readonly</span> **zSize**: `number`

Defined in: [src/bound/AABB.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L78)

Z축 방향 전체 크기(`maxZ - minZ`)입니다.

## Methods

### clone()

> **clone**(): `AABB`

Defined in: [src/bound/AABB.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L279)

현재 `AABB`와 동일한 경계 값을 가진 새 `AABB` 인스턴스를 복제하여 반환합니다.

#### Example
```typescript
const clonedAABB = aabb.clone();
```

#### Returns

`AABB`

복제된 `AABB` 인스턴스

***

### contains()

> **contains**(`pointOrX`, `y?`, `z?`): `boolean`

Defined in: [src/bound/AABB.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L253)

지정한 3차원 좌표 또는 점이 `AABB` 내부에 포함되는지 확인합니다.

#### Example
```typescript
const isInside = aabb.contains(0, 0, 0);
const isPointInside = aabb.contains([0, 0, 0]);
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

### copy()

> **copy**(`other`): `this`

Defined in: [src/bound/AABB.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L201)

다른 `AABB` 인스턴스의 경계 값을 현재 인스턴스에 복사합니다.

#### Example
```typescript
aabb.copy(otherAABB);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `AABB` | 복사할 원본 `AABB` 인스턴스 |

#### Returns

`this`

갱신된 현재 `AABB` 인스턴스

***

### intersects()

> **intersects**(`other`): `boolean`

Defined in: [src/bound/AABB.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L221)

다른 `AABB` 인스턴스와의 교차 여부를 판정합니다.

#### Example
```typescript
const isIntersecting = aabb.intersects(otherAABB);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `AABB` | 교차 여부를 검사할 대상 `AABB` 인스턴스 |

#### Returns

`boolean`

교차 시 `true`, 그렇지 않으면 `false`

***

### set()

> **set**(`minX`, `maxX`, `minY`, `maxY`, `minZ`, `maxZ`): `this`

Defined in: [src/bound/AABB.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L155)

현재 `AABB` 인스턴스의 경계 좌표와 파생 속성들을 제자리(In-place)에서 갱신합니다.

#### Example
```typescript
aabb.set(-10, 10, -10, 10, -10, 10);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `minX` | `number` | X축 최소값 |
| `maxX` | `number` | X축 최대값 |
| `minY` | `number` | Y축 최소값 |
| `maxY` | `number` | Y축 최대값 |
| `minZ` | `number` | Z축 최소값 |
| `maxZ` | `number` | Z축 최대값 |

#### Returns

`this`

갱신된 현재 `AABB` 인스턴스
