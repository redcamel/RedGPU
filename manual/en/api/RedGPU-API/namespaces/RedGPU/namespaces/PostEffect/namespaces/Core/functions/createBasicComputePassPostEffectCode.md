[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / createBasicComputePassPostEffectCode

# Function: createBasicComputePassPostEffectCode()

> **createBasicComputePassPostEffectCode**(`effect`, `code`, `uniformStruct?`, `sourceTextureConfigs?`, `earlyExit?`, `useSystemUniforms?`): `string`

Defined in: [src/postEffect/core/createBasicComputePassPostEffectCode.ts:35](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/createBasicComputePassPostEffectCode.ts#L35)

Generates WGSL compute shader code for a single compute-pass post-processing effect.

Automatically configures bindings for input source textures (Group 0), effect uniforms (Group 1), system uniforms and G-Buffer (Group 2, optional), output storage texture (Group 3 when `useSystemUniforms` is `true`, Group 2 when `false`), and boundary early-exit checks (`earlyExit`).

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `effect` | [`ASingleComputePassPostEffect`](../classes/ASingleComputePassPostEffect.md) | `undefined` | Target `ASingleComputePassPostEffect` instance |
| `code` | `string` | `undefined` | WGSL computation code to insert inside the `main` function |
| `uniformStruct?` | `string` | `''` | Effect-specific `Uniforms` struct definition string |
| `sourceTextureConfigs?` | [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md) \| [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md)[] | `...` | Input source texture binding configuration |
| `earlyExit?` | `boolean` | `true` | Whether to immediately terminate threads outside output resolution bounds (set `false` when using workgroup barriers) |
| `useSystemUniforms?` | `boolean` | `true` | Whether to include system uniforms and G-Buffer (Group 2) bindings |

## Returns

`string`

Generated WGSL compute shader code string (`string`)
