#redgpu_include SYSTEM_UNIFORM;
#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.struct.GrassParams;
#redgpu_include landscape.struct.GrassVertexOutput;
#redgpu_include landscape.math.rotateVectorByQuat;
#redgpu_include landscape.math.transformGrassPosition;
#redgpu_include landscape.math.blendGrassGround;

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
    let delta = instPos - camPos;
    let distSq = dot(delta, delta);

    var scaleXZ = instance.scaleXZ;
    var scaleY = instance.scaleY;
    var alphaFade: f32 = 1.0;

    let fadeStart = min(grassUniforms.fadeStartDistance, grassUniforms.cullingDistance);
    let fadeStartSq = fadeStart * fadeStart;
    if (distSq > fadeStartSq) {
        let distToCam = sqrt(distSq);
        let fadeRatio = clamp((grassUniforms.cullingDistance - distToCam) * grassUniforms.invFadeRange, 0.0, 1.0);
        scaleXZ *= fadeRatio;
        scaleY *= fadeRatio;
        alphaFade = smoothstep(0.0, 1.0, fadeRatio);
    }

    let q = normalize(unpack4x8snorm(instance.packedQuat));

    let xform = transformGrassPosition(
        input.position,
        instPos,
        scaleXZ,
        scaleY,
        q,
        grassUniforms.minY,
        grassUniforms.invMeshHeight
    );
    let worldNormal = rotateVectorByQuat(input.normal, q);

    let relPos = xform.worldPos - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;

    output.clipPos = systemUniforms.projection.projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.worldPos = xform.worldPos;
    output.uv = input.uv;
    output.normal = computeGrassUpwardNormal(worldNormal, xform.heightRatio);
    output.heightRatio = xform.heightRatio;
    output.alphaFade = alphaFade;
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionMatrix * vec4<f32>(viewPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(xform.worldPos, 1.0);

    output.groundColor = unpack4x8unorm(instance.packedGroundColorAndType);

    return output;
}
