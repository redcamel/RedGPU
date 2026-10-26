[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_ADDRESS\_MODE

# Variable: GPU\_ADDRESS\_MODE

> `const` **GPU\_ADDRESS\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_ADDRESS\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_ADDRESS_MODE.ts#L7)

텍스처 좌표가 정규화된 범위(`[0, 1]`)를 벗어날 때 적용되는 샘플링 래핑 모드 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-clamp_to_edge"></a> `CLAMP_TO_EDGE` | `"clamp-to-edge"` | `'clamp-to-edge'` | 범위 밖의 좌표를 가장자리 끝값(`0.0` 또는 `1.0`)으로 고정합니다. | [src/gpuConst/GPU\_ADDRESS\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_ADDRESS_MODE.ts#L12) |
| <a id="property-mirrored_repeat"></a> `MIRRORED_REPEAT` | `"mirror-repeat"` | `'mirror-repeat'` | 정수 경계마다 텍스처를 거울처럼 반전시키며 타일을 반복합니다. | [src/gpuConst/GPU\_ADDRESS\_MODE.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_ADDRESS_MODE.ts#L22) |
| <a id="property-repeat"></a> `REPEAT` | `"repeat"` | `'repeat'` | 정수를 버리고 소수 부분만 취해 텍스처 타일을 주기적으로 반복합니다. | [src/gpuConst/GPU\_ADDRESS\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_ADDRESS_MODE.ts#L17) |
