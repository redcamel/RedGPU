[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isUint

# Function: isUint()

> **isUint**(`value`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isUint.ts:21](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/runtimeChecker/isFunc/isUint.ts#L21)

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

