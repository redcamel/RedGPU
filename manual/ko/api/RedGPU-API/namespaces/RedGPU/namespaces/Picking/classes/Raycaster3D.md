[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / Raycaster3D

# Class: Raycaster3D

Defined in: [src/picking/Raycaster3D.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster3D.ts#L23)

3D 공간에서 카메라와 화면 좌표를 기반으로 광선(`Ray`)을 투사하여 메시와의 정밀한 삼각형 단위 교차를 검사하는 클래스입니다.

### Example
```typescript
const raycaster = new RedGPU.Picking.Raycaster3D();
// 화면 좌표와 뷰를 기반으로 광선 설정 및 교차 검사 수행
raycaster.setFromCamera(mouseX, mouseY, view);
const intersects = raycaster.intersectObjects(scene.children);
```

## See

[MouseEvent (Raycasting) example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)

## Constructors

### Constructor

> **new Raycaster3D**(): `Raycaster3D`

Defined in: [src/picking/Raycaster3D.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster3D.ts#L53)

`Raycaster3D` 인스턴스를 생성합니다.

#### Returns

`Raycaster3D`

## Properties

### far

> **far**: `number` = `Infinity`

Defined in: [src/picking/Raycaster3D.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster3D.ts#L40)

교차 검사 시 고려할 카메라로부터의 최대 거리 (기본값: `Infinity`)

***

### near

> **near**: `number` = `0`

Defined in: [src/picking/Raycaster3D.ts:34](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster3D.ts#L34)

교차 검사 시 고려할 카메라로부터의 최소 거리 (기본값: `0`)

***

### ray

> <span class="readonly-badge">readonly</span> **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/Raycaster3D.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster3D.ts#L28)

내부적으로 관리되는 광선(`Ray`) 객체

## Methods

### intersectObject()

> **intersectObject**(`mesh`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster3D.ts:122](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster3D.ts#L122)

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

Defined in: [src/picking/Raycaster3D.ts:147](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster3D.ts#L147)

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

Defined in: [src/picking/Raycaster3D.ts:76](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/picking/Raycaster3D.ts#L76)

화면 좌표와 `View3D`의 카메라 정보를 기반으로 광선을 설정합니다.

#### Example
```typescript
raycaster.setFromCamera(mouseX, mouseY, view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | 화면 X 좌표 |
| `screenY` | `number` | 화면 Y 좌표 |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 대상 `View3D` 인스턴스 |

#### Returns

`void`
