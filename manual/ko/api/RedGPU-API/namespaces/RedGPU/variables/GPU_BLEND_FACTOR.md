[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_BLEND\_FACTOR

# Variable: GPU\_BLEND\_FACTOR

> `const` **GPU\_BLEND\_FACTOR**: `object`

Defined in: [src/gpuConst/GPU\_BLEND\_FACTOR.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L7)

렌더 파이프라인의 색상 및 알파 블렌딩 연산에서 소스(Source)와 대상(Destination) 값에 곱해지는 가중치 계수 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-constant"></a> `CONSTANT` | `"constant"` | `"constant"` | 렌더 패스에 설정된 고정 블렌드 상수(`blendConstant`) 값을 가중치로 적용합니다. `(Rc, Gc, Bc, Ac)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:67](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L67) |
| <a id="property-dst"></a> `DST` | `"dst"` | `"dst"` | 렌더 타겟(프레임버퍼)에 기록된 대상 색상값을 가중치로 적용합니다. `(Rd, Gd, Bd, Ad)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L42) |
| <a id="property-dst_alpha"></a> `DST_ALPHA` | `"dst-alpha"` | `"dst-alpha"` | 대상의 알파(Alpha) 값을 가중치로 적용합니다. `(Ad, Ad, Ad, Ad)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:52](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L52) |
| <a id="property-one"></a> `ONE` | `"one"` | `'one'` | 가중치로 `1`을 적용합니다. `(1, 1, 1, 1)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L17) |
| <a id="property-one_minus_constant"></a> `ONE_MINUS_CONSTANT` | `"one-minus-constant"` | `"one-minus-constant"` | `1`에서 고정 블렌드 상수 값을 뺀 보수 값을 가중치로 적용합니다. `(1-Rc, 1-Gc, 1-Bc, 1-Ac)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:72](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L72) |
| <a id="property-one_minus_dst"></a> `ONE_MINUS_DST` | `"one-minus-dst"` | `"one-minus-dst"` | `1`에서 대상 색상값을 뺀 보수 값을 가중치로 적용합니다. `(1-Rd, 1-Gd, 1-Bd, 1-Ad)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L47) |
| <a id="property-one_minus_dst_alpha"></a> `ONE_MINUS_DST_ALPHA` | `"one-minus-dst-alpha"` | `"one-minus-dst-alpha"` | `1`에서 대상 알파 값을 뺀 보수 값을 가중치로 적용합니다. `(1-Ad, 1-Ad, 1-Ad, 1-Ad)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L57) |
| <a id="property-one_minus_src"></a> `ONE_MINUS_SRC` | `"one-minus-src"` | `"one-minus-src"` | `1`에서 소스 색상값을 뺀 보수 값을 가중치로 적용합니다. `(1-Rs, 1-Gs, 1-Bs, 1-As)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L27) |
| <a id="property-one_minus_src_alpha"></a> `ONE_MINUS_SRC_ALPHA` | `"one-minus-src-alpha"` | `"one-minus-src-alpha"` | `1`에서 소스 알파 값을 뺀 보수 값을 가중치로 적용합니다. `(1-As, 1-As, 1-As, 1-As)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L37) |
| <a id="property-one_minus_src1"></a> `ONE_MINUS_SRC1` | `"one-minus-src1"` | `"one-minus-src1"` | `1`에서 두 번째 소스 색상값을 뺀 보수 값을 가중치로 적용합니다. `(1-Rs1, 1-Gs1, 1-Bs1, 1-As1)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:82](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L82) |
| <a id="property-one_minus_src1_alpha"></a> `ONE_MINUS_SRC1_ALPHA` | `"one-minus-src1-alpha"` | `"one-minus-src1-alpha"` | `1`에서 두 번째 소스 알파 값을 뺀 보수 값을 가중치로 적용합니다. `(1-As1, 1-As1, 1-As1, 1-As1)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L92) |
| <a id="property-src"></a> `SRC` | `"src"` | `"src"` | 프래그먼트 셰이더가 출력한 소스 색상값을 가중치로 적용합니다. `(Rs, Gs, Bs, As)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L22) |
| <a id="property-src_alpha"></a> `SRC_ALPHA` | `"src-alpha"` | `"src-alpha"` | 소스의 알파(Alpha) 값을 가중치로 적용합니다. `(As, As, As, As)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L32) |
| <a id="property-src_alpha_saturated"></a> `SRC_ALPHA_SATURATED` | `"src-alpha-saturated"` | `"src-alpha-saturated"` | 포화된 소스 알파 값(`min(As, 1-Ad)`)을 색상 가중치로, `1`을 알파 가중치로 적용합니다. | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L62) |
| <a id="property-src1"></a> `SRC1` | `"src1"` | `"src1"` | 듀얼 소스 블렌딩(Dual-Source Blending)의 두 번째 소스 색상값을 가중치로 적용합니다. `(Rs1, Gs1, Bs1, As1)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L77) |
| <a id="property-src1_alpha"></a> `SRC1_ALPHA` | `"src1-alpha"` | `"src1-alpha"` | 두 번째 소스의 알파 값을 가중치로 적용합니다. `(As1, As1, As1, As1)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L87) |
| <a id="property-zero"></a> `ZERO` | `"zero"` | `"zero"` | 가중치로 `0`을 적용합니다. `(0, 0, 0, 0)` | [src/gpuConst/GPU\_BLEND\_FACTOR.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_BLEND_FACTOR.ts#L12) |
