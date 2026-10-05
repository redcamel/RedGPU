#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;
#redgpu_include landscape.math.rotateVectorByQuat;
#redgpu_include landscape.math.transformFoliagePosition;
#redgpu_include landscape.math.ditherFadeDiscard;
#redgpu_include landscape.math.evaluateMipScaledAlphaCutoff;

struct SubMeshUniforms {
    relativeModelMatrix: mat4x4<f32>,
    relativeNormalMatrix: mat4x4<f32>,
    globalFragmentSlotIndex: u32,
    hasHierarchyTransform: u32,
    receiveShadow: f32,
    pad0: u32,

    windMultiplier: f32,
    windFlutterMultiplier: f32,
    treeHeight: f32,
    pad1: u32,

    groundBlendStrength: f32,
    groundBlendRange: f32,
    padGB0: f32,
    padGB1: f32,
};

@group(1) @binding(0) var<uniform> subMeshUniforms: SubMeshUniforms;

fn calculateFoliageWindDisplacement(
    worldPos: vec3<f32>,
    localPos: vec3<f32>,
    vertexNormal: vec3<f32>,
    vertexColor: vec4<f32>,
    instancePos: vec3<f32>,
    time: f32
) -> vec3<f32> {
    if (systemUniforms.wind.enabled == 0u || systemUniforms.wind.strength <= 0.0001 || subMeshUniforms.windMultiplier <= 0.0001) {
        return vec3<f32>(0.0);
    }

    let viewDist = distance(systemUniforms.camera.cameraPosition, instancePos);
    if (viewDist > 500.0) {
        return vec3<f32>(0.0);
    }

    let treeH = max(2.0, subMeshUniforms.treeHeight);
    let heightNorm = clamp(localPos.y / treeH, 0.0, 1.0);

    let groundAnchor = smoothstep(0.08, 0.8, heightNorm);
    let cubicBend = groundAnchor * groundAnchor * groundAnchor;

    let radialDist = length(localPos.xz);
    let branchRadialMask = smoothstep(0.15, 0.55, radialDist);

    let hasValidMask = (vertexColor.r > 0.001 && vertexColor.r < 0.999) ||
                       (vertexColor.b > 0.001 && vertexColor.b < 0.999);

    let trunkMask = select(
        cubicBend,
        vertexColor.r * groundAnchor,
        hasValidMask
    );

    let leafMask = select(
        branchRadialMask * groundAnchor,
        vertexColor.b * groundAnchor,
        hasValidMask
    );

    let rawWindXZ = systemUniforms.wind.direction.xz;
    let windDir = select(vec2<f32>(1.0, 0.0), normalize(rawWindXZ), length(rawWindXZ) > 0.0001);
    let windSpeed = systemUniforms.wind.speed;
    let windFreq = systemUniforms.wind.frequency;

    let treeBaseXZ = instancePos.xz;
    let spatialPhase = (treeBaseXZ.x * windDir.x + treeBaseXZ.y * windDir.y) * windFreq;
    let mainWave = sin(time * windSpeed + spatialPhase);
    let gustWave = sin(time * (windSpeed * 1.5) + spatialPhase * 1.8) * 0.25;
    let combinedWave = mainWave + gustWave;

    let trunkDistFade = clamp(1.0 - (viewDist - 350.0) / 150.0, 0.0, 1.0);
    let trunkDisplacement = vec3<f32>(windDir.x, 0.0, windDir.y) *
                            (combinedWave * trunkMask * (systemUniforms.wind.strength * 0.45) * subMeshUniforms.windMultiplier * trunkDistFade);

    let leafPhase = dot(localPos, vec3<f32>(0.9, 1.4, 0.9)) + time * (windSpeed * 3.5);
    let leafWaveX = sin(leafPhase);
    let leafWaveY = cos(leafPhase * 1.3);
    let leafWaveZ = sin(leafPhase * 0.85);

    let flutterDistFade = clamp(1.0 - (viewDist - 150.0) / 150.0, 0.0, 1.0);
    let flutterScale = (systemUniforms.wind.flutterStrength * 0.45) * subMeshUniforms.windMultiplier * subMeshUniforms.windFlutterMultiplier * flutterDistFade;
    let leafDisplacement = vec3<f32>(
        windDir.x * leafWaveX * 0.75,
        leafWaveY * 0.5,
        windDir.y * leafWaveZ * 0.75
    ) * (leafMask * flutterScale);

    return trunkDisplacement + leafDisplacement;
}

struct FoliageInstanceData {
    instancePos: vec3<f32>,
    instanceScale: vec3<f32>,
    xform: FoliageVertexTransformResult,
};

fn unpackAndTransformFoliage(
    position: vec3<f32>,
    instancePos_scaleY: vec4<f32>,
    instanceRotQuat: vec4<f32>,
    instanceScaleXZ: vec2<f32>
) -> FoliageInstanceData {
    var res: FoliageInstanceData;
    res.instancePos = instancePos_scaleY.xyz;
    res.instanceScale = vec3<f32>(instanceScaleXZ.x, instancePos_scaleY.w, instanceScaleXZ.y);
    res.xform = transformFoliagePosition(
        position,
        subMeshUniforms.hasHierarchyTransform,
        subMeshUniforms.relativeModelMatrix,
        res.instancePos,
        res.instanceScale,
        instanceRotQuat
    );
    return res;
}

fn calculateFoliageOpaqueWorldPosition(
    position: vec3<f32>,
    instancePos_scaleY: vec4<f32>,
    instanceRotQuat: vec4<f32>,
    instanceScaleXZ: vec2<f32>
) -> vec3<f32> {
    let instData = unpackAndTransformFoliage(position, instancePos_scaleY, instanceRotQuat, instanceScaleXZ);
    let windDisp = calculateFoliageWindDisplacement(
        instData.xform.worldPos,
        instData.xform.hierarchyPos,
        vec3<f32>(0.0, 1.0, 0.0),
        vec4<f32>(1.0),
        instData.instancePos,
        systemUniforms.time.time
    );
    return instData.xform.worldPos + windDisp;
}

fn getCameraClipPosition(worldPos: vec3<f32>) -> vec4<f32> {
    let relPos = worldPos - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;
    return systemUniforms.projection.projectionMatrix * vec4<f32>(viewPos, 1.0);
}

struct VertexInput {
    @location(0) position : vec3<f32>,
    @location(1) vertexNormal : vec3<f32>,
    @location(2) uv : vec2<f32>,
    @location(3) uv1 : vec2<f32>,
    @location(4) vertexColor_0 : vec4<f32>,
    @location(5) vertexTangent : vec4<f32>,

    @location(6) instancePos_scaleY : vec4<f32>,
    @location(7) instanceRotQuat : vec4<f32>,
    @location(8) instanceScaleXZ : vec2<f32>,
    @location(9) groundColor_fade : vec4<f32>,
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0 : vec4<f32>,
    @location(5) vertexTangent : vec4<f32>,
    @location(6) instanceRotQuat: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(13) groundColor_blendFactor: vec4<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@vertex
fn entryPointMainVertex(input : VertexInput) -> OutputData {
    var output : OutputData;

    let instData = unpackAndTransformFoliage(input.position, input.instancePos_scaleY, input.instanceRotQuat, input.instanceScaleXZ);
    let instancePos = instData.instancePos;
    let instanceRotQuat = input.instanceRotQuat;
    let hierarchyPos = instData.xform.hierarchyPos;
    var worldPos = instData.xform.worldPos;
    let safeScale = instData.xform.safeScale;
    var worldNormal = vec3<f32>(0.0, 1.0, 0.0);

    let combinedOpacity = input.groundColor_fade.a;

    var hierarchyNormal = input.vertexNormal;
    var hierarchyTangent = input.vertexTangent.xyz;
    if (subMeshUniforms.hasHierarchyTransform != 0u) {
        hierarchyNormal = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.vertexNormal, 0.0)).xyz;
        hierarchyTangent = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.vertexTangent.xyz, 0.0)).xyz;
    }

    let isImpostor = (input.vertexTangent.w < -500.0);
    if (isImpostor) {
        let rightXZ = vec2<f32>(systemUniforms.camera.viewMatrix[0][0], systemUniforms.camera.viewMatrix[2][0]);
        let rightLenSq = dot(rightXZ, rightXZ);
        let billboardRight = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(rightXZ.x, 0.0, rightXZ.y) * inverseSqrt(rightLenSq), rightLenSq > 0.0001);
        let billboardUp = vec3<f32>(0.0, 1.0, 0.0);

        let centerYLocal = hierarchyPos.z;
        let treeCenter = instancePos + vec3<f32>(0.0, centerYLocal * safeScale.y, 0.0);
        let toCam = systemUniforms.camera.cameraPosition.xyz - treeCenter;

        let impostorOffset = billboardRight * (hierarchyPos.x * safeScale.x) + billboardUp * (hierarchyPos.y * safeScale.y);
        worldPos = treeCenter + impostorOffset;
        worldNormal = vec3<f32>(-billboardRight.z, 0.0, billboardRight.x);

        let invQuat = vec4<f32>(-instanceRotQuat.xyz, instanceRotQuat.w);
        let localView = normalize(rotateVectorByQuat(toCam, invQuat));
        output.vertexTangent = vec4<f32>(localView, -999.0);
    } else {
        if (dot(hierarchyNormal, hierarchyNormal) > 0.0001) {
            let scaledNormal = hierarchyNormal / safeScale;
            worldNormal = normalize(rotateVectorByQuat(scaledNormal, instanceRotQuat));
        }

        var inTan = hierarchyTangent;
        if (dot(inTan, inTan) < 0.0001) {
            var rawT = vec3<f32>(1.0, 0.0, 0.0);
            if (abs(hierarchyNormal.x) > 0.9) { rawT = vec3<f32>(0.0, 1.0, 0.0); }
            inTan = normalize(cross(hierarchyNormal, rawT));
        }
        let scaledTangent = inTan * safeScale;
        let worldTangent = normalize(rotateVectorByQuat(scaledTangent, instanceRotQuat));
        let tanW = select(1.0, input.vertexTangent.w, input.vertexTangent.w != 0.0);
        output.vertexTangent = vec4<f32>(worldTangent, tanW);

        let windDisp = calculateFoliageWindDisplacement(worldPos, hierarchyPos, worldNormal, input.vertexColor_0, instancePos, systemUniforms.time.time);
        worldPos += windDisp;
    }

    let relPos = worldPos - systemUniforms.camera.cameraPosition;
    let viewPos = (systemUniforms.camera.viewMatrix * vec4<f32>(relPos, 0.0)).xyz;

    output.position = systemUniforms.projection.projectionMatrix * vec4<f32>(viewPos, 1.0);
    output.vertexPosition = worldPos;
    output.vertexNormal = worldNormal;
    output.uv = input.uv;
    output.uv1 = input.uv1;
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionMatrix * vec4<f32>(viewPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.instanceRotQuat = instanceRotQuat;
    output.vertexColor_0 = input.vertexColor_0;
    output.globalFragmentSlotIndex = subMeshUniforms.globalFragmentSlotIndex;
    output.localNodeScale_volumeScale = vec2<f32>(safeScale.x, safeScale.y);

    output.combinedOpacity = combinedOpacity;
    output.receiveShadow = subMeshUniforms.receiveShadow;

    output.motionVector = vec3<f32>(0.0);
    output.pickingId = vec4<f32>(0.0);

    let heightAboveGround = max(0.0, worldPos.y - instancePos.y);
    let blendRange = max(0.1, subMeshUniforms.groundBlendRange);
    let rawBlend = clamp(1.0 - (heightAboveGround / blendRange), 0.0, 1.0);
    let groundBlendFactor = rawBlend * subMeshUniforms.groundBlendStrength;
    output.groundColor_blendFactor = vec4<f32>(input.groundColor_fade.rgb, groundBlendFactor);

    return output;
}

struct ShadowOpaqueVertexInput {
    @location(0) position : vec3<f32>,

    @location(6) instancePos_scaleY : vec4<f32>,
    @location(7) instanceRotQuat : vec4<f32>,
    @location(8) instanceScaleXZ : vec2<f32>,
    @location(9) groundColor_fade : vec4<f32>,
};

struct FoliageShadowOpaqueOutput {
    @builtin(position) position: vec4<f32>,
};

@vertex
fn entryPointShadowOpaqueVertex(input : ShadowOpaqueVertexInput) -> FoliageShadowOpaqueOutput {
    var output : FoliageShadowOpaqueOutput;
    let worldPos = calculateFoliageOpaqueWorldPosition(
        input.position,
        input.instancePos_scaleY,
        input.instanceRotQuat,
        input.instanceScaleXZ
    );
    output.position = getShadowClipPosition(worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    return output;
}

struct FoliageDepthPrepassOpaqueOutput {
    @builtin(position) position: vec4<f32>,
};

@vertex
fn entryPointDepthPrepassOpaqueVertex(input : ShadowOpaqueVertexInput) -> FoliageDepthPrepassOpaqueOutput {
    var output : FoliageDepthPrepassOpaqueOutput;
    let worldPos = calculateFoliageOpaqueWorldPosition(
        input.position,
        input.instancePos_scaleY,
        input.instanceRotQuat,
        input.instanceScaleXZ
    );
    output.position = getCameraClipPosition(worldPos);
    return output;
}

struct FoliageShadowMaskedOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) shadowFade: f32,
    @location(2) @interpolate(flat) globalFragmentSlotIndex: u32,
};

@vertex
fn entryPointShadowMaskedVertex(input : VertexInput) -> FoliageShadowMaskedOutput {
    var output : FoliageShadowMaskedOutput;
    let instData = unpackAndTransformFoliage(input.position, input.instancePos_scaleY, input.instanceRotQuat, input.instanceScaleXZ);
    let windDisp = calculateFoliageWindDisplacement(
        instData.xform.worldPos,
        instData.xform.hierarchyPos,
        input.vertexNormal,
        input.vertexColor_0,
        instData.instancePos,
        systemUniforms.time.time
    );
    let worldPos = instData.xform.worldPos + windDisp;

    output.position = getShadowClipPosition(worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    output.uv = input.uv;
    output.shadowFade = input.groundColor_fade.a;
    output.globalFragmentSlotIndex = subMeshUniforms.globalFragmentSlotIndex;
    return output;
}

@group(2) @binding(1) var shadowBaseColorTextureSampler: sampler;
@group(2) @binding(2) var shadowBaseColorTexture: texture_2d<f32>;

@fragment
fn entryPointShadowMaskedFragment(input : FoliageShadowMaskedOutput) {
    let ddxUV = dpdx(input.uv);
    let ddyUV = dpdy(input.uv);
    let alpha = textureSample(shadowBaseColorTexture, shadowBaseColorTextureSampler, input.uv).a;

    ditherFadeDiscard(input.position.xy, input.shadowFade, systemUniforms.time.frameIndex);

    let globalFragmentData = globalFragmentSSBO_PBR[input.globalFragmentSlotIndex];
    let baseCutOff = select(0.3333, globalFragmentData.cutOff, globalFragmentData.cutOff > 0.0);

    evaluateMipScaledAlphaCutoff(alpha, ddxUV, ddyUV, baseCutOff);
}
