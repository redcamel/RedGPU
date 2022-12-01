// define Struct
struct Uniforms {
  resolution:vec2<f32>,
  width:f32,
  height : f32
};
@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var _Sampler: sampler;
@group(0) @binding(2) var _Texture: texture_2d<f32>;
@fragment
fn main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
    let dx:f32 = 1.0/uniforms.resolution.x * uniforms.width;
    let dy:f32 = 1.0/uniforms.resolution.y * uniforms.height;
    let coord:vec2<f32> = vec2<f32>(
        dx * (floor(uv.x / dx) + 0.5),
        dy * (floor(uv.y / dy) + 0.5)
    );
    var diffuseColor:vec4<f32> = textureSample(_Texture, _Sampler,coord);
    return diffuseColor;
}
