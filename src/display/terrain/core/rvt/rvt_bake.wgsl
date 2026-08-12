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

@group(0) @binding(0) var<storage, read> bakeUniformsArray: array<RVTBakeUniforms>;
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
    let atlasPixelsPerWorldUV = outputWidth / max(0.00001, worldUVScaleX);
    let layerTexelsPerWorldUV = scale * textureSize;
    let texelsPerAtlasPixel = layerTexelsPerWorldUV / max(0.00001, atlasPixelsPerWorldUV);
    
    if (texelsPerAtlasPixel <= 1.0) {
        return 0.0;
    }
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
    let tileIndex = global_id.z;
    let bakeUniforms = bakeUniformsArray[tileIndex];

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

    var sw = vec4<f32>(0.0);

    if (bakeUniforms.useAutoSplat == 1u) {
        let heightmapData = textureSampleLevel(heightmapAtlasTexture, texSampler, wUV, 0.0);
        let hCenter = heightmapData.r;
        let normal = decodeOctahedronNormal(heightmapData.gb);

        let slope = clamp(1.0 - normal.y, 0.0, 1.0);

        let rockWeight = smoothstep(0.18, 0.45, slope);
        let sandWeight = select(0.0, 1.0 - smoothstep(0.02, 0.08, hCenter), slope < 0.2);
        let gravelWeight = select(0.0, smoothstep(0.5, 0.8, hCenter), slope >= 0.1 && slope <= 0.4);
        let grassWeight = max(0.0, 1.0 - (rockWeight + sandWeight + gravelWeight));

        sw = vec4<f32>(grassWeight, rockWeight, gravelWeight, sandWeight);
    } else {
        let splat = textureSampleLevel(splatTexture, texSampler, wUV, 0.0);
        let splat3Sum = splat.r + splat.g + splat.b;
        let layer3Weight = select(max(0.0, 1.0 - splat3Sum), splat.a, splat.a > 0.001 && (splat3Sum + splat.a) <= 1.05);
        sw = vec4<f32>(splat.r, splat.g, splat.b, layer3Weight);
    }

    let totalWeightAlbedo = sw.r + sw.g + sw.b + sw.a;
    if (totalWeightAlbedo <= 0.001) {
        sw = vec4<f32>(1.0, 0.0, 0.0, 0.0);
    } else {
        sw = sw / totalWeightAlbedo;
    }

    // Active Layer Fast-Path: 하이트 맵 샘플링을 활성화된 레이어로 제한
    var layerHeights = vec4<f32>(0.5);
    if (sw.r > 0.001) {
        let h0_s = textureSampleLevel(heightArray, texSampler, tileUV, 0i, tileMip);
        let h0_raw = mix(select(h0_s.r, 0.5, h0_s.a <= 0.01), select(textureSampleLevel(heightArray, texSampler, macroUV, 0i, macroMip).r, 0.5, h0_s.a <= 0.01), 0.3);
        layerHeights.r = clamp(h0_raw, 0.0, 1.0) * clamp(h0_raw, 0.0, 1.0) * clamp(h0_raw, 0.0, 1.0);
    }
    if (sw.g > 0.001) {
        let h1_s = textureSampleLevel(heightArray, texSampler, tileUV, 1i, tileMip);
        let h1_raw = mix(select(h1_s.r, 0.5, h1_s.a <= 0.01), select(textureSampleLevel(heightArray, texSampler, macroUV, 1i, macroMip).r, 0.5, h1_s.a <= 0.01), 0.3);
        layerHeights.g = clamp(h1_raw, 0.0, 1.0) * clamp(h1_raw, 0.0, 1.0) * clamp(h1_raw, 0.0, 1.0);
    }
    if (sw.b > 0.001) {
        let h2_s = textureSampleLevel(heightArray, texSampler, tileUV, 2i, tileMip);
        let h2_raw = mix(select(h2_s.r, 0.5, h2_s.a <= 0.01), select(textureSampleLevel(heightArray, texSampler, macroUV, 2i, macroMip).r, 0.5, h2_s.a <= 0.01), 0.3);
        layerHeights.b = clamp(h2_raw, 0.0, 1.0) * clamp(h2_raw, 0.0, 1.0) * clamp(h2_raw, 0.0, 1.0);
    }
    if (sw.a > 0.001) {
        let h3_s = textureSampleLevel(heightArray, texSampler, tileUV, 3i, tileMip);
        let h3_raw = mix(select(h3_s.r, 0.5, h3_s.a <= 0.01), select(textureSampleLevel(heightArray, texSampler, macroUV, 3i, macroMip).r, 0.5, h3_s.a <= 0.01), 0.3);
        layerHeights.a = clamp(h3_raw, 0.0, 1.0) * clamp(h3_raw, 0.0, 1.0) * clamp(h3_raw, 0.0, 1.0);
    }

    let w = getHeightBlendedWeights(sw, layerHeights, bakeUniforms.blendContrast);

    // Active Layer Fast-Path: 디퓨즈, 노멀, ORM 샘플링을 활성화된 레이어만 분기 실행
    var layerAlbedo = vec4<f32>(0.0);
    var blendedNormalXY = vec2<f32>(0.0);
    var blendedRoughness = 0.0;
    var blendedOcclusion = 0.0;

    let globalRoughnessMult = bakeUniforms.roughnessFactor;

    if (w.r > 0.0001) {
        let d0_s = textureSampleLevel(diffuseArray, texSampler, tileUV, 0i, tileMip);
        let d0 = select(
            mix(d0_s, textureSampleLevel(diffuseArray, texSampler, macroUV, 0i, macroMip), 0.3),
            vec4<f32>(1.0, 1.0, 1.0, 1.0),
            d0_s.a <= 0.01 || (d0_s.r <= 0.001 && d0_s.g <= 0.001 && d0_s.b <= 0.001)
        );
        layerAlbedo += d0 * w.r;

        let n0_s = textureSampleLevel(normalArray, texSampler, tileUV, 0i, tileMip);
        let n0_raw = select(
            mix(n0_s.rg * 2.0 - vec2<f32>(1.0), textureSampleLevel(normalArray, texSampler, macroUV, 0i, macroMip).rg * 2.0 - vec2<f32>(1.0), 0.3),
            vec2<f32>(0.0),
            n0_s.a <= 0.01 || (n0_s.r <= 0.001 && n0_s.g <= 0.001 && n0_s.b <= 0.001)
        );
        blendedNormalXY += n0_raw * w.r;

        var o0 = mix(textureSampleLevel(ormArray, texSampler, tileUV, 0i, tileMip), textureSampleLevel(ormArray, texSampler, macroUV, 0i, macroMip), 0.3);
        if (o0.a <= 0.01 || (o0.r <= 0.001 && o0.g <= 0.001 && o0.b <= 0.001)) { o0 = vec4<f32>(1.0, 1.0, 1.0, 1.0); }
        blendedRoughness += o0.g * bakeUniforms.layer0RoughnessFactor * globalRoughnessMult * w.r;
        blendedOcclusion += o0.r * w.r;
    }

    if (w.g > 0.0001) {
        let d1_s = textureSampleLevel(diffuseArray, texSampler, tileUV, 1i, tileMip);
        let d1 = select(
            mix(d1_s, textureSampleLevel(diffuseArray, texSampler, macroUV, 1i, macroMip), 0.3),
            vec4<f32>(1.0, 1.0, 1.0, 1.0),
            d1_s.a <= 0.01 || (d1_s.r <= 0.001 && d1_s.g <= 0.001 && d1_s.b <= 0.001)
        );
        layerAlbedo += d1 * w.g;

        let n1_s = textureSampleLevel(normalArray, texSampler, tileUV, 1i, tileMip);
        let n1_raw = select(
            mix(n1_s.rg * 2.0 - vec2<f32>(1.0), textureSampleLevel(normalArray, texSampler, macroUV, 1i, macroMip).rg * 2.0 - vec2<f32>(1.0), 0.3),
            vec2<f32>(0.0),
            n1_s.a <= 0.01 || (n1_s.r <= 0.001 && n1_s.g <= 0.001 && n1_s.b <= 0.001)
        );
        blendedNormalXY += n1_raw * w.g;

        var o1 = mix(textureSampleLevel(ormArray, texSampler, tileUV, 1i, tileMip), textureSampleLevel(ormArray, texSampler, macroUV, 1i, macroMip), 0.3);
        if (o1.a <= 0.01 || (o1.r <= 0.001 && o1.g <= 0.001 && o1.b <= 0.001)) { o1 = vec4<f32>(1.0, 1.0, 1.0, 1.0); }
        blendedRoughness += o1.g * bakeUniforms.layer1RoughnessFactor * globalRoughnessMult * w.g;
        blendedOcclusion += o1.r * w.g;
    }

    if (w.b > 0.0001) {
        let d2_s = textureSampleLevel(diffuseArray, texSampler, tileUV, 2i, tileMip);
        let d2 = select(
            mix(d2_s, textureSampleLevel(diffuseArray, texSampler, macroUV, 2i, macroMip), 0.3),
            vec4<f32>(1.0, 1.0, 1.0, 1.0),
            d2_s.a <= 0.01 || (d2_s.r <= 0.001 && d2_s.g <= 0.001 && d2_s.b <= 0.001)
        );
        layerAlbedo += d2 * w.b;

        let n2_s = textureSampleLevel(normalArray, texSampler, tileUV, 2i, tileMip);
        let n2_raw = select(
            mix(n2_s.rg * 2.0 - vec2<f32>(1.0), textureSampleLevel(normalArray, texSampler, macroUV, 2i, macroMip).rg * 2.0 - vec2<f32>(1.0), 0.3),
            vec2<f32>(0.0),
            n2_s.a <= 0.01 || (n2_s.r <= 0.001 && n2_s.g <= 0.001 && n2_s.b <= 0.001)
        );
        blendedNormalXY += n2_raw * w.b;

        var o2 = mix(textureSampleLevel(ormArray, texSampler, tileUV, 2i, tileMip), textureSampleLevel(ormArray, texSampler, macroUV, 2i, macroMip), 0.3);
        if (o2.a <= 0.01 || (o2.r <= 0.001 && o2.g <= 0.001 && o2.b <= 0.001)) { o2 = vec4<f32>(1.0, 1.0, 1.0, 1.0); }
        blendedRoughness += o2.g * bakeUniforms.layer2RoughnessFactor * globalRoughnessMult * w.b;
        blendedOcclusion += o2.r * w.b;
    }

    if (w.a > 0.0001) {
        let d3_s = textureSampleLevel(diffuseArray, texSampler, tileUV, 3i, tileMip);
        let d3 = select(
            mix(d3_s, textureSampleLevel(diffuseArray, texSampler, macroUV, 3i, macroMip), 0.3),
            vec4<f32>(1.0, 1.0, 1.0, 1.0),
            d3_s.a <= 0.01 || (d3_s.r <= 0.001 && d3_s.g <= 0.001 && d3_s.b <= 0.001)
        );
        layerAlbedo += d3 * w.a;

        let n3_s = textureSampleLevel(normalArray, texSampler, tileUV, 3i, tileMip);
        let n3_raw = select(
            mix(n3_s.rg * 2.0 - vec2<f32>(1.0), textureSampleLevel(normalArray, texSampler, macroUV, 3i, macroMip).rg * 2.0 - vec2<f32>(1.0), 0.3),
            vec2<f32>(0.0),
            n3_s.a <= 0.01 || (n3_s.r <= 0.001 && n3_s.g <= 0.001 && n3_s.b <= 0.001)
        );
        blendedNormalXY += n3_raw * w.a;

        var o3 = mix(textureSampleLevel(ormArray, texSampler, tileUV, 3i, tileMip), textureSampleLevel(ormArray, texSampler, macroUV, 3i, macroMip), 0.3);
        if (o3.a <= 0.01 || (o3.r <= 0.001 && o3.g <= 0.001 && o3.b <= 0.001)) { o3 = vec4<f32>(1.0, 1.0, 1.0, 1.0); }
        blendedRoughness += o3.g * bakeUniforms.layer3RoughnessFactor * globalRoughnessMult * w.a;
        blendedOcclusion += o3.r * w.a;
    }

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

    blendedNormalXY = blendedNormalXY * bakeUniforms.normalScale;
    let scaledNormal = clamp(blendedNormalXY * 0.5 + vec2<f32>(0.5), vec2<f32>(0.0), vec2<f32>(1.0));

    var globalORM = textureSampleLevel(ormTexture, texSampler, wUV, 0.0);
    let hasGlobalORM = select(1.0, 0.0, globalORM.a <= 0.01 || (globalORM.r <= 0.001 && globalORM.g <= 0.001 && globalORM.b <= 0.001));

    let macroRoughnessVariation = (globalORM.g - 0.5) * 0.4 * hasGlobalORM;
    let finalRoughness = clamp(blendedRoughness + macroRoughnessVariation, 0.04, 1.0);

    let globalAO = select(1.0, globalORM.r, hasGlobalORM > 0.5);
    let finalOcclusion = clamp(blendedOcclusion * globalAO * bakeUniforms.occlusionStrength, 0.0, 1.0);

    textureStore(albedoOutput, destCoords, finalAlbedo);
    textureStore(normalORMOutput, destCoords, vec4<f32>(scaledNormal, finalRoughness, finalOcclusion));
}


