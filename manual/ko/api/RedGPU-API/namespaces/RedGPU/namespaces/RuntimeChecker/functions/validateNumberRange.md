[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateNumberRange

# Function: validateNumberRange()

> **validateNumberRange**(`value`, `minRange?`, `maxRange?`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateNumberRange.ts:29](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/runtimeChecker/validateFunc/validateNumberRange.ts#L29)

값이 [minRange, maxRange] 범위 내의 숫자인지 검증하며, 실패 시 예외를 발생시킵니다.

### Example
```typescript
RedGPU.RuntimeChecker.validateNumberRange(50, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | 검증할 숫자 값 |
| `minRange?` | `number` | `-Number.MAX_VALUE` | 허용 최소값 (기본값: -Number.MAX_VALUE) |
| `maxRange?` | `number` | `Number.MAX_VALUE` | 허용 최대값 (기본값: Number.MAX_VALUE) |

## Returns

`boolean`

범위 내의 숫자이면 true

## Throws

인자가 숫자가 아니거나 NaN, 또는 값이 범위를 벗어난 경우 Error 발생
