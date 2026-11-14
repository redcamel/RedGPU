[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / createUUID

# Function: createUUID()

> **createUUID**(): `string`

Defined in: [src/utils/uuid/createUUID.ts:23](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/utils/uuid/createUUID.ts#L23)

무작위 UUID(버전 4) 문자열을 생성합니다.

내부 정적 문자 버퍼를 재사용하며, 형식은 `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`(대문자 16진수)입니다.

### Example
```typescript
const uuid = RedGPU.Util.createUUID();
```

## Returns

`string`

생성된 UUID 문자열
