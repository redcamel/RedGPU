[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / createBasicRenderPassPostEffectCode

# Function: createBasicRenderPassPostEffectCode()

> **createBasicRenderPassPostEffectCode**(`code`, `uniformStruct?`, `sourceTextureConfigs?`, `useSystemUniforms?`): `string`

Defined in: [src/postEffect/core/createBasicRenderPassPostEffectCode.ts:28](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/core/createBasicRenderPassPostEffectCode.ts#L28)

Generates WGSL vertex and fragment shader code for a single In-Place render-pass post-processing effect (`ASingleRenderPassPostEffect`).

Automatically configures a bufferless 3-vertex fullscreen triangle (`vs_main`), bindings for auxiliary input textures (Group 0), effect uniforms (Group 1), system uniforms and G-Buffer (Group 2), and the fragment entry point (`fs_main`). Because it composites In-Place onto the existing color buffer, it omits the default `sourceTexture` binding to prevent WebGPU Read-Write Hazards.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `code` | `string` | `undefined` | WGSL fragment computation code to insert inside `fs_main` (must return `vec4<f32>(...)`) |
| `uniformStruct?` | `string` | `''` | Effect-specific `Uniforms` struct definition or helper WGSL code string |
| `sourceTextureConfigs?` | [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md) \| [`IPostEffectSourceConfig`](../interfaces/IPostEffectSourceConfig.md)[] | `undefined` | Auxiliary input source texture binding configuration (defaults to `[]`) |
| `useSystemUniforms?` | `boolean` | `true` | Whether to include system uniforms and G-Buffer (Group 2) bindings |

## Returns

`string`

Generated WGSL vertex and fragment shader code string (`string`)
