[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / AABB

# Class: AABB

Defined in: [src/bound/AABB.ts:18](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L18)

3차원 축 정렬 경계 상자(Axis-Aligned Bounding Box) 클래스입니다.


각 축에 평행한 경계 상자를 정의하며 교차 판정, 포함 여부 확인 기능을 제공합니다.


* ### Example
```typescript
const aabb = new RedGPU.Bound.AABB(-1, 1, -1, 1, -1, 1);
const intersects = aabb.intersects(otherAABB);
```

## Constructors

### Constructor

> **new AABB**(`minX`, `maxX`, `minY`, `maxY`, `minZ`, `maxZ`): `AABB`

Defined in: [src/bound/AABB.ts:108](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L108)

AABB 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `minX` | `number` | X축 최소값
| `maxX` | `number` | X축 최대값
| `minY` | `number` | Y축 최소값
| `maxY` | `number` | Y축 최대값
| `minZ` | `number` | Z축 최소값
| `maxZ` | `number` | Z축 최대값

#### Returns

`AABB`

## Properties

### centerX

> `readonly` **centerX**: `number`

Defined in: [src/bound/AABB.ts:53](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L53)

X축 중심 좌표


***

### centerY

> `readonly` **centerY**: `number`

Defined in: [src/bound/AABB.ts:58](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L58)

Y축 중심 좌표


***

### centerZ

> `readonly` **centerZ**: `number`

Defined in: [src/bound/AABB.ts:63](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L63)

Z축 중심 좌표


***

### geometryRadius

> `readonly` **geometryRadius**: `number`

Defined in: [src/bound/AABB.ts:83](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L83)

중심에서 꼭짓점까지의 거리(반지름)


***

### maxX

> `readonly` **maxX**: `number`

Defined in: [src/bound/AABB.ts:28](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L28)

X축 최대값


***

### maxY

> `readonly` **maxY**: `number`

Defined in: [src/bound/AABB.ts:38](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L38)

Y축 최대값


***

### maxZ

> `readonly` **maxZ**: `number`

Defined in: [src/bound/AABB.ts:48](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L48)

Z축 최대값


***

### minX

> `readonly` **minX**: `number`

Defined in: [src/bound/AABB.ts:23](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L23)

X축 최소값


***

### minY

> `readonly` **minY**: `number`

Defined in: [src/bound/AABB.ts:33](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L33)

Y축 최소값


***

### minZ

> `readonly` **minZ**: `number`

Defined in: [src/bound/AABB.ts:43](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L43)

Z축 최소값


***

### xSize

> `readonly` **xSize**: `number`

Defined in: [src/bound/AABB.ts:68](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L68)

X축 크기


***

### ySize

> `readonly` **ySize**: `number`

Defined in: [src/bound/AABB.ts:73](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L73)

Y축 크기


***

### zSize

> `readonly` **zSize**: `number`

Defined in: [src/bound/AABB.ts:78](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L78)

Z축 크기


## Methods

### clone()

> **clone**(): `AABB`

Defined in: [src/bound/AABB.ts:189](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L189)

AABB 인스턴스를 복제합니다.


#### Returns

`AABB`

복제된 AABB 인스턴스


***

### contains()

> **contains**(`pointOrX`, `y?`, `z?`): `boolean`

Defined in: [src/bound/AABB.ts:168](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L168)

점 또는 좌표가 AABB 내부에 포함되는지 여부를 반환합니다.


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

Defined in: [src/bound/AABB.ts:142](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/bound/AABB.ts#L142)

다른 AABB와의 교차 여부를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `AABB` | 교차 여부를 검사할 AABB 인스턴스

#### Returns

`boolean`

교차하면 true, 아니면 false

