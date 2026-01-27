[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / InstanceIdGenerator

# Class: InstanceIdGenerator

Defined in: [src/utils/uuid/InstanceIdGenerator.ts:15](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/utils/uuid/InstanceIdGenerator.ts#L15)


Utility class for generating unique instance IDs per type.


Manages separate counters for each constructor to assign IDs from 0.

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

Defined in: [src/utils/uuid/InstanceIdGenerator.ts:33](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/utils/uuid/InstanceIdGenerator.ts#L33)


Returns the next unique instance ID.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `Function` | Type to generate ID for |

#### Returns

`number`


Unique instance ID
