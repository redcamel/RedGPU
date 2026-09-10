

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

    let groundAnchor = smoothstep(0.08, 0.8, heightNorm);
    let cubicBend = groundAnchor * groundAnchor * groundAnchor;

    let radialDist = length(localPos.xz);
    let branchRadialMask = smoothstep(0.15, 0.55, radialDist);

    let hasValidMask = (subMeshUniforms.useVertexColorWind != 0u) &&
                       ((vertexColor.r > 0.001 && vertexColor.r < 0.999) || (vertexColor.b > 0.001 && vertexColor.b < 0.999));

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

    let windDir = normalize(subMeshUniforms.windDirection);
    let windSpeed = subMeshUniforms.windSpeed;
    let windFreq = subMeshUniforms.windFrequency;

    let treeBaseXZ = instancePos.xz;
    let spatialPhase = (treeBaseXZ.x * windDir.x + treeBaseXZ.y * windDir.y) * windFreq;
    let mainWave = sin(time * windSpeed + spatialPhase);
    let gustWave = sin(time * (windSpeed * 1.5) + spatialPhase * 1.8) * 0.25;
    let combinedWave = mainWave + gustWave;

    let trunkDisplacement = vec3<f32>(windDir.x, 0.0, windDir.y) *
                            (combinedWave * trunkMask * (subMeshUniforms.windStrength * 0.45) * subMeshUniforms.windMultiplier);

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
