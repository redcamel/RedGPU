#redgpu_include SYSTEM_UNIFORM;
#redgpu_include drawDirectionalShadowDepth;
struct VertexUniforms {
    pickingId:u32,
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
    useDisplacementTexture:u32,
    displacementScale:f32,
    receiveShadow:f32
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
    @location(3) uv1 : vec2<f32>,
    @location(4) vertexColor_0 : vec4<f32>,
    @location(5) vertexWeight : vec4<f32>,
    @location(6) vertexJoint : vec4<f32>,
    @location(7) vertexTangent : vec4<f32>,
};

struct OutputData {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(6) shadowPos: vec3<f32>,
    @location(7) receiveShadow: f32,
    @location(8) pickingId: vec4<f32>,
};
@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;

    // 카메라 매트릭스와 유니폼 매트릭스를 미리 계산
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    //
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.normalModelMatrix;
    //
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_receiveShadow = vertexUniforms.receiveShadow;

    var position:vec4<f32>;
    var normalPosition:vec4<f32>;

    position =  u_modelMatrix * vec4<f32>(input_position, 1.0);
    normalPosition =  u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);

    output.position = u_projectionMatrix * u_cameraMatrix *  position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = inputData.uv;
    output.uv1 = inputData.uv1;
    output.vertexColor_0 = inputData.vertexColor_0;
    output.vertexTangent = inputData.vertexTangent;

    var posFromLight =  u_directionalLightProjectionViewMatrix * vec4(position.xyz, 1.0);
    // Convert XY to (0, 1)
    // Y is flipped because texture coords are Y-down.
    output.shadowPos = vec3(
      posFromLight.xy * vec2(0.5, -0.5) + vec2(0.5),
      posFromLight.z
    );
    output.receiveShadow = u_receiveShadow;

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
