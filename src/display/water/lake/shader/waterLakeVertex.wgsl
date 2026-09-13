#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.globalVertexStruct;

struct WaterLakeVertexUniforms {
    waveAmplitude: f32,
    waveWavelength: f32,
    waveSpeed: f32,
    padding1: f32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: WaterLakeVertexUniforms;

struct InputData {
    @builtin(instance_index) globalVertexSlotIndex: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) vertexTangent: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,

    @location(11) combinedOpacity: f32,
    @location(12) motionVector: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

const TWO_PI: f32 = 6.283185307179586;

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];

    let su_projection = systemUniforms.projection;
    let su_projectionViewMatrix = su_projection.projectionViewMatrix;

    let gu_matrixList = globalVertexData.matrixList;
    let gu_combinedOpacity = globalVertexData.combinedOpacity;
    let gu_uvTransform = globalVertexData.uvTransform;

    let gu_modelMatrix = gu_matrixList.modelMatrix;
    let gu_prevModelMatrix = gu_matrixList.prevModelMatrix;
    let gu_normalModelMatrix = gu_matrixList.normalModelMatrix;

    let input_position = inputData.position;
    let input_position_vec4 = vec4<f32>(input_position, 1.0);
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    let transformedUV = input_uv * gu_uvTransform.zw + gu_uvTransform.xy;

    // 1. 기본 월드 공간 정점 위치 변환
    var worldPos = gu_modelMatrix * input_position_vec4;

    // 2. Step 8: 미세 장파장 너울 (Micro Vertex Swell) 계산
    // 완만하게 오르내리는 2중 합성 사인파 (주 너울 + 보조 교차 너울)
    let timeSec = systemUniforms.time.time;
    let amp = vertexUniforms.waveAmplitude;
    let wl = max(vertexUniforms.waveWavelength, 1.0);
    let spd = vertexUniforms.waveSpeed;

    if (amp > 0.0) {
        // - 주 너울 레이어 (주 풍향 25도 방향 진행)
        let k1 = TWO_PI / wl;
        let phase1 = k1 * (worldPos.x * 0.906 + worldPos.z * 0.423) - timeSec * spd;
        let swell1 = sin(phase1) * (amp * 0.7);

        // - 보조 교차 너울 레이어 (-40도 교차 방향, 0.55배 파장, 1.35배 속도)
        let k2 = TWO_PI / (wl * 0.55);
        let phase2 = k2 * (worldPos.x * 0.643 - worldPos.z * 0.766) - timeSec * (spd * 1.35);
        let swell2 = sin(phase2) * (amp * 0.3);

        worldPos.y += (swell1 + swell2);
    }

    let worldNormal = normalize((gu_normalModelMatrix * vec4<f32>(input_vertexNormal, 0.0)).xyz);
    let normalPosition = vec4<f32>(worldNormal, 0.0);

    output.position = su_projectionViewMatrix * worldPos;
    output.vertexPosition = worldPos.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = transformedUV;
    output.globalFragmentSlotIndex = globalVertexData.globalFragmentSlotIndex;

    let transformedTangentXYZ = (gu_normalModelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz;
    output.vertexTangent = vec4<f32>(normalize(transformedTangentXYZ), inputData.vertexTangent.w);

    output.combinedOpacity = gu_combinedOpacity;
    output.receiveShadow = globalVertexData.receiveShadow;

    output.currentClipPos = su_projection.noneJitterProjectionViewMatrix * worldPos;
    output.prevClipPos = su_projection.prevNoneJitterProjectionViewMatrix * gu_prevModelMatrix * input_position_vec4;

    return output;
}
