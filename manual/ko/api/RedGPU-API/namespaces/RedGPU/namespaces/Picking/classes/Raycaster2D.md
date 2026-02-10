[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / Raycaster2D

# Class: Raycaster2D

Defined in: [src/picking/Raycaster2D.ts:22](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L22)

2D 공간에서 객체와의 교차를 검사하는 클래스입니다.


View2D 환경에 최적화되어 있으며, NDC 좌표를 역추적하여 2D 객체의 정밀한 로컬 좌표 및 UV를 산출합니다.


### Example
```typescript
const raycaster = new RedGPU.Picking.Raycaster2D();
raycaster.setFromCamera(mouseX, mouseY, view);
const intersects = raycaster.intersectObjects(scene.children);
```

## Constructors

### Constructor

> **new Raycaster2D**(): `Raycaster2D`

Defined in: [src/picking/Raycaster2D.ts:42](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L42)

Raycaster2D 인스턴스를 생성합니다.


#### Returns

`Raycaster2D`

## Properties

### ray

> `readonly` **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/Raycaster2D.ts:30](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L30)

내부적으로 관리되는 광선 객체


2D에서는 실제 광선 대신 월드 좌표상의 지점을 사용하지만, Raycaster3D와의 호환성을 위해 유지됩니다.


## Methods

### intersectObject()

> **intersectObject**(`mesh`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster2D.ts:98](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L98)

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

> **intersectObjects**(`meshes`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster2D.ts:123](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L123)

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

Defined in: [src/picking/Raycaster2D.ts:65](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L65)

화면 좌표를 기반으로 피킹 지점을 설정합니다.


### Example
```typescript
raycaster.setFromCamera(mouseX, mouseY, view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | 화면 X 좌표
| `screenY` | `number` | 화면 Y 좌표
| `view` | [`View2D`](../../Display/classes/View2D.md) | 대상 View2D 인스턴스

#### Returns

`void`
