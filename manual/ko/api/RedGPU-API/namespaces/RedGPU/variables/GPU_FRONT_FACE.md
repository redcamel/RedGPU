[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_FRONT\_FACE

# Variable: GPU\_FRONT\_FACE

> `const` **GPU\_FRONT\_FACE**: `object`

Defined in: [src/gpuConst/GPU\_FRONT\_FACE.ts:10](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/gpuConst/GPU_FRONT_FACE.ts#L10)

앞면(Front Face)을 판단하는 정점의 순서를 정의하는 상수군입니다.


정점이 배치된 순서에 따라 어느 쪽이 앞면인지 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="ccw"></a> `CCW` | `"ccw"` | `'ccw'` | 반시계 방향(Counter-Clockwise)으로 배치된 면을 앞면으로 간주합니다.
| <a id="cw"></a> `CW` | `"cw"` | `'cw'` | 시계 방향(Clockwise)으로 배치된 면을 앞면으로 간주합니다.
