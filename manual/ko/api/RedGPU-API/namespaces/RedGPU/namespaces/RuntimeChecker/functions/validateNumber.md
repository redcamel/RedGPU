[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / validateNumber

# Function: validateNumber()

> **validateNumber**(`value`): `boolean`

Defined in: [src/runtimeChecker/validateFunc/validateNumber.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/runtimeChecker/validateFunc/validateNumber.ts#L23)

값이 NaN이 아닌 number 타입인지 검증하며, 실패 시 예외를 발생시킵니다.

### Example
```typescript
RedGPU.RuntimeChecker.validateNumber(123);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 검증할 값 |

## Returns

`boolean`

유효한 숫자이면 true

## Throws

number 타입이 아니거나 NaN인 경우 Error 발생
