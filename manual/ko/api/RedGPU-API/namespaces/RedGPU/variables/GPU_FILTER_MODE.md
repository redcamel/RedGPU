[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_FILTER\_MODE

# Variable: GPU\_FILTER\_MODE

> `const` **GPU\_FILTER\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_FILTER\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_FILTER_MODE.ts#L7)

텍스처 확대(Magnification) 및 축소(Minification) 샘플링 시 픽셀 간 보간 방식을 정의하는 필터 모드 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-linear"></a> `LINEAR` | `"linear"` | `'linear'` | 샘플링 좌표 주변의 인접 텍셀 값들을 선형 보간(Bilinear Interpolation)하여 반환합니다. | [src/gpuConst/GPU\_FILTER\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_FILTER_MODE.ts#L17) |
| <a id="property-nearest"></a> `NEAREST` | `"nearest"` | `'nearest'` | 샘플링 좌표에서 가장 가까운 단일 텍셀(Texel)의 값을 그대로 반환합니다. | [src/gpuConst/GPU\_FILTER\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_FILTER_MODE.ts#L12) |
