[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / OBB

# Class: OBB

Defined in: [src/bound/OBB.ts:19](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L19)

3차원 방향성 경계 상자(Oriented Bounding Box) 클래스입니다.


임의의 방향을 가질 수 있는 경계 상자를 정의하며 SAT 기반 교차 판정 및 포함 여부 확인 기능을 제공합니다.


* ### Example
```typescript
const obb = new RedGPU.Bound.OBB([0, 0, 0], [1, 1, 1], orientationMatrix);
const intersects = obb.intersects(otherOBB);
```

## Constructors

### Constructor

> **new OBB**(`center`, `halfExtents`, `orientation`): `OBB`

Defined in: [src/bound/OBB.ts:85](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L85)

OBB 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `center` | \[`number`, `number`, `number`\] | 중심 좌표 [x, y, z]
| `halfExtents` | \[`number`, `number`, `number`\] | 반치수 [x, y, z]
| `orientation` | [`mat4`](../../../type-aliases/mat4.md) | 방향 행렬(mat4)

#### Returns

`OBB`

## Properties

### center

> `readonly` **center**: \[`number`, `number`, `number`\]

Defined in: [src/bound/OBB.ts:59](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L59)

중심 좌표 [x, y, z]


***

### centerX

> `readonly` **centerX**: `number`

Defined in: [src/bound/OBB.ts:24](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L24)

X축 중심 좌표


***

### centerY

> `readonly` **centerY**: `number`

Defined in: [src/bound/OBB.ts:29](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L29)

Y축 중심 좌표


***

### centerZ

> `readonly` **centerZ**: `number`

Defined in: [src/bound/OBB.ts:34](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L34)

Z축 중심 좌표


***

### geometryRadius

> `readonly` **geometryRadius**: `number`

Defined in: [src/bound/OBB.ts:69](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L69)

중심에서 꼭짓점까지의 거리(반지름)


***

### halfExtents

> `readonly` **halfExtents**: \[`number`, `number`, `number`\]

Defined in: [src/bound/OBB.ts:64](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L64)

반치수 [x, y, z]


***

### halfExtentX

> `readonly` **halfExtentX**: `number`

Defined in: [src/bound/OBB.ts:39](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L39)

X축 반치수(half extent)


***

### halfExtentY

> `readonly` **halfExtentY**: `number`

Defined in: [src/bound/OBB.ts:44](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L44)

Y축 반치수(half extent)


***

### halfExtentZ

> `readonly` **halfExtentZ**: `number`

Defined in: [src/bound/OBB.ts:49](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L49)

Z축 반치수(half extent)


***

### orientation

> `readonly` **orientation**: [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/bound/OBB.ts:54](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L54)

방향 행렬(mat4)


## Methods

### clone()

> **clone**(): `OBB`

Defined in: [src/bound/OBB.ts:186](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L186)

OBB 인스턴스를 복제합니다.


#### Returns

`OBB`

복제된 OBB 인스턴스


***

### contains()

> **contains**(`pointOrX`, `y?`, `z?`): `boolean`

Defined in: [src/bound/OBB.ts:160](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L160)

점 또는 좌표가 OBB 내부에 포함되는지 여부를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pointOrX` | `number` \| \[`number`, `number`, `number`\] | [x, y, z] 배열 또는 x 좌표
| `y?` | `number` | y 좌표
| `z?` | `number` | z 좌표

#### Returns

`boolean`

포함되면 true, 아니면 false


***

### intersects()

> **intersects**(`other`): `boolean`

Defined in: [src/bound/OBB.ts:117](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/bound/OBB.ts#L117)

다른 OBB와의 교차 여부를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `OBB` | 교차 여부를 검사할 OBB 인스턴스

#### Returns

`boolean`

교차하면 true, 아니면 false

