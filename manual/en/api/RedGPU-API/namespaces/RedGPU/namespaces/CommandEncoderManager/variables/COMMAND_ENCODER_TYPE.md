[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [CommandEncoderManager](../README.md) / COMMAND\_ENCODER\_TYPE

# Variable: COMMAND\_ENCODER\_TYPE

> `const` **COMMAND\_ENCODER\_TYPE**: `object`

Defined in: [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:7](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L7)

Constant object defining the execution phase types of GPU command encoders.

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-immediate"></a> `IMMEDIATE` | `"IMMEDIATE"` | `'IMMEDIATE'` | Immediate submission phase (immediately submitted to the queue with an independent command encoder) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L32) |
| <a id="property-main"></a> `MAIN` | `"MAIN"` | `'MAIN'` | Main rendering phase (main scene draw, etc.) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L22) |
| <a id="property-post_process"></a> `POST_PROCESS` | `"POST_PROCESS"` | `'POST_PROCESS'` | Post-processing phase (applying post-processing effects such as blur and tonemapping) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L27) |
| <a id="property-pre_process"></a> `PRE_PROCESS` | `"PRE_PROCESS"` | `'PRE_PROCESS'` | Pre-processing phase (G-Buffer rendering, shadow map generation, physics simulation, etc.) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L17) |
| <a id="property-resource"></a> `RESOURCE` | `"RESOURCE"` | `'RESOURCE'` | Resource processing phase (buffer write, texture/buffer copy, etc.) | [src/commandEncoderManager/COMMAND\_ENCODER\_TYPE.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/commandEncoderManager/COMMAND_ENCODER_TYPE.ts#L12) |
