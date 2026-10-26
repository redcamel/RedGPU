[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_MIPMAP\_FILTER\_MODE

# Variable: GPU\_MIPMAP\_FILTER\_MODE

> `const` **GPU\_MIPMAP\_FILTER\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_MIPMAP\_FILTER\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_MIPMAP_FILTER_MODE.ts#L7)

텍스처 샘플링 시 서로 다른 밉맵(Mipmap) 레벨 사이의 보간 방식을 정의하는 필터 모드 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-linear"></a> `LINEAR` | `"linear"` | `'linear'` | 인접한 두 밉맵 레벨에서 각각 샘플링한 뒤 두 값을 선형 보간(Trilinear Filtering)합니다. | [src/gpuConst/GPU\_MIPMAP\_FILTER\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_MIPMAP_FILTER_MODE.ts#L17) |
| <a id="property-nearest"></a> `NEAREST` | `"nearest"` | `'nearest'` | 계산된 LOD(Level of Detail)에서 가장 가까운 단일 밉맵 레벨을 선택하여 샘플링합니다. | [src/gpuConst/GPU\_MIPMAP\_FILTER\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_MIPMAP_FILTER_MODE.ts#L12) |
