[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateNumber

# Function: validateNumber()

> **validateNumber**(`value`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateNumber.ts:26](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/runtimeChecker/validateFunc/validateNumber.ts#L26)

주어진 값이 숫자(Number) 타입인지 검증합니다.


값이 number 타입이 아니면 예외를 발생시킵니다.


* ### Example
```typescript
RedGPU.RuntimeChecker.validateNumber(123);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 검증할 값

## Returns

`boolean`

값이 숫자이면 true


## Throws

값이 숫자가 아닐 경우 Error 발생

