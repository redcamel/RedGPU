[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / createBasicPostEffectCode

# Function: createBasicPostEffectCode()

> **createBasicPostEffectCode**(`effect`, `code`, `uniformStruct?`, `sourceTextureConfigs?`, `earlyExit?`): `object`

Defined in: [src/postEffect/core/createBasicPostEffectCode.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/createBasicPostEffectCode.ts#L90)

Generates MSAA and Non-MSAA WGSL compute shader codes for a single-pass post-processing effect.

Automatically configures bindings for input source textures (Group 0), effect uniforms (Group 1), system uniforms and G-Buffer (Group 2), output storage texture (Group 3), and boundary early-exit checks (`earlyExit`).

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `effect` | [`ASinglePassPostEffect`](../classes/ASinglePassPostEffect.md) | `undefined` | Target `ASinglePassPostEffect` instance |
| `code` | `string` | `undefined` | WGSL computation code to insert inside the `main` function |
| `uniformStruct?` | `string` | `''` | Effect-specific `Uniforms` struct definition string |
| `sourceTextureConfigs?` | [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md) \| [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md)[] | `...` | Input source texture binding configuration |
| `earlyExit?` | `boolean` | `true` | Whether to immediately terminate threads outside output resolution bounds (set `false` when using workgroup barriers) |

## Returns

`object`

WGSL code object for MSAA and Non-MSAA (`{ msaa: string, nonMsaa: string }`)

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `msaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:98](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/createBasicPostEffectCode.ts#L98) |
| `nonMsaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/postEffect/core/createBasicPostEffectCode.ts#L99) |
