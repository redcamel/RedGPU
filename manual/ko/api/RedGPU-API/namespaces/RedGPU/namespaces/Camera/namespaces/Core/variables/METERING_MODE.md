[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / METERING\_MODE

# Variable: METERING\_MODE

> `const` **METERING\_MODE**: `object`

Defined in: [src/camera/core/METERING\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/METERING_MODE.ts#L7)

자동 노출(AutoExposure) 휘도 산출 시 사용되는 측광 모드 상수입니다.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-average"></a> `AVERAGE` | `0` | `0` | 화면 전체 픽셀의 휘도를 균등하게 반영하는 평균 측광 모드입니다. | [src/camera/core/METERING\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/METERING_MODE.ts#L12) |
| <a id="property-center_weighted"></a> `CENTER_WEIGHTED` | `1` | `1` | 화면 중앙부 픽셀에 높은 가중치를 부여하는 중앙 중점 측광 모드입니다. | [src/camera/core/METERING\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/METERING_MODE.ts#L17) |
| <a id="property-spot"></a> `SPOT` | `2` | `2` | 화면 정중앙의 좁은 영역 휘도만 측정하는 스팟 측광 모드입니다. | [src/camera/core/METERING\_MODE.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/METERING_MODE.ts#L22) |
