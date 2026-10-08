#redgpu_include SYSTEM_UNIFORM;
#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.struct.GrassParams;
#redgpu_include landscape.struct.GrassVertexOutput;
#redgpu_include landscape.math.transformGrassPosition;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @builtin(instance_index) instanceIndex: u32,
};

@group(1) @binding(0) var<storage, read> culledInstances: array<GrassInstance>;
@group(1) @binding(1) var<uniform> grassUniforms: GrassParams;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    let instance = culledInstances[input.instanceIndex];
    let camPos = systemUniforms.camera.cameraPosition.xyz;
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);
    let distToCam = distance(instPos, camPos);

    let cullDist = grassUniforms.cullingDistance;
    let fadeStart = min(grassUniforms.fadeStartDistance, cullDist);
    let fade = computeGrassDistanceFade(distToCam, cullDist, fadeStart, instance.scaleXZ, instance.scaleY);

    let xform = transformGrassPosition(
        input.position,
        instPos,
        fade.scaleXZ,
        fade.scaleY,
        instance.packedQuat,
        grassUniforms.minY,
        grassUniforms.meshHeight
    );
    let worldNormal = rotateGrassNormal(input.normal, instance.packedQuat);

    let relPos = xform.worldPos - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;

    output.clipPos = systemUniforms.projection.projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.worldPos = xform.worldPos;
    output.uv = input.uv;
    output.normal = worldNormal;
    output.heightRatio = xform.heightRatio;
    output.alphaFade = fade.alphaFade;
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionMatrix * vec4<f32>(viewPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(xform.worldPos, 1.0);

    output.groundColor = unpack4x8unorm(instance.packedGroundColorAndType);

    return output;
}
