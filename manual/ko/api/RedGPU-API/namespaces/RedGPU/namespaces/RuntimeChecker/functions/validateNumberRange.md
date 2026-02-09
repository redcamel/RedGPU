[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateNumberRange

# Function: validateNumberRange()

> **validateNumberRange**(`value`, `minRange`, `maxRange`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateNumberRange.ts:32](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/runtimeChecker/validateFunc/validateNumberRange.ts#L32)

주어진 값이 지정된 범위 내의 숫자인지 검증합니다.


값이 지정된 최소/최대값 범위를 벗어나거나 숫자가 아니면 예외를 발생시킵니다.


* ### Example
```typescript
RedGPU.RuntimeChecker.validateNumberRange(50, 0, 100);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `value` | `number` | `undefined` | 검증할 숫자 값
| `minRange` | `number` | `-Number.MAX_VALUE` | 허용되는 최소값 (기본값: -Number.MAX_VALUE)
| `maxRange` | `number` | `Number.MAX_VALUE` | 허용되는 최대값 (기본값: Number.MAX_VALUE)

## Returns

`boolean`

범위 내의 숫자이면 true


## Throws

입력값이 숫자가 아니거나 범위를 벗어날 경우 Error 발생

