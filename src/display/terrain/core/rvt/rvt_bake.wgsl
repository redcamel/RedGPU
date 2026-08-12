struct RVTBakeUniforms {
    tileUVOffset: vec2<f32>,
    tileUVScale:  vec2<f32>,
    worldUVOffset: vec2<f32>,
    worldUVScale:  vec2<f32>,
    tileRect: vec4<f32>, // (destPixelX, destPixelY, pixelWidth, pixelHeight)
    tileScale:  f32,
    macroScale: f32,
    blendContrast: f32,
    roughnessFactor: f32,
    layer0RoughnessFactor: f32,
    layer1RoughnessFactor: f32,
    layer2RoughnessFactor: f32,
    layer3RoughnessFactor: f32,
    normalScale: f32,
    occlusionStrength: f32,
    baseColorWeight: f32,
    baseColorBlendMode: u32,
    useAutoSplat: u32,
    padding0: u32,
    padding1: u32,
    padding2: u32,
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
@group(0) @binding(9) var heightmapAtlasTexture: texture_2d<f32>;

@group(0) @binding(10) var albedoOutput:    texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(11) var normalORMOutput: texture_storage_2d<rgba16float, write>;

fn getHeightBlendedWeights(
    splatWeights: vec4<f32>,
    layerHeights: vec4<f32>,
    contrast: f32
) -> vec4<f32> {
    let mask = vec4<f32>(
        select(0.0, 1.0, splatWeights.r > 0.001),
        select(0.0, 1.0, splatWeights.g > 0.001),
        select(0.0, 1.0, splatWeights.b > 0.001),
        select(0.0, 1.0, splatWeights.a > 0.001)
    );
    let heightScores = splatWeights + layerHeights * mask;
    let maxHeight = max(heightScores.r, max(heightScores.g, max(heightScores.b, heightScores.a)));
    
    let transition = max(0.001, (1.0 - clamp(contrast, 0.0, 0.99)) * 0.4);
    let threshold = maxHeight - transition;
    let blended = max(heightScores - vec4<f32>(threshold), vec4<f32>(0.0)) * splatWeights;
    
    let sumVal = blended.r + blended.g + blended.b + blended.a;
    if (sumVal <= 0.0001) { return splatWeights; }
    return blended / sumVal;
}

fn getBakeMipLevel(scale: f32, textureSize: f32, worldUVScaleX: f32, outputWidth: f32) -> f32 {
    // 1 World UV당 아틀라스가 갖는 픽셀 수
    let atlasPixelsPerWorldUV = outputWidth / max(0.00001, worldUVScaleX);
    // 1 World UV당 디테일 레이어 텍스처가 갖는 텍셀 수
    let layerTexelsPerWorldUV = scale * textureSize;
    // 아틀라스 1픽셀당 텍셀 비중
    let texelsPerAtlasPixel = layerTexelsPerWorldUV / max(0.00001, atlasPixelsPerWorldUV);
    
    if (texelsPerAtlasPixel <= 1.0) {
        return 0.0;
    }
    // 아틀라스 픽셀 해상도 한계에 맞춰 선명도를 최대한 유지하는 유동적 Mipmap 계산
    return log2(texelsPerAtlasPixel);
}

fn decodeOctahedronNormal(oct: vec2<f32>) -> vec3<f32> {
    if (oct.x == 0.0 && oct.y == 0.0) {
        return vec3<f32>(0.0, 1.0, 0.0);
    }
    let f = oct * 2.0 - 1.0;
    var n = vec3<f32>(f.x, 1.0 - abs(f.x) - abs(f.y), f.y);
    let t = clamp(-n.y, 0.0, 1.0);
    n.x += select(t, -t, n.x >= 0.0);
    n.z += select(t, -t, n.z >= 0.0);
    let norm = normalize(n);
    if (norm.y < 0.0) {
        return vec3<f32>(0.0, 1.0, 0.0);
    }
    return norm;
}

@compute @workgroup_size(16, 16)
fn cs_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let outputDim = textureDimensions(albedoOutput);
    let tileWidth = u32(bakeUniforms.tileRect.z);
    let tileHeight = u32(bakeUniforms.tileRect.w);

    if (global_id.x >= tileWidth || global_id.y >= tileHeight) {
        return;
    }

    let destCoords = vec2<i32>(
        i32(u32(bakeUniforms.tileRect.x) + global_id.x),
        i32(u32(bakeUniforms.tileRect.y) + global_id.y)
    );

    if (destCoords.x >= i32(outputDim.x) || destCoords.y >= i32(outputDim.y)) {
        return;
    }

    let localTileUV = (vec2<f32>(global_id.xy) + vec2<f32>(0.5) - vec2<f32>(4.0)) / vec2<f32>(128.0);
    let rawWorldUV = bakeUniforms.worldUVOffset + localTileUV * bakeUniforms.worldUVScale;
    let wUV = vec2<f32>(rawWorldUV.x, 1.0 - rawWorldUV.y);
    let tileUV = wUV * bakeUniforms.tileScale;
    let macroUV = wUV * bakeUniforms.macroScale;

    let texSize = f32(textureDimensions(diffuseArray).x);
    let tileMip = getBakeMipLevel(bakeUniforms.tileScale, texSize, bakeUniforms.worldUVScale.x, f32(outputDim.x));
    let macroMip = getBakeMipLevel(bakeUniforms.macroScale, texSize, bakeUniforms.worldUVScale.x, f32(outputDim.x));

    // 디퓨즈 혼합 (미지정 텍스처 시 vec4(1.0) 기본 흰색 대입)
    let d0_s = textureSampleLevel(diffuseArray, texSampler, tileUV, 0i, tileMip);
    let d0 = select(
        mix(d0_s, textureSampleLevel(diffuseArray, texSampler, macroUV, 0i, macroMip), 0.3),
        vec4<f32>(1.0, 1.0, 1.0, 1.0),
        d0_s.a <= 0.01 || (d0_s.r <= 0.001 && d0_s.g <= 0.001 && d0_s.b <= 0.001)
    );

    let d1_s = textureSampleLevel(diffuseArray, texSampler, tileUV, 1i, tileMip);
    let d1 = select(
        mix(d1_s, textureSampleLevel(diffuseArray, texSampler, macroUV, 1i, macroMip), 0.3),
        vec4<f32>(1.0, 1.0, 1.0, 1.0),
        d1_s.a <= 0.01 || (d1_s.r <= 0.001 && d1_s.g <= 0.001 && d1_s.b <= 0.001)
    );

    let d2_s = textureSampleLevel(diffuseArray, texSampler, tileUV, 2i, tileMip);
    let d2 = select(
        mix(d2_s, textureSampleLevel(diffuseArray, texSampler, macroUV, 2i, macroMip), 0.3),
        vec4<f32>(1.0, 1.0, 1.0, 1.0),
        d2_s.a <= 0.01 || (d2_s.r <= 0.001 && d2_s.g <= 0.001 && d2_s.b <= 0.001)
    );

    let d3_s = textureSampleLevel(diffuseArray, texSampler, tileUV, 3i, tileMip);
    let d3 = select(
        mix(d3_s, textureSampleLevel(diffuseArray, texSampler, macroUV, 3i, macroMip), 0.3),
        vec4<f32>(1.0, 1.0, 1.0, 1.0),
        d3_s.a <= 0.01 || (d3_s.r <= 0.001 && d3_s.g <= 0.001 && d3_s.b <= 0.001)
    );

    // 하이트 혼합
    let h0_s = textureSampleLevel(heightArray, texSampler, tileUV, 0i, tileMip);
    let h0_raw = mix(
        select(h0_s.r, 0.5, h0_s.a <= 0.01),
        select(textureSampleLevel(heightArray, texSampler, macroUV, 0i, macroMip).r, 0.5, h0_s.a <= 0.01),
        0.3
    );
    let h0_c = clamp(h0_raw, 0.0, 1.0);
    let h0 = h0_c * h0_c * h0_c;

    let h1_s = textureSampleLevel(heightArray, texSampler, tileUV, 1i, tileMip);
    let h1_raw = mix(
        select(h1_s.r, 0.5, h1_s.a <= 0.01),
        select(textureSampleLevel(heightArray, texSampler, macroUV, 1i, macroMip).r, 0.5, h1_s.a <= 0.01),
        0.3
    );
    let h1_c = clamp(h1_raw, 0.0, 1.0);
    let h1 = h1_c * h1_c * h1_c;

    let h2_s = textureSampleLevel(heightArray, texSampler, tileUV, 2i, tileMip);
    let h2_raw = mix(
        select(h2_s.r, 0.5, h2_s.a <= 0.01),
        select(textureSampleLevel(heightArray, texSampler, macroUV, 2i, macroMip).r, 0.5, h2_s.a <= 0.01),
        0.3
    );
    let h2_c = clamp(h2_raw, 0.0, 1.0);
    let h2 = h2_c * h2_c * h2_c;

    let h3_s = textureSampleLevel(heightArray, texSampler, tileUV, 3i, tileMip);
    let h3_raw = mix(
        select(h3_s.r, 0.5, h3_s.a <= 0.01),
        select(textureSampleLevel(heightArray, texSampler, macroUV, 3i, macroMip).r, 0.5, h3_s.a <= 0.01),
        0.3
    );
    let h3_c = clamp(h3_raw, 0.0, 1.0);
    let h3 = h3_c * h3_c * h3_c;

    let layerHeights = vec4<f32>(h0, h1, h2, h3);

    var sw = vec4<f32>(0.0);

    if (bakeUniforms.useAutoSplat == 1u) {
        // 단 1회의 샘플링으로 높이와 사전 베이킹된 노멀 벡터를 동시에 획득 (Octahedron Decoding)
        let heightmapData = textureSampleLevel(heightmapAtlasTexture, texSampler, wUV, 0.0);
        let hCenter = heightmapData.r;
        let normal = decodeOctahedronNormal(heightmapData.gb);

        // 경사(Slope)를 노멀 벡터의 수직성분(y)을 이용하여 제곱근 없이 선형 근사
        // 하늘을 수직으로 볼수록 (y가 1에 가까울수록) 경사도는 0, 평평해질수록 (y가 0에 가까울수록) 경사도는 1
        let slope = clamp(1.0 - normal.y, 0.0, 1.0);

        let rockWeight = smoothstep(0.18, 0.45, slope);
        let sandWeight = select(0.0, 1.0 - smoothstep(0.02, 0.08, hCenter), slope < 0.2);
        let gravelWeight = select(0.0, smoothstep(0.5, 0.8, hCenter), slope >= 0.1 && slope <= 0.4);
        let grassWeight = max(0.0, 1.0 - (rockWeight + sandWeight + gravelWeight));

        sw = vec4<f32>(grassWeight, rockWeight, gravelWeight, sandWeight);
    } else {
        let splat = textureSampleLevel(splatTexture, texSampler, wUV, 0.0);
        let splat3Sum = splat.r + splat.g + splat.b;
        // Use splat.a if alpha channel contains valid weight, otherwise fall back to 1.0 - splat3Sum
        let layer3Weight = select(max(0.0, 1.0 - splat3Sum), splat.a, splat.a > 0.001 && (splat3Sum + splat.a) <= 1.05);
        sw = vec4<f32>(splat.r, splat.g, splat.b, layer3Weight);
    }

    let totalWeightAlbedo = sw.r + sw.g + sw.b + sw.a;
    if (totalWeightAlbedo <= 0.001) {
        sw = vec4<f32>(1.0, 0.0, 0.0, 0.0);
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
        finalAlbedo = mix(layerAlbedo, baseColorSample, weight);
    } else {
        let tintedAlbedo = layerAlbedo * baseColorSample;
        finalAlbedo = mix(layerAlbedo, tintedAlbedo, weight);
    }
    finalAlbedo.a = 1.0;

    // 노멀 혼합 (미지정 텍스처 시 Flat Normal vec2(0.0) 자동 대입)
    let n0_s = textureSampleLevel(normalArray, texSampler, tileUV, 0i, tileMip);
    let n0_raw = select(
        mix(n0_s.rg * 2.0 - vec2<f32>(1.0), textureSampleLevel(normalArray, texSampler, macroUV, 0i, macroMip).rg * 2.0 - vec2<f32>(1.0), 0.3),
        vec2<f32>(0.0),
        n0_s.a <= 0.01 || (n0_s.r <= 0.001 && n0_s.g <= 0.001 && n0_s.b <= 0.001)
    );

    let n1_s = textureSampleLevel(normalArray, texSampler, tileUV, 1i, tileMip);
    let n1_raw = select(
        mix(n1_s.rg * 2.0 - vec2<f32>(1.0), textureSampleLevel(normalArray, texSampler, macroUV, 1i, macroMip).rg * 2.0 - vec2<f32>(1.0), 0.3),
        vec2<f32>(0.0),
        n1_s.a <= 0.01 || (n1_s.r <= 0.001 && n1_s.g <= 0.001 && n1_s.b <= 0.001)
    );

    let n2_s = textureSampleLevel(normalArray, texSampler, tileUV, 2i, tileMip);
    let n2_raw = select(
        mix(n2_s.rg * 2.0 - vec2<f32>(1.0), textureSampleLevel(normalArray, texSampler, macroUV, 2i, macroMip).rg * 2.0 - vec2<f32>(1.0), 0.3),
        vec2<f32>(0.0),
        n2_s.a <= 0.01 || (n2_s.r <= 0.001 && n2_s.g <= 0.001 && n2_s.b <= 0.001)
    );

    let n3_s = textureSampleLevel(normalArray, texSampler, tileUV, 3i, tileMip);
    let n3_raw = select(
        mix(n3_s.rg * 2.0 - vec2<f32>(1.0), textureSampleLevel(normalArray, texSampler, macroUV, 3i, macroMip).rg * 2.0 - vec2<f32>(1.0), 0.3),
        vec2<f32>(0.0),
        n3_s.a <= 0.01 || (n3_s.r <= 0.001 && n3_s.g <= 0.001 && n3_s.b <= 0.001)
    );

    var blendedNormalXY = n0_raw * w.r + n1_raw * w.g + n2_raw * w.b + n3_raw * w.a;
    blendedNormalXY = blendedNormalXY * bakeUniforms.normalScale;
    let scaledNormal = clamp(blendedNormalXY * 0.5 + vec2<f32>(0.5), vec2<f32>(0.0), vec2<f32>(1.0));

    // ORM 혼합
    var o0 = mix(
        textureSampleLevel(ormArray, texSampler, tileUV, 0i, tileMip),
        textureSampleLevel(ormArray, texSampler, macroUV, 0i, macroMip),
        0.3
    );
    var o1 = mix(
        textureSampleLevel(ormArray, texSampler, tileUV, 1i, tileMip),
        textureSampleLevel(ormArray, texSampler, macroUV, 1i, macroMip),
        0.3
    );
    var o2 = mix(
        textureSampleLevel(ormArray, texSampler, tileUV, 2i, tileMip),
        textureSampleLevel(ormArray, texSampler, macroUV, 2i, macroMip),
        0.3
    );
    var o3 = mix(
        textureSampleLevel(ormArray, texSampler, tileUV, 3i, tileMip),
        textureSampleLevel(ormArray, texSampler, macroUV, 3i, macroMip),
        0.3
    );
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

    let macroRoughnessVariation = (globalORM.g - 0.5) * 0.4 * hasGlobalORM;
    let finalRoughness = clamp(blendedRoughness + macroRoughnessVariation, 0.04, 1.0);

    let globalAO = select(1.0, globalORM.r, hasGlobalORM > 0.5);
    let finalOcclusion = clamp(blendedOcclusion * globalAO * bakeUniforms.occlusionStrength, 0.0, 1.0);

    textureStore(albedoOutput, destCoords, finalAlbedo);
    textureStore(normalORMOutput, destCoords, vec4<f32>(scaledNormal, finalRoughness, finalOcclusion));
}

