
struct GlobalFragmentBuiltInUniform {
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