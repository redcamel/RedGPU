#redgpu_include SYSTEM_UNIFORM;

struct GrassInstance {
    posX: f32,
    posY: f32,
    posZ: f32,
    rotationY: f32,
    scaleXZ: f32,
    scaleY: f32,
    packedNormal: u32,
    packedGroundColor: u32,
};

struct GrassUniforms {
    cullingDistance: f32,
    shrinkStartDistance: f32,
    meshHeight: f32,
    minY: f32,
};

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @builtin(instance_index) instanceIndex: u32,
};

struct VertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) worldPos: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>,
    @location(3) heightRatio: f32,
    @location(4) alphaFade: f32,
    @location(5) currentClipPos: vec4<f32>,
    @location(6) prevClipPos: vec4<f32>,
    @location(7) groundColor: vec3<f32>,
};

@group(1) @binding(0) var<storage, read> culledInstances: array<GrassInstance>;
@group(1) @binding(1) var<uniform> grassUniforms: GrassUniforms;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    let instance = culledInstances[input.instanceIndex];
    let rotationY = instance.rotationY;
    var scaleXZ = instance.scaleXZ;
    var scaleY = instance.scaleY;

    let camPos = systemUniforms.camera.cameraPosition.xyz;
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);
    let distToCam = distance(instPos, camPos);

    let shrinkStart = grassUniforms.shrinkStartDistance;
    let cullDist = grassUniforms.cullingDistance;
    var shrink = 1.0;
    var alphaFade = 1.0;

    if (distToCam > shrinkStart) {
        shrink = clamp((cullDist - distToCam) / max(1.0, cullDist - shrinkStart), 0.0, 1.0);
        scaleXZ = scaleXZ * shrink;
        scaleY = scaleY * shrink;
        alphaFade = smoothstep(0.0, 1.0, shrink);
    }

    let baseHeight = max(0.01, grassUniforms.meshHeight);
    let heightRatio = clamp((input.position.y - grassUniforms.minY) / baseHeight, 0.0, 1.0);

    let cosR = cos(rotationY);
    let sinR = sin(rotationY);
    let localX = input.position.x * cosR - input.position.z * sinR;
    let localZ = input.position.x * sinR + input.position.z * cosR;

    let normRotX = input.normal.x * cosR - input.normal.z * sinR;
    let normRotZ = input.normal.x * sinR + input.normal.z * cosR;

    var localPos = vec3<f32>(
        localX * scaleXZ,
        (input.position.y - grassUniforms.minY) * scaleY,
        localZ * scaleXZ
    );
    var localNorm = vec3<f32>(normRotX, input.normal.y, normRotZ);

    let unpackedNorm = unpack2x16snorm(instance.packedNormal);
    let normX = unpackedNorm.x;
    let normZ = unpackedNorm.y;
    let normY = sqrt(max(0.0, 1.0 - normX * normX - normZ * normZ));
    let terrainN = vec3<f32>(normX, normY, normZ);

    let rotAxis = vec3<f32>(normZ, 0.0, -normX);
    let axisLen = length(rotAxis);
    if (axisLen > 0.0001) {
        let axis = rotAxis / axisLen;
        let cosA = normY;
        let sinA = axisLen;
        let oneMinusCos = 1.0 - cosA;
        localPos = localPos * cosA + cross(axis, localPos) * sinA + axis * dot(axis, localPos) * oneMinusCos;
        localNorm = localNorm * cosA + cross(axis, localNorm) * sinA + axis * dot(axis, localNorm) * oneMinusCos;
    }

    let worldPos = localPos + instPos;
    let worldNormal = normalize(localNorm);

    // [KO] 카메라 상대적 고정밀 투영 변환 (풀 잎 지터링 방지)
    // [EN] Camera-relative high-precision projection transform
    let relPos = worldPos - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;

    output.clipPos = systemUniforms.projection.projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.worldPos = worldPos;
    output.uv = input.uv;
    output.normal = worldNormal;
    output.heightRatio = heightRatio;
    output.alphaFade = alphaFade;
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionMatrix * vec4<f32>(viewPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.groundColor = unpack4x8unorm(instance.packedGroundColor).rgb;

    return output;
}
