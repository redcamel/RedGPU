#redgpu_include SYSTEM_UNIFORM;
#redgpu_include drawDirectionalShadowDepth;
struct VertexUniforms {
      pickingId:u32,
	  modelMatrix:mat4x4<f32>,
	  normalModelMatrix:mat4x4<f32>,
	  useDisplacementTexture:u32,
	  displacementScale:f32,
	  receiveShadow:f32,
      combinedOpacity:f32,
};
const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;
@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;

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
    @location(14) receiveShadow: f32,
    @location(15) pickingId: vec4<f32>,
};

@vertex
fn main( inputData:InputData ) -> OutputData {
  var output : OutputData;

  //
  let u_projectionMatrix = systemUniforms.projectionMatrix;
  let u_resolution = systemUniforms.resolution;
  let u_camera = systemUniforms.camera;
  let u_cameraMatrix = u_camera.cameraMatrix;
  let u_cameraPosition = u_camera.cameraPosition;
  //
  let u_modelMatrix = vertexUniforms.modelMatrix;
  let u_normalModelMatrix = vertexUniforms.normalModelMatrix;
  let u_displacementScale = vertexUniforms.displacementScale;
  let u_useDisplacementTexture = vertexUniforms.useDisplacementTexture == 1u;
  let u_receiveShadow = vertexUniforms.receiveShadow;
  //
  let u_directionalLightCount = systemUniforms.directionalLightCount;
  let u_directionalLights = systemUniforms.directionalLights;
  let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
  //
  let input_position = inputData.position;
  let input_vertexNormal = inputData.vertexNormal;
  let input_uv = inputData.uv;

  var position:vec4<f32>;
  var normalPosition:vec4<f32>;
  position = u_modelMatrix * vec4<f32>(input_position, 1.0);

    if (u_useDisplacementTexture) {
        let distance = distance(position.xyz, u_cameraPosition);
        let mipLevel = (distance / maxDistance) * maxMipLevel;
        let displacementSample = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv, mipLevel).r;
        let scaledDisplacement = displacementSample * u_displacementScale;
        let displacedPosition = input_position + input_vertexNormal * scaledDisplacement;

        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);
        normalPosition = u_normalModelMatrix * vec4<f32>(input_vertexNormal * scaledDisplacement, 1.0);
    } else {
        normalPosition = u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);
    }


    output.position = u_projectionMatrix * u_cameraMatrix *  position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = input_uv;
    var posFromLight =  u_directionalLightProjectionViewMatrix * vec4(position.xyz, 1.0);
    // Convert XY to (0, 1)
    // Y is flipped because texture coords are Y-down.
    output.shadowPos = vec3(
      posFromLight.xy * vec2(0.5, -0.5) + vec2(0.5),
      posFromLight.z
    );
    output.receiveShadow = u_receiveShadow;
    output.combinedOpacity = vertexUniforms.combinedOpacity;


  return output;
}

@vertex
fn picking(inputData: InputData) -> OutputData {
    var output: OutputData;
    let input_position = inputData.position;
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);
    output.position = u_projectionMatrix * u_cameraMatrix *  position;
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);
    return output;
}
