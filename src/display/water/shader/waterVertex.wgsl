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
    @location(9) ndcPosition: vec3<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(14) receiveShadow: f32,
    @location(15) pickingId: vec4<f32>,
};

struct GerstnerWaveResult {
    height: f32,
    offsetX: f32,
    offsetZ: f32,
    normalX: f32,
    normalZ: f32,
}

struct WaveHeightResult {
    height: f32,
    offsetX: f32,
    offsetZ: f32,
}

// 🌊 **통합 스케일 계산 함수** (노말과 거품이 공동 사용)
fn getAdaptiveScale(worldPos2D: vec2<f32>, time: f32) -> f32 {
    let baseScale = 8.5;
    let distanceFromOrigin = length(worldPos2D);
    return baseScale + sin(distanceFromOrigin * 0.01 + time * 0.3) * 2.0;
}

// 🌊 **통합 epsilon 계산** (노말 계산 정밀도)
fn getAdaptiveEpsilon(worldPos2D: vec2<f32>) -> f32 {
    let distance = length(worldPos2D);
    return max(0.05, distance * 0.001); // 최소값 보장으로 안정성 확보
}

// 🌊 **통합 회전 시스템** (격자 패턴 완전 방지)
fn getRotationTransform(worldPos2D: vec2<f32>, time: f32) -> vec2<f32> {
    let rotationAngle = time * 0.1;
    let cosR = cos(rotationAngle);
    let sinR = sin(rotationAngle);
    return vec2<f32>(
        worldPos2D.x * cosR - worldPos2D.y * sinR,
        worldPos2D.x * sinR + worldPos2D.y * cosR
    );
}

// 🌊 고성능 Gerstner Wave 계산 (최적화된 버전)
fn calculateGerstnerWave(
    worldPos: vec2<f32>,
    time: f32,
    direction: vec2<f32>,
    amplitude: f32,
    wavelength: f32,
    speed: f32,
    steepness: f32
) -> GerstnerWaveResult {
    let dir = normalize(direction);
    let frequency = 2.0 * PI_VALUE / max(wavelength, 0.1);
    let phase = frequency * dot(dir, worldPos) + time * speed;
    let steepnessFactor = min(steepness / frequency, 0.95);

    let sinPhase = sin(phase);
    let cosPhase = cos(phase);

    var result: GerstnerWaveResult;
    result.height = amplitude * sinPhase;
    result.offsetX = steepnessFactor * dir.x * cosPhase;
    result.offsetZ = steepnessFactor * dir.y * cosPhase;

    let normalFactor = frequency * amplitude * cosPhase;
    result.normalX = -dir.x * normalFactor;
    result.normalZ = -dir.y * normalFactor;

    return result;
}

// 🌊 높이만 계산하는 최적화된 함수 (중앙 차분법용)
fn calculateWaveHeight(
    worldPos: vec2<f32>,
    time: f32,
    direction: vec2<f32>,
    amplitude: f32,
    wavelength: f32,
    speed: f32,
    steepness: f32
) -> WaveHeightResult {
    let dir = normalize(direction);
    let frequency = 2.0 * PI_VALUE / max(wavelength, 0.1);
    let phase = frequency * dot(dir, worldPos) + time * speed;
    let steepnessFactor = min(steepness / frequency, 0.95);

    let sinPhase = sin(phase);
    let cosPhase = cos(phase);

    var result: WaveHeightResult;
    result.height = amplitude * sinPhase;
    result.offsetX = steepnessFactor * dir.x * cosPhase;
    result.offsetZ = steepnessFactor * dir.y * cosPhase;

    return result;
}

// 🌊 Primary 4개 웨이브 계산 (주된 물결)
fn calculatePrimaryWaves(worldPos: vec2<f32>, time: f32) -> GerstnerWaveResult {
    let directions = array<vec2<f32>, 4>(
        vertexUniforms.waveDirection1,
        vertexUniforms.waveDirection2,
        vertexUniforms.waveDirection3,
        vertexUniforms.waveDirection4
    );

    var primaryResult: GerstnerWaveResult;
    primaryResult.height = 0.0;
    primaryResult.offsetX = 0.0;
    primaryResult.offsetZ = 0.0;
    primaryResult.normalX = 0.0;
    primaryResult.normalZ = 0.0;

    for (var i = 0; i < 4; i++) {
        let wave = calculateGerstnerWave(
            worldPos,
            time,
            directions[i],
            vertexUniforms.waveAmplitude[i],
            vertexUniforms.waveWavelength[i],
            vertexUniforms.waveSpeed[i],
            vertexUniforms.waveSteepness[i]
        );

        primaryResult.height += wave.height;
        primaryResult.offsetX += wave.offsetX;
        primaryResult.offsetZ += wave.offsetZ;
        primaryResult.normalX += wave.normalX;
        primaryResult.normalZ += wave.normalZ;
    }

    return primaryResult;
}

// 🌀 Detail 2개 웨이브 계산 (세부 디테일)
fn calculateDetailWaves(worldPos: vec2<f32>, time: f32) -> GerstnerWaveResult {
    let directions = array<vec2<f32>, 2>(
        vertexUniforms.detailWaveDirection1,
        vertexUniforms.detailWaveDirection2
    );

    var detailResult: GerstnerWaveResult;
    detailResult.height = 0.0;
    detailResult.offsetX = 0.0;
    detailResult.offsetZ = 0.0;
    detailResult.normalX = 0.0;
    detailResult.normalZ = 0.0;

    for (var i = 0; i < 2; i++) {
        let wave = calculateGerstnerWave(
            worldPos,
            time,
            directions[i],
            vertexUniforms.detailWaveAmplitude[i],
            vertexUniforms.detailWaveWavelength[i],
            vertexUniforms.detailWaveSpeed[i],
            vertexUniforms.detailWaveSteepness[i]
        );

        detailResult.height += wave.height;
        detailResult.offsetX += wave.offsetX;
        detailResult.offsetZ += wave.offsetZ;
        detailResult.normalX += wave.normalX;
        detailResult.normalZ += wave.normalZ;
    }

    return detailResult;
}

// 🔬 중앙 차분법을 위한 통합 높이 계산 함수
fn calculateTotalWaveHeight(worldPos: vec2<f32>, time: f32) -> WaveHeightResult {
    // Primary waves
    let primaryDirections = array<vec2<f32>, 4>(
        vertexUniforms.waveDirection1,
        vertexUniforms.waveDirection2,
        vertexUniforms.waveDirection3,
        vertexUniforms.waveDirection4
    );

    // Detail waves
    let detailDirections = array<vec2<f32>, 2>(
        vertexUniforms.detailWaveDirection1,
        vertexUniforms.detailWaveDirection2
    );

    var result: WaveHeightResult;
    result.height = 0.0;
    result.offsetX = 0.0;
    result.offsetZ = 0.0;

    // Primary 4개 웨이브 합성
    for (var i = 0; i < 4; i++) {
        let wave = calculateWaveHeight(
            worldPos,
            time,
            primaryDirections[i],
            vertexUniforms.waveAmplitude[i],
            vertexUniforms.waveWavelength[i],
            vertexUniforms.waveSpeed[i],
            vertexUniforms.waveSteepness[i]
        );
        result.height += wave.height;
        result.offsetX += wave.offsetX;
        result.offsetZ += wave.offsetZ;
    }

    // Detail 2개 웨이브 합성
    for (var i = 0; i < 2; i++) {
        let wave = calculateWaveHeight(
            worldPos,
            time * 1.2,
            detailDirections[i],
            vertexUniforms.detailWaveAmplitude[i],
            vertexUniforms.detailWaveWavelength[i],
            vertexUniforms.detailWaveSpeed[i],
            vertexUniforms.detailWaveSteepness[i]
        );
        result.height += wave.height;
        result.offsetX += wave.offsetX * 0.6;
        result.offsetZ += wave.offsetZ * 0.6;
    }

    return result;
}

// 🔬 **통합 동기화된 중앙 차분법 노말 계산**
fn calculateCentralDifferenceNormal(worldPos2D: vec2<f32>, time: f32) -> vec3<f32> {
    let epsilon = getAdaptiveEpsilon(worldPos2D);

    // X 방향 중앙 차분
    let rightHeight = calculateTotalWaveHeight(worldPos2D + vec2<f32>(epsilon, 0.0), time).height;
    let leftHeight = calculateTotalWaveHeight(worldPos2D - vec2<f32>(epsilon, 0.0), time).height;

    // Z 방향 중앙 차분
    let frontHeight = calculateTotalWaveHeight(worldPos2D + vec2<f32>(0.0, epsilon), time).height;
    let backHeight = calculateTotalWaveHeight(worldPos2D - vec2<f32>(0.0, epsilon), time).height;

    // 편미분 계산 (중앙 차분법)
    let dHeightdX = (rightHeight - leftHeight) / (2.0 * epsilon);
    let dHeightdZ = (frontHeight - backHeight) / (2.0 * epsilon);

    // 노말 벡터 계산 - 높이 필드의 그래디언트를 이용
    return normalize(vec3<f32>(-dHeightdX, 1.0, -dHeightdZ));
}

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // System uniforms
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

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
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    var finalPosition = input_position;

    // 🌊 월드 공간 위치 계산
    let worldPos2D = input_position.xz * u_waveScale;

    // 🌊 통합 파도 계산 (높이 + 오프셋)
    let totalWaveResult = calculateTotalWaveHeight(worldPos2D, u_time);
    let totalHeight = totalWaveResult.height;
    let totalOffsetX = totalWaveResult.offsetX;
    let totalOffsetZ = totalWaveResult.offsetZ;

    // 🌊 최종 포지션 변환 적용
    finalPosition.x += totalOffsetX;
    finalPosition.y += totalHeight + u_waterLevel;
    finalPosition.z += totalOffsetZ;

    // 🔬 **통합 동기화된 중앙 차분법으로 노말 계산**
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
    output.waveHeight = totalHeight;
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

struct OutputShadowData {
    @builtin(position) position : vec4<f32>,
};

@vertex
fn drawDirectionalShadowDepth(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;
//
//    // 🌊 그림자용으로도 파도 변형 적용 (정확한 그림자를 위해)
//    let u_time = systemUniforms.time * 0.001;
//    let u_waveScale = vertexUniforms.waveScale;
//    let u_waterLevel = vertexUniforms.waterLevel;
//    let u_modelMatrix = vertexUniforms.modelMatrix;
//    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
//
//    var finalPosition = inputData.position;
//    let worldPos2D = inputData.position.xz * u_waveScale;
//
//    // 🌊 그림자용 간단한 파도 변형 (최적화)
//    let totalWaveResult = calculateTotalWaveHeight(worldPos2D, u_time);
//
//    finalPosition.x += totalWaveResult.offsetX;
//    finalPosition.y += totalWaveResult.height + u_waterLevel;
//    finalPosition.z += totalWaveResult.offsetZ;
//
//    let position = u_modelMatrix * vec4<f32>(finalPosition, 1.0);
//    output.position = u_directionalLightProjectionViewMatrix * position;

    return output;
}
