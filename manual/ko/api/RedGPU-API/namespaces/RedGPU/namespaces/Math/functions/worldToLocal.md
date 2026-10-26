[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / worldToLocal

# Function: worldToLocal()

> **worldToLocal**(`targetMatrix`, `x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/math/coordinates/worldToLocal.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/coordinates/worldToLocal.ts#L36)

4x4 변환 행렬(`targetMatrix`)의 역행렬을 사용하여 3D 월드 좌표(`[x, y, z]`)를 로컬 좌표(`[x, y, z]`)로 변환합니다.

### Example
```typescript
const [localX, localY, localZ] = RedGPU.Math.worldToLocal(mesh.modelMatrix, 10, 5, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMatrix` | [`mat4`](../type-aliases/mat4.md) | 기준 객체의 4x4 월드 변환 행렬 (`mat4`, 열 우선) |
| `x` | `number` | 변환할 월드 X 좌표 |
| `y` | `number` | 변환할 월드 Y 좌표 |
| `z` | `number` | 변환할 월드 Z 좌표 |

## Returns

\[`number`, `number`, `number`\]

변환된 로컬 좌표 튜플 (`[x, y, z]`)

## Throws

`x`, `y`, `z` 중 하나라도 유효한 숫자가 아닐 경우 에러 발생

## See

[World to Local example](https://redcamel.github.io/RedGPU/examples/3d/coordinateTransformation/worldToLocal/)
