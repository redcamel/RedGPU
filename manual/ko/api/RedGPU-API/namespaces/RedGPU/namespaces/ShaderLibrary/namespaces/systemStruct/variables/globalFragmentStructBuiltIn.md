[**RedGPU API v4.3.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / globalFragmentStructBuiltIn

# Variable: globalFragmentStructBuiltIn

> `const` **globalFragmentStructBuiltIn**: `string` = `globalFragmentStructBuiltIn_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2666](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L2666)

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
    useSSR:u32,
    metallic:f32,
    roughness:f32,
    //
};
```
