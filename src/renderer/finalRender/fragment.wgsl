struct Uniforms{
   backgroundColor:vec4<f32>
}

@group(1) @binding(0)
var _sampler: sampler;

@group(1) @binding(1)
var _texture: texture_2d<f32>;

@group(1) @binding(2)
var<uniform> uniforms : Uniforms;

@fragment
fn main(@location(0) fragUV : vec2<f32>) -> @location(0) vec4<f32> {
    var viewColor: vec4<f32> = textureSample(_texture, _sampler, fragUV);

    let backgroundColor = uniforms.backgroundColor;

    let blendedColor = vec4<f32>(
        viewColor.rgb + backgroundColor.rgb * (1.0 - viewColor.a),
        viewColor.a + backgroundColor.a * (1.0 - viewColor.a)
    );

    return blendedColor;
}
