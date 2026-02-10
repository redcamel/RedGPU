[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / GeometryGPURenderInfo

# Class: GeometryGPURenderInfo

Defined in: [src/primitive/core/GeometryGPURenderInfo.ts:7](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/primitive/core/GeometryGPURenderInfo.ts#L7)


Class that stores GPU rendering layout information for geometry.

## Constructors

### Constructor

> **new GeometryGPURenderInfo**(`buffers`): `GeometryGPURenderInfo`

Defined in: [src/primitive/core/GeometryGPURenderInfo.ts:22](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/primitive/core/GeometryGPURenderInfo.ts#L22)


Creates an instance of GeometryGPURenderInfo.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | Array of buffer layouts to set |

#### Returns

`GeometryGPURenderInfo`

## Properties

### buffers

> **buffers**: `GPUVertexBufferLayout`[]

Defined in: [src/primitive/core/GeometryGPURenderInfo.ts:12](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/primitive/core/GeometryGPURenderInfo.ts#L12)


Array of vertex buffer layouts
