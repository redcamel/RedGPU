[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / Raycaster3D

# Class: Raycaster3D

Defined in: [src/picking/Raycaster3D.ts:22](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/Raycaster3D.ts#L22)

3D 공간에서 광선(Ray)을 투사하여 객체와의 교차를 검사하는 클래스입니다.


마우스 좌표와 카메라 정보를 기반으로 광선을 생성하고, 메시의 정밀한 삼각형 단위 충돌 검사를 수행합니다.


### Example
```typescript
const raycaster = new RedGPU.Picking.Raycaster3D();
raycaster.setFromCamera(mouseX, mouseY, view);
const intersects = raycaster.intersectObjects(scene.children);
```

## Constructors

### Constructor

> **new Raycaster3D**(): `Raycaster3D`

Defined in: [src/picking/Raycaster3D.ts:55](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/Raycaster3D.ts#L55)

Raycaster3D 인스턴스를 생성합니다.


#### Returns

`Raycaster3D`

## Properties

### far

> **far**: `number` = `Infinity`

Defined in: [src/picking/Raycaster3D.ts:41](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/Raycaster3D.ts#L41)

교차 검사 시 고려할 최대 거리 (카메라로부터)


#### Default Value

```ts
Infinity
```

***

### near

> **near**: `number` = `0`

Defined in: [src/picking/Raycaster3D.ts:34](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/Raycaster3D.ts#L34)

교차 검사 시 고려할 최소 거리 (카메라로부터)


#### Default Value

```ts
0
```

***

### ray

> `readonly` **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/Raycaster3D.ts:27](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/Raycaster3D.ts#L27)

내부적으로 관리되는 광원 객체


## Methods

### intersectObject()

> **intersectObject**(`mesh`, `recursive`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster3D.ts:118](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/Raycaster3D.ts#L118)

단일 객체와의 교차 여부를 검사합니다.


### Example
```typescript
const result = raycaster.intersectObject(mesh);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | `undefined` | 검사할 메시 객체
| `recursive` | `boolean` | `true` | 자식 객체도 포함할지 여부 (기본값: true)

#### Returns

`RayIntersectResult`[]

교차 정보 배열 (`RayIntersectResult[]`)


***

### intersectObjects()

> **intersectObjects**(`meshes`, `recursive`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster3D.ts:143](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/Raycaster3D.ts#L143)

여러 객체와의 교차 여부를 검사합니다.


### Example
```typescript
const results = raycaster.intersectObjects(scene.children);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `meshes` | [`Mesh`](../../Display/classes/Mesh.md)[] | `undefined` | 검사할 메시 객체 배열
| `recursive` | `boolean` | `true` | 자식 객체도 포함할지 여부 (기본값: true)

#### Returns

`RayIntersectResult`[]

교차 정보 배열 (`RayIntersectResult[]`)


***

### setFromCamera()

> **setFromCamera**(`screenX`, `screenY`, `view`): `void`

Defined in: [src/picking/Raycaster3D.ts:78](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/Raycaster3D.ts#L78)

화면 좌표와 카메라 정보를 기반으로 광선을 설정합니다.


### Example
```typescript
raycaster.setFromCamera(mouseX, mouseY, view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | 화면 X 좌표
| `screenY` | `number` | 화면 Y 좌표
| `view` | [`View3D`](../../Display/classes/View3D.md) | 대상 View3D 인스턴스

#### Returns

`void`
