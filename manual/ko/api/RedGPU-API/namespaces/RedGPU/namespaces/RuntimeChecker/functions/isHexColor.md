[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isHexColor

# Function: isHexColor()

> **isHexColor**(`hex`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isHexColor.ts:21](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/runtimeChecker/isFunc/isHexColor.ts#L21)

주어진 문자열이 유효한 16진수(Hex) 색상 형식인지 검사합니다.


'#', '0x' 접두사가 붙은 3자리 또는 6자리 16진수 색상 문자열을 지원합니다.


* ### Example
```typescript
const isValid = RedGPU.RuntimeChecker.isHexColor('#FF0000');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` | 검사할 문자열

## Returns

`boolean`

유효한 Hex 색상이면 true, 아니면 false

