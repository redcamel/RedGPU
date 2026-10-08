#redgpu_include math.PI2;
#redgpu_include landscape.struct.LandscapeLayerParams;
#redgpu_include landscape.tiling.stochasticTiling;
#redgpu_include landscape.math.perturbNormalOrthonormal;


struct VBTBakeUniforms {
    tileOriginInAtlas: vec2<f32>,
    tilePixelSize: vec2<f32>,
    atlasSize: vec2<f32>,
    activeLayerCount: u32,
    singleTileSize: f32,
    baseColor: vec4<f32>,
    layerParams: array<LandscapeLayerParams, 8>,
};

@group(0) @binding(0) var<uniform> uniforms: VBTBakeUniforms;
@group(0) @binding(1) var vntAtlasTexture: texture_2d<f32>;
@group(0) @binding(2) var vbtTextureSampler: sampler;

@group(0) @binding(3) var layerBaseColorArray: texture_2d_array<f32>;
@group(0) @binding(4) var layerNormalArray: texture_2d_array<f32>;
@group(0) @binding(5) var layerORMArray: texture_2d_array<f32>;
@group(0) @binding(6) var layerWeightMapArray: texture_2d_array<f32>;

@group(0) @binding(7) var vbtBaseColorOutput: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(8) var vbtNormalOutput: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(9) var vbtORMOutput: texture_storage_2d<rgba8unorm, write>;

fn sampleLayerStochasticLevel(
    baseUV: vec2<f32>,
    layerIdx: i32,
    scaleMult: f32,
    normalIntensity: f32
) -> StochasticSampleResult {
    let gridTri = getStochasticGridTri(baseUV * scaleMult);

    let r0 = stochasticHash2D(gridTri.v0);
    let r1 = stochasticHash2D(gridTri.v1);
    let r2 = stochasticHash2D(gridTri.v2);

    let ang0 = r0.z * PI2;
    let ang1 = r1.z * PI2;
    let ang2 = r2.z * PI2;

    let uv0 = rotate2D(baseUV, ang0) + r0.xy;
    let uv1 = rotate2D(baseUV, ang1) + r1.xy;
    let uv2 = rotate2D(baseUV, ang2) + r2.xy;

    let alb0 = textureSampleLevel(layerBaseColorArray, vbtTextureSampler, uv0, layerIdx, 0.0).rgb;
    let alb1 = textureSampleLevel(layerBaseColorArray, vbtTextureSampler, uv1, layerIdx, 0.0).rgb;
    let alb2 = textureSampleLevel(layerBaseColorArray, vbtTextureSampler, uv2, layerIdx, 0.0).rgb;

    let rawNorm = textureSampleLevel(layerNormalArray, vbtTextureSampler, baseUV, layerIdx, 0.0).rgb * 2.0 - vec3<f32>(1.0);
    let norm = vec3<f32>(rawNorm.xy * normalIntensity, max(0.01, rawNorm.z));
    let orm = textureSampleLevel(layerORMArray, vbtTextureSampler, baseUV, layerIdx, 0.0);

    var res: StochasticSampleResult;
    res.albedo = alb0 * gridTri.w0 + alb1 * gridTri.w1 + alb2 * gridTri.w2;
    res.normal = norm;
    res.orm = orm;
    return res;
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

    let vntSample = textureSampleLevel(vntAtlasTexture, vbtTextureSampler, globalUV, 0.0).rgb;
    let sampledNormal = normalize(vntSample * 2.0 - vec3<f32>(1.0));
    var N: vec3<f32> = select(sampledNormal, vec3<f32>(0.0, 1.0, 0.0), length(vntSample) <= 0.001);

    var baseAlbedo = uniforms.baseColor.rgb;
    var baseRoughness = 0.9;
    var baseMetallic = 0.0;
    var baseAO = 1.0;

    let activeLayerCount = uniforms.activeLayerCount;

    let tileSize = select(256.0, uniforms.singleTileSize, uniforms.singleTileSize > 0.0);
    let tileLocalX = f32(atlasPixelX % i32(tileSize));
    let tileLocalZ = f32(atlasPixelZ % i32(tileSize));

    let worldTileUV = vec2<f32>(
        (tileLocalX + 0.5) / tileSize,
        (tileLocalZ + 0.5) / tileSize
    );

    var totalLayerWeight = 0.0;
    var blendedAlbedo = vec3<f32>(0.0);
    var blendedNormalTangent = vec3<f32>(0.0, 0.0, 0.0);
    var blendedRoughness = 0.0;
    var blendedMetallic = 0.0;
    var blendedAO = 0.0;

    for (var i = 0u; i < activeLayerCount; i = i + 1u) {
        let layerParams = uniforms.layerParams[i];
        if (layerParams.enabled <= 0.5) { continue; }

        let layerIdx = i32(i);
        let weightMapSample = textureSampleLevel(layerWeightMapArray, vbtTextureSampler, globalUV, layerIdx, 0.0);
        let chIdx = u32(layerParams.weightChannelIndex + 0.5);
        var weightVal = weightMapSample.r;
        if (chIdx == 1u) { weightVal = weightMapSample.g; }
        else if (chIdx == 2u) { weightVal = weightMapSample.b; }
        else if (chIdx == 3u) {
            let isAlphaFull = weightMapSample.a >= 0.99;
            let remainingWeight = clamp(1.0 - (weightMapSample.r + weightMapSample.g + weightMapSample.b), 0.0, 1.0);
            weightVal = select(weightMapSample.a, remainingWeight, isAlphaFull);
        }
        let layerW = clamp(weightVal, 0.0, 1.0);

        if (layerW <= 0.0001) { continue; }

        let layerUV = worldTileUV * layerParams.uvScale + layerParams.uvOffset;

        var layerAlbedoSample: vec3<f32>;
        var layerNormalSample: vec3<f32>;
        var layerORMSample: vec4<f32>;

        if (layerParams.stochasticTiling > 0.5) {
            let stScale = select(1.0, layerParams.stochasticScale, layerParams.stochasticScale > 0.0);
            let stResult = sampleLayerStochasticLevel(layerUV, layerIdx, stScale, layerParams.normalIntensity);
            layerAlbedoSample = stResult.albedo;
            layerNormalSample = stResult.normal;
            layerORMSample = stResult.orm;
        } else {
            layerAlbedoSample = textureSampleLevel(layerBaseColorArray, vbtTextureSampler, layerUV, layerIdx, 0.0).rgb;
            let layerNormalRaw = textureSampleLevel(layerNormalArray, vbtTextureSampler, layerUV, layerIdx, 0.0).rgb * 2.0 - vec3<f32>(1.0);
            layerNormalSample = vec3<f32>(layerNormalRaw.xy * layerParams.normalIntensity, max(0.01, layerNormalRaw.z));
            layerORMSample = textureSampleLevel(layerORMArray, vbtTextureSampler, layerUV, layerIdx, 0.0);
        }

        let r = layerParams.roughness * layerORMSample.g;
        let m = layerParams.metallic * layerORMSample.b;
        let rawAO = select(1.0, layerORMSample.r, layerORMSample.r > 0.001);
        let ao = clamp(mix(1.0, rawAO, layerParams.aoIntensity), 0.2, 1.0);

        blendedAlbedo += layerAlbedoSample * layerW;
        blendedNormalTangent += layerNormalSample * layerW;
        blendedRoughness += r * layerW;
        blendedMetallic += m * layerW;
        blendedAO += ao * layerW;

        totalLayerWeight += layerW;
    }

    var finalAlbedo = baseAlbedo;
    var finalRoughness = baseRoughness;
    var finalMetallic = baseMetallic;
    var finalAO = baseAO;

    if (activeLayerCount > 0u) {
        if (totalLayerWeight > 0.0001) {
            let invW = 1.0 / totalLayerWeight;
            finalAlbedo = blendedAlbedo * invW;
            let layerBlendNormal = normalize(blendedNormalTangent * invW);
            finalRoughness = blendedRoughness * invW;
            finalMetallic = blendedMetallic * invW;
            finalAO = blendedAO * invW;
            N = perturbNormalOrthonormal(N, layerBlendNormal);
        } else {
            let layer0Params = uniforms.layerParams[0];
            let layer0UV = worldTileUV * layer0Params.uvScale + layer0Params.uvOffset;
            var layer0Albedo: vec3<f32>;
            var layer0ORM: vec4<f32>;
            var layer0Normal: vec3<f32>;

            if (layer0Params.stochasticTiling > 0.5) {
                let stScale = select(1.0, layer0Params.stochasticScale, layer0Params.stochasticScale > 0.0);
                let stResult = sampleLayerStochasticLevel(layer0UV, 0, stScale, layer0Params.normalIntensity);
                layer0Albedo = stResult.albedo;
                layer0ORM = stResult.orm;
                layer0Normal = stResult.normal;
            } else {
                layer0Albedo = textureSampleLevel(layerBaseColorArray, vbtTextureSampler, layer0UV, 0, 0.0).rgb;
                layer0ORM = textureSampleLevel(layerORMArray, vbtTextureSampler, layer0UV, 0, 0.0);
                let layer0NormalRaw = textureSampleLevel(layerNormalArray, vbtTextureSampler, layer0UV, 0, 0.0).rgb * 2.0 - vec3<f32>(1.0);
                layer0Normal = vec3<f32>(layer0NormalRaw.xy * layer0Params.normalIntensity, max(0.01, layer0NormalRaw.z));
            }

            finalAlbedo = layer0Albedo;
            finalRoughness = layer0Params.roughness * layer0ORM.g;
            finalMetallic = layer0Params.metallic * layer0ORM.b;
            let rawAO = select(1.0, layer0ORM.r, layer0ORM.r > 0.001);
            finalAO = clamp(mix(1.0, rawAO, layer0Params.aoIntensity), 0.2, 1.0);

            N = perturbNormalOrthonormal(N, layer0Normal);
        }
    }

    let storeCoord = vec2<i32>(atlasPixelX, atlasPixelZ);

    textureStore(vbtBaseColorOutput, storeCoord, vec4<f32>(finalAlbedo, 1.0));

    let encodedFinalN = N * 0.5 + vec3<f32>(0.5);
    textureStore(vbtNormalOutput, storeCoord, vec4<f32>(encodedFinalN, 1.0));

    textureStore(vbtORMOutput, storeCoord, vec4<f32>(finalAO, finalRoughness, finalMetallic, 1.0));
}
