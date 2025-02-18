// VertexUniforms struct definition
// Contains a single 4x4 modelMatrix field
struct VertexUniforms {
    modelMatrix: mat4x4<f32>,
};

// Global uniform variable of type VertexUniforms
@group(0) @binding(0)
var<uniform> vertexUniforms: VertexUniforms;

// VertexOutput struct definition
// Contains a vec4 field "Position" for the position of the vertex
// and a vec2 field "fragUV" for the UV coordinates of the fragment
struct VertexOutput {
    @builtin(position) Position: vec4<f32>,
    @location(0) fragUV: vec2<f32>,
};

// Vertex shader main function, called once per vertex
@vertex
fn main(@builtin(vertex_index) VertexIndex: u32) -> VertexOutput {

  // An array of 6 2D vertex positions
  var pos = array<vec2<f32>, 6>(
      vec2( 1.0,  1.0),
      vec2( 1.0, -1.0),
      vec2(-1.0, -1.0),
      vec2( 1.0,  1.0),
      vec2(-1.0, -1.0),
      vec2(-1.0,  1.0),
  );

  // An array of 6 2D UV coordinates
  var uv = array<vec2<f32>, 6>(
      vec2(1.0, 0.0),
      vec2(1.0, 1.0),
      vec2(0.0, 1.0),
      vec2(1.0, 0.0),
      vec2(0.0, 1.0),
      vec2(0.0, 0.0),
  );

  // Creating an output variable of type VertexOutput
  var output: VertexOutput;

  // Assigning the position and fragUV values to the output
  output.Position = vertexUniforms.modelMatrix * vec4<f32>(pos[VertexIndex], 0.0, 1.0);
  output.fragUV = uv[VertexIndex];

  // Returning the output which is passed to the next shader stage
  return output;
}
