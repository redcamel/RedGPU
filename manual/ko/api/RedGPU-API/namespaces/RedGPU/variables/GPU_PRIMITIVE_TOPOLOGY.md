[**RedGPU API v4.0.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_PRIMITIVE\_TOPOLOGY

# Variable: GPU\_PRIMITIVE\_TOPOLOGY

> `const` **GPU\_PRIMITIVE\_TOPOLOGY**: `object`

Defined in: [src/gpuConst/GPU\_PRIMITIVE\_TOPOLOGY.ts:10](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/gpuConst/GPU_PRIMITIVE_TOPOLOGY.ts#L10)

정점 데이터를 기하학적 도형으로 해석하는 방식을 정의하는 상수군입니다.


정점들이 어떤 규칙으로 연결되어 그려질지 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-line_list"></a> `LINE_LIST` | `"line-list"` | `'line-list'` | 두 정점을 연결하여 독립적인 선분을 만듭니다.
| <a id="property-line_strip"></a> `LINE_STRIP` | `"line-strip"` | `'line-strip'` | 연속된 정점들을 하나의 선으로 연결합니다.
| <a id="property-point_list"></a> `POINT_LIST` | `"point-list"` | `'point-list'` | 각 정점을 독립적인 점으로 렌더링합니다.
| <a id="property-triangle_list"></a> `TRIANGLE_LIST` | `"triangle-list"` | `'triangle-list'` | 세 정점을 연결하여 독립적인 삼각형을 만듭니다.
| <a id="property-triangle_strip"></a> `TRIANGLE_STRIP` | `"triangle-strip"` | `'triangle-strip'` | 연속된 정점들을 연결하여 삼각형 띠를 만듭니다.
