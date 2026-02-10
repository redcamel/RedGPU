[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / Raycaster3D

# Class: Raycaster3D

Defined in: [src/picking/Raycaster3D.ts:22](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/picking/Raycaster3D.ts#L22)


Class that casts a ray in 3D space to check for intersections with objects.


Generates a ray based on mouse coordinates and camera information, and performs precise triangle-level collision tests on meshes.

### Example
```typescript
const raycaster = new RedGPU.Picking.Raycaster3D();
raycaster.setFromCamera(mouseX, mouseY, view);
const intersects = raycaster.intersectObjects(scene.children);
```

## Constructors

### Constructor

> **new Raycaster3D**(): `Raycaster3D`

Defined in: [src/picking/Raycaster3D.ts:55](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/picking/Raycaster3D.ts#L55)


Creates a Raycaster3D instance.

#### Returns

`Raycaster3D`

## Properties

### far

> **far**: `number` = `Infinity`

Defined in: [src/picking/Raycaster3D.ts:41](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/picking/Raycaster3D.ts#L41)


Maximum distance to consider for intersection (from camera)

#### Default Value

```ts
Infinity
```

***

### near

> **near**: `number` = `0`

Defined in: [src/picking/Raycaster3D.ts:34](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/picking/Raycaster3D.ts#L34)


Minimum distance to consider for intersection (from camera)

#### Default Value

```ts
0
```

***

### ray

> `readonly` **ray**: [`Ray`](../../Math/classes/Ray.md)

Defined in: [src/picking/Raycaster3D.ts:27](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/picking/Raycaster3D.ts#L27)


Internally managed ray object

## Methods

### intersectObject()

> **intersectObject**(`mesh`, `recursive?`): `RayIntersectResult`[]

Defined in: [src/picking/Raycaster3D.ts:118](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/picking/Raycaster3D.ts#L118)


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

Defined in: [src/picking/Raycaster3D.ts:143](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/picking/Raycaster3D.ts#L143)


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

Defined in: [src/picking/Raycaster3D.ts:78](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/picking/Raycaster3D.ts#L78)


Sets the ray based on screen coordinates and camera information.

### Example
```typescript
raycaster.setFromCamera(mouseX, mouseY, view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate |
| `screenY` | `number` | Screen Y coordinate |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Target View3D instance |

#### Returns

`void`
