[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / updateObject3DMatrix

# Function: updateObject3DMatrix()

> **updateObject3DMatrix**(`targetMesh`, `view`): `void`

Defined in: [src/math/updateObject3DMatrix.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/updateObject3DMatrix.ts#L25)

대상 3D 객체(`Mesh` 또는 `Group3D`)의 위치, 회전(도 단위), 스케일, 피벗 및 부모 행렬을 반영하여 `localMatrix`와 `modelMatrix`를 갱신합니다.

### Example
```typescript
RedGPU.Math.updateObject3DMatrix(mesh, view);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) \| [`Group3D`](../../Display/classes/Group3D.md) | 행렬을 갱신할 대상 객체 (`Mesh` 또는 `Group3D`) |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 현재 렌더링 중인 `View3D` 인스턴스 |

## Returns

`void`
