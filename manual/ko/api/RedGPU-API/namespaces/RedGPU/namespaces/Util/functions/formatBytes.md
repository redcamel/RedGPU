[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / formatBytes

# Function: formatBytes()

> **formatBytes**(`bytes`, `decimals`): `string`

Defined in: [src/utils/math/formatBytes.ts:26](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/utils/math/formatBytes.ts#L26)

바이트 단위를 사람이 읽기 쉬운 문자열로 변환합니다.


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

변환된 바이트 문자열 (예: '1.23 MB')


## Throws

bytes가 유효한 uint가 아닐 경우 Error 발생

