#redgpu_include SYSTEM_UNIFORM;
#redgpu_include picking;

struct VertexUniforms {
    pickingId: u32,
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
    receiveShadow: f32,
    combinedOpacity: f32,
    //


    // 🌊 Gerstner Wave Parameters (4 waves)
    waveAmplitude: vec4<f32>,      // amplitude1, amplitude2, amplitude3, amplitude4
    waveWavelength: vec4<f32>,     // wavelength1, wavelength2, wavelength3, wavelength4
    waveSpeed: vec4<f32>,          // speed1, speed2, speed3, speed4
    waveSteepness: vec4<f32>,      // steepness1, steepness2, steepness3, steepness4
    waveDirection1: vec2<f32>,     // direction1
    waveDirection2: vec2<f32>,     // direction2
    waveDirection3: vec2<f32>,     // direction3
    waveDirection4: vec2<f32>,     // direction4

    // 🌊 Water visual parameters
    waveScale: f32,
    waterLevel: f32,
};

const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;
const PI: f32 = 3.14159265359;

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
    @location(3) worldPosition: vec3<f32>,  // 🌊 월드 위치 추가
    @location(4) waveHeight: f32,           // 🌊 파도 높이 정보
    @location(9) ndcPosition: vec3<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(14) receiveShadow: f32,
    @location(15) pickingId: vec4<f32>,
};

// 🌊 단일 Gerstner Wave 계산
struct GerstnerWaveResult {
    height: f32,
    offsetX: f32,
    offsetZ: f32,
    normalX: f32,
    normalZ: f32,
}

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
    let frequency = 2.0 * PI / wavelength;
    let phase = frequency * dot(dir, worldPos) + time * speed;

    let Q = steepness / (frequency * amplitude + 0.001); // 0으로 나누기 방지

    let sinPhase = sin(phase);
    let cosPhase = cos(phase);

    var result: GerstnerWaveResult;
    result.height = amplitude * sinPhase;
    result.offsetX = Q * amplitude * dir.x * cosPhase;
    result.offsetZ = Q * amplitude * dir.y * cosPhase;

    // 🌊 노말 벡터 계산 (파도의 기울기)
    let dPhaseDx = frequency * dir.x;
    let dPhaseDz = frequency * dir.y;
    result.normalX = -dPhaseDx * amplitude * cosPhase * (1.0 + Q);
    result.normalZ = -dPhaseDz * amplitude * cosPhase * (1.0 + Q);

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

    // 🌊 월드 위치 계산 (Gerstner Wave 계산용)
    let worldPos4 = u_modelMatrix * vec4<f32>(input_position, 1.0);
    let worldPos2D = worldPos4.xz * u_waveScale;

    let gerstnerResult = calculateAllGerstnerWaves(worldPos2D, u_time);

    // 🌊 버텍스 위치에 파도 효과 적용
    finalPosition.x += gerstnerResult.offsetX;
    finalPosition.y += gerstnerResult.height + u_waterLevel;
    finalPosition.z += gerstnerResult.offsetZ;
    waveHeight = gerstnerResult.height;

    // 🌊 노말 벡터 계산
    let normalX = gerstnerResult.normalX;
    let normalZ = gerstnerResult.normalZ;
    let normalY = 1.0 - sqrt(normalX * normalX + normalZ * normalZ);
    finalNormal = normalize(vec3<f32>(normalX, normalY, normalZ));

    normalPosition = u_normalModelMatrix * vec4<f32>(finalNormal, 1.0);

    // 🌊 최종 위치 계산
    position = u_modelMatrix * vec4<f32>(finalPosition, 1.0);

    output.position = u_projectionMatrix * u_cameraMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = input_uv;
    output.worldPosition = position.xyz;  // 🌊 월드 위치
    output.waveHeight = waveHeight;       // 🌊 파도 높이
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
    // TODO SpriteSheet3D drawDirectionalShadowDepth
    var output: OutputShadowData;
    return output;
}
