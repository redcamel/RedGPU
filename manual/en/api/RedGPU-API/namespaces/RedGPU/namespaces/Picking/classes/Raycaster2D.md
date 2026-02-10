[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / Raycaster2D

# Class: Raycaster2D

Defined in: [src/picking/Raycaster2D.ts:22](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L22)


Class that checks for intersections with objects in 2D space.


Optimized for View2D environments, it reverse-tracks NDC coordinates to calculate precise local coordinates and UVs for 2D objects.

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


Creates a Raycaster2D instance.

#### Returns

`Raycaster2D`

## Properties

### ray

> `readonly` **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/Raycaster2D.ts:30](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L30)


Internally managed ray object


In 2D, a point in world coordinates is used instead of an actual ray, but it is maintained for compatibility with Raycaster3D.

## Methods

### intersectObject()

> **intersectObject**(`mesh`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster2D.ts:98](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L98)


Checks for intersection with a single object.

### Example
```typescript
const result = raycaster.intersectObject(mesh);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | `undefined` | Mesh object to check |
| `recursive` | `boolean` | `true` | Whether to include child objects (default: true) |

#### Returns

`RayIntersectResult`[]


Array of intersection information (`RayIntersectResult[]`)

***

### intersectObjects()

> **intersectObjects**(`meshes`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster2D.ts:123](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L123)


Checks for intersections with multiple objects.

### Example
```typescript
const results = raycaster.intersectObjects(scene.children);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `meshes` | [`Mesh`](../../Display/classes/Mesh.md)[] | `undefined` | Array of mesh objects to check |
| `recursive` | `boolean` | `true` | Whether to include child objects (default: true) |

#### Returns

`RayIntersectResult`[]


Array of intersection information (`RayIntersectResult[]`)

***

### setFromCamera()

> **setFromCamera**(`screenX`, `screenY`, `view`): `void`

Defined in: [src/picking/Raycaster2D.ts:65](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/picking/Raycaster2D.ts#L65)


Sets the picking point based on screen coordinates.

### Example
```typescript
raycaster.setFromCamera(mouseX, mouseY, view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate |
| `screenY` | `number` | Screen Y coordinate |
| `view` | [`View2D`](../../Display/classes/View2D.md) | Target View2D instance |

#### Returns

`void`
