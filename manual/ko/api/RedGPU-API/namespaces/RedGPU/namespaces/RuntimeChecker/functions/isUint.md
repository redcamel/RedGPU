[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isUint

# Function: isUint()

> **isUint**(`value`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isUint.ts:21](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/runtimeChecker/isFunc/isUint.ts#L21)

주어진 값이 부호 없는 정수(Unsigned Integer)인지 검사합니다.


0 이상의 정수이면 true를 반환합니다.


* ### Example
```typescript
const isValid = RedGPU.RuntimeChecker.isUint(10);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 검사할 숫자 값

## Returns

`boolean`

부호 없는 정수이면 true, 아니면 false

