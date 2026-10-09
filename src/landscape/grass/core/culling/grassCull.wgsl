#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.struct.GrassTypeParam;
#redgpu_include landscape.struct.DrawIndexedIndirectArgs;
#redgpu_include landscape.math.scatterColorPack;
#redgpu_include landscape.math.testSphereInFrustum;

struct GlobalCullUniforms {
    cameraPosition: vec3<f32>,
    totalInstanceCount: u32,
    frustumPlanes: array<vec4<f32>, 6>,
};

@group(0) @binding(0) var<uniform> uniforms: GlobalCullUniforms;
@group(0) @binding(1) var<storage, read> rawInstances: array<GrassInstance>;
@group(0) @binding(2) var<storage, read_write> culledInstances: array<GrassInstance>;
@group(0) @binding(3) var<storage, read_write> indirectCommands: array<DrawIndexedIndirectArgs>;

struct GrassTypeParamsBlock {
    types: array<GrassTypeParam, 64>,
};
@group(0) @binding(4) var<uniform> typeParamsBlock: GrassTypeParamsBlock;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let index = globalId.x;
    if (index >= uniforms.totalInstanceCount) {
        return;
    }

    let inst = rawInstances[index];

    if (inst.posY < -900000.0) {
        return;
    }

    let typeIdx = unpackTypeId(inst.packedGroundColorAndType);
    if (typeIdx >= 64u) {
        return;
    }

    let typeInfo = typeParamsBlock.types[typeIdx];
    if (typeInfo.instanceCount == 0u || index < typeInfo.rawBaseOffset) {
        return;
    }

    if (index - typeInfo.rawBaseOffset >= typeInfo.instanceCount) {
        return;
    }

    let pos = vec3<f32>(inst.posX, inst.posY, inst.posZ);
    let delta = pos - uniforms.cameraPosition;
    let distSq = dot(delta, delta);

    if (distSq > typeInfo.cullingDistanceSq) {
        return;
    }

    let boundData = unpack2x16float(inst.packedBounding);
    let centerOffsetY = boundData.x;
    let boundRadius = boundData.y;
    let sphereCenter = pos + vec3<f32>(0.0, centerOffsetY, 0.0);

    if (!testSphereInFrustum(sphereCenter, boundRadius, uniforms.frustumPlanes)) {
        return;
    }

    let isFar = typeInfo.hasFarStage != 0u && distSq > typeInfo.farDistanceSq;
    let targetStageSlot = select(typeInfo.nearIndirectSlot, typeInfo.farIndirectSlot, isFar);
    let culledBase = select(typeInfo.culledNearBaseOffset, typeInfo.culledFarBaseOffset, isFar);

    let writeSlot = atomicAdd(&indirectCommands[targetStageSlot].instanceCount, 1u);
    if (writeSlot >= typeInfo.maxInstances) {
        atomicSub(&indirectCommands[targetStageSlot].instanceCount, 1u);
        return;
    }

    let numUnits = max(typeInfo.renderUnitCount, 1u);
    for (var s = 1u; s < numUnits; s = s + 1u) {
        atomicAdd(&indirectCommands[targetStageSlot + s].instanceCount, 1u);
    }

    var fadeRatio: f32 = 1.0;
    var alphaFade: f32 = 1.0;
    var shadowFadeRatio: f32 = 1.0;
    var shadowAlphaFade: f32 = 1.0;

    let needsMainFade = distSq > typeInfo.fadeStartSq;
    let isShadowOut = distSq >= typeInfo.shadowCullDistanceSq;
    let needsShadowFade = !isShadowOut && (distSq > typeInfo.shadowFadeStartSq);

    if (needsMainFade || needsShadowFade) {
        let distToCam = sqrt(distSq);
        if (needsMainFade) {
            fadeRatio = clamp((typeInfo.cullingDistance - distToCam) * typeInfo.invFadeRange, 0.0, 1.0);
            alphaFade = smoothstep(0.0, 1.0, fadeRatio);
        }
        if (needsShadowFade) {
            shadowFadeRatio = clamp((typeInfo.shadowCullDistance - distToCam) * typeInfo.invShadowFadeRange, 0.0, 1.0);
            shadowAlphaFade = smoothstep(0.0, 1.0, shadowFadeRatio);
        }
    }

    if (isShadowOut) {
        shadowFadeRatio = 0.0;
        shadowAlphaFade = 0.0;
    }

    var culledInst = inst;

    culledInst.packedBounding = pack4x8unorm(vec4<f32>(fadeRatio, alphaFade, shadowFadeRatio, shadowAlphaFade));

    let culledTargetIdx = culledBase + writeSlot;
    culledInstances[culledTargetIdx] = culledInst;
}
