[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / InstanceIdGenerator

# Class: InstanceIdGenerator

Defined in: [src/utils/uuid/InstanceIdGenerator.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/uuid/InstanceIdGenerator.ts#L12)

클래스 타입(생성자)별로 0부터 순차 증가하는 고유 인스턴스 ID를 발급하는 유틸리티입니다.

### Example
```typescript
const id = RedGPU.Util.InstanceIdGenerator.getNextId(RedGPU.Display.Mesh);
```

## Constructors

### Constructor

> **new InstanceIdGenerator**(): `InstanceIdGenerator`

#### Returns

`InstanceIdGenerator`

## Methods

### getNextId()

> `static` **getNextId**(`type`): `number`

Defined in: [src/utils/uuid/InstanceIdGenerator.ts:31](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/utils/uuid/InstanceIdGenerator.ts#L31)

지정한 타입의 다음 ID를 반환하고 내부 카운터를 1 증가시킵니다.

#### Example
```typescript
const id = RedGPU.Util.InstanceIdGenerator.getNextId(RedGPU.Display.Mesh);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `Function` | ID를 발급할 대상 클래스 생성자 |

#### Returns

`number`

발급된 인스턴스 ID
