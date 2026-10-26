[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Primitive](../../../README.md) / [Core](../README.md) / GeometryGPURenderInfo

# Class: GeometryGPURenderInfo

Defined in: [src/primitive/core/GeometryGPURenderInfo.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/GeometryGPURenderInfo.ts#L12)

지오메트리의 GPU 정점 버퍼 레이아웃 정보를 보관하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new GeometryGPURenderInfo**(`buffers`): `GeometryGPURenderInfo`

Defined in: [src/primitive/core/GeometryGPURenderInfo.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/GeometryGPURenderInfo.ts#L27)

GeometryGPURenderInfo 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `buffers` | `GPUVertexBufferLayout`[] | 설정할 정점 버퍼 레이아웃 배열 |

#### Returns

`GeometryGPURenderInfo`

## Properties

### buffers

> **buffers**: `GPUVertexBufferLayout`[]

Defined in: [src/primitive/core/GeometryGPURenderInfo.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/primitive/core/GeometryGPURenderInfo.ts#L17)

GPU 정점 버퍼 레이아웃(`GPUVertexBufferLayout`) 배열입니다.
