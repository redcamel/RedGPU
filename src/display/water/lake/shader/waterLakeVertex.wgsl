#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.globalVertexStruct;
#redgpu_include math.PI;

struct WaterLakeVertexUniforms {
    waveAmplitude: f32,
    waveWavelength: f32,
    waveSpeed: f32,
    padding: f32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: WaterLakeVertexUniforms;
@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;

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
    @location(11) combinedOpacity: f32,
    @location(14) @interpolate(flat) receiveShadow: f32,
};

// 미세 장파장 너울 (Micro Swell) 수직 위치 변위 및 편미분 벡터 산출
fn calculateWaveDisplacement(posXZ: vec2<f32>, timeSec: f32) -> vec4<f32> {
    if (vertexUniforms.waveAmplitude <= 0.00001) {
        return vec4<f32>(0.0, 0.0, 0.0, 0.0);
    }

    let wavelength = max(0.5, vertexUniforms.waveWavelength);
    let k = (2.0 * PI) / wavelength;
    let speed = vertexUniforms.waveSpeed;
    let amp = vertexUniforms.waveAmplitude;

    // 주파 1 (Base Swell: 75% 진폭, 완만한 주풍 방향 [1.0, 0.3])
    let dir1 = normalize(vec2<f32>(1.0, 0.3));
    let k1 = k;
    let omega1 = sqrt(9.8 * k1) * 0.4 + speed * 0.6;
    let phase1 = dot(posXZ, dir1) * k1 - timeSec * omega1;
    let cosP1 = cos(phase1);
    let sinP1 = sin(phase1);
    let amp1 = amp * 0.75;

    let y1 = amp1 * sinP1;
    let dY1dx = amp1 * k1 * dir1.x * cosP1;
    let dY1dz = amp1 * k1 * dir1.y * cosP1;

    // 부파 2 (Cross Swell: 25% 진폭, 교차 방향 [-0.5, 0.85])
    let dir2 = normalize(vec2<f32>(-0.5, 0.85));
    let k2 = k * 1.65;
    let omega2 = sqrt(9.8 * k2) * 0.4 + speed * 0.8;
    let phase2 = dot(posXZ, dir2) * k2 - timeSec * omega2;
    let cosP2 = cos(phase2);
    let sinP2 = sin(phase2);
    let amp2 = amp * 0.25;

    let y2 = amp2 * sinP2;
    let dY2dx = amp2 * k2 * dir2.x * cosP2;
    let dY2dz = amp2 * k2 * dir2.y * cosP2;

    let totalY = y1 + y2;
    let totalDydx = dY1dx + dY2dx;
    let totalDydz = dY1dz + dY2dz;

    return vec4<f32>(totalY, totalDydx, totalDydz, 0.0);
}

@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    let globalVertexData = globalVertexSSBO[inputData.globalVertexSlotIndex];

    let su_projection = systemUniforms.projection;
    let su_projectionViewMatrix = su_projection.projectionViewMatrix;

    let gu_matrixList = globalVertexData.matrixList;
    let gu_modelMatrix = gu_matrixList.modelMatrix;
    let gu_prevModelMatrix = gu_matrixList.prevModelMatrix;
    let gu_normalModelMatrix = gu_matrixList.normalModelMatrix;

    let timeSec = systemUniforms.time.time;

    var localPos = inputData.position;

    // 1. 월드 평면(XZ) 좌표 기준 미세 너울 수직 변위 및 편미분 계산
    let baseWorldPos = gu_modelMatrix * vec4<f32>(localPos, 1.0);
    let waveResult = calculateWaveDisplacement(baseWorldPos.xz, timeSec);

    let dispY = waveResult.x;
    let dYdx = waveResult.y;
    let dYdz = waveResult.z;

    // 2. 수직 위치 변위 적용
    localPos.y = localPos.y + dispY;

    // 3. 편미분을 통한 새로운 정점 법선 및 탄젠트 벡터 계산
    let localNormal = normalize(vec3<f32>(-dYdx, 1.0, -dYdz));
    let localTangent = normalize(vec3<f32>(1.0, dYdx, 0.0));

    let input_position_vec4 = vec4<f32>(localPos, 1.0);
    let worldPos = gu_modelMatrix * input_position_vec4;
    let worldNormal = normalize((gu_normalModelMatrix * vec4<f32>(localNormal, 0.0)).xyz);
    let worldTangent = normalize((gu_normalModelMatrix * vec4<f32>(localTangent, 0.0)).xyz);

    // Step 12.3 & 12.4: 변위된 월드 좌표 및 정점 노멀/탄젠트 적용
    output.position = su_projectionViewMatrix * worldPos;
    output.vertexPosition = worldPos.xyz;
    output.vertexNormal = worldNormal;
    output.uv = inputData.uv * globalVertexData.uvTransform.zw + globalVertexData.uvTransform.xy;
    output.vertexTangent = vec4<f32>(worldTangent, inputData.vertexTangent.w);

    output.combinedOpacity = globalVertexData.combinedOpacity;
    output.receiveShadow = globalVertexData.receiveShadow;
    output.currentClipPos = su_projection.noneJitterProjectionViewMatrix * worldPos;
    output.prevClipPos = su_projection.prevNoneJitterProjectionViewMatrix * gu_prevModelMatrix * input_position_vec4;

    return output;
}
