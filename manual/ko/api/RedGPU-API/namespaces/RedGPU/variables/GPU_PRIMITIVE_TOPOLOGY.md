[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_PRIMITIVE\_TOPOLOGY

# Variable: GPU\_PRIMITIVE\_TOPOLOGY

> `const` **GPU\_PRIMITIVE\_TOPOLOGY**: `object`

Defined in: [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L7)

정점(Vertex) 스트림을 점, 선, 삼각형 등의 기하학적 기본 도형(Primitive)으로 조립하는 토폴로지 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-line_list"></a> `LINE_LIST` | `"line-list"` | `'line-list'` | 정점을 2개씩 짝지어 서로 분리된 독립 선분(Line Segment)으로 렌더링합니다. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L17) |
| <a id="property-line_strip"></a> `LINE_STRIP` | `"line-strip"` | `'line-strip'` | 연속된 정점들을 순서대로 이어 하나의 연결된 선(Polyline)으로 렌더링합니다. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L22) |
| <a id="property-point_list"></a> `POINT_LIST` | `"point-list"` | `'point-list'` | 각각의 정점을 독립된 단일 점(Point)으로 렌더링합니다. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L12) |
| <a id="property-triangle_list"></a> `TRIANGLE_LIST` | `"triangle-list"` | `'triangle-list'` | 정점을 3개씩 묶어 서로 분리된 독립 삼각형(Triangle)으로 렌더링합니다. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L27) |
| <a id="property-triangle_strip"></a> `TRIANGLE_STRIP` | `"triangle-strip"` | `'triangle-strip'` | 이전 삼각형의 마지막 두 정점과 새 정점을 공유하여 연속된 삼각형 띠(Triangle Strip)로 렌더링합니다. | [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L32) |
