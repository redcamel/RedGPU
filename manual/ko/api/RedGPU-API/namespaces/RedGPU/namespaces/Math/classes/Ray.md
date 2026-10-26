[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / Ray

# Class: Ray

Defined in: [src/math/Ray.ts:16](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L16)

3D 공간의 시작점(`origin`)과 방향 벡터(`direction`)를 가지며 AABB 및 삼각형과의 교차 판정을 수행하는 광선(Ray) 클래스입니다.

### Example
```typescript
const ray = new RedGPU.Math.Ray([0, 0, 0], [0, 0, -1]);
```

## See

[Mouse Event Raycasting example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)

## Constructors

### Constructor

> **new Ray**(`origin?`, `direction?`): `Ray`

Defined in: [src/math/Ray.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L44)

지정된 시작점과 방향 벡터로 `Ray` 인스턴스를 생성합니다.

#### Example
```typescript
const ray = new RedGPU.Math.Ray([0, 0, 0], [0, 0, -1]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `origin?` | [`vec3`](../type-aliases/vec3.md) | 광선의 시작점 (기본값: `[0, 0, 0]`) |
| `direction?` | [`vec3`](../type-aliases/vec3.md) | 광선의 방향 벡터 (기본값: `[0, 0, -1]`) |

#### Returns

`Ray`

## Properties

### direction

> **direction**: [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L26)

광선의 정규화된 방향 벡터 (`vec3`)

***

### origin

> **origin**: [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L21)

광선의 시작점 좌표 (`vec3`)

## Methods

### applyMatrix4()

> **applyMatrix4**(`matrix`): `Ray`

Defined in: [src/math/Ray.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L93)

4x4 변환 행렬을 현재 광선의 시작점과 방향 벡터에 인플레이스(In-place)로 적용하고 방향 벡터를 정규화합니다.

::: warning
이 메서드는 인스턴스 자신을 직접 수정합니다. 원본 보존이 필요한 경우 `clone()`과 함께 사용하십시오.
:::

#### Example
```typescript
// 원본 광선 직접 변환
ray.applyMatrix4(matrix);

// 원본 보존 후 변환
const transformedRay = ray.clone().applyMatrix4(matrix);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `matrix` | [`mat4`](../type-aliases/mat4.md) | 적용할 4x4 변환 행렬 (`mat4`) |

#### Returns

`Ray`

변환이 적용된 현재 `Ray` 인스턴스 (`this`)

***

### clone()

> **clone**(): `Ray`

Defined in: [src/math/Ray.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L62)

현재 광선의 시작점과 방향을 복사한 새 `Ray` 인스턴스를 반환합니다.

#### Example
```typescript
const clonedRay = ray.clone();
```

#### Returns

`Ray`

복제된 `Ray` 인스턴스

***

### intersectBox()

> **intersectBox**(`aabb`): `boolean`

Defined in: [src/math/Ray.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L120)

Slabs 알고리즘을 사용하여 광선과 `AABB` 바운딩 박스의 교차 여부를 판별합니다.

#### Example
```typescript
const isHit = ray.intersectBox(aabb);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `aabb` | [`AABB`](../../Bound/classes/AABB.md) | 교차 검사할 대상 `AABB` 인스턴스 |

#### Returns

`boolean`

교차 여부 (`boolean`)

***

### intersectTriangle()

> **intersectTriangle**(`v0`, `v1`, `v2`, `backfaceCulling?`): [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L170)

Möller-Trumbore 알고리즘을 사용하여 광선과 삼각형의 교차 지점 좌표를 계산합니다.

#### Example
```typescript
const hitPoint = ray.intersectTriangle(v0, v1, v2, true);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `v0` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 삼각형의 첫 번째 정점 (`vec3`) |
| `v1` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 삼각형의 두 번째 정점 (`vec3`) |
| `v2` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 삼각형의 세 번째 정점 (`vec3`) |
| `backfaceCulling?` | `boolean` | `true` | 후면 컬링 적용 여부 (기본값: `true`) |

#### Returns

[`vec3`](../type-aliases/vec3.md)

교차 지점 좌표 (`vec3`) 또는 미교차 시 `null`

***

### intersectTriangleBarycentric()

> **intersectTriangleBarycentric**(`v0`, `v1`, `v2`, `backfaceCulling?`): `object`

Defined in: [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L238)

광선과 삼각형의 교차 지점 좌표, 거리(`t`), 및 무게중심 좌표(`u`, `v`)를 계산합니다.

#### Example
```typescript
const hit = ray.intersectTriangleBarycentric(v0, v1, v2);
if (hit) {
    console.log(hit.point, hit.t, hit.u, hit.v);
}
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `v0` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 삼각형의 첫 번째 정점 (`vec3`) |
| `v1` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 삼각형의 두 번째 정점 (`vec3`) |
| `v2` | [`vec3`](../type-aliases/vec3.md) | `undefined` | 삼각형의 세 번째 정점 (`vec3`) |
| `backfaceCulling?` | `boolean` | `true` | 후면 컬링 적용 여부 (기본값: `true`) |

#### Returns

`object`

교차 정보 객체 (`{ point: vec3, t: number, u: number, v: number }`) 또는 미교차 시 `null`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `point` | [`vec3`](../type-aliases/vec3.md) | [src/math/Ray.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L239) |
| `t` | `number` | [src/math/Ray.ts:240](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L240) |
| `u` | `number` | [src/math/Ray.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L241) |
| `v` | `number` | [src/math/Ray.ts:242](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L242) |
