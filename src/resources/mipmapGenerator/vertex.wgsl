var<private> pos:array<vec2<f32>,4> = array<vec2<f32>,4>(
    vec2<f32>(-1.0, 1.0), vec2<f32>(1.0, 1.0),
    vec2<f32>(-1.0, -1.0), vec2<f32>(1.0, -1.0)
);

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) texCoord : vec2<f32>,
};

@vertex
fn main(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
    var output : VertexOutput;
    output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
    output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
    return output;
}
