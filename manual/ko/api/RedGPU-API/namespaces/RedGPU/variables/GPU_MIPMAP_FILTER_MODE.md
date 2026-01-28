[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_MIPMAP\_FILTER\_MODE

# Variable: GPU\_MIPMAP\_FILTER\_MODE

> `const` **GPU\_MIPMAP\_FILTER\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_MIPMAP\_FILTER\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/gpuConst/GPU_MIPMAP_FILTER_MODE.ts#L10)

밉맵 레벨 간 샘플링 시의 필터링 모드 옵션을 정의하는 상수군입니다.


텍스처의 밉맵 레벨 사이를 어떻게 보간할지 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="linear"></a> `LINEAR` | `"linear"` | `'linear'` | 인접한 두 밉맵 레벨 사이를 선형 보간합니다.
| <a id="nearest"></a> `NEAREST` | `"nearest"` | `'nearest'` | 가장 가까운 밉맵 레벨에서 샘플링합니다.
