[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / updateObject3DMatrix

# Function: updateObject3DMatrix()

> **updateObject3DMatrix**(`targetMesh`, `view`): `void`

Defined in: [src/math/updateObject3DMatrix.ts:28](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/updateObject3DMatrix.ts#L28)

Object3D(Mesh, AGroupBase)의 로컬 행렬과 모델 행렬을 업데이트합니다.


이 함수는 객체의 위치, 회전, 크기, 피벗 정보를 바탕으로 로컬 행렬을 계산하고, 부모의 모델 행렬이 있을 경우 이를 합성하여 최종 모델 행렬을 구합니다.


* ### Example
```typescript
// 시스템 내부에서 주로 호출됩니다. (Mainly called internally by the system.)
RedGPU.math.updateObject3DMatrix(mesh, view);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) \| [`AGroupBase`](../../Display/namespaces/CoreGroup/classes/AGroupBase.md) | 행렬을 업데이트할 대상 객체 (Mesh 또는 AGroupBase)
| `view` | [`View3D`](../../Display/classes/View3D.md) | 현재 렌더링 중인 View3D 인스턴스 (크기 계산 등에 사용)

## Returns

`void`
