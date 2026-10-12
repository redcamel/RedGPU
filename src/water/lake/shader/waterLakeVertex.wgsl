#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.globalVertexStruct;
#redgpu_include math.PI;

struct WaterLakeVertexUniforms {
    waveAmplitude: f32,
    waveWavelength: f32,
    pad0: f32, // 16-byte tail alignment
    pad1: f32,
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
};

fn calculateWaveDisplacement(posXZ: vec2<f32>, timeSec: f32) -> vec4<f32> {
    if (systemUniforms.wind.enabled == 0u || systemUniforms.wind.strength <= 0.0001 || vertexUniforms.waveAmplitude <= 0.0001) {
        return vec4<f32>(0.0, 0.0, 0.0, 0.0);
    }

    let wavelength = max(0.5, vertexUniforms.waveWavelength);
    let k = (2.0 * PI) / wavelength;
    let speed = systemUniforms.wind.speed;
    let amp = vertexUniforms.waveAmplitude * systemUniforms.wind.strength;

    let rawWindXZ = systemUniforms.wind.direction.xz;
    let rawLenSq = dot(rawWindXZ, rawWindXZ);
    let dir1 = select(vec2<f32>(1.0, 0.0), normalize(rawWindXZ), rawLenSq > 1e-8);
    let dir2 = vec2<f32>(
        dir1.x * 0.819152 - dir1.y * 0.573576,
        dir1.x * 0.573576 + dir1.y * 0.819152
    );

    let k1 = k;
    let sqrt98k = sqrt(9.8 * k1);
    let omega1 = sqrt98k * 0.4 + speed * 0.6;
    let phase1 = dot(posXZ, dir1) * k1 - timeSec * omega1;
    let cosP1 = cos(phase1);
    let sinP1 = sin(phase1);
    let amp1 = amp * 0.75;

    let y1 = amp1 * sinP1;
    let dY1dx = amp1 * k1 * dir1.x * cosP1;
    let dY1dz = amp1 * k1 * dir1.y * cosP1;

    let k2 = k * 1.65;
    let omega2 = sqrt98k * 0.5138093 + speed * 0.8;
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

    let gu_matrixList = globalVertexData.matrixList;
    let gu_modelMatrix = gu_matrixList.modelMatrix;
    let gu_normalModelMatrix = gu_matrixList.normalModelMatrix;

    let timeSec = systemUniforms.time.time;

    var localPos = inputData.position;

    let baseWorldPos = gu_modelMatrix * vec4<f32>(localPos, 1.0);
    let waveResult = calculateWaveDisplacement(baseWorldPos.xz, timeSec);

    let dispY = waveResult.x;
    let dYdx = waveResult.y;
    let dYdz = waveResult.z;

    let localNormal = normalize(vec3<f32>(-dYdx, 1.0, -dYdz));
    let localTangent = normalize(vec3<f32>(1.0, dYdx, 0.0));

    let worldPos = vec4<f32>(baseWorldPos.xyz + gu_modelMatrix[1].xyz * dispY, 1.0);
    let worldNormal = normalize((gu_normalModelMatrix * vec4<f32>(localNormal, 0.0)).xyz);
    let worldTangent = normalize((gu_normalModelMatrix * vec4<f32>(localTangent, 0.0)).xyz);

    let toCam = systemUniforms.camera.cameraPosition - worldPos.xyz;
    let camDist = length(toCam);
    let V = toCam / max(camDist, 0.001);
    let NdotV = saturate(V.y);
    let grazingFactor = 1.0 - NdotV;
    let horizonAngleFactor = smoothstep(0.65, 0.90, grazingFactor);
    let distFactor = smoothstep(20.0, 100.0, camDist);
    let taaFactor = horizonAngleFactor * distFactor;

    let relPos = -toCam;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;
    let clipPosNoneJitter = su_projection.noneJitterProjectionMatrix * vec4<f32>(viewPos, 1.0);
    let clipPosJittered = su_projection.projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.position = mix(clipPosNoneJitter, clipPosJittered, taaFactor);
    output.vertexPosition = worldPos.xyz;
    output.vertexNormal = worldNormal;
    output.uv = inputData.uv * globalVertexData.uvTransform.zw + globalVertexData.uvTransform.xy;
    output.vertexTangent = vec4<f32>(worldTangent, inputData.vertexTangent.w);

    return output;
}
