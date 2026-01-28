[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / worldToLocal

# Function: worldToLocal()

> **worldToLocal**(`targetMatrix`, `x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/utils/math/coordinates/worldToLocal.ts:35](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/utils/math/coordinates/worldToLocal.ts#L35)

월드 좌표를 로컬 좌표로 변환합니다.


* ### Example
```typescript
const localPos = RedGPU.Util.worldToLocal(mesh.modelMatrix, 10, 5, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMatrix` | [`mat4`](../../../type-aliases/mat4.md) | 변환에 사용할 4x4 행렬
| `x` | `number` | 월드 x 좌표
| `y` | `number` | 월드 y 좌표
| `z` | `number` | 월드 z 좌표

## Returns

\[`number`, `number`, `number`\]

변환된 로컬 좌표 [x, y, z]


## Throws

입력 좌표가 숫자가 아니면 Error 발생

