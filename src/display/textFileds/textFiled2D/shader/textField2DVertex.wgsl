#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;
struct VertexUniforms {
      pickingId:u32,
	  modelMatrix:mat4x4<f32>,
	  normalModelMatrix:mat4x4<f32>,
	  combinedOpacity:f32,
};


@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

struct InputData {
    @location(0) position : vec3<f32>,
    @location(1) vertexNormal : vec3<f32>,
    @location(2) uv : vec2<f32>,
};
struct OutputData {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(15) pickingId: vec4<f32>,
};


@vertex
fn main( inputData:InputData ) -> OutputData {
  var output : OutputData;

  //
  let u_projectionMatrix = systemUniforms.projectionMatrix;
  let u_camera = systemUniforms.camera;
  let u_cameraMatrix = u_camera.cameraMatrix;
  let u_cameraPosition = u_camera.cameraPosition;
  //
  let u_modelMatrix = vertexUniforms.modelMatrix;
  let u_normalModelMatrix = vertexUniforms.normalModelMatrix;
//

  //
  let input_position = inputData.position;
  let input_vertexNormal = inputData.vertexNormal;
  let input_uv = inputData.uv;

  var position:vec4<f32>;
  var normalPosition:vec4<f32>;

  position = u_cameraMatrix * u_modelMatrix * vec4<f32>(input_position, 1.0);
  normalPosition = u_cameraMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);
  output.position = u_projectionMatrix * position;


  output.vertexPosition = position.xyz;
  output.vertexNormal = normalPosition.xyz;
  output.uv = input_uv;
  output.combinedOpacity = vertexUniforms.combinedOpacity;
  return output;
}
struct OutputShadowData {
    @builtin(position) position : vec4<f32>,
};

@vertex
fn picking(inputData: InputData) -> OutputData {
    var output : OutputData;
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;
    //
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.normalModelMatrix;
    //


    //
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position:vec4<f32>;
    var normalPosition:vec4<f32>;

    position = u_cameraMatrix * u_modelMatrix * vec4<f32>(input_position, 1.0);
  normalPosition = u_cameraMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);
    output.position = u_projectionMatrix * position;

    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);
    return output;
}
