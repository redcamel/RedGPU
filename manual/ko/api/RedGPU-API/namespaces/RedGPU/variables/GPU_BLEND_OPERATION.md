[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_BLEND\_OPERATION

# Variable: GPU\_BLEND\_OPERATION

> `const` **GPU\_BLEND\_OPERATION**: `object`

Defined in: [src/gpuConst/GPU\_BLEND\_OPERATION.ts:7](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_BLEND_OPERATION.ts#L7)

가중치가 적용된 소스(Source)와 대상(Destination) 색상/알파 값을 결합하는 블렌딩 산술 연산자 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-add"></a> `ADD` | `"add"` | `"add"` | 가중치가 곱해진 소스 값과 대상 값을 더합니다. (`Src * SrcFactor + Dst * DstFactor`) | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_BLEND_OPERATION.ts#L12) |
| <a id="property-max"></a> `MAX` | `"max"` | `"max"` | 소스와 대상의 각 채널 중 더 큰 값을 선택합니다. (`max(Src, Dst)`) | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_BLEND_OPERATION.ts#L32) |
| <a id="property-min"></a> `MIN` | `"min"` | `"min"` | 소스와 대상의 각 채널 중 더 작은 값을 선택합니다. (`min(Src, Dst)`) | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_BLEND_OPERATION.ts#L27) |
| <a id="property-reverse_subtract"></a> `REVERSE_SUBTRACT` | `"reverse-subtract"` | `"reverse-subtract"` | 가중치가 곱해진 대상 값에서 소스 값을 뺍니다. (`Dst * DstFactor - Src * SrcFactor`) | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_BLEND_OPERATION.ts#L22) |
| <a id="property-subtract"></a> `SUBTRACT` | `"subtract"` | `"subtract"` | 가중치가 곱해진 소스 값에서 대상 값을 뺍니다. (`Src * SrcFactor - Dst * DstFactor`) | [src/gpuConst/GPU\_BLEND\_OPERATION.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/gpuConst/GPU_BLEND_OPERATION.ts#L17) |
