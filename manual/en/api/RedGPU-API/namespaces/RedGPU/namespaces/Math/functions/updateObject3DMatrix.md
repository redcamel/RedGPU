[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / updateObject3DMatrix

# Function: updateObject3DMatrix()

> **updateObject3DMatrix**(`targetMesh`, `view`): `void`

Defined in: [src/math/updateObject3DMatrix.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/math/updateObject3DMatrix.ts#L25)

Updates the `localMatrix` and `modelMatrix` of a target 3D object (`Mesh` or `Group3D`) using its position, rotation (in degrees), scale, pivot, and parent matrix.

### Example
```typescript
RedGPU.Math.updateObject3DMatrix(mesh, view);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) \| [`Group3D`](../../Display/classes/Group3D.md) | Target object whose matrices will be updated (`Mesh` or `Group3D`) |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Currently rendering `View3D` instance |

## Returns

`void`
