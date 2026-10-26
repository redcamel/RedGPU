[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / Raycaster3D

# Class: Raycaster3D

Defined in: [src/picking/Raycaster3D.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster3D.ts#L23)

Class that casts a `Ray` in 3D space based on camera and screen coordinates to perform precise triangle-level intersection tests with meshes.

### Example
```typescript
const raycaster = new RedGPU.Picking.Raycaster3D();
// Set ray based on screen coordinates and view, then perform intersection test
raycaster.setFromCamera(mouseX, mouseY, view);
const intersects = raycaster.intersectObjects(scene.children);
```

## See

[MouseEvent (Raycasting) example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)

## Constructors

### Constructor

> **new Raycaster3D**(): `Raycaster3D`

Defined in: [src/picking/Raycaster3D.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster3D.ts#L53)

Creates a `Raycaster3D` instance.

#### Returns

`Raycaster3D`

## Properties

### far

> **far**: `number` = `Infinity`

Defined in: [src/picking/Raycaster3D.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster3D.ts#L40)

Maximum distance from the camera to consider for intersection (default: `Infinity`)

***

### near

> **near**: `number` = `0`

Defined in: [src/picking/Raycaster3D.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster3D.ts#L34)

Minimum distance from the camera to consider for intersection (default: `0`)

***

### ray

> <span class="readonly-badge">readonly</span> **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/Raycaster3D.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster3D.ts#L28)

Internally managed `Ray` object

## Methods

### intersectObject()

> **intersectObject**(`mesh`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster3D.ts:122](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster3D.ts#L122)

Checks for intersection with a single mesh object.

#### Example
```typescript
const result = raycaster.intersectObject(mesh);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | `undefined` | Mesh object to check |
| `recursive?` | `boolean` | `true` | Whether to include child objects (default: `true`) |

#### Returns

`RayIntersectResult`[]

Array of intersection results sorted by distance (`RayIntersectResult[]`)

***

### intersectObjects()

> **intersectObjects**(`meshes`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster3D.ts:147](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster3D.ts#L147)

Checks for intersections with multiple mesh objects.

#### Example
```typescript
const results = raycaster.intersectObjects(scene.children);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `meshes` | [`Mesh`](../../Display/classes/Mesh.md)[] | `undefined` | Array of mesh objects to check |
| `recursive?` | `boolean` | `true` | Whether to include child objects (default: `true`) |

#### Returns

`RayIntersectResult`[]

Array of intersection results sorted by distance (`RayIntersectResult[]`)

***

### setFromCamera()

> **setFromCamera**(`screenX`, `screenY`, `view`): `void`

Defined in: [src/picking/Raycaster3D.ts:76](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster3D.ts#L76)

Sets the ray based on screen coordinates and camera information of `View3D`.

#### Example
```typescript
raycaster.setFromCamera(mouseX, mouseY, view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate |
| `screenY` | `number` | Screen Y coordinate |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Target `View3D` instance |

#### Returns

`void`
