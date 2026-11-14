[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isHexColor

# Function: isHexColor()

> **isHexColor**(`hex`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isHexColor.ts:19](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/runtimeChecker/isFunc/isHexColor.ts#L19)

Checks if the given value is a valid hexadecimal (Hex) color format. Supports 3/6-digit strings with '#' prefix or integers in the range 0 to 0xFFFFFF.

### Example
```typescript
const isValidStr = RedGPU.RuntimeChecker.isHexColor('#FF0000');
const isValidNum = RedGPU.RuntimeChecker.isHexColor(0xFF0000);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `any` | Value to check (string or number) |

## Returns

`boolean`

True if it is a valid hex color, otherwise false
