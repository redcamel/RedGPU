[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / GeometryGPURenderInfo

# Class: GeometryGPURenderInfo

Defined in: [src/primitive/core/GeometryGPURenderInfo.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/primitive/core/GeometryGPURenderInfo.ts#L12)

Class that holds GPU vertex buffer layout information for geometry.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new GeometryGPURenderInfo**(`buffers`): `GeometryGPURenderInfo`

Defined in: [src/primitive/core/GeometryGPURenderInfo.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/primitive/core/GeometryGPURenderInfo.ts#L27)

Creates a GeometryGPURenderInfo instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | Array of vertex buffer layouts to set |

#### Returns

`GeometryGPURenderInfo`

## Properties

### buffers

> **buffers**: `GPUVertexBufferLayout`[]

Defined in: [src/primitive/core/GeometryGPURenderInfo.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/primitive/core/GeometryGPURenderInfo.ts#L17)

Array of GPU vertex buffer layouts (`GPUVertexBufferLayout`).
