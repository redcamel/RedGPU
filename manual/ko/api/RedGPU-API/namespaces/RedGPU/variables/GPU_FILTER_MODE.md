[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_FILTER\_MODE

# Variable: GPU\_FILTER\_MODE

> `const` **GPU\_FILTER\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_FILTER\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/gpuConst/GPU_FILTER_MODE.ts#L10)

텍스처 샘플링 시의 필터링 모드 옵션을 정의하는 상수군입니다.


텍스처 확대 및 축소 시 픽셀 간 보간 방식을 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="linear"></a> `LINEAR` | `"linear"` | `'linear'` | 주변 텍셀 값들을 선형 보간하여 사용합니다.
| <a id="nearest"></a> `NEAREST` | `"nearest"` | `'nearest'` | 가장 가까운 텍셀의 값을 사용합니다.
