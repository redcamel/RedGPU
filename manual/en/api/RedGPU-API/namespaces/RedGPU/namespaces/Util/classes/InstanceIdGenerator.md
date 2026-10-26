[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / InstanceIdGenerator

# Class: InstanceIdGenerator

Defined in: [src/utils/uuid/InstanceIdGenerator.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/uuid/InstanceIdGenerator.ts#L12)

Utility that issues unique instance IDs, incrementing sequentially from 0 per class type (constructor).

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

Defined in: [src/utils/uuid/InstanceIdGenerator.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/utils/uuid/InstanceIdGenerator.ts#L31)

Returns the next ID for the given type and increments its internal counter by 1.

#### Example
```typescript
const id = RedGPU.Util.InstanceIdGenerator.getNextId(RedGPU.Display.Mesh);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `Function` | Target class constructor to issue the ID for |

#### Returns

`number`

Issued instance ID
