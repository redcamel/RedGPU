[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / createBasicPostEffectCode

# Function: createBasicPostEffectCode()

> **createBasicPostEffectCode**(`effect`, `code`, `uniformStruct?`, `sourceTextureConfigs?`): `object`

Defined in: [src/postEffect/core/createBasicPostEffectCode.ts:92](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/postEffect/core/createBasicPostEffectCode.ts#L92)

High-level helper function to generate WGSL code for basic post-processing effects.


This function automates repetitive boilerplate code and performs the following:
1. Automatically generates separate code for MSAA and Non-MSAA.
2. Automates binding of input source textures (Group 0).
3. Automatically includes effect-specific uniforms (Group 1) and system common resources (Group 2: G-Buffer, Depth, etc.).
4. Defines the storage texture for output (Group 3).
5. Reflects the workgroup size defined in the class.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `effect` | [`ASinglePassPostEffect`](../classes/ASinglePassPostEffect.md) | `undefined` | Effect instance inheriting ASinglePassPostEffect |
| `code` | `string` | `undefined` | WGSL logic to be inserted inside the main function |
| `uniformStruct` | `string` | `''` | (Optional) Uniforms struct definition for the effect |
| `sourceTextureConfigs` | [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md) \| [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md)[] | `...` | (Optional) Configurations for input sources (Default: {name: 'sourceTexture'}) |

## Returns

`object`

WGSL code objects generated for MSAA and Non-MSAA respectively

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `msaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:99](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/postEffect/core/createBasicPostEffectCode.ts#L99) |
| `nonMsaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:100](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/postEffect/core/createBasicPostEffectCode.ts#L100) |
