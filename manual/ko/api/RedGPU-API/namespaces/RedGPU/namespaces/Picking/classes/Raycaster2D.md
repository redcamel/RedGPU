[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / Raycaster2D

# Class: Raycaster2D

Defined in: [src/picking/Raycaster2D.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster2D.ts#L23)

`View2D` 환경에서 NDC 좌표를 역추적하여 2D 객체와의 교차 여부 및 로컬 좌표·UV를 산출하는 클래스입니다.

### Example
```typescript
const raycaster = new RedGPU.Picking.Raycaster2D();
// 화면 좌표를 기반으로 피킹 지점 설정 및 교차 검사 수행
raycaster.setFromCamera(mouseX, mouseY, view);
const intersects = raycaster.intersectObjects(scene.children);
```

## See

[MouseEvent (Sprite2D) example](https://redcamel.github.io/RedGPU/examples/2d/interaction/mouseEvent/sprite2D/)

## Constructors

### Constructor

> **new Raycaster2D**(): `Raycaster2D`

Defined in: [src/picking/Raycaster2D.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster2D.ts#L40)

`Raycaster2D` 인스턴스를 생성합니다.

#### Returns

`Raycaster2D`

## Properties

### ray

> <span class="readonly-badge">readonly</span> **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/Raycaster2D.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster2D.ts#L28)

`Raycaster3D`와의 호환성을 위해 내부적으로 관리되는 광선(`Ray`) 객체

## Methods

### intersectObject()

> **intersectObject**(`mesh`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster2D.ts:96](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster2D.ts#L96)

단일 메시 객체와의 교차 여부를 검사합니다.

#### Example
```typescript
const result = raycaster.intersectObject(mesh);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | `undefined` | 검사할 메시 객체 |
| `recursive?` | `boolean` | `true` | 자식 객체도 포함할지 여부 (기본값: `true`) |

#### Returns

`RayIntersectResult`[]

거리순으로 정렬된 교차 결과 배열 (`RayIntersectResult[]`)

***

### intersectObjects()

> **intersectObjects**(`meshes`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster2D.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster2D.ts#L121)

여러 메시 객체와의 교차 여부를 검사합니다.

#### Example
```typescript
const results = raycaster.intersectObjects(scene.children);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `meshes` | [`Mesh`](../../Display/classes/Mesh.md)[] | `undefined` | 검사할 메시 객체 배열 |
| `recursive?` | `boolean` | `true` | 자식 객체도 포함할지 여부 (기본값: `true`) |

#### Returns

`RayIntersectResult`[]

거리순으로 정렬된 교차 결과 배열 (`RayIntersectResult[]`)

***

### setFromCamera()

> **setFromCamera**(`screenX`, `screenY`, `view`): `void`

Defined in: [src/picking/Raycaster2D.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster2D.ts#L63)

화면 좌표와 `View2D` 정보를 기반으로 피킹 지점을 설정합니다.

#### Example
```typescript
raycaster.setFromCamera(mouseX, mouseY, view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | 화면 X 좌표 |
| `screenY` | `number` | 화면 Y 좌표 |
| `view` | [`View2D`](../../Display/classes/View2D.md) | 대상 `View2D` 인스턴스 |

#### Returns

`void`
