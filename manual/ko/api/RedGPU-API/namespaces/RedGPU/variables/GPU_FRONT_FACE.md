[**RedGPU API v4.4.0-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_FRONT\_FACE

# Variable: GPU\_FRONT\_FACE

> `const` **GPU\_FRONT\_FACE**: `object`

Defined in: [src/gpuConst/GPU\_FRONT\_FACE.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_FRONT_FACE.ts#L7)

폴리곤의 정점 감기 순서(Winding Order)에 따라 어느 방향을 앞면(Front Face)으로 판별할지 정의하는 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-ccw"></a> `CCW` | `"ccw"` | `'ccw'` | 정점이 반시계 방향(Counter-Clockwise, `'ccw'`)으로 감긴 폴리곤 면을 앞면으로 간주합니다. | [src/gpuConst/GPU\_FRONT\_FACE.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_FRONT_FACE.ts#L17) |
| <a id="property-cw"></a> `CW` | `"cw"` | `'cw'` | 정점이 시계 방향(Clockwise, `'cw'`)으로 감긴 폴리곤 면을 앞면으로 간주합니다. | [src/gpuConst/GPU\_FRONT\_FACE.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/gpuConst/GPU_FRONT_FACE.ts#L12) |
