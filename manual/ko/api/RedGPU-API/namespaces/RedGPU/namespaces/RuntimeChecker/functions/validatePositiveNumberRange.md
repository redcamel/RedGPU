[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validatePositiveNumberRange

# Function: validatePositiveNumberRange()

> **validatePositiveNumberRange**(`value`, `minRange`, `maxRange`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validatePositiveNumberRange.ts:32](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/runtimeChecker/validateFunc/validatePositiveNumberRange.ts#L32)

주어진 값이 0 이상의 양수이며 지정된 범위 내에 있는지 검증합니다.


값이 0 미만이거나 지정된 범위를 벗어날 경우 예외를 발생시킵니다.


* ### Example
```typescript
RedGPU.RuntimeChecker.validatePositiveNumberRange(10, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | 검증할 숫자 값
| `minRange` | `number` | `0` | 허용되는 최소값 (0 이상, 기본값: 0)
| `maxRange` | `number` | `Number.MAX_VALUE` | 허용되는 최대값 (기본값: Number.MAX_VALUE)

## Returns

`boolean`

범위 내의 양수이면 true


## Throws

입력값이 숫자가 아니거나, 0 미만이거나, 범위를 벗어날 경우 Error 발생

