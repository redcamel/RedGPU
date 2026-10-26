[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / Raycaster2D

# Class: Raycaster2D

Defined in: [src/picking/Raycaster2D.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster2D.ts#L23)

Class that reverse-tracks NDC coordinates in a `View2D` environment to calculate intersections, local coordinates, and UVs for 2D objects.

### Example
```typescript
const raycaster = new RedGPU.Picking.Raycaster2D();
// Set picking point based on screen coordinates and perform intersection test
raycaster.setFromCamera(mouseX, mouseY, view);
const intersects = raycaster.intersectObjects(scene.children);
```

## See

[MouseEvent (Sprite2D) example](https://redcamel.github.io/RedGPU/examples/2d/interaction/mouseEvent/sprite2D/)

## Constructors

### Constructor

> **new Raycaster2D**(): `Raycaster2D`

Defined in: [src/picking/Raycaster2D.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster2D.ts#L40)

Creates a `Raycaster2D` instance.

#### Returns

`Raycaster2D`

## Properties

### ray

> <span class="readonly-badge">readonly</span> **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/Raycaster2D.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster2D.ts#L28)

Internally managed `Ray` object maintained for compatibility with `Raycaster3D`

## Methods

### intersectObject()

> **intersectObject**(`mesh`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster2D.ts:96](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster2D.ts#L96)

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

Defined in: [src/picking/Raycaster2D.ts:121](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster2D.ts#L121)

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

Defined in: [src/picking/Raycaster2D.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/Raycaster2D.ts#L63)

Sets the picking point based on screen coordinates and `View2D` information.

#### Example
```typescript
raycaster.setFromCamera(mouseX, mouseY, view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate |
| `screenY` | `number` | Screen Y coordinate |
| `view` | [`View2D`](../../Display/classes/View2D.md) | Target `View2D` instance |

#### Returns

`void`
