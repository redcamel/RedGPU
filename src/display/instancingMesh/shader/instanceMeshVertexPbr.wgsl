#redgpu_include SYSTEM_UNIFORM;
#redgpu_include calcDisplacements;

struct InstanceUniforms {
    useDisplacementTexture: u32,
    displacementScale: f32,
    instanceGroupModelMatrix: mat4x4<f32>,
    instanceModelMatrixs: array<mat4x4<f32>, __INSTANCE_COUNT__>,
    instanceNormalModelMatrix: array<mat4x4<f32>, __INSTANCE_COUNT__>,
    instanceOpacity: array<f32, __INSTANCE_COUNT__>,

};

@group(1) @binding(0) var<storage, read> instanceUniforms: InstanceUniforms;
@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;
@group(1) @binding(3) var<storage, read> visibilityBuffer: array<u32>;

struct InputData {
    @builtin(instance_index) instanceIdx: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(9) ndcPosition: vec3<f32>,
    @location(10) localNodeScale: f32,
    @location(11) volumeScale: f32,

    //
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowPos: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

struct OutputShadowData {
    @builtin(position) position: vec4<f32>,
};

const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    let input_instanceIdx: u32 = visibilityBuffer[inputData.instanceIdx];


    let u_modelMatrix = instanceUniforms.instanceModelMatrixs[input_instanceIdx];
    let u_normalModelMatrix = instanceUniforms.instanceNormalModelMatrix[input_instanceIdx];
    let u_instanceGroupModelMatrix = instanceUniforms.instanceGroupModelMatrix;
    let u_useDisplacementTexture = instanceUniforms.useDisplacementTexture == 1u;
    let u_displacementScale = instanceUniforms.displacementScale;

    // 시스템 유니폼
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_projectionCameraMatrix = systemUniforms.projectionCameraMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);

    // 월드 좌표 변환
    let worldPosition = position.xyz;

    // Displacement 처리
    if (u_useDisplacementTexture) {
        let distance = distance(position.xyz, u_cameraPosition);
        let mipLevel = (distance / maxDistance) * maxMipLevel;
        let displacedPosition = calcDisplacementPosition(
            input_position,
            input_vertexNormal,
            displacementTexture,
            displacementTextureSampler,
            u_displacementScale,
            input_uv,
            mipLevel
        );
        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);
    }

    // 최종 클립 좌표 계산
    output.position = u_projectionCameraMatrix * u_instanceGroupModelMatrix * position;
    output.vertexPosition = position.xyz;

    // 노말 변환
    var normalPosition: vec3<f32> = (u_instanceGroupModelMatrix * u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0)).xyz;
    output.vertexNormal = normalPosition;

    output.uv = input_uv;

    return output;
}

@vertex
fn drawDirectionalShadowDepth(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;

    let input_instanceIdx: u32 = visibilityBuffer[inputData.instanceIdx];

    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
    let u_modelMatrix = instanceUniforms.instanceModelMatrixs[input_instanceIdx];
    let u_useDisplacementTexture = instanceUniforms.useDisplacementTexture == 1u;
    let u_displacementScale = instanceUniforms.displacementScale;

    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position: vec4<f32> = u_modelMatrix * vec4<f32>(input_position, 1.0);

    // Displacement 처리
    if (u_useDisplacementTexture) {
        let distance = distance(position.xyz, u_directionalLightProjectionViewMatrix[3].xyz);
        let mipLevel = (distance / maxDistance) * maxMipLevel;
        let displacedPosition = calcDisplacementPosition(
            input_position,
            input_vertexNormal,
            displacementTexture,
            displacementTextureSampler,
            u_displacementScale,
            input_uv,
            mipLevel
        );
        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);
    }

    output.position = u_directionalLightProjectionViewMatrix * position;
    return output;
}
