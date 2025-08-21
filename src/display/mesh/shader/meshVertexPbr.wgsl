#redgpu_include SYSTEM_UNIFORM;
#redgpu_include drawDirectionalShadowDepth;
#redgpu_include picking;

struct VertexUniforms {
    pickingId: u32,
    localMatrix: mat4x4<f32>,
    modelMatrix: mat4x4<f32>,
    prevModelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
    receiveShadow: f32
};

const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;
@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;

struct InputData {
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexWeight: vec4<f32>,
    @location(6) vertexJoint: vec4<f32>,
    @location(7) vertexTangent: vec4<f32>,
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(6) shadowPos: vec3<f32>,
    @location(7) receiveShadow: f32,
    @location(8) pickingId: vec4<f32>,
    @location(9) ndcPosition: vec3<f32>,
    @location(10) localNodeScale: f32,
    @location(11) volumeScale: f32,
    @location(12) motionVector: vec2<f32>,
};

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;

    // 카메라 매트릭스와 유니폼 매트릭스를 미리 계산
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_projectionCameraMatrix = systemUniforms.projectionCameraMatrix;
    let u_prevProjectionCameraMatrix = systemUniforms.prevProjectionCameraMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    let u_localMatrix = vertexUniforms.localMatrix;
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.normalModelMatrix;

    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_receiveShadow = vertexUniforms.receiveShadow;
    let u_prevModelMatrix = vertexUniforms.prevModelMatrix;

    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    position = u_modelMatrix * vec4<f32>(input_position, 1.0);
    normalPosition = u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);

    output.position = u_projectionCameraMatrix * position;
    {
        // 모션벡터 계산
        let prevClipPos = u_prevProjectionCameraMatrix * u_prevModelMatrix * vec4<f32>(input_position, 1.0);
        let currentScreen = output.position.xy / output.position.w;
        let prevScreen = prevClipPos.xy / prevClipPos.w;
        let motionVector = currentScreen - prevScreen;
        output.motionVector = motionVector;
    }



    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = inputData.uv;
    output.uv1 = inputData.uv1;
    output.vertexColor_0 = inputData.vertexColor_0;
    output.vertexTangent = u_normalModelMatrix * inputData.vertexTangent;

    #redgpu_if receiveShadow
    {
        var posFromLight = u_directionalLightProjectionViewMatrix * vec4(position.xyz, 1.0);
        output.shadowPos = vec3( posFromLight.xy * vec2(0.5, -0.5) + vec2(0.5), posFromLight.z );
        output.receiveShadow = vertexUniforms.receiveShadow;
    }
    #redgpu_endIf

    output.ndcPosition = output.position.xyz / output.position.w;

    let nodeScaleX: f32 = length(u_localMatrix[0].xyz);
    let nodeScaleY: f32 = length(u_localMatrix[1].xyz);
    let nodeScaleZ = length(u_localMatrix[2].xyz);
    output.localNodeScale = pow(nodeScaleX * nodeScaleY * nodeScaleZ, 1.0 / 3.0);

    let volumeScaleX: f32 = length(u_modelMatrix[0].xyz);
    let volumeScaleY: f32 = length(u_modelMatrix[1].xyz);
    let volumeScaleZ = length(u_modelMatrix[2].xyz);
    output.volumeScale = pow(volumeScaleX * volumeScaleY * volumeScaleZ, 1.0 / 3.0);

    return output;
}
