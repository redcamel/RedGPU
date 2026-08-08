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
@group(0) @binding(11) var normalORMOutput: texture_storage_2d<rgba8unorm, write>;

fn getHeightBlendedWeights(
    splatWeights: vec4<f32>,
    layerHeights: vec4<f32>,
    contrast: f32
) -> vec4<f32> {
    let combined = (layerHeights + vec4<f32>(1.0)) * splatWeights;
    let maxVal   = max(combined.r, max(combined.g, max(combined.b, combined.a)));
    if (maxVal <= 0.0001) { return splatWeights; }

    let transition = max(0.005, (1.0 - clamp(contrast, 0.0, 1.0)) * 0.5);
    let threshold  = maxVal - transition;
    let blended    = max(combined - vec4<f32>(threshold), vec4<f32>(0.0));
    let sumVal     = blended.r + blended.g + blended.b + blended.a;
    if (sumVal <= 0.0001) { return splatWeights; }
    return blended / sumVal;
}

fn getBakeMipLevel(tileScale: f32, textureSize: f32, atlasSize: f32) -> f32 {
    let texelsPerAtlasPixel = (tileScale * textureSize) / atlasSize;
    if (texelsPerAtlasPixel <= 1.0) {
        return 0.0;
    }
    let mip = log2(texelsPerAtlasPixel) - 0.5;
    return clamp(mip, 0.0, 3.0);
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

    let rawUV = (vec2<f32>(destCoords) + vec2<f32>(0.5)) / vec2<f32>(outputDim);

    let wUV = bakeUniforms.worldUVOffset + rawUV * bakeUniforms.worldUVScale;
    let tileUV = wUV * bakeUniforms.tileScale;

    let bakeMip = getBakeMipLevel(bakeUniforms.tileScale, 1024.0, f32(outputDim.x));

    let d0 = textureSampleLevel(diffuseArray, texSampler, tileUV, 0i, bakeMip);
    let d1 = textureSampleLevel(diffuseArray, texSampler, tileUV, 1i, bakeMip);
    let d2 = textureSampleLevel(diffuseArray, texSampler, tileUV, 2i, bakeMip);
    let d3 = textureSampleLevel(diffuseArray, texSampler, tileUV, 3i, bakeMip);

    let h0 = pow(clamp(textureSampleLevel(heightArray, texSampler, tileUV, 0i, bakeMip).r, 0.0, 1.0), 3.0);
    let h1 = pow(clamp(textureSampleLevel(heightArray, texSampler, tileUV, 1i, bakeMip).r, 0.0, 1.0), 3.0);
    let h2 = pow(clamp(textureSampleLevel(heightArray, texSampler, tileUV, 2i, bakeMip).r, 0.0, 1.0), 3.0);
    let h3 = pow(clamp(textureSampleLevel(heightArray, texSampler, tileUV, 3i, bakeMip).r, 0.0, 1.0), 3.0);
    let layerHeights = vec4<f32>(h0, h1, h2, h3);

    var sw = vec4<f32>(0.0);

    if (bakeUniforms.useAutoSplat == 1u) {
        let texDim = vec2<f32>(textureDimensions(heightmapAtlasTexture));
        let texelSize = 1.0 / max(texDim, vec2<f32>(1.0));

        let hCenter = textureSampleLevel(heightmapAtlasTexture, texSampler, wUV, 0.0).r;
        let hRight  = textureSampleLevel(heightmapAtlasTexture, texSampler, wUV + vec2<f32>(texelSize.x, 0.0), 0.0).r;
        let hUp     = textureSampleLevel(heightmapAtlasTexture, texSampler, wUV + vec2<f32>(0.0, texelSize.y), 0.0).r;

        let dhX = (hRight - hCenter) * 40.0;
        let dhZ = (hUp - hCenter) * 40.0;
        let slope = clamp(sqrt(dhX * dhX + dhZ * dhZ), 0.0, 1.0);

        let rockWeight = smoothstep(0.18, 0.45, slope);
        let sandWeight = select(0.0, 1.0 - smoothstep(0.02, 0.08, hCenter), slope < 0.2);
        let gravelWeight = select(0.0, smoothstep(0.5, 0.8, hCenter), slope >= 0.1 && slope <= 0.4);
        let grassWeight = max(0.0, 1.0 - (rockWeight + sandWeight + gravelWeight));

        sw = vec4<f32>(grassWeight, rockWeight, gravelWeight, sandWeight);
    } else {
        let splat = textureSampleLevel(splatTexture, texSampler, wUV, 0.0);
        let splat3Sum = clamp(splat.r + splat.g + splat.b, 0.0, 1.0);
        sw = vec4<f32>(splat.r, splat.g, splat.b, max(0.0, 1.0 - splat3Sum));
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

    let macroRoughnessVariation = (globalORM.g - 0.5) * 0.4 * hasGlobalORM;
    let finalRoughness = clamp(blendedRoughness + macroRoughnessVariation, 0.04, 1.0);

    let globalAO = select(1.0, globalORM.r, hasGlobalORM > 0.5);
    let finalOcclusion = clamp(blendedOcclusion * globalAO * bakeUniforms.occlusionStrength, 0.0, 1.0);

    textureStore(albedoOutput, destCoords, finalAlbedo);
    textureStore(normalORMOutput, destCoords, vec4<f32>(scaledNormal, finalRoughness, finalOcclusion));
}

