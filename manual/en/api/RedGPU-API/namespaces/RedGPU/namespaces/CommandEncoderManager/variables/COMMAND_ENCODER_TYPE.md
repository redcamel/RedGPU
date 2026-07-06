[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / COMMAND\_ENCODER\_TYPE

# Variable: COMMAND\_ENCODER\_TYPE

> `const` **COMMAND\_ENCODER\_TYPE**: `object`

Defined in: [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:6](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L6)

Constant object defining the types of GPU command encoders.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-main"></a> `MAIN` | `"MAIN"` | `'MAIN'` | Main rendering phase (main scene draw, etc.) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:21](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L21) |
| <a id="property-post_process"></a> `POST_PROCESS` | `"POST_PROCESS"` | `'POST_PROCESS'` | Post-processing phase (apply post-processing effects like blur, tonemapping) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:26](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L26) |
| <a id="property-pre_process"></a> `PRE_PROCESS` | `"PRE_PROCESS"` | `'PRE_PROCESS'` | Pre-processing phase (e.g., G-Buffer rendering, shadow map rendering, physics simulation) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:16](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L16) |
| <a id="property-resource"></a> `RESOURCE` | `"RESOURCE"` | `'RESOURCE'` | Resource processing phase (e.g., copy, write buffer) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:11](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L11) |
