// define Struct
struct Uniforms {
  brightness:f32,
  contrast : f32
};
@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var _Sampler: sampler;
@group(0) @binding(2) var _Texture: texture_2d<f32>;
@fragment
fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
    var diffuseColor:vec4<f32> = textureSample(_Texture,_Sampler, uv);


    var t0:f32;
    if (uniforms.contrast > 0.0) {
        t0 = (1.0 - uniforms.contrast);
        diffuseColor = vec4<f32>(
            diffuseColor.r + (diffuseColor.r - 0.5) / t0 + 0.5,
            diffuseColor.g + (diffuseColor.g - 0.5) / t0 + 0.5,
            diffuseColor.b + (diffuseColor.b - 0.5) / t0 + 0.5,
            diffuseColor.a
        );
    } else {
        t0 = (1.0 + uniforms.contrast);
        diffuseColor = vec4<f32>(
            diffuseColor.r + (diffuseColor.r - 0.5) * t0 + 0.5,
            diffuseColor.g + (diffuseColor.g - 0.5) * t0 + 0.5,
            diffuseColor.b + (diffuseColor.b - 0.5) * t0 + 0.5,
            diffuseColor.a
        );
    }
    diffuseColor.r += uniforms.brightness;
    diffuseColor.g += uniforms.brightness;
    diffuseColor.b += uniforms.brightness;
  return diffuseColor;
}
