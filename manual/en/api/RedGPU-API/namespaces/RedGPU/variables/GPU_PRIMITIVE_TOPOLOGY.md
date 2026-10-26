[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_PRIMITIVE\_TOPOLOGY

# Variable: GPU\_PRIMITIVE\_TOPOLOGY

> `const` **GPU\_PRIMITIVE\_TOPOLOGY**: `object`

Defined in: [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L7)

Primitive topology constants defining how vertex streams are assembled into geometric primitives such as points, lines, or triangles.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-line_list"></a> `LINE_LIST` | `"line-list"` | `'line-list'` | Pairs every two vertices to render independent, disconnected line segments. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L17) |
| <a id="property-line_strip"></a> `LINE_STRIP` | `"line-strip"` | `'line-strip'` | Connects consecutive vertices in order to render a continuous polyline. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L22) |
| <a id="property-point_list"></a> `POINT_LIST` | `"point-list"` | `'point-list'` | Renders each vertex as an independent single point. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L12) |
| <a id="property-triangle_list"></a> `TRIANGLE_LIST` | `"triangle-list"` | `'triangle-list'` | Groups every three vertices to render independent, disconnected triangles. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L27) |
| <a id="property-triangle_strip"></a> `TRIANGLE_STRIP` | `"triangle-strip"` | `'triangle-strip'` | Shares the last two vertices of the previous triangle with each new vertex to render a continuous triangle strip. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L32) |
