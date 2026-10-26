#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;
#redgpu_include landscape.rotateVectorByQuat;
#redgpu_include landscape.foliageOctahedralCommon;

struct FoliageVertexTransformResult {
    worldPos: vec3<f32>,
    safeScale: vec3<f32>,
};

fn transformFoliagePosition(
    position: vec3<f32>,
    instancePos: vec3<f32>,
    instanceScale: vec3<f32>,
    instanceRotQuat: vec4<f32>
) -> FoliageVertexTransformResult {
    let safeScale = max(instanceScale, vec3<f32>(0.0001));
    let scaledPos = position * safeScale;
    let rotatedPos = rotateVectorByQuat(scaledPos, instanceRotQuat);
    let worldPos = rotatedPos + instancePos;
    return FoliageVertexTransformResult(worldPos, safeScale);
}

struct RenderUnitUniforms {
    globalFragmentSlotIndex: u32,
    receiveShadow: f32,
    trunkBendScale: f32,
    leafFlutterScale: f32,
    foliageHeight: f32,
    groundBlendStrength: f32,
    groundBlendRange: f32,
    pad0: u32,
};

@group(1) @binding(0) var<uniform> renderUnitUniforms: RenderUnitUniforms;

const INV_150: f32 = 0.006666667;
const WIND_SPATIAL_SCALE: f32 = 0.05;

fn calculateFoliageWindDisplacement(
    localPos: vec3<f32>,
    vertexColor: vec4<f32>,
    instancePos: vec3<f32>,
    time: f32
) -> vec3<f32> {
    if (systemUniforms.wind.enabled == 0u || systemUniforms.wind.strength <= 0.0001 || (renderUnitUniforms.trunkBendScale <= 0.0001 && renderUnitUniforms.leafFlutterScale <= 0.0001)) {
        return vec3<f32>(0.0);
    }

    let diff = systemUniforms.camera.cameraPosition - instancePos;
    let distSq = dot(diff, diff);
    if (distSq > 250000.0) {
        return vec3<f32>(0.0);
    }
    let viewDist = sqrt(distSq);

    let foliageH = max(2.0, renderUnitUniforms.foliageHeight);
    let heightNorm = saturate(localPos.y / foliageH);

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

    let windDir = systemUniforms.wind.direction.xz;
    let windSpeed = systemUniforms.wind.speed;

    let treeBaseXZ = instancePos.xz;
    let spatialPhase = (treeBaseXZ.x * windDir.x + treeBaseXZ.y * windDir.y) * WIND_SPATIAL_SCALE;
    let mainWave = sin(time * windSpeed + spatialPhase);
    let gustWave = sin(time * (windSpeed * 1.5) + spatialPhase * 1.8) * 0.25;
    let combinedWave = mainWave + gustWave;

    let trunkDistFade = saturate(1.0 - (viewDist - 350.0) * INV_150);
    let trunkDisplacement = vec3<f32>(windDir.x, 0.0, windDir.y) *
                            (combinedWave * trunkMask * (systemUniforms.wind.strength * 0.45) * renderUnitUniforms.trunkBendScale * trunkDistFade);

    let leafPhase = dot(localPos, vec3<f32>(0.9, 1.4, 0.9)) + time * (windSpeed * 3.5);
    let leafWaveX = sin(leafPhase);
    let leafWaveY = cos(leafPhase * 1.3);
    let leafWaveZ = sin(leafPhase * 0.85);

    let flutterDistFade = saturate(1.0 - (viewDist - 150.0) * INV_150);
    let flutterScale = (systemUniforms.wind.strength * 0.225) * renderUnitUniforms.leafFlutterScale * flutterDistFade;
    let leafDisplacement = vec3<f32>(
        windDir.x * leafWaveX * 0.75,
        leafWaveY * 0.5,
        windDir.y * leafWaveZ * 0.75
    ) * (leafMask * flutterScale);

    return trunkDisplacement + leafDisplacement;
}

/**
 * 🌟 [그림자 패스 전용 저주파 풍하중 변위 함수]
 * - 1x 포인트 샘플링되는 그림자 맵에서 알파 컷오프 잎사귀와 병합 LOD 삼각형이 고주파(3.5x) `leafFlutter`로 인해
 *   매 프레임 텍셀 중심을 넘나들며 깜빡이는 현상(Shadow Texel Shimmering)을 원천 차단합니다.
 * - 부드럽고 일관된 저주파 줄기/수관 흔들림(`trunkDisplacement`)만 반영하고 원거리 캐스케이드에서 점진 감쇄합니다.
 */
fn calculateFoliageShadowWindDisplacement(
    localPos: vec3<f32>,
    vertexColor: vec4<f32>,
    instancePos: vec3<f32>,
    time: f32
) -> vec3<f32> {
    if (systemUniforms.wind.enabled == 0u || systemUniforms.wind.strength <= 0.0001 || renderUnitUniforms.trunkBendScale <= 0.0001) {
        return vec3<f32>(0.0);
    }

    let diff = systemUniforms.camera.cameraPosition - instancePos;
    let distSq = dot(diff, diff);
    if (distSq > 19600.0) {
        return vec3<f32>(0.0);
    }
    let viewDist = sqrt(distSq);

    let foliageH = max(2.0, renderUnitUniforms.foliageHeight);
    let heightNorm = saturate(localPos.y / foliageH);

    let groundAnchor = smoothstep(0.08, 0.8, heightNorm);
    let cubicBend = groundAnchor * groundAnchor * groundAnchor;

    let hasValidMask = (vertexColor.r > 0.001 && vertexColor.r < 0.999) ||
                       (vertexColor.b > 0.001 && vertexColor.b < 0.999);

    let trunkMask = select(
        cubicBend,
        vertexColor.r * groundAnchor,
        hasValidMask
    );

    let windDir = systemUniforms.wind.direction.xz;
    let windSpeed = systemUniforms.wind.speed;

    let treeBaseXZ = instancePos.xz;
    let spatialPhase = (treeBaseXZ.x * windDir.x + treeBaseXZ.y * windDir.y) * WIND_SPATIAL_SCALE;
    let mainWave = sin(time * windSpeed + spatialPhase);
    let gustWave = sin(time * (windSpeed * 1.5) + spatialPhase * 1.8) * 0.25;
    let combinedWave = mainWave + gustWave;

    let shadowDistFade = saturate(1.0 - (viewDist - 60.0) * 0.0125);
    return vec3<f32>(windDir.x, 0.0, windDir.y) *
           (combinedWave * trunkMask * (systemUniforms.wind.strength * 0.45) * renderUnitUniforms.trunkBendScale * shadowDistFade);
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
        position,
        vec4<f32>(1.0),
        instData.instancePos,
        systemUniforms.time.time
    );
    return instData.xform.worldPos + windDisp;
}

fn calculateFoliageShadowOpaqueWorldPosition(
    position: vec3<f32>,
    instancePos_scaleY: vec4<f32>,
    instanceRotQuat: vec4<f32>,
    instanceScaleXZ: vec2<f32>
) -> vec3<f32> {
    let instData = unpackAndTransformFoliage(position, instancePos_scaleY, instanceRotQuat, instanceScaleXZ);
    let windDisp = calculateFoliageShadowWindDisplacement(
        position,
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
    let hierarchyPos = input.position;
    var worldPos = instData.xform.worldPos;
    var prevWorldPos = worldPos;
    let safeScale = instData.xform.safeScale;
    var worldNormal = vec3<f32>(0.0, 1.0, 0.0);

    let combinedOpacity = input.groundColor_fade.a;

    let hierarchyNormal = input.vertexNormal;
    let hierarchyTangent = input.vertexTangent.xyz;

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
        prevWorldPos = worldPos;
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
            let rawT = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 1.0, 0.0), abs(hierarchyNormal.x) > 0.9);
            inTan = normalize(cross(hierarchyNormal, rawT));
        }
        let scaledTangent = inTan * safeScale;
        let worldTangent = normalize(rotateVectorByQuat(scaledTangent, instanceRotQuat));
        let tanW = select(1.0, input.vertexTangent.w, input.vertexTangent.w != 0.0);
        output.vertexTangent = vec4<f32>(worldTangent, tanW);

        let curTime = systemUniforms.time.time;
        let prevTime = curTime - clamp(systemUniforms.time.deltaTime, 0.0, 0.1);
        let windDisp = calculateFoliageWindDisplacement(hierarchyPos, input.vertexColor_0, instancePos, curTime);
        let prevWindDisp = calculateFoliageWindDisplacement(hierarchyPos, input.vertexColor_0, instancePos, prevTime);
        prevWorldPos = worldPos + prevWindDisp;
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
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(prevWorldPos, 1.0);

    output.instanceRotQuat = instanceRotQuat;
    output.vertexColor_0 = input.vertexColor_0;
    output.globalFragmentSlotIndex = renderUnitUniforms.globalFragmentSlotIndex;
    output.localNodeScale_volumeScale = vec2<f32>(safeScale.x, safeScale.y);

    output.combinedOpacity = combinedOpacity;
    output.receiveShadow = renderUnitUniforms.receiveShadow;

    output.motionVector = vec3<f32>(0.0);
    output.pickingId = vec4<f32>(0.0);

    let heightAboveGround = max(0.0, worldPos.y - instancePos.y);
    let invBlendRange = 1.0 / max(0.1, renderUnitUniforms.groundBlendRange);
    let rawBlend = saturate(1.0 - (heightAboveGround * invBlendRange));
    let groundBlendFactor = rawBlend * renderUnitUniforms.groundBlendStrength;
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
    let worldPos = calculateFoliageShadowOpaqueWorldPosition(
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
    let isImpostor = (input.vertexTangent.w < -500.0);
    var worldPos: vec3<f32>;
    var outUV = input.uv;

    if (isImpostor) {
        let lightDir = -systemUniforms.directionalLights[0].direction;
        let rightXZ = vec2<f32>(lightDir.z, -lightDir.x);
        let rightLenSq = dot(rightXZ, rightXZ);
        let billboardRight = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(rightXZ.x, 0.0, rightXZ.y) * inverseSqrt(rightLenSq), rightLenSq > 0.0001);
        let billboardUp = vec3<f32>(0.0, 1.0, 0.0);

        let hierarchyPos = input.position;
        let safeScale = instData.xform.safeScale;
        let centerYLocal = hierarchyPos.z;
        let treeCenter = instData.instancePos + vec3<f32>(0.0, centerYLocal * safeScale.y, 0.0);

        let impostorOffset = billboardRight * (hierarchyPos.x * safeScale.x) + billboardUp * (hierarchyPos.y * safeScale.y);
        worldPos = treeCenter + impostorOffset;

        let invQuat = vec4<f32>(-input.instanceRotQuat.xyz, input.instanceRotQuat.w);
        let localLightDir = normalize(rotateVectorByQuat(lightDir, invQuat));
        let octUV = dirToHemiOctahedralUV(localLightDir);
        let grid = clamp(floor(octUV * 8.0), vec2<f32>(0.0), vec2<f32>(7.0));
        let safeSubUV = clamp(input.uv, vec2<f32>(0.00390625), vec2<f32>(1.0 - 0.00390625));
        outUV = (grid + safeSubUV) * 0.125;
    } else {
        let windDisp = calculateFoliageShadowWindDisplacement(
            input.position,
            input.vertexColor_0,
            instData.instancePos,
            systemUniforms.time.time
        );
        worldPos = instData.xform.worldPos + windDisp;
    }

    output.position = getShadowClipPosition(worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    output.uv = outUV;
    output.shadowFade = input.groundColor_fade.a;
    output.globalFragmentSlotIndex = renderUnitUniforms.globalFragmentSlotIndex;
    return output;
}

@group(2) @binding(1) var shadowBaseColorTextureSampler: sampler;
@group(2) @binding(2) var shadowBaseColorTexture: texture_2d<f32>;

@fragment
fn entryPointShadowMaskedFragment(input : FoliageShadowMaskedOutput) {
    let ddxUV = dpdx(input.uv);
    let ddyUV = dpdy(input.uv);
    let alpha = textureSample(shadowBaseColorTexture, shadowBaseColorTextureSampler, input.uv).a;

    ditherFadeDiscard(input.position.xy, input.shadowFade, 0u);

    let globalFragmentData = globalFragmentSSBO_PBR[input.globalFragmentSlotIndex];
    let baseCutOff = select(0.3333, globalFragmentData.cutOff, globalFragmentData.cutOff > 0.0);

    var effectiveAlpha = alpha;
    if (alpha < baseCutOff) {
        let lenSq = max(dot(ddxUV, ddxUV), dot(ddyUV, ddyUV));
        let texDim = vec2<f32>(textureDimensions(shadowBaseColorTexture));
        let maxDim = max(texDim.x, texDim.y);
        let mipLevel = max(0.0, 0.5 * log2(max(lenSq * (maxDim * maxDim), 1.0)));
        effectiveAlpha = alpha * (1.0 + mipLevel * 0.28);
    }

    if (effectiveAlpha <= baseCutOff) {
        discard;
    }
}
