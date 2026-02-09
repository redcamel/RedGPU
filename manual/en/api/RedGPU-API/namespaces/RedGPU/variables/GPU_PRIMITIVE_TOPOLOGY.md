[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_PRIMITIVE\_TOPOLOGY

# Variable: GPU\_PRIMITIVE\_TOPOLOGY

> `const` **GPU\_PRIMITIVE\_TOPOLOGY**: `object`

Defined in: [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:10](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L10)


Constants defining how to interpret vertex data as geometric shapes.


Determines the rules by which vertices are connected and drawn.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="line_list"></a> `LINE_LIST` | `"line-list"` | `'line-list'` | Connects two vertices to form an independent line segment. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:20](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L20) |
| <a id="line_strip"></a> `LINE_STRIP` | `"line-strip"` | `'line-strip'` | Connects consecutive vertices into a single continuous line. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:25](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L25) |
| <a id="point_list"></a> `POINT_LIST` | `"point-list"` | `'point-list'` | Renders each vertex as an independent point. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:15](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L15) |
| <a id="triangle_list"></a> `TRIANGLE_LIST` | `"triangle-list"` | `'triangle-list'` | Connects three vertices to form an independent triangle. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:30](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L30) |
| <a id="triangle_strip"></a> `TRIANGLE_STRIP` | `"triangle-strip"` | `'triangle-strip'` | Connects consecutive vertices to form a triangle strip. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:35](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L35) |
