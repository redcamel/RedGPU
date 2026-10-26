[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateUintRange

# Function: validateUintRange()

> **validateUintRange**(`value`, `min?`, `max?`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateUintRange.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/runtimeChecker/validateFunc/validateUintRange.ts#L34)

값이 [min, max] 범위 내의 부호 없는 정수(Uint)인지 검증하며, 실패 시 예외를 발생시킵니다.

min과 max 역시 Uint여야 하며, min은 max보다 작아야 합니다.

### Example
```typescript
RedGPU.RuntimeChecker.validateUintRange(10, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | 검증할 숫자 값 |
| `min?` | `number` | `0` | 허용 최소 Uint 값 (기본값: 0) |
| `max?` | `number` | `MAX_UINT` | 허용 최대 Uint 값 (기본값: 4503599627370496) |

## Returns

`boolean`

범위 내의 Uint이면 true

## Throws

value/min/max가 Uint가 아니거나, min이 max 이상이거나, 값이 범위를 벗어난 경우 Error 발생
