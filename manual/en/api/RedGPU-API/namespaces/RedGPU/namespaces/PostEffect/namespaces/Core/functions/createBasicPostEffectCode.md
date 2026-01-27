[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [PostEffect](../../../README.md) / [Core](../README.md) / createBasicPostEffectCode

# Function: createBasicPostEffectCode()

> **createBasicPostEffectCode**(`effect`, `code`, `uniformStruct`): `object`

Defined in: [src/postEffect/core/createBasicPostEffectCode.ts:54](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/postEffect/core/createBasicPostEffectCode.ts#L54)


Helper function to create basic post-effect WGSL code.


Automatically generates WGSL code based on options such as MSAA/Non-MSAA, uniform structure, depth texture, etc.


Internally automatically includes system uniforms, source/output textures, workgroup sizes, etc.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `effect` | [`ASinglePassPostEffect`](../classes/ASinglePassPostEffect.md) | `undefined` | ASinglePassPostEffect instance |
| `code` | `string` | `undefined` | WGSL main code (inside main function) |
| `uniformStruct` | `string` | `''` | Uniform structure WGSL code (optional) |

## Returns

`object`


{ msaa: string, nonMsaa: string } - WGSL code for MSAA/Non-MSAA

* ### Example
```typescript
const shader = createBasicPostEffectCode(effect, '...main code...', 'struct Uniforms {...};');
// shader.msaa, shader.nonMsaa 사용
```

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `msaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:56](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/postEffect/core/createBasicPostEffectCode.ts#L56) |
| `nonMsaa` | `string` | [src/postEffect/core/createBasicPostEffectCode.ts:57](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/postEffect/core/createBasicPostEffectCode.ts#L57) |
