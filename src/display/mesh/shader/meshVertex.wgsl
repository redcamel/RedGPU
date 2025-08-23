#redgpu_include SYSTEM_UNIFORM;
#redgpu_include drawDirectionalShadowDepth;
#redgpu_include picking;
#redgpu_include calcDisplacements;

struct VertexUniforms {
    pickingId: u32,
    modelMatrix: mat4x4<f32>,
    prevModelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
    receiveShadow: f32,
    combinedOpacity: f32,
    //
    useDisplacementTexture: u32,
    displacementScale: f32,
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
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) motionVector: vec2<f32>,
    @location(9) ndcPosition: vec3<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(14) receiveShadow: f32,
    @location(15) pickingId: vec4<f32>,

};

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // System uniforms
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_projectionCameraMatrix = systemUniforms.projectionCameraMatrix;
    let u_prevProjectionCameraMatrix = systemUniforms.prevProjectionCameraMatrix;
    let u_noneJitterProjectionCameraMatrix = systemUniforms.noneJitterProjectionCameraMatrix;
    let u_resolution = systemUniforms.resolution;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex uniforms
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_prevModelMatrix = vertexUniforms.prevModelMatrix;
    let u_normalModelMatrix = vertexUniforms.normalModelMatrix;
    let u_displacementScale = vertexUniforms.displacementScale;
    let u_useDisplacementTexture = vertexUniforms.useDisplacementTexture == 1u;
    let u_receiveShadow = vertexUniforms.receiveShadow;

    // Light uniforms
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;

    // Input data
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    #redgpu_if useDisplacementTexture
        let tempPosition = u_modelMatrix * vec4<f32>(input_position, 1.0);
        let distance = distance(tempPosition.xyz, u_cameraPosition);
        let mipLevel = (distance / maxDistance) * maxMipLevel;

        // 로컬 스페이스에서 디스플레이스먼트 계산
        let displacedPosition = calcDisplacementPosition(input_position, input_vertexNormal, displacementTexture, displacementTextureSampler, u_displacementScale, input_uv, mipLevel);

        // 월드 스페이스로 변환
        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);

        // 노멀은 월드 스페이스에서 직접 계산하는 것이 더 정확
        let worldUV = input_uv; // 또는 월드 스페이스 UV 계산
        var displacedNormal:vec3<f32>;

            displacedNormal = calcDisplacementNormal(
                normalize((u_normalModelMatrix * vec4<f32>(input_vertexNormal, 0.0)).xyz),
                displacementTexture,
                displacementTextureSampler,
                u_displacementScale,
                worldUV,
                mipLevel
            );
        normalPosition = vec4<f32>(displacedNormal, 0.0);
    #redgpu_else
        position = u_modelMatrix * vec4<f32>(input_position, 1.0);
        normalPosition = u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);
    #redgpu_endIf

    output.position = u_projectionCameraMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = input_uv;
    output.ndcPosition = output.position.xyz / output.position.w;
    #redgpu_if receiveShadow
    {
        var posFromLight = u_directionalLightProjectionViewMatrix * vec4(position.xyz, 1.0);
        output.shadowPos = vec3( posFromLight.xy * vec2(0.5, -0.5) + vec2(0.5), posFromLight.z );
        output.receiveShadow = vertexUniforms.receiveShadow;
    }
    #redgpu_endIf

    output.combinedOpacity = vertexUniforms.combinedOpacity;
  {
     let currentClipPos = u_noneJitterProjectionCameraMatrix * position;  // jitter 제거된 위치 사용
//     let currentClipPos = output.position;
     let prevClipPos = u_prevProjectionCameraMatrix * u_prevModelMatrix * vec4<f32>(input_position, 1.0);

     // 클립 공간에서 유효한 w 값 확인
     let currentW = max(currentClipPos.w, 0.0001);
     let prevW = max(prevClipPos.w, 0.0001);

     // NDC 좌표로 변환
     let currentNDC = currentClipPos.xy / currentW;
     let prevNDC = prevClipPos.xy / prevW;

     // 정규화된 스크린 공간에서의 모션벡터 (-1 ~ 1 범위)
     output.motionVector = currentNDC - prevNDC;

 }
    return output;
}
