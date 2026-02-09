[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / uuidToUint

# Function: uuidToUint()

> **uuidToUint**(`uuid`): `number`

Defined in: [src/utils/uuid/uuidToUint.ts:18](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/utils/uuid/uuidToUint.ts#L18)

UUID 문자열을 32비트 부호 없는 정수로 변환합니다.


* ### Example
```typescript
const uintId = RedGPU.Util.uuidToUint('123e4567-e89b-12d3-a456-426614174000');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uuid` | `string` | 변환할 UUID 문자열

## Returns

`number`

변환된 32비트 부호 없는 정수

