[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_BLEND\_FACTOR

# Variable: GPU\_BLEND\_FACTOR

> `const` **GPU\_BLEND\_FACTOR**: `object`

Defined in: [src/gpuConst/GPU\_BLEND\_FACTOR.ts:10](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/gpuConst/GPU_BLEND_FACTOR.ts#L10)

블렌딩 연산에 사용되는 팩터(계수) 옵션을 정의하는 상수군입니다.


소스(Source)와 대상(Destination) 색상을 혼합할 때 각 채널에 곱해지는 값을 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="constant"></a> `CONSTANT` | `"constant"` | `"constant"` | 설정된 상수 색상을 계수로 사용합니다.
| <a id="dst"></a> `DST` | `"dst"` | `"dst"` | 대상 색상 값을 계수로 사용합니다.
| <a id="dst_alpha"></a> `DST_ALPHA` | `"dst-alpha"` | `"dst-alpha"` | 대상 알파 값을 계수로 사용합니다.
| <a id="one"></a> `ONE` | `"one"` | `'one'` | 계수 1을 사용합니다.
| <a id="one_minus_constant"></a> `ONE_MINUS_CONSTANT` | `"one-minus-constant"` | `"one-minus-constant"` | (1 - 상수 색상) 값을 계수로 사용합니다.
| <a id="one_minus_dst"></a> `ONE_MINUS_DST` | `"one-minus-dst"` | `"one-minus-dst"` | (1 - 대상 색상) 값을 계수로 사용합니다.
| <a id="one_minus_dst_alpha"></a> `ONE_MINUS_DST_ALPHA` | `"one-minus-dst-alpha"` | `"one-minus-dst-alpha"` | (1 - 대상 알파) 값을 계수로 사용합니다.
| <a id="one_minus_src"></a> `ONE_MINUS_SRC` | `"one-minus-src"` | `"one-minus-src"` | (1 - 소스 색상) 값을 계수로 사용합니다.
| <a id="one_minus_src_alpha"></a> `ONE_MINUS_SRC_ALPHA` | `"one-minus-src-alpha"` | `"one-minus-src-alpha"` | (1 - 소스 알파) 값을 계수로 사용합니다.
| <a id="one_minus_src1"></a> `ONE_MINUS_SRC1` | `"one-minus-src1"` | `"one-minus-src1"` | (1 - 두 번째 소스 색상) 값을 계수로 사용합니다.
| <a id="one_minus_src1_alpha"></a> `ONE_MINUS_SRC1_ALPHA` | `"one-minus-src1-alpha"` | `"one-minus-src1-alpha"` | (1 - 두 번째 소스 알파) 값을 계수로 사용합니다.
| <a id="src"></a> `SRC` | `"src"` | `"src"` | 소스 색상 값을 계수로 사용합니다.
| <a id="src_alpha"></a> `SRC_ALPHA` | `"src-alpha"` | `"src-alpha"` | 소스 알파 값을 계수로 사용합니다.
| <a id="src_alpha_saturated"></a> `SRC_ALPHA_SATURATED` | `"src-alpha-saturated"` | `"src-alpha-saturated"` | 클램핑된 소스 알파 값을 계수로 사용합니다.
| <a id="src1"></a> `SRC1` | `"src1"` | `"src1"` | 두 번째 소스 색상을 계수로 사용합니다.
| <a id="src1_alpha"></a> `SRC1_ALPHA` | `"src1-alpha"` | `"src1-alpha"` | 두 번째 소스 알파 값을 계수로 사용합니다.
| <a id="zero"></a> `ZERO` | `"zero"` | `"zero"` | 계수 0을 사용합니다.
