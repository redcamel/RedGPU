[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / calculateMeshOBB

# Function: calculateMeshOBB()

> **calculateMeshOBB**(`mesh`): [`OBB`](../classes/OBB.md)

Defined in: [src/bound/math/calculateMeshOBB.ts:25](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/bound/math/calculateMeshOBB.ts#L25)

메시의 modelMatrix를 적용한 월드 공간 OBB를 계산합니다.


지오메트리 볼륨 정보를 기반으로 중심점, 반치수, 방향 행렬이 포함된 OBB를 반환합니다.


* ### Example
```typescript
const meshOBB = RedGPU.Bound.calculateMeshOBB(mesh);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | OBB를 계산할 메시 객체

## Returns

[`OBB`](../classes/OBB.md)

계산된 월드 기준 OBB 인스턴스

