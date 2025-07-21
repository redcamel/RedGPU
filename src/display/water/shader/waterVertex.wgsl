#redgpu_include SYSTEM_UNIFORM;
#redgpu_include picking;

struct VertexUniforms {
    pickingId: u32,
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
    receiveShadow: f32,
    combinedOpacity: f32,

    // 🌊 Gerstner Wave Parameters (4 primary waves)
    waveAmplitude: vec4<f32>,
    waveWavelength: vec4<f32>,
    waveSpeed: vec4<f32>,
    waveSteepness: vec4<f32>,
    waveDirection1: vec2<f32>,
    waveDirection2: vec2<f32>,
    waveDirection3: vec2<f32>,
    waveDirection4: vec2<f32>,

    // 🌊 Water visual parameters
    waveScale: f32,
    waterLevel: f32,
};

const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;
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

// 🌊 표준 Gerstner Wave 계산
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
    let frequency = 2.0 * PI_VALUE / wavelength;
    let phase = frequency * dot(dir, worldPos) + time * speed;
    let steepnessFactor = steepness / frequency;

    let sinPhase = sin(phase);
    let cosPhase = cos(phase);

    var result: GerstnerWaveResult;

    // 높이 계산
    result.height = amplitude * sinPhase;

    // 수평 오프셋 계산 (Gerstner의 핵심)
    result.offsetX = steepnessFactor * dir.x * cosPhase;
    result.offsetZ = steepnessFactor * dir.y * cosPhase;

    // 노말 벡터의 편미분 계산
    let waveNormalFactor = frequency * amplitude * cosPhase;
    result.normalX = -dir.x * waveNormalFactor;
    result.normalZ = -dir.y * waveNormalFactor;

    return result;
}

// 🌊 모든 Gerstner Wave들을 합성
fn calculateAllGerstnerWaves(worldPos: vec2<f32>, time: f32) -> GerstnerWaveResult {
    let directions = array<vec2<f32>, 4>(
        vertexUniforms.waveDirection1,
        vertexUniforms.waveDirection2,
        vertexUniforms.waveDirection3,
        vertexUniforms.waveDirection4
    );

    var totalResult: GerstnerWaveResult;
    totalResult.height = 0.0;
    totalResult.offsetX = 0.0;
    totalResult.offsetZ = 0.0;
    totalResult.normalX = 0.0;
    totalResult.normalZ = 0.0;

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

        totalResult.height += wave.height;
        totalResult.offsetX += wave.offsetX;
        totalResult.offsetZ += wave.offsetZ;
        totalResult.normalX += wave.normalX;
        totalResult.normalZ += wave.normalZ;
    }

    return totalResult;
}

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // System uniforms
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_resolution = systemUniforms.resolution;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex uniforms
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.normalModelMatrix;
    let u_receiveShadow = vertexUniforms.receiveShadow;

    // 🌊 Water-specific uniforms
    let u_time = systemUniforms.time * 0.001;
    let u_waveScale = vertexUniforms.waveScale;
    let u_waterLevel = vertexUniforms.waterLevel;

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
    var finalPosition = input_position;
    var finalNormal = input_vertexNormal;
    var waveHeight: f32 = 0.0;

    // 🌊 월드 위치 계산
    let worldPos2D = input_position.xz * u_waveScale;

    // 🌊 Gerstner Waves 계산
    let waves = calculateAllGerstnerWaves(worldPos2D, u_time);

    // 🌊 포지션 변환 적용
    finalPosition.x += waves.offsetX;
    finalPosition.y += waves.height + u_waterLevel;
    finalPosition.z += waves.offsetZ;
    waveHeight = waves.height;

    // 🌊 노말 벡터 계산
    let normalX = waves.normalX;
    let normalZ = waves.normalZ;

    // 정규화된 노말 벡터 생성 (Y는 1.0 기준으로 조정)
    let normalMagnitude = sqrt(normalX * normalX + normalZ * normalZ);
    let normalY = sqrt(max(1.0 - min(normalMagnitude * normalMagnitude, 0.99), 0.01));

    finalNormal = normalize(vec3<f32>(normalX, normalY, normalZ));

    // 최종 변환 적용
    normalPosition = u_normalModelMatrix * vec4<f32>(finalNormal, 0.0);
    position = u_modelMatrix * vec4<f32>(finalPosition, 1.0);

    output.position = u_projectionMatrix * u_cameraMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalize(normalPosition.xyz);
    output.uv = input_uv;
    output.worldPosition = position.xyz;
    output.waveHeight = waveHeight;
    output.ndcPosition = output.position.xyz / output.position.w;

    #redgpu_if receiveShadow
    {
        var posFromLight = u_directionalLightProjectionViewMatrix * vec4(position.xyz, 1.0);
        output.shadowPos = vec3( posFromLight.xy * vec2(0.5, -0.5) + vec2(0.5), posFromLight.z );
        output.receiveShadow = vertexUniforms.receiveShadow;
    }
    #redgpu_endIf

    output.combinedOpacity = vertexUniforms.combinedOpacity;
    return output;
}

struct OutputShadowData {
    @builtin(position) position : vec4<f32>,
};

@vertex
fn drawDirectionalShadowDepth(inputData: InputData) -> OutputShadowData {
    var output: OutputShadowData;
    return output;
}
