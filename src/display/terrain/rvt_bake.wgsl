// ============================================================================
// TerrainRVT Compute Bake Shader
// [KO] 4종 레이어 Height-Blend 결과를 Compute Shader 기반으로 RVT 아틀라스 타일에 베이킹하는 셰이더
// [EN] Dedicated Compute Shader for baking 4-layer Height-Blend result into RVT atlas tiles
// ============================================================================

struct RVTBakeUniforms {
    // 타일 UV 범위 (아틀라스 내 이 타일의 위치)
    tileUVOffset: vec2<f32>,  // 아틀라스 UV 시작점
    tileUVScale:  vec2<f32>,  // 아틀라스 UV 크기
    // 월드 UV 범위 (지형 전체에서 이 타일의 위치)
    worldUVOffset: vec2<f32>,
    worldUVScale:  vec2<f32>,
    // 텍스처 타일링
    tileScale:  f32,
    macroScale: f32,
    blendContrast: f32,
    roughnessFactor: f32,
    // 레이어별 roughnessFactor (Layer 0~3)
    layer0RoughnessFactor: f32,
    layer1RoughnessFactor: f32,
    layer2RoughnessFactor: f32,
    layer3RoughnessFactor: f32,
    normalScale: f32,
    occlusionStrength: f32,
    baseColorWeight: f32,
    baseColorBlendMode: u32, // 0: mix (Direct Mix), 1: multiply (Tint Multiply)
}

@group(0) @binding(0) var<uniform> bakeUniforms: RVTBakeUniforms;
@group(0) @binding(1) var splatTexture:  texture_2d<f32>;
@group(0) @binding(2) var diffuseArray:  texture_2d_array<f32>;
@group(0) @binding(3) var normalArray:   texture_2d_array<f32>;
@group(0) @binding(4) var heightArray:   texture_2d_array<f32>;
@group(0) @binding(5) var ormArray:      texture_2d_array<f32>;
@group(0) @binding(6) var texSampler:    sampler;
@group(0) @binding(7) var baseColorTexture: texture_2d<f32>;
@group(0) @binding(8) var ormTexture:       texture_2d<f32>;

@group(0) @binding(9)  var albedoOutput:    texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(10) var normalORMOutput: texture_storage_2d<rgba8unorm, write>;

// ─── Height-Blend helper (Unreal Engine 5 Landscape HeightBlend Official Source) ─
fn getHeightBlendedWeights(
    splatWeights: vec4<f32>,
    layerHeights: vec4<f32>,
    contrast: f32
) -> vec4<f32> {
    // 언리얼 엔진 5 Landscape 공식 수식: Combined = (Height + 1.0) * Weight
    let combined = (layerHeights + vec4<f32>(1.0)) * splatWeights;
    let maxVal   = max(combined.r, max(combined.g, max(combined.b, combined.a)));
    if (maxVal <= 0.0001) { return splatWeights; }

    // 언리얼 엔진 5 공식 Transition 범위 산출
    let transition = max(0.005, (1.0 - clamp(contrast, 0.0, 1.0)) * 0.5);
    let threshold  = maxVal - transition;
    let blended    = max(combined - vec4<f32>(threshold), vec4<f32>(0.0));
    let sumVal     = blended.r + blended.g + blended.b + blended.a;
    if (sumVal <= 0.0001) { return splatWeights; }
    return blended / sumVal;
}

// ─── Explicit Compute MipLevel Helper (언리얼 엔진 RVT Mipmap Baking 규격) ─────
fn getBakeMipLevel(tileScale: f32, textureSize: f32, atlasSize: f32) -> f32 {
    let texelsPerAtlasPixel = (tileScale * textureSize) / atlasSize;
    // 근접 구역 (1px당 텍셀 1개 이하) -> 100% Mip 0 (원본 텍스처 칼 같은 선명도 보장)
    if (texelsPerAtlasPixel <= 1.0) {
        return 0.0;
    }
    // 원거리 / 고밀도 타일링 구역 -> 지글거림(Aliasing) 방지를 위한 적정 MipLevel 산출
    let mip = log2(texelsPerAtlasPixel) - 0.5;
    return clamp(mip, 0.0, 3.0);
}

// ─── Compute Shader Execution ────────────────────────────────────────────────
@compute @workgroup_size(16, 16)
fn cs_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let outputDim = textureDimensions(albedoOutput);
    if (global_id.x >= outputDim.x || global_id.y >= outputDim.y) {
        return;
    }

    let coords = vec2<i32>(global_id.xy);
    let rawUV = (vec2<f32>(global_id.xy) + vec2<f32>(0.5)) / vec2<f32>(outputDim);

    let wUV = bakeUniforms.worldUVOffset + rawUV * bakeUniforms.worldUVScale;
    let tileUV = wUV * bakeUniforms.tileScale;
    let macroUV = wUV * bakeUniforms.macroScale;

    // 타일링 밀도와 아틀라스 해상도 비례에 알맞은 최적 MipLevel 산출 (지글거림 방지)
    let bakeMip = getBakeMipLevel(bakeUniforms.tileScale, 1024.0, f32(outputDim.x));

    // 1. Albedo & Height 샘플링 (적정 MipLevel 적용)
    let d0 = textureSampleLevel(diffuseArray, texSampler, tileUV, 0i, bakeMip);
    let d1 = textureSampleLevel(diffuseArray, texSampler, tileUV, 1i, bakeMip);
    let d2 = textureSampleLevel(diffuseArray, texSampler, tileUV, 2i, bakeMip);
    let d3 = textureSampleLevel(diffuseArray, texSampler, tileUV, 3i, bakeMip);

    let h0 = pow(clamp(textureSampleLevel(heightArray, texSampler, tileUV, 0i, bakeMip).r, 0.0, 1.0), 3.0);
    let h1 = pow(clamp(textureSampleLevel(heightArray, texSampler, tileUV, 1i, bakeMip).r, 0.0, 1.0), 3.0);
    let h2 = pow(clamp(textureSampleLevel(heightArray, texSampler, tileUV, 2i, bakeMip).r, 0.0, 1.0), 3.0);
    let h3 = pow(clamp(textureSampleLevel(heightArray, texSampler, tileUV, 3i, bakeMip).r, 0.0, 1.0), 3.0);
    let layerHeights = vec4<f32>(h0, h1, h2, h3);

    let splat = textureSampleLevel(splatTexture, texSampler, wUV, 0.0);
    // 💡 JPG splatMap 호환: A 채널을 1-(R+G+B) 잔여 가중치로 유도
    //    (PNG splatMap 사용 시에도 합산이 1.0을 초과하지 않으면 동일하게 작동)
    let splat3Sum = clamp(splat.r + splat.g + splat.b, 0.0, 1.0);
    var sw = vec4<f32>(splat.r, splat.g, splat.b, max(0.0, 1.0 - splat3Sum));
    let totalWeightAlbedo = sw.r + sw.g + sw.b + sw.a;
    if (totalWeightAlbedo <= 0.001) {
        sw = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    } else {
        sw = sw / totalWeightAlbedo;
    }

    let w = getHeightBlendedWeights(sw, layerHeights, bakeUniforms.blendContrast);

    var layerAlbedo = d0 * w.r + d1 * w.g + d2 * w.b + d3 * w.a;
    if (layerAlbedo.a <= 0.01 || (layerAlbedo.r <= 0.001 && layerAlbedo.g <= 0.001 && layerAlbedo.b <= 0.001)) {
        layerAlbedo = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    }

    var baseColorSample = textureSampleLevel(baseColorTexture, texSampler, wUV, 0.0);
    if (baseColorSample.a <= 0.01 || (baseColorSample.r <= 0.001 && baseColorSample.g <= 0.001 && baseColorSample.b <= 0.001)) {
        baseColorSample = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    }

    let weight = clamp(bakeUniforms.baseColorWeight, 0.0, 1.0);
    var finalAlbedo = layerAlbedo;

    if (bakeUniforms.baseColorBlendMode == 0u) {
        // Direct Mix Mode (Lerp)
        finalAlbedo = mix(layerAlbedo, baseColorSample, weight);
    } else {
        // Multiply Mode (Tint)
        let tintedAlbedo = layerAlbedo * baseColorSample;
        finalAlbedo = mix(layerAlbedo, tintedAlbedo, weight);
    }
    finalAlbedo.a = 1.0;

    // 2. Normal & ORM 연산 (언리얼 엔진 Landscape Tangent Space Blend)
    let n0_raw = (textureSampleLevel(normalArray, texSampler, tileUV, 0i, bakeMip).rg * 2.0 - vec2<f32>(1.0));
    let n1_raw = (textureSampleLevel(normalArray, texSampler, tileUV, 1i, bakeMip).rg * 2.0 - vec2<f32>(1.0));
    let n2_raw = (textureSampleLevel(normalArray, texSampler, tileUV, 2i, bakeMip).rg * 2.0 - vec2<f32>(1.0));
    let n3_raw = (textureSampleLevel(normalArray, texSampler, tileUV, 3i, bakeMip).rg * 2.0 - vec2<f32>(1.0));

    var blendedNormalXY = n0_raw * w.r + n1_raw * w.g + n2_raw * w.b + n3_raw * w.a;
    blendedNormalXY = blendedNormalXY * bakeUniforms.normalScale;
    let scaledNormal = clamp(blendedNormalXY * 0.5 + vec2<f32>(0.5), vec2<f32>(0.0), vec2<f32>(1.0));

    var o0 = textureSampleLevel(ormArray, texSampler, tileUV, 0i, bakeMip);
    var o1 = textureSampleLevel(ormArray, texSampler, tileUV, 1i, bakeMip);
    var o2 = textureSampleLevel(ormArray, texSampler, tileUV, 2i, bakeMip);
    var o3 = textureSampleLevel(ormArray, texSampler, tileUV, 3i, bakeMip);
    if (o0.a <= 0.01 || (o0.r <= 0.001 && o0.g <= 0.001 && o0.b <= 0.001)) { o0 = vec4<f32>(1.0, 1.0, 1.0, 1.0); }
    if (o1.a <= 0.01 || (o1.r <= 0.001 && o1.g <= 0.001 && o1.b <= 0.001)) { o1 = vec4<f32>(1.0, 1.0, 1.0, 1.0); }
    if (o2.a <= 0.01 || (o2.r <= 0.001 && o2.g <= 0.001 && o2.b <= 0.001)) { o2 = vec4<f32>(1.0, 1.0, 1.0, 1.0); }
    if (o3.a <= 0.01 || (o3.r <= 0.001 && o3.g <= 0.001 && o3.b <= 0.001)) { o3 = vec4<f32>(1.0, 1.0, 1.0, 1.0); }

    let globalRoughnessMult = bakeUniforms.roughnessFactor;
    let r0 = o0.g * bakeUniforms.layer0RoughnessFactor * globalRoughnessMult;
    let r1 = o1.g * bakeUniforms.layer1RoughnessFactor * globalRoughnessMult;
    let r2 = o2.g * bakeUniforms.layer2RoughnessFactor * globalRoughnessMult;
    let r3 = o3.g * bakeUniforms.layer3RoughnessFactor * globalRoughnessMult;

    let blendedRoughness = r0 * w.r + r1 * w.g + r2 * w.b + r3 * w.a;
    let blendedOcclusion = o0.r * w.r + o1.r * w.g + o2.r * w.b + o3.r * w.a;

    var globalORM = textureSampleLevel(ormTexture, texSampler, wUV, 0.0);
    let hasGlobalORM = select(1.0, 0.0, globalORM.a <= 0.01 || (globalORM.r <= 0.001 && globalORM.g <= 0.001 && globalORM.b <= 0.001));

    // 언리얼 엔진 Landscape Macro Variation 표준 공식 (0.5 중립 기반 부드러운 매크로 변형)
    // globalORM.g 수치에 따른 무분별한 거칠기 붕괴(번들거림) 방지
    let macroRoughnessVariation = (globalORM.g - 0.5) * 0.4 * hasGlobalORM;
    let finalRoughness = clamp(blendedRoughness + macroRoughnessVariation, 0.04, 1.0);

    let globalAO = select(1.0, globalORM.r, hasGlobalORM > 0.5);
    let finalOcclusion = clamp(blendedOcclusion * globalAO * bakeUniforms.occlusionStrength, 0.0, 1.0);

    textureStore(albedoOutput, coords, finalAlbedo);
    textureStore(normalORMOutput, coords, vec4<f32>(scaledNormal, finalRoughness, finalOcclusion));
}
