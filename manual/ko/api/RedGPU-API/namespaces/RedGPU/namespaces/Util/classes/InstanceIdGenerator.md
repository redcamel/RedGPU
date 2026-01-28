[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / InstanceIdGenerator

# Class: InstanceIdGenerator

Defined in: [src/utils/uuid/InstanceIdGenerator.ts:15](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/utils/uuid/InstanceIdGenerator.ts#L15)

타입별 고유 인스턴스 ID를 생성하는 유틸리티 클래스입니다.


각 생성자 타입마다 별도의 카운터를 관리하여 0부터 ID를 부여합니다.


* ### Example
```typescript
const id = RedGPU.Util.InstanceIdGenerator.getNextId(RedMesh);
```

## Constructors

### Constructor

> **new InstanceIdGenerator**(): `InstanceIdGenerator`

#### Returns

`InstanceIdGenerator`

## Methods

### getNextId()

> `static` **getNextId**(`type`): `number`

Defined in: [src/utils/uuid/InstanceIdGenerator.ts:33](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/utils/uuid/InstanceIdGenerator.ts#L33)

다음 고유 인스턴스 ID를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `Function` | ID를 생성할 타입

#### Returns

`number`

고유 인스턴스 ID

