[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isUint

# Function: isUint()

> **isUint**(`value`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isUint.ts:19](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/runtimeChecker/isFunc/isUint.ts#L19)

값이 0 이상의 정수(Unsigned Integer)인지 검사합니다.

### Example
```typescript
RedGPU.RuntimeChecker.isUint(10); // true
RedGPU.RuntimeChecker.isUint(-1); // false
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | 검사할 숫자 값 |

## Returns

`boolean`

부호 없는 정수이면 true, 아니면 false
