// 🍃 RedGPU Foliage Vertex Wind Simulation Function
// Pure ALU-based procedural wind displacement with hybrid vertex-color masking, radial branch detection, and 3-axis leaf flutter.

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
