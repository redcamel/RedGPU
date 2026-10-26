[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_CULL\_MODE

# Variable: GPU\_CULL\_MODE

> `const` **GPU\_CULL\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_CULL\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_CULL_MODE.ts#L7)

렌더링 파이프라인에서 카메라를 기준으로 앞면(Front) 또는 뒷면(Back) 폴리곤을 렌더링에서 제외(Culling)할지 결정하는 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-back"></a> `BACK` | `"back"` | `'back'` | 뒷면(Back Face)을 컬링하여 앞면만 렌더링합니다. | [src/gpuConst/GPU\_CULL\_MODE.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_CULL_MODE.ts#L22) |
| <a id="property-front"></a> `FRONT` | `"front"` | `'front'` | 앞면(Front Face)을 컬링하여 뒷면만 렌더링합니다. | [src/gpuConst/GPU\_CULL\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_CULL_MODE.ts#L17) |
| <a id="property-none"></a> `NONE` | `"none"` | `'none'` | 면 컬링을 수행하지 않고 양면을 모두 렌더링합니다. | [src/gpuConst/GPU\_CULL\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_CULL_MODE.ts#L12) |
