[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateUintRange

# Function: validateUintRange()

> **validateUintRange**(`value`, `min`, `max`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateUintRange.ts:34](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/runtimeChecker/validateFunc/validateUintRange.ts#L34)

주어진 값이 부호 없는 정수(Uint) 범위 내에 있는지 검증합니다.


입력값들이 정수가 아니거나, 지정된 최소/최대 범위를 벗어날 경우 예외를 발생시킵니다.


* ### Example
```typescript
RedGPU.RuntimeChecker.validateUintRange(10, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | 검증할 숫자 값
| `min` | `number` | `0` | 허용되는 최소 Uint 값 (기본값: 0)
| `max` | `number` | `MAX_UINT` | 허용되는 최대 Uint 값 (기본값: 4503599627370496)

## Returns

`boolean`

범위 내의 Uint이면 true


## Throws

값 또는 범위가 Uint가 아니거나, 범위를 벗어날 경우 Error 발생

