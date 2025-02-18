#redgpu_include SYSTEM_UNIFORM;

struct InstanceUniforms {
      instanceGroupModelMatrix:mat4x4<f32>,
	  instanceModelMatrixs:array<mat4x4<f32>,100000>,
	  instanceNormalModelMatrix:array<mat4x4<f32>,100000>,
	  instanceOpacity:array<f32,100000>,
      useDisplacementTexture:u32,
      displacementScale:f32,
      combinedOpacity:f32,
};
@group(1) @binding(0) var<storage, read> instanceUniforms: InstanceUniforms;
@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;

struct InputData {
    @builtin(instance_index) instanceIdx : u32,
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
struct OutputShadowData {
    @builtin(position) position : vec4<f32>,
};
const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;
@vertex
fn main( inputData:InputData ) -> OutputData {
    var output : OutputData;

    let input_instanceIdx: u32 = inputData.instanceIdx;
    let u_modelMatrix = instanceUniforms.instanceModelMatrixs[input_instanceIdx];
    let u_normalModelMatrix = instanceUniforms.instanceNormalModelMatrix[input_instanceIdx];
    let u_instanceGroupModelMatrix = instanceUniforms.instanceGroupModelMatrix;
    let u_useDisplacementTexture = instanceUniforms.useDisplacementTexture == 1u;
    let u_displacementScale = instanceUniforms.displacementScale;
    //
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;


    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);

    //
    // 1. 월드 좌표 변환
    let worldPosition = position.xyz;

        // 3. 프러스텀 컬링 - 화면 범위를 벗어난 경우
    let margin: f32 = 0.5;

    // 클립 좌표로 변환
    var clipPosition: vec4<f32> = u_projectionMatrix * u_cameraMatrix * vec4<f32>(worldPosition, 1.0);

    // NDC로 변환
    let ndcPosition: vec3<f32> = clipPosition.xyz / clipPosition.w;

    // 프러스텀 컬링 기준
    if (ndcPosition.x < -1.0 - margin || ndcPosition.x > 1.0 + margin ||
        ndcPosition.y < -1.0 - margin || ndcPosition.y > 1.0 + margin ||
        ndcPosition.z < 0.0 || ndcPosition.z > 1.0 + margin) {
        output.position = vec4<f32>(0.0, 0.0, 0.0, 0.0);
        return output;
    }

output.position = clipPosition; // 정상적으로 처리

    //


    var normalPosition:vec3<f32> = (u_instanceGroupModelMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0)).xyz;;


    if (u_useDisplacementTexture) {
        let distance = distance(position.xyz, u_cameraPosition);
        let mipLevel = (distance / maxDistance) * maxMipLevel;
        let displacementSample = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv, mipLevel).r;
        let scaledDisplacement = displacementSample * u_displacementScale;
        let displacedPosition = input_position + input_vertexNormal * scaledDisplacement;

        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);
//        normalPosition = u_normalModelMatrix * vec4<f32>(input_vertexNormal * scaledDisplacement, 1.0);
    }

    output.position = u_projectionMatrix * u_cameraMatrix * u_instanceGroupModelMatrix *  position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition;
    output.uv = input_uv;
    output.combinedOpacity = instanceUniforms.instanceOpacity[input_instanceIdx];
    return output;
}
@vertex
fn drawDirectionalShadowDepth( inputData:InputData ) -> OutputShadowData {
    var output : OutputShadowData;
    let input_instanceIdx: u32 = inputData.instanceIdx;
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_modelMatrix = instanceUniforms.instanceModelMatrixs[input_instanceIdx];
    let u_useDisplacementTexture = instanceUniforms.useDisplacementTexture == 1u;
    let u_displacementScale = instanceUniforms.displacementScale;

    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position:vec4<f32>;
    position =  u_modelMatrix * vec4<f32>(input_position, 1.0);


    if (u_useDisplacementTexture) {
        let distance = distance(position.xyz, u_directionalLightProjectionViewMatrix[3].xyz);
        let mipLevel = (distance / maxDistance) * maxMipLevel;
        let displacementSample = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv, mipLevel).r;
        let scaledDisplacement = displacementSample * u_displacementScale;
        let displacedPosition = input_position + input_vertexNormal * scaledDisplacement;

        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);
    }


  output.position = u_directionalLightProjectionViewMatrix *  position;
  return output;
}
