#redgpu_include SYSTEM_UNIFORM;
#redgpu_include landscape.rotateVectorByQuat;
#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.struct.GrassRenderParams;
#redgpu_include landscape.struct.GrassVertexOutput;
#redgpu_include landscape.grassVertexCommon;

fn computeGrassUpwardNormal(vertexNormal: vec3<f32>, heightRatio: f32) -> vec3<f32> {
    let upVec = vec3<f32>(0.0, 1.0, 0.0);
    let upwardBlend = mix(0.55, 0.85, heightRatio);
    return normalize(mix(vertexNormal, upVec, upwardBlend));
}

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @builtin(instance_index) instanceIndex: u32,
};

@group(1) @binding(0) var<storage, read> culledInstances: array<GrassInstance>;
@group(1) @binding(1) var<uniform> grassUniforms: GrassRenderParams;

@vertex
fn main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;

    let instance = culledInstances[input.instanceIndex];
    let instPos = vec3<f32>(instance.posX, instance.posY, instance.posZ);

    let fadeData = unpack4x8unorm(instance.packedBounding);
    let fadeRatio = fadeData.x;
    let alphaFade = fadeData.y;

    let scaleXZ = instance.scaleXZ * fadeRatio;
    let scaleY = instance.scaleY * fadeRatio;

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

    let viewDepth = -viewPos.z;
    var shadowWeight = 0.0;
    let shadowInfo = systemUniforms.shadow;
    let csmStrength = shadowInfo.directionalShadowStrength * grassUniforms.shadowStrength;
    let casterRadiusSq = shadowInfo.casterBoundingRadiusSq;

    if (grassUniforms.receiveShadow != 0u && systemUniforms.directionalLightCount > 0u && csmStrength > 0.001 && casterRadiusSq != 0.0 && viewDepth > 0.0) {
        let cascadeCount = min(4u, max(1u, shadowInfo.cascadeCount));
        let maxCSMDist = shadowInfo.cascadeSplitDepths[cascadeCount - 1u];
        let maxDist = min(maxCSMDist, grassUniforms.shadowCullDistance);
        let distSq = dot(relPos, relPos);
        if (distSq < maxDist * maxDist) {
            var inCasterBounds = true;
            if (casterRadiusSq > 0.0) {
                let casterDiff = xform.worldPos - shadowInfo.casterBoundingCenter;
                inCasterBounds = dot(casterDiff, casterDiff) <= casterRadiusSq;
            }
            if (inCasterBounds) {
                let distToCam = sqrt(distSq);
                let fadeLinear = saturate((maxDist - distToCam) * grassUniforms.invShadowFadeRange);
                shadowWeight = smoothstep(0.0, 1.0, fadeLinear) * csmStrength;
            }
        }
    }
    output.shadowData = vec2<f32>(shadowWeight, viewDepth);

    return output;
}
