[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / globalFragmentStructBuiltIn

# Variable: globalFragmentStructBuiltIn

> `const` **globalFragmentStructBuiltIn**: `string` = `globalFragmentStructBuiltIn_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2763](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L2763)

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
