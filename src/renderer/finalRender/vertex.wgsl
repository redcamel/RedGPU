struct Uniforms {
    ndcScaleOffset: vec4<f32>,
    backgroundColor: vec4<f32>,
    casPeak: f32,
    subpix: f32,
    edgeThreshold: f32,
    edgeThresholdMin: f32,
};

@group(0) @binding(2)
var<uniform> uniforms: Uniforms;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
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
fn main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    let ndcPos = POS[vertexIndex] * uniforms.ndcScaleOffset.xy + uniforms.ndcScaleOffset.zw;
    output.position = vec4<f32>(ndcPos, 0.0, 1.0);
    output.fragUV = UV[vertexIndex];
    return output;
}
