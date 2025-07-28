#redgpu_include SYSTEM_UNIFORM;
#redgpu_include picking;

struct VertexUniforms {
    pickingId: u32,
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
    receiveShadow: f32,
    combinedOpacity: f32,

    // 🌊 Primary Gerstner Wave Parameters (4 waves)
    waveAmplitude: vec4<f32>,
    waveWavelength: vec4<f32>,
    waveSpeed: vec4<f32>,
    waveSteepness: vec4<f32>,

    // 🌀 Detail waves (5th and 6th for fine surface details)
    detailWaveAmplitude: vec2<f32>,
    detailWaveWavelength: vec2<f32>,
    detailWaveSpeed: vec2<f32>,
    detailWaveSteepness: vec2<f32>,

    // 🌊 Primary Wave directions (4 primary directions)
    waveDirection1: vec2<f32>,
    waveDirection2: vec2<f32>,
    waveDirection3: vec2<f32>,
    waveDirection4: vec2<f32>,

    // 🌀 Detail Wave directions (2 detail directions)
    detailWaveDirection1: vec2<f32>,
    detailWaveDirection2: vec2<f32>,

    // 🌊 Global water parameters
    waveScale: f32,
    waterLevel: f32,
};

const PI_VALUE: f32 = 3.14159265359;

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

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
    @location(3) worldPosition: vec3<f32>,
    @location(4) waveHeight: f32,
    @location(5) waveScale: f32,
    @location(6) foamIntensity: f32,
    @location(7) flowVector: vec2<f32>,
    @location(9) ndcPosition: vec3<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(14) receiveShadow: f32,
    @location(15) pickingId: vec4<f32>,
};

struct WaveResult {
    height: f32,
    offsetX: f32,
    offsetZ: f32,
    steepnessContribution: f32,
    waveBreaking: f32,
    flowVector: vec2<f32>,
}

// 🌊 **단일 Gerstner Wave 계산 - 위치만 계산**
fn calculateGerstnerWave(
    worldPos: vec2<f32>,
    time: f32,
    direction: vec2<f32>,
    amplitude: f32,
    wavelength: f32,
    speed: f32,
    steepness: f32
) -> WaveResult {
    let dir = normalize(direction);
    let frequency = 2.0 * PI_VALUE / max(wavelength, 0.1);
    let phase = frequency * dot(dir, worldPos) + time * speed;
    let steepnessFactor = min(steepness / frequency, 0.95);

    let sinPhase = sin(phase);
    let cosPhase = cos(phase);

    var result: WaveResult;

    // 🌊 **기본 파도 계산만**
    result.height = amplitude * sinPhase;
    result.offsetX = steepnessFactor * dir.x * cosPhase;
    result.offsetZ = steepnessFactor * dir.y * cosPhase;

    // 🌊 **개별 웨이브 정보만 저장 (거품 계산용)**
    result.steepnessContribution = steepness * amplitude;
    result.waveBreaking = 0.0; // 개별 웨이브에서는 계산하지 않음

    return result;
}

// 🌊 **엄격한 거품 생성 조건으로 개선된 함수**
fn calculateCombinedFoam(
    worldPos: vec2<f32>,
    time: f32,
    finalHeight: f32,
    totalSteepness: f32,
    dominantAmplitude: f32,
    dominantWavelength: f32,
    dominantPhase: f32
) -> f32 {
    // 🌊 **엄격한 거품 생성 조건들**
    let steepnessThreshold = 0.8;    // 기존보다 훨씬 높임 (0.3 -> 0.8)
    let amplitudeThreshold = 0.25;   // 최소 진폭 요구 (0.1 -> 0.25)
    let heightThreshold = 0.2;       // 최소 높이 요구 (0.05 -> 0.2)
    let phaseThreshold = 0.85;       // 위상 기반 정점 감지 강화 (0.5 -> 0.85)

    // 🌊 **모든 조건을 만족해야만 거품 생성**
    let meetsSteepness = totalSteepness > steepnessThreshold;
    let meetsAmplitude = dominantAmplitude > amplitudeThreshold;
    let meetsHeight = abs(finalHeight) > heightThreshold;

    // 🌊 **파도 정점에서만 거품 생성 (sin 값이 매우 높은 구간만)**
    let phaseValue = sin(dominantPhase);
    let isAtCrest = phaseValue > phaseThreshold;

    // 🌊 **모든 조건 불충족시 거품 없음**
    if (!meetsSteepness || !meetsAmplitude || !meetsHeight || !isAtCrest) {
        return 0.0;
    }

    // 🌊 **통과한 경우에만 거품 강도 계산 (매우 제한적으로)**
    let crestFactor = smoothstep(phaseThreshold, 1.0, phaseValue);
    let steepnessFactor = smoothstep(steepnessThreshold, 1.0, totalSteepness);
    let heightFactor = smoothstep(heightThreshold, dominantAmplitude, abs(finalHeight));

    // 🌊 **거품 강도를 더욱 줄임**
    let foamIntensity = crestFactor * steepnessFactor * heightFactor;

    return saturate(foamIntensity * 0.15); // 강도를 85% 줄임 (기존 0.6 -> 0.15)
}

// 🌊 **전체 파도 계산 - Primary + Detail 합성 + Flow Vector**
fn calculateAllWaves(worldPos: vec2<f32>, time: f32) -> WaveResult {
    // Primary waves 방향 배열
    let primaryDirections = array<vec2<f32>, 4>(
        vertexUniforms.waveDirection1,
        vertexUniforms.waveDirection2,
        vertexUniforms.waveDirection3,
        vertexUniforms.waveDirection4
    );

    // Detail waves 방향 배열
    let detailDirections = array<vec2<f32>, 2>(
        vertexUniforms.detailWaveDirection1,
        vertexUniforms.detailWaveDirection2
    );

    var totalResult: WaveResult;
    totalResult.height = 0.0;
    totalResult.offsetX = 0.0;
    totalResult.offsetZ = 0.0;
    totalResult.steepnessContribution = 0.0;
    totalResult.waveBreaking = 0.0;
    totalResult.flowVector = vec2<f32>(0.0); // 🌊 **흐름 벡터 초기화**

    // 🌊 **Primary 4개 웨이브 합성 + 흐름 계산**
    for (var i = 0; i < 4; i++) {
        let wave = calculateGerstnerWave(
            worldPos,
            time,
            primaryDirections[i],
            vertexUniforms.waveAmplitude[i],
            vertexUniforms.waveWavelength[i],
            vertexUniforms.waveSpeed[i],
            vertexUniforms.waveSteepness[i]
        );

        totalResult.height += wave.height;
        totalResult.offsetX += wave.offsetX;
        totalResult.offsetZ += wave.offsetZ;
        totalResult.steepnessContribution += wave.steepnessContribution;

        // 🌊 **각 파도의 흐름 기여도 계산**
        let waveContribution = vertexUniforms.waveAmplitude[i] * vertexUniforms.waveSpeed[i];
        let normalizedDirection = normalize(primaryDirections[i]);
        totalResult.flowVector += normalizedDirection * waveContribution;
    }

    // 🌊 **Detail 2개 웨이브 합성 + 세부 흐름**
    for (var i = 0; i < 2; i++) {
        let wave = calculateGerstnerWave(
            worldPos,
            time * 1.2, // 약간 다른 시간
            detailDirections[i],
            vertexUniforms.detailWaveAmplitude[i],
            vertexUniforms.detailWaveWavelength[i],
            vertexUniforms.detailWaveSpeed[i],
            vertexUniforms.detailWaveSteepness[i]
        );

        totalResult.height += wave.height;
        totalResult.offsetX += wave.offsetX * 0.6;
        totalResult.offsetZ += wave.offsetZ * 0.6;
        totalResult.steepnessContribution += wave.steepnessContribution;

        // 🌊 **Detail 파도의 흐름 기여 (약간 줄임)**
        let detailContribution = vertexUniforms.detailWaveAmplitude[i] * vertexUniforms.detailWaveSpeed[i] * 0.3;
        let normalizedDetailDirection = normalize(detailDirections[i]);
        totalResult.flowVector += normalizedDetailDirection * detailContribution;
    }

    // 🌊 **최종 흐름 벡터 정규화 및 스케일링**
    if (length(totalResult.flowVector) > 0.0) {
        totalResult.flowVector = normalize(totalResult.flowVector) *
                                 min(length(totalResult.flowVector), 2.0) * 0.1;
    }

    // 🌊 **가장 강한 파도만을 기준으로 거품 계산 (더 엄격하게)**
    let dominantAmplitude = vertexUniforms.waveAmplitude[0];
    let dominantWavelength = vertexUniforms.waveWavelength[0];
    let dominantPhase = 2.0 * PI_VALUE / dominantWavelength *
                       dot(normalize(vertexUniforms.waveDirection1), worldPos) +
                       time * vertexUniforms.waveSpeed[0];

    totalResult.waveBreaking = calculateCombinedFoam(
        worldPos,
        time,
        totalResult.height,
        totalResult.steepnessContribution,
        dominantAmplitude,
        dominantWavelength,
        dominantPhase
    );

    return totalResult;
}

// 🌊 **높이만 계산하는 최적화된 함수** - 노말 계산용
fn calculateWaveHeight(worldPos: vec2<f32>, time: f32) -> f32 {
    let primaryDirections = array<vec2<f32>, 4>(
        vertexUniforms.waveDirection1,
        vertexUniforms.waveDirection2,
        vertexUniforms.waveDirection3,
        vertexUniforms.waveDirection4
    );

    let detailDirections = array<vec2<f32>, 2>(
        vertexUniforms.detailWaveDirection1,
        vertexUniforms.detailWaveDirection2
    );

    var totalHeight = 0.0;

    // Primary waves - 높이만
    for (var i = 0; i < 4; i++) {
        let dir = normalize(primaryDirections[i]);
        let frequency = 2.0 * PI_VALUE / max(vertexUniforms.waveWavelength[i], 0.1);
        let phase = frequency * dot(dir, worldPos) + time * vertexUniforms.waveSpeed[i];
        totalHeight += vertexUniforms.waveAmplitude[i] * sin(phase);
    }

    // Detail waves - 높이만
    for (var i = 0; i < 2; i++) {
        let dir = normalize(detailDirections[i]);
        let frequency = 2.0 * PI_VALUE / max(vertexUniforms.detailWaveWavelength[i], 0.1);
        let phase = frequency * dot(dir, worldPos) + time * 1.2 * vertexUniforms.detailWaveSpeed[i];
        totalHeight += vertexUniforms.detailWaveAmplitude[i] * sin(phase);
    }

    return totalHeight;
}

// 🔬 **적응형 epsilon 계산** - 거리에 따른 정밀도 조절
fn getAdaptiveEpsilon(worldPos2D: vec2<f32>) -> f32 {
    let distance = length(worldPos2D);
    return max(0.03, distance * 0.0008); // 더 정밀한 계산
}

// 🔬 **중앙차분법 노말 계산** - 최적화됨
fn calculateCentralDifferenceNormal(worldPos2D: vec2<f32>, time: f32) -> vec3<f32> {
    let epsilon = getAdaptiveEpsilon(worldPos2D);

    // X 방향 중앙 차분
    let rightHeight = calculateWaveHeight(worldPos2D + vec2<f32>(epsilon, 0.0), time);
    let leftHeight = calculateWaveHeight(worldPos2D - vec2<f32>(epsilon, 0.0), time);

    // Z 방향 중앙 차분
    let frontHeight = calculateWaveHeight(worldPos2D + vec2<f32>(0.0, epsilon), time);
    let backHeight = calculateWaveHeight(worldPos2D - vec2<f32>(0.0, epsilon), time);

    // 편미분 계산
    let dHeightdX = (rightHeight - leftHeight) / (2.0 * epsilon);
    let dHeightdZ = (frontHeight - backHeight) / (2.0 * epsilon);

    // 노말 벡터 계산
    return normalize(vec3<f32>(-dHeightdX, 1.0, -dHeightdZ));
}

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // System uniforms
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;

    // Vertex uniforms
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.normalModelMatrix;

    // 🌊 Water-specific uniforms
    let u_time = systemUniforms.time * 0.001;
    let u_waveScale = vertexUniforms.waveScale;
    let u_waterLevel = vertexUniforms.waterLevel;

    // Light uniforms (shadows)
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;

    // Input data
    let input_position = inputData.position;
    let input_uv = inputData.uv;

    var finalPosition = input_position;

    // 🌊 월드 공간 위치 계산
    let worldPos2D = input_position.xz * u_waveScale;

    // 🌊 **통합 파도 계산 - 위치와 폼 정보**
    let waveResult = calculateAllWaves(worldPos2D, u_time);

    // 🌊 최종 포지션 변환 적용
    finalPosition.x += waveResult.offsetX;
    finalPosition.y += waveResult.height + u_waterLevel;
    finalPosition.z += waveResult.offsetZ;

    // 🔬 **중앙차분법으로 정확한 노말 계산**
    let finalNormal = calculateCentralDifferenceNormal(worldPos2D, u_time);

    // 최종 변환 행렬 적용
    let normalPosition = u_normalModelMatrix * vec4<f32>(finalNormal, 0.0);
    let position = u_modelMatrix * vec4<f32>(finalPosition, 1.0);

    // Output 데이터 설정
    output.position = u_projectionMatrix * u_cameraMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalize(normalPosition.xyz);
    output.uv = input_uv;
    output.worldPosition = position.xyz;
    output.waveHeight = waveResult.height;
    output.waveScale = vertexUniforms.waveScale;
    output.foamIntensity = waveResult.waveBreaking;
    output.flowVector = waveResult.flowVector;
    output.ndcPosition = output.position.xyz / output.position.w;
    output.combinedOpacity = vertexUniforms.combinedOpacity;

    // 🌊 그림자 지원
    #redgpu_if receiveShadow
    {
        var posFromLight = u_directionalLightProjectionViewMatrix * vec4<f32>(position.xyz, 1.0);
        output.shadowPos = vec3<f32>(
            posFromLight.xy * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5),
            posFromLight.z
        );
        output.receiveShadow = vertexUniforms.receiveShadow;
    }
    #redgpu_endIf

    // 🌊 피킹 지원
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);

    return output;
}

// 🌊 **그림자용 최적화된 함수 - 위치 계산만**
fn calculateWaveHeightAndOffset(worldPos: vec2<f32>, time: f32) -> vec3<f32> {
    let primaryDirections = array<vec2<f32>, 4>(
        vertexUniforms.waveDirection1,
        vertexUniforms.waveDirection2,
        vertexUniforms.waveDirection3,
        vertexUniforms.waveDirection4
    );

    let detailDirections = array<vec2<f32>, 2>(
        vertexUniforms.detailWaveDirection1,
        vertexUniforms.detailWaveDirection2
    );

    var totalHeight = 0.0;
    var totalOffsetX = 0.0;
    var totalOffsetZ = 0.0;

    // Primary waves
    for (var i = 0; i < 4; i++) {
        let dir = normalize(primaryDirections[i]);
        let frequency = 2.0 * PI_VALUE / max(vertexUniforms.waveWavelength[i], 0.1);
        let phase = frequency * dot(dir, worldPos) + time * vertexUniforms.waveSpeed[i];
        let steepnessFactor = min(vertexUniforms.waveSteepness[i] / frequency, 0.95);

        let sinPhase = sin(phase);
        let cosPhase = cos(phase);

        totalHeight += vertexUniforms.waveAmplitude[i] * sinPhase;
        totalOffsetX += steepnessFactor * dir.x * cosPhase;
        totalOffsetZ += steepnessFactor * dir.y * cosPhase;
    }

    // Detail waves
    for (var i = 0; i < 2; i++) {
        let dir = normalize(detailDirections[i]);
        let frequency = 2.0 * PI_VALUE / max(vertexUniforms.detailWaveWavelength[i], 0.1);
        let phase = frequency * dot(dir, worldPos) + time * 1.2 * vertexUniforms.detailWaveSpeed[i];
        let steepnessFactor = min(vertexUniforms.detailWaveSteepness[i] / frequency, 0.95);

        let sinPhase = sin(phase);
        let cosPhase = cos(phase);

        totalHeight += vertexUniforms.detailWaveAmplitude[i] * sinPhase;
        totalOffsetX += steepnessFactor * dir.x * cosPhase * 0.6;
        totalOffsetZ += steepnessFactor * dir.y * cosPhase * 0.6;
    }

    return vec3<f32>(totalOffsetX, totalHeight, totalOffsetZ);
}

struct OutputShadowData {
    @builtin(position) position : vec4<f32>,
};

@vertex
fn drawDirectionalShadowDepth(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;

    // 🌊 그림자용으로도 파도 변형 적용 (정확한 그림자를 위해)
    let u_time = systemUniforms.time * 0.001;
    let u_waveScale = vertexUniforms.waveScale;
    let u_waterLevel = vertexUniforms.waterLevel;
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;

    var finalPosition = inputData.position;
    let worldPos2D = inputData.position.xz * u_waveScale;

    // 🌊 그림자용 최적화된 파도 변형 (높이와 오프셋만)
    let waveOffset = calculateWaveHeightAndOffset(worldPos2D, u_time);
    finalPosition.x += waveOffset.x;
    finalPosition.y += waveOffset.y + u_waterLevel;
    finalPosition.z += waveOffset.z;

    let position = u_modelMatrix * vec4<f32>(finalPosition, 1.0);
    output.position = u_directionalLightProjectionViewMatrix * position;

    return output;
}
