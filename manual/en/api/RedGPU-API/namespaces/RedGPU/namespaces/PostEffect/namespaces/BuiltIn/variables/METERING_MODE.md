[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [BuiltIn](../README.md) / METERING\_MODE

# Variable: METERING\_MODE

> `const` **METERING\_MODE**: `object`

Defined in: [src/postEffect/builtIn/autoExposure/METERING\_MODE.ts:7](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/METERING_MODE.ts#L7)

Metering mode constants used when calculating luminance for auto-exposure.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-average"></a> `AVERAGE` | `0` | `0` | Average metering mode that weights all screen pixels equally. | [src/postEffect/builtIn/autoExposure/METERING\_MODE.ts:12](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/METERING_MODE.ts#L12) |
| <a id="property-center_weighted"></a> `CENTER_WEIGHTED` | `1` | `1` | Center-weighted metering mode that assigns higher weight to the central screen area. | [src/postEffect/builtIn/autoExposure/METERING\_MODE.ts:17](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/METERING_MODE.ts#L17) |
| <a id="property-spot"></a> `SPOT` | `2` | `2` | Spot metering mode that measures luminance only within a narrow area at the screen center. | [src/postEffect/builtIn/autoExposure/METERING\_MODE.ts:22](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/autoExposure/METERING_MODE.ts#L22) |
