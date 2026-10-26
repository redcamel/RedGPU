[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / formatBytes

# Function: formatBytes()

> **formatBytes**(`bytes`, `decimals?`): `string`

Defined in: [src/utils/formatBytes.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/formatBytes.ts#L28)

바이트 값을 1024 단위 기준의 읽기 쉬운 문자열(Bytes, KB, MB, GB)로 변환합니다.

### Example
```typescript
// '1 MB' 반환
const readable = RedGPU.Util.formatBytes(1048576);
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `bytes` | `number` | `undefined` | 변환할 바이트 값 (0 이상의 정수) |
| `decimals?` | `number` | `2` | 소수점 자릿수 (기본값: 2, 음수는 0으로 처리) |

## Returns

`string`

단위가 포함된 변환 문자열

## Throws

`bytes`가 0 이상의 정수가 아닌 경우
