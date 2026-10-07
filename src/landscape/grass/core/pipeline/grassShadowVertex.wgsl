#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;
#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.struct.GrassParams;
#redgpu_include landscape.math.transformGrassPosition;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @builtin(instance_index) instanceIndex: u32,
};

struct ShadowVertexOutput {
    @builtin(position) clipPos: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) alphaFade: f32,
};

@group(1) @binding(0) var<storage, read> culledInstances: array<GrassInstance>;
@group(1) @binding(1) var<uniform> grassUniforms: GrassParams;

@vertex
fn main(input: VertexInput) -> ShadowVertexOutput {
    var output: ShadowVertexOutput;

    let instance = culledInstances[input.instanceIndex];
    let camPos = systemUniforms.camera.cameraPosition.xyz;
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);
    let distToCam = distance(instPos, camPos);

    let shadowCullDist = grassUniforms.shadowCullDistance;
    let shadowFadeStart = min(grassUniforms.shadowFadeStartDistance, shadowCullDist);

    if (distToCam >= shadowCullDist) {
        output.clipPos = vec4<f32>(2.0, 2.0, 2.0, 1.0);
        output.uv = vec2<f32>(0.0, 0.0);
        output.alphaFade = 0.0;
        return output;
    }

    let fade = computeGrassDistanceFade(distToCam, shadowCullDist, shadowFadeStart, instance.scaleXZ, instance.scaleY);

    let xform = transformGrassPosition(
        input.position,
        instPos,
        fade.scaleXZ,
        fade.scaleY,
        instance.packedQuat,
        grassUniforms.minY,
        grassUniforms.meshHeight
    );

    output.clipPos = getShadowClipPosition(xform.worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    output.uv = input.uv;
    output.alphaFade = fade.alphaFade;

    return output;
}
