[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / InstanceIdGenerator

# Class: InstanceIdGenerator

Defined in: [src/utils/uuid/InstanceIdGenerator.ts:15](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/utils/uuid/InstanceIdGenerator.ts#L15)

Utility for generating unique instance IDs per type (Constructor).

Maintains an independent counter for each class type and assigns IDs sequentially starting from 0.

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

Defined in: [src/utils/uuid/InstanceIdGenerator.ts:25](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/utils/uuid/InstanceIdGenerator.ts#L25)

Returns the next unique ID for the given type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `Function` | Target type |

#### Returns

`number`

Unique ID
