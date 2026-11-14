[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isHexColor

# Function: isHexColor()

> **isHexColor**(`hex`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isHexColor.ts:19](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/runtimeChecker/isFunc/isHexColor.ts#L19)

주어진 값이 유효한 16진수(Hex) 색상 형식인지 검사합니다. '#' 접두사가 포함된 3자리/6자리 문자열 또는 0~0xFFFFFF 범위의 정수를 지원합니다.

### Example
```typescript
const isValidStr = RedGPU.RuntimeChecker.isHexColor('#FF0000');
const isValidNum = RedGPU.RuntimeChecker.isHexColor(0xFF0000);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `any` | 검사할 값 (문자열 또는 숫자) |

## Returns

`boolean`

유효한 Hex 색상이면 true, 아니면 false
