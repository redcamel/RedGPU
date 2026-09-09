#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowClipPosition;

struct SubMeshUniforms {
    relativeModelMatrix: mat4x4<f32>,
    relativeNormalMatrix: mat4x4<f32>,
    globalFragmentSlotIndex: u32,
    hasHierarchyTransform: u32,
    receiveShadow: f32,
    pad2: u32,

    // 🍃 [Phase 5] 바람 시뮬레이션 파라미터 (48 bytes)
    windDirection: vec2<f32>,
    windSpeed: f32,
    windStrength: f32,
    windFrequency: f32,
    windFlutterStrength: f32,
    windEnabled: u32,
    windMultiplier: f32,
    windFlutterMultiplier: f32,
    useVertexColorWind: u32,
    treeHeight: f32,
    padWind: u32,
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
    if (subMeshUniforms.windEnabled == 0u || subMeshUniforms.windStrength <= 0.0001 || subMeshUniforms.windMultiplier <= 0.0001) {
        return vec3<f32>(0.0);
    }

    let treeH = max(2.0, subMeshUniforms.treeHeight);
    let heightNorm = clamp(localPos.y / treeH, 0.0, 1.0);

    // 1. 밑동 앵커링 (밑동 10% 구간은 지면에 단단히 고정)
    let groundAnchor = smoothstep(0.08, 0.8, heightNorm);
    let cubicBend = groundAnchor * groundAnchor * groundAnchor;

    // 2. 🍃 기하학적 나뭇가지/잎사귀 분리 (Radial Branch Detection)
    // 중심 기둥축(r < 0.2m)은 0, 옆으로 뻗어나온 나뭇가지와 잎사귀(r > 0.4m)는 1.0으로 자동 마스킹
    let radialDist = length(localPos.xz);
    let branchRadialMask = smoothstep(0.15, 0.55, radialDist);

    // 3. 유효한 Vertex Color 마스크 판별
    let hasValidMask = (subMeshUniforms.useVertexColorWind != 0u) &&
                       ((vertexColor.r > 0.001 && vertexColor.r < 0.999) || (vertexColor.b > 0.001 && vertexColor.b < 0.999));

    // 줄기 휨 마스크
    let trunkMask = select(
        cubicBend,
        vertexColor.r * groundAnchor,
        hasValidMask
    );

    // 잎사귀 떨림 마스크: 정점 컬러 B 또는 기하학적 방사형 가지 마스크 (줄기 중심 제외)
    let leafMask = select(
        branchRadialMask * groundAnchor,
        vertexColor.b * groundAnchor,
        hasValidMask
    );

    let windDir = normalize(subMeshUniforms.windDirection);
    let windSpeed = subMeshUniforms.windSpeed;
    let windFreq = subMeshUniforms.windFrequency;

    // 4. 공간 파동 위상차 (나무 밑동 instancePos 기준 - 한 나무 전체가 일관된 단일 위상 공유)
    let treeBaseXZ = instancePos.xz;
    let spatialPhase = (treeBaseXZ.x * windDir.x + treeBaseXZ.y * windDir.y) * windFreq;
    let mainWave = sin(time * windSpeed + spatialPhase);
    let gustWave = sin(time * (windSpeed * 1.5) + spatialPhase * 1.8) * 0.25;
    let combinedWave = mainWave + gustWave;

    // 5. 메인 줄기(Trunk) 굽힘 변위 (수평 바람 방향, 밑동 앵커링으로 단단히 지지)
    let trunkDisplacement = vec3<f32>(windDir.x, 0.0, windDir.y) *
                            (combinedWave * trunkMask * (subMeshUniforms.windStrength * 0.45) * subMeshUniforms.windMultiplier);

    // 6. 🍃 잎사귀(Leaf) 펄럭임 (수평 풍향 진동 + 수직 펄럭임)
    // 노멀(vertexNormal) 방향 팽창을 제거하여 단면 두께가 꿀렁거리거나 찌그러지지 않고 100% 보존됨
    let leafPhase = dot(localPos, vec3<f32>(0.9, 1.4, 0.9)) + time * (windSpeed * 3.5);
    let leafWaveX = sin(leafPhase);
    let leafWaveY = cos(leafPhase * 1.3);
    let leafWaveZ = sin(leafPhase * 0.85);

    let flutterScale = (subMeshUniforms.windFlutterStrength * 0.45) * subMeshUniforms.windFlutterMultiplier;
    let leafDisplacement = vec3<f32>(
        windDir.x * leafWaveX * 0.75,
        leafWaveY * 0.5,
        windDir.y * leafWaveZ * 0.75
    ) * (leafMask * flutterScale);

    return trunkDisplacement + leafDisplacement;
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
    @location(9) instanceFade : f32,
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
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

fn rotateVectorByQuaternion(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

@vertex
fn mainInput(input : VertexInput) -> OutputData {
    var output : OutputData;

    let instancePos = input.instancePos_scaleY.xyz;
    let scaleY = input.instancePos_scaleY.w;

    let instanceRotQuat = input.instanceRotQuat;
    let instanceScale = vec3<f32>(input.instanceScaleXZ.x, scaleY, input.instanceScaleXZ.y);

    let combinedOpacity = input.instanceFade;

    var hierarchyPos = input.position;
    var hierarchyNormal = input.vertexNormal;
    var hierarchyTangent = input.vertexTangent.xyz;
    if (subMeshUniforms.hasHierarchyTransform != 0u) {
        hierarchyPos = (subMeshUniforms.relativeModelMatrix * vec4<f32>(input.position, 1.0)).xyz;
        hierarchyNormal = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.vertexNormal, 0.0)).xyz;
        hierarchyTangent = (subMeshUniforms.relativeNormalMatrix * vec4<f32>(input.vertexTangent.xyz, 0.0)).xyz;
    }

    let safeScale = max(instanceScale, vec3<f32>(0.0001));
    let scaledPos = hierarchyPos * safeScale;
    let rotatedPos = rotateVectorByQuaternion(scaledPos, instanceRotQuat);

    var worldPos = rotatedPos + instancePos;
    var worldNormal = vec3<f32>(0.0, 1.0, 0.0);

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
        let localView = normalize(rotateVectorByQuaternion(toCam, invQuat));
        output.vertexTangent = vec4<f32>(localView, -999.0);
    } else {
        if (dot(hierarchyNormal, hierarchyNormal) > 0.0001) {
            let scaledNormal = hierarchyNormal / safeScale;
            worldNormal = normalize(rotateVectorByQuaternion(scaledNormal, instanceRotQuat));
        }

        var inTan = hierarchyTangent;
        if (dot(inTan, inTan) < 0.0001) {
            var rawT = vec3<f32>(1.0, 0.0, 0.0);
            if (abs(hierarchyNormal.x) > 0.9) { rawT = vec3<f32>(0.0, 1.0, 0.0); }
            inTan = normalize(cross(hierarchyNormal, rawT));
        }
        let scaledTangent = inTan * safeScale;
        let worldTangent = normalize(rotateVectorByQuaternion(scaledTangent, instanceRotQuat));
        let tanW = select(1.0, input.vertexTangent.w, input.vertexTangent.w != 0.0);
        output.vertexTangent = vec4<f32>(worldTangent, tanW);

        let windDisp = calculateFoliageWindDisplacement(worldPos, hierarchyPos, worldNormal, input.vertexColor_0, instancePos, systemUniforms.time.time);
        worldPos += windDisp;
    }

    let clipPos = systemUniforms.projection.projectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.position = clipPos;
    output.vertexPosition = worldPos;
    output.vertexNormal = worldNormal;
    output.uv = input.uv;
    output.uv1 = input.uv1;
    output.currentClipPos = systemUniforms.projection.noneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);
    output.prevClipPos = systemUniforms.projection.prevNoneJitterProjectionViewMatrix * vec4<f32>(worldPos, 1.0);

    output.instanceRotQuat = instanceRotQuat;
    output.vertexColor_0 = input.vertexColor_0;
    output.globalFragmentSlotIndex = subMeshUniforms.globalFragmentSlotIndex;
    output.localNodeScale_volumeScale = vec2<f32>(safeScale.x, safeScale.y);

    output.combinedOpacity = combinedOpacity;
    output.receiveShadow = subMeshUniforms.receiveShadow;

    output.motionVector = vec3<f32>(0.0);
    output.pickingId = vec4<f32>(0.0);

    return output;
}

struct ShadowOpaqueVertexInput {
    @location(0) position : vec3<f32>,

    @location(6) instancePos_scaleY : vec4<f32>,
    @location(7) instanceRotQuat : vec4<f32>,
    @location(8) instanceScaleXZ : vec2<f32>,
    @location(9) instanceFade : f32,
};

struct FoliageShadowOpaqueOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) shadowFade: f32,
};

@vertex
fn entryPointShadowOpaqueVertex(input : ShadowOpaqueVertexInput) -> FoliageShadowOpaqueOutput {
    var output : FoliageShadowOpaqueOutput;

    let instancePos = input.instancePos_scaleY.xyz;
    let scaleY = input.instancePos_scaleY.w;

    let instanceRotQuat = input.instanceRotQuat;
    let instanceScale = vec3<f32>(input.instanceScaleXZ.x, scaleY, input.instanceScaleXZ.y);

    var hierarchyPos = input.position;
    if (subMeshUniforms.hasHierarchyTransform != 0u) {
        hierarchyPos = (subMeshUniforms.relativeModelMatrix * vec4<f32>(input.position, 1.0)).xyz;
    }

    let safeScale = max(instanceScale, vec3<f32>(0.0001));
    let scaledPos = hierarchyPos * safeScale;
    let rotatedPos = rotateVectorByQuaternion(scaledPos, instanceRotQuat);

    var worldPos = rotatedPos + instancePos;
    let windDisp = calculateFoliageWindDisplacement(worldPos, hierarchyPos, vec3<f32>(0.0, 1.0, 0.0), vec4<f32>(1.0), instancePos, systemUniforms.time.time);
    worldPos += windDisp;

    output.position = getShadowClipPosition(worldPos, systemUniforms.directionalLightProjectionViewMatrix);
    output.shadowFade = input.instanceFade;
    return output;
}

@fragment
fn entryPointShadowOpaqueFragment(input : FoliageShadowOpaqueOutput) {
    if (input.shadowFade < 0.999) {
        let px = u32(input.position.x) & 3u;
        let py = u32(input.position.y) & 3u;
        let idx = (py << 2u) | px;
        let packed = select(0x6E4C2A80u, 0x5D7F91B3u, idx >= 8u);
        let threshold = f32((packed >> ((idx & 7u) * 4u)) & 0xFu) * 0.0625;
        if (input.shadowFade < threshold) {
            discard;
        }
    }
}

