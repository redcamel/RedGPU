[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / updateObject3DMatrix

# Function: updateObject3DMatrix()

> **updateObject3DMatrix**(`targetMesh`, `view`): `void`

Defined in: [src/math/updateObject3DMatrix.ts:29](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/math/updateObject3DMatrix.ts#L29)

Updates the local matrix and model matrix of Object3D (Mesh, Group3D).

This function calculates the local matrix based on the object's position, rotation, scale, and pivot information, and calculates the final model matrix by multiplying it with the parent's model matrix if it exists.

* ### Example
```typescript
// 시스템 내부에서 주로 호출됩니다. (Mainly called internally by the system.)
RedGPU.math.updateObject3DMatrix(mesh, view);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) \| [`Group3D`](../../Display/classes/Group3D.md) | The target object to update the matrix for (Mesh or Group3D) |
| `view` | [`View3D`](../../Display/classes/View3D.md) | The View3D instance currently being rendered (used for size calculations, etc.) |

## Returns

`void`
