[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ResourceStatusInfo

# Class: ResourceStatusInfo

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts#L12)

Status information class that manages the cache table and video memory usage per resource category.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ResourceStatusInfo**(): `ResourceStatusInfo`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts#L28)

Creates a ResourceStatusInfo instance.

#### Returns

`ResourceStatusInfo`

## Properties

### table

> **table**: `Map`\<`string`, `any`\>

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts#L17)

Map storing resource states by cache key (`Map<string, any>`)

***

### videoMemory

> **videoMemory**: `number` = `0`

Defined in: [src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/resourceState/ResourceStatusInfo.ts#L22)

Total video memory usage (in bytes) of the resource category
