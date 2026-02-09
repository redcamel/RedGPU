[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / localToWorld

# Function: localToWorld()

> **localToWorld**(`targetMatrix`, `x`, `y`, `z`): \[`number`, `number`, `number`\]

Defined in: [src/math/coordinates/localToWorld.ts:34](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/coordinates/localToWorld.ts#L34)

로컬 좌표를 월드 좌표로 변환합니다.


### Example
```typescript
const worldPos = RedGPU.math.localToWorld(mesh.modelMatrix, 0, 1, 0);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMatrix` | [`mat4`](../type-aliases/mat4.md) | 변환에 사용할 4x4 행렬
| `x` | `number` | 로컬 x 좌표
| `y` | `number` | 로컬 y 좌표
| `z` | `number` | 로컬 z 좌표

## Returns

\[`number`, `number`, `number`\]

변환된 월드 좌표 [x, y, z]


## Throws

입력 좌표가 숫자가 아니면 Error 발생

