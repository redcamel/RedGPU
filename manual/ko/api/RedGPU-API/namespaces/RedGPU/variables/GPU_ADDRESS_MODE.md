[**RedGPU API v3.9.1-Alpha**](../../../../README.md)

***

[RedGPU API](../../../../README.md) / [RedGPU](../README.md) / GPU\_ADDRESS\_MODE

# Variable: GPU\_ADDRESS\_MODE

> `const` **GPU\_ADDRESS\_MODE**: `object`

Defined in: [src/gpuConst/GPU\_ADDRESS\_MODE.ts:10](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/gpuConst/GPU_ADDRESS_MODE.ts#L10)

텍스처 샘플링 및 래핑을 위한 주소 모드 옵션을 정의하는 상수군입니다.


텍스처 좌표가 [0, 1] 범위를 벗어날 때의 샘플링 방식을 결정합니다.


## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="clamp_to_edge"></a> `CLAMP_TO_EDGE` | `"clamp-to-edge"` | `'clamp-to-edge'` | 텍스처 좌표를 [0, 1] 범위 내로 클램핑합니다.
| <a id="mirrored_repeat"></a> `MIRRORED_REPEAT` | `"mirror-repeat"` | `'mirror-repeat'` | 텍스처를 미러링하며 타일 형태로 반복합니다.
| <a id="repeat"></a> `REPEAT` | `"repeat"` | `'repeat'` | 텍스처를 타일 형태로 반복합니다.
