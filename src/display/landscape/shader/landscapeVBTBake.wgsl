#redgpu_include math.PI;
#redgpu_include math.INV_PI;
#redgpu_include math.EPSILON;

struct LandscapeLayerParams {
    uvOffset: vec2<f32>,
    uvScale: vec2<f32>,
    _padding0: vec2<f32>,
    minVal: f32,
    maxVal: f32,
    tintColor: vec4<f32>,
    blendFalloff: f32,
    blendMode: f32,
    roughness: f32,
    metallic: f32,
    normalIntensity: f32,
    enabled: f32,
    aoIntensity: f32,
    heightOffset: f32,
    heightContrast: f32,
    weightMapChannelIndex: f32,
    pad0: f32,
    pad1: f32,
};

struct VBTBakeUniforms {
    tileOriginInAtlas: vec2<f32>,
    tilePixelSize: vec2<f32>,
    atlasSize: vec2<f32>,
    sliceIndex: u32,
    activeLayerCount: u32,
    baseColor: vec4<f32>,
    layers: array<LandscapeLayerParams, 8>,
};

@group(0) @binding(0) var<uniform> uniforms: VBTBakeUniforms;
@group(0) @binding(1) var vhtAtlasTexture: texture_2d<f32>;
@group(0) @binding(2) var vntAtlasTexture: texture_2d<f32>;
@group(0) @binding(3) var vbtTextureSampler: sampler;

@group(0) @binding(4) var layerBaseColorArray: texture_2d_array<f32>;
@group(0) @binding(5) var layerNormalArray: texture_2d_array<f32>;
@group(0) @binding(6) var layerORMArray: texture_2d_array<f32>;
@group(0) @binding(7) var layerWeightMapArray: texture_2d_array<f32>;

@group(0) @binding(8) var vbtBaseColorOutput: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(9) var vbtNormalOutput: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(10) var vbtORMOutput: texture_storage_2d<rgba8unorm, write>;

fn computeLayerRawWeightFast(layer: LandscapeLayerParams, slopeAngleDeg: f32, vertexHeight: f32) -> f32 {
    let blendMode = layer.blendMode;
    let minVal = layer.minVal;
    let maxVal = layer.maxVal;
    let falloff = max(0.001, layer.blendFalloff);

    var val = 0.0;
    if (blendMode < 0.5) {
        val = slopeAngleDeg;
    } else if (blendMode < 1.5) {
        val = vertexHeight + layer.heightOffset;
    } else {
        return 1.0;
    }

    let lowW = select(smoothstep(minVal, minVal + falloff, val), 1.0, minVal <= -499.0 || (blendMode < 0.5 && minVal <= 0.001));
    let highW = select(1.0 - smoothstep(maxVal - falloff, maxVal, val), 1.0, maxVal >= 499.0 || (blendMode < 0.5 && maxVal >= 89.999));

    return clamp(lowW * highW, 0.0, 1.0);
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let tileW = u32(uniforms.tilePixelSize.x);
    let tileH = u32(uniforms.tilePixelSize.y);

    if (global_id.x >= tileW || global_id.y >= tileH) {
        return;
    }

    let localX = i32(global_id.x);
    let localZ = i32(global_id.y);

    let atlasW = uniforms.atlasSize.x;
    let atlasH = uniforms.atlasSize.y;

    let atlasPixelX = i32(uniforms.tileOriginInAtlas.x) + localX;
    let atlasPixelZ = i32(uniforms.tileOriginInAtlas.y) + localZ;

    if (f32(atlasPixelX) >= atlasW || f32(atlasPixelZ) >= atlasH) {
        return;
    }

    let globalUV = vec2<f32>(
        (f32(atlasPixelX) + 0.5) / atlasW,
        (f32(atlasPixelZ) + 0.5) / atlasH
    );

    let vhtCoord = vec2<i32>(atlasPixelX, atlasPixelZ);

    let vertexHeight = textureLoad(vhtAtlasTexture, vhtCoord, 0).r;
    let encodedNormal = textureLoad(vntAtlasTexture, vhtCoord, 0).rgb;
    let sampledNormal = normalize(encodedNormal * 2.0 - vec3<f32>(1.0));
    var N: vec3<f32> = select(sampledNormal, vec3<f32>(0.0, 1.0, 0.0), length(encodedNormal) <= 0.001);

    let slopeAngleDeg = acos(clamp(N.y, -1.0, 1.0)) * 57.295779513;

    var baseAlbedo = uniforms.baseColor.rgb;
    var baseRoughness = 0.9;
    var baseMetallic = 0.0;
    var baseAO = 1.0;

    let activeLayerCount = uniforms.activeLayerCount;
    var totalLayerWeight = 0.0;
    var blendedAlbedo = vec3<f32>(0.0);
    var blendedNormalTangent = vec3<f32>(0.0, 0.0, 0.0);
    var blendedRoughness = 0.0;
    var blendedMetallic = 0.0;
    var blendedAO = 0.0;

    let worldTileUV = vec2<f32>(
        (f32(localX) + 0.5) / f32(tileW),
        (f32(localZ) + 0.5) / f32(tileH)
    );

    for (var i = 0u; i < activeLayerCount; i = i + 1u) {
        let layerParams = uniforms.layers[i];
        if (layerParams.enabled <= 0.5) { continue; }

        let layerIdx = i32(i);
        var layerW = 0.0;

        if (layerParams.blendMode >= 1.5) {
            let weightMapSample = textureSampleLevel(layerWeightMapArray, vbtTextureSampler, globalUV, layerIdx, 0.0);
            let chIdx = u32(layerParams.weightMapChannelIndex + 0.5);
            var weightVal = weightMapSample.r;
            if (chIdx == 1u) { weightVal = weightMapSample.g; }
            else if (chIdx == 2u) { weightVal = weightMapSample.b; }
            else if (chIdx == 3u) {
                let isAlphaFull = weightMapSample.a >= 0.99;
                let remainingWeight = clamp(1.0 - (weightMapSample.r + weightMapSample.g + weightMapSample.b), 0.0, 1.0);
                weightVal = select(weightMapSample.a, remainingWeight, isAlphaFull);
            }
            layerW = clamp(weightVal, 0.0, 1.0);
        } else {
            layerW = computeLayerRawWeightFast(layerParams, slopeAngleDeg, vertexHeight);
        }

        if (layerW <= 0.0001) { continue; }

        let layerUV = worldTileUV * layerParams.uvScale + layerParams.uvOffset;

        let layerAlbedoSample = textureSampleLevel(layerBaseColorArray, vbtTextureSampler, layerUV, layerIdx, 0.0);
        let layerNormalRaw = textureSampleLevel(layerNormalArray, vbtTextureSampler, layerUV, layerIdx, 0.0).rgb * 2.0 - vec3<f32>(1.0);
        let layerNormalSample = vec3<f32>(layerNormalRaw.xy * layerParams.normalIntensity, max(0.01, layerNormalRaw.z));
        let layerORMSample = textureSampleLevel(layerORMArray, vbtTextureSampler, layerUV, layerIdx, 0.0);

        let layerAlbedo = layerAlbedoSample.rgb * layerParams.tintColor.rgb;
        let layerRoughness = layerParams.roughness * layerORMSample.g;
        let layerMetallic = layerParams.metallic * layerORMSample.b;
        let rawAO = select(1.0, layerORMSample.r, layerORMSample.r > 0.001);
        let layerAO = clamp(mix(1.0, rawAO, layerParams.aoIntensity), 0.2, 1.0);

        blendedAlbedo += layerAlbedo * layerW;
        blendedNormalTangent += layerNormalSample * layerW;
        blendedRoughness += layerRoughness * layerW;
        blendedMetallic += layerMetallic * layerW;
        blendedAO += layerAO * layerW;

        totalLayerWeight += layerW;
    }

    var finalAlbedo = baseAlbedo;
    var finalRoughness = baseRoughness;
    var finalMetallic = baseMetallic;
    var finalAO = baseAO;

    if (totalLayerWeight > 0.0001) {
        let invW = 1.0 / totalLayerWeight;
        let layerBlendAlbedo = blendedAlbedo * invW;
        let layerBlendNormal = normalize(blendedNormalTangent * invW);
        let layerBlendRoughness = blendedRoughness * invW;
        let layerBlendMetallic = blendedMetallic * invW;
        let layerBlendAO = blendedAO * invW;

        let alpha = clamp(totalLayerWeight, 0.0, 1.0);

        finalAlbedo = mix(baseAlbedo, layerBlendAlbedo, alpha);

        if (length(layerBlendNormal.xy) > 0.001) {
            let tangentX = normalize(vec3<f32>(1.0, 0.0, 0.0) - N * N.x);
            let tangentZ = normalize(cross(N, tangentX));
            let perturbedWorldN = normalize(tangentX * layerBlendNormal.x + tangentZ * layerBlendNormal.y + N * layerBlendNormal.z);
            N = normalize(mix(N, perturbedWorldN, alpha));
        }

        finalRoughness = mix(baseRoughness, layerBlendRoughness, alpha);
        finalMetallic = mix(baseMetallic, layerBlendMetallic, alpha);
        finalAO = mix(baseAO, layerBlendAO, alpha);
    }

    let storeCoord = vec2<i32>(atlasPixelX, atlasPixelZ);

    textureStore(vbtBaseColorOutput, storeCoord, vec4<f32>(finalAlbedo, 1.0));

    let encodedFinalN = N * 0.5 + vec3<f32>(0.5);
    textureStore(vbtNormalOutput, storeCoord, vec4<f32>(encodedFinalN, 1.0));

    textureStore(vbtORMOutput, storeCoord, vec4<f32>(finalAO, finalRoughness, finalMetallic, 1.0));
}
