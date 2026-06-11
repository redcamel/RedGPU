[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / formatBytes

# Function: formatBytes()

> **formatBytes**(`bytes`, `decimals?`): `string`

Defined in: [src/utils/formatBytes.ts:17](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/utils/formatBytes.ts#L17)

바이트 단위를 읽기 쉬운 문자열(KB, MB, GB 등)로 변환합니다.

* ### Example
```typescript
const readable = RedGPU.Util.formatBytes(1048576); // '1.00 MB'
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `bytes` | `number` | `undefined` | 변환할 바이트 값
| `decimals` | `number` | `2` | 소수점 자릿수 (기본값: 2)

## Returns

`string`

변환된 문자열
