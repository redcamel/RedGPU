[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / globalFragmentStructBuiltIn

# Variable: globalFragmentStructBuiltIn

> `const` **globalFragmentStructBuiltIn**: `string` = `globalFragmentStructBuiltIn_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2765](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L2765)

```wgsl
struct GlobalFragmentStructBuiltIn {
    // basic
    opacity: f32,
    useTint:u32,
    tintBlendMode:u32,
    tint:vec4<f32>,
    // color
    color: vec3<f32>,
    // phong
    emissiveColor: vec3<f32>,
    emissiveStrength:f32,
    //
    specularColor:vec3<f32>,
    specularStrength:f32,
    shininess: f32,
    //
    aoStrength:f32,
    //
    normalScale:f32,
    displacementScale:f32,
    //
    metallic:f32,
    roughness:f32,
    //
};
```
