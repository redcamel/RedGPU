[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / Ray

# Class: Ray

Defined in: [src/math/Ray.ts:17](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L17)

3D 공간에서 시작점(origin)과 방향(direction)을 가지는 광선(Ray) 클래스입니다.


이 클래스는 교차 검사(Intersection test)를 위한 수학적 연산(박스, 삼각형 등)을 제공합니다.


### Example
```typescript
const ray = new RedGPU.math.Ray([0, 0, 0], [0, 0, -1]);
```

## Constructors

### Constructor

> **new Ray**(`origin`, `direction`): `Ray`

Defined in: [src/math/Ray.ts:45](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L45)

Ray 인스턴스를 생성합니다.


### Example
```typescript
const ray = new RedGPU.math.Ray([0, 0, 0], [0, 0, 1]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `origin` | [`vec3`](../type-aliases/vec3.md) | 시작점
| `direction` | [`vec3`](../type-aliases/vec3.md) | 방향 벡터

#### Returns

`Ray`

## Properties

### direction

> **direction**: [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:27](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L27)

광선의 방향 벡터 (정규화 권장)


***

### origin

> **origin**: [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:22](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L22)

광선의 시작점


## Methods

### applyMatrix4()

> **applyMatrix4**(`matrix`): `Ray`

Defined in: [src/math/Ray.ts:92](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L92)

행렬을 사용하여 광선을 변환합니다.


::: warning
이 메서드는 호출 대상(자신)을 직접 수정합니다. 원본 광선의 상태를 보존해야 하는 경우 `.clone()`을 함께 사용하십시오.

:::

### Example
```typescript
// 원본 수정 (In-place)
ray.applyMatrix4(matrix);

// 원본 보존 (Preserve original)
const transformedRay = ray.clone().applyMatrix4(matrix);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `matrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 변환 행렬

#### Returns

`Ray`

변환된 자신


***

### clone()

> **clone**(): `Ray`

Defined in: [src/math/Ray.ts:63](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L63)

현재 Ray 인스턴스를 복제합니다.


### Example
```typescript
const clonedRay = ray.clone();
```

#### Returns

`Ray`

복제된 Ray 인스턴스


***

### intersectBox()

> **intersectBox**(`aabb`): `boolean`

Defined in: [src/math/Ray.ts:120](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L120)

AABB 박스와의 교차 여부를 판별합니다 (Slabs 알고리즘).


### Example
```typescript
const intersects = ray.intersectBox(aabb);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `aabb` | [`AABB`](../../Bound/classes/AABB.md) | 대상 AABB 박스

#### Returns

`boolean`

교차 여부


***

### intersectTriangle()

> **intersectTriangle**(`v0`, `v1`, `v2`, `backfaceCulling`): [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:170](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L170)

삼각형과의 교차 지점을 계산합니다 (Möller-Trumbore 알고리즘).


### Example
```typescript
const point = ray.intersectTriangle(v0, v1, v2);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `v0` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 정점 0
| `v1` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 정점 1
| `v2` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 정점 2
| `backfaceCulling` | `boolean` | `true` | 뒷면 컬링 여부

#### Returns

[`vec3`](../type-aliases/vec3.md)

교차 지점(vec3) 또는 null


***

### intersectTriangleBarycentric()

> **intersectTriangleBarycentric**(`v0`, `v1`, `v2`, `backfaceCulling`): `object`

Defined in: [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L238)

삼각형과의 교차 지점 및 무게중심 좌표를 계산합니다.


### Example
```typescript
const result = ray.intersectTriangleBarycentric(v0, v1, v2);
if (result) {
    console.log(result.point, result.u, result.v);
}
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `v0` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 정점 0
| `v1` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 정점 1
| `v2` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 정점 2
| `backfaceCulling` | `boolean` | `true` | 뒷면 컬링 여부

#### Returns

`object`

교차 정보({point, t, u, v}) 또는 null


| Name | Type | Defined in |
| ------ | ------ | ------ |
| `point` | [`vec3`](../type-aliases/vec3.md) | [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L238) |
| `t` | `number` | [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L238) |
| `u` | `number` | [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L238) |
| `v` | `number` | [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/Ray.ts#L238) |
