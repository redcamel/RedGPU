struct VertexUniforms {
    modelMatrix: mat4x4<f32>,
};

@group(0) @binding(0)
var<uniform> vertexUniforms: VertexUniforms;

struct VertexOutput {
    @builtin(position) Position: vec4<f32>,
    @location(0) fragUV: vec2<f32>,
};

const POS: array<vec2<f32>, 6> = array<vec2<f32>, 6>(
    vec2<f32>( 1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0,  1.0),
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(-1.0,  1.0),
);

const UV: array<vec2<f32>, 6> = array<vec2<f32>, 6>(
    vec2<f32>(1.0, 0.0),
    vec2<f32>(1.0, 1.0),
    vec2<f32>(0.0, 1.0),
    vec2<f32>(1.0, 0.0),
    vec2<f32>(0.0, 1.0),
    vec2<f32>(0.0, 0.0),
);

@vertex
fn main(@builtin(vertex_index) VertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    output.Position = vertexUniforms.modelMatrix * vec4<f32>(POS[VertexIndex], 0.0, 1.0);
    output.fragUV = UV[VertexIndex];
    return output;
}
