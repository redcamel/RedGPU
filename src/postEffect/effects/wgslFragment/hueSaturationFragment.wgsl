// define Struct
struct Uniforms {
  hue : f32,
  saturation:f32
};
@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var _Sampler: sampler;
@group(0) @binding(2) var _Texture: texture_2d<f32>;
@fragment
fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
    var diffuseColor:vec4<f32> = textureSample(_Texture,_Sampler, uv);

    let angle:f32 = uniforms.hue * 3.1415926535897932384626433832795;
    let s:f32  = sin(angle);
    let c:f32 = cos(angle);
    let weights:vec3<f32> = (vec3<f32>(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;
    let len:f32 = length(diffuseColor.rgb);

    diffuseColor = vec4<f32>(
        dot(diffuseColor.rgb, weights.xyz),
        dot(diffuseColor.rgb, weights.zxy),
        dot(diffuseColor.rgb, weights.yzx),
        diffuseColor.a
    );

    let average:f32 = (diffuseColor.r + diffuseColor.g + diffuseColor.b) / 3.0;
    if (uniforms.saturation > 0.0) {
        let t0:f32 = (1.0 - 1.0 / (1.001 - uniforms.saturation));
        diffuseColor = vec4<f32>(
           diffuseColor.r + (average - diffuseColor.r) * t0,
           diffuseColor.g + (average - diffuseColor.g) * t0,
           diffuseColor.b + (average - diffuseColor.b) * t0,
           diffuseColor.a
        );
    } else {
        diffuseColor = vec4<f32>(
            diffuseColor.r + (average - diffuseColor.r) * -uniforms.saturation,
            diffuseColor.g + (average - diffuseColor.g) * -uniforms.saturation,
            diffuseColor.b + (average - diffuseColor.b) * -uniforms.saturation,
            diffuseColor.a
        );
    }
  return diffuseColor;
}
