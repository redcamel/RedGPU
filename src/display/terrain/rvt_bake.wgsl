// ============================================================================
// TerrainRVT Bake Shader
// [KO] 4종 레이어 Height-Blend 결과를 RVT 아틀라스 타일에 베이킹하는 전용 셰이더
// [EN] Dedicated shader for baking 4-layer Height-Blend result into RVT atlas tiles
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
    pad0: f32,
    // 레이어별 roughnessFactor
    grassRoughnessFactor:  f32,
    sandRoughnessFactor:   f32,
    rockRoughnessFactor:   f32,
    gravelRoughnessFactor: f32,
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

// ─── Outputs ──────────────────────────────────────────────────────────────────
struct BakeOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) worldUV: vec2<f32>,
}

// ─── Height-Blend helper ──────────────────────────────────────────────────────
fn getHeightBlendedWeights(
    splatWeights: vec4<f32>,
    layerHeights:  vec4<f32>,
    contrast: f32
) -> vec4<f32> {
    let combined = (layerHeights + vec4<f32>(1.0)) * splatWeights;
    let maxVal   = max(combined.r, max(combined.g, max(combined.b, combined.a)));
    let cp       = pow(contrast, 3.0);
    let sc       = max(1.0 - cp, 0.02) * 2.0;
    let threshold = maxVal - sc;
    let blended   = max(combined - vec4<f32>(threshold), vec4<f32>(0.0));
    let s         = blended.r + blended.g + blended.b + blended.a;
    if (s <= 0.0001) { return splatWeights; }
    return blended / s;
}

// ─── Full-screen triangle vertex shader ──────────────────────────────────────
@vertex
fn vs_main(@builtin(vertex_index) vi: u32) -> BakeOutput {
    // NDC 전체화면 삼각형 (index 0,1,2 → 하나의 삼각형으로 화면 전체 커버)
    var positions = array<vec2<f32>, 3>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>( 3.0, -1.0),
        vec2<f32>(-1.0,  3.0),
    );
    var uvs = array<vec2<f32>, 3>(
        vec2<f32>(0.0, 1.0),
        vec2<f32>(2.0, 1.0),
        vec2<f32>(0.0, -1.0),
    );

    var out: BakeOutput;
    let ndcPos = positions[vi];
    let rawUV  = uvs[vi];

    // 이 타일이 담당하는 월드 UV 범위로 변환
    let worldUV = bakeUniforms.worldUVOffset + rawUV * bakeUniforms.worldUVScale;

    out.position = vec4<f32>(ndcPos, 0.0, 1.0);
    out.worldUV  = worldUV;
    return out;
}

// ─── Albedo bake fragment shader (Unreal Engine Landscape LayerBlend 방식) ────
struct AlbedoOutput {
    @location(0) albedo: vec4<f32>,
}

@fragment
fn fs_albedo(in: BakeOutput) -> AlbedoOutput {
    let wUV     = in.worldUV;
    let tileUV  = wUV * bakeUniforms.tileScale;

    // 언리얼 엔진 랜드스케이프 디테일 레이어 텍스처 샘플링 (sRGB Diffuse)
    let d0 = textureSample(diffuseArray, texSampler, tileUV, 0i);
    let d1 = textureSample(diffuseArray, texSampler, tileUV, 1i);
    let d2 = textureSample(diffuseArray, texSampler, tileUV, 2i);
    let d3 = textureSample(diffuseArray, texSampler, tileUV, 3i);

    // Height 샘플링 (HeightBlend 용)
    let h0 = pow(clamp(textureSample(heightArray, texSampler, tileUV, 0i).r, 0.0, 1.0), 3.0);
    let h1 = pow(clamp(textureSample(heightArray, texSampler, tileUV, 1i).r, 0.0, 1.0), 3.0);
    let h2 = pow(clamp(textureSample(heightArray, texSampler, tileUV, 2i).r, 0.0, 1.0), 3.0);
    let h3 = pow(clamp(textureSample(heightArray, texSampler, tileUV, 3i).r, 0.0, 1.0), 3.0);
    let layerHeights = vec4<f32>(h0, h1, h2, h3);

    // Splat 가중치 (언리얼 엔진 Landscape WeightBlend 방식과 100% 호환)
    let splat = textureSample(splatTexture, texSampler, wUV);
    var sw = vec4<f32>(splat.r, splat.g, splat.b, splat.a);
    let totalWeightAlbedo = sw.r + sw.g + sw.b + sw.a;
    if (totalWeightAlbedo <= 0.001) {
        // 스플랫 맵 데이터 미선언/미칠해짐 구역 -> 언리얼 엔진과 동일하게 Layer 0 (Base Layer) 100%
        sw = vec4<f32>(1.0, 0.0, 0.0, 0.0);
    } else {
        sw = sw / totalWeightAlbedo;
    }

    // 언리얼 엔진 HeightBlend 가중치 연산
    let w = getHeightBlendedWeights(sw, layerHeights, bakeUniforms.blendContrast);

    // 디테일 레이어 알베도 샘플링
    var layerAlbedo = d0 * w.r + d1 * w.g + d2 * w.b + d3 * w.a;
    // 디테일 레이어가 없거나 emptyArray인 경우 (baseColorTexture 100% 사용을 위해 (1,1,1,1) 폴백)
    if (layerAlbedo.a <= 0.01 || (layerAlbedo.r <= 0.001 && layerAlbedo.g <= 0.001 && layerAlbedo.b <= 0.001)) {
        layerAlbedo = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    }

    // baseColorTexture (지형 전체 기본/글로벌 텍스처)
    var baseColorSample = textureSample(baseColorTexture, texSampler, wUV);
    if (baseColorSample.a <= 0.01 || (baseColorSample.r <= 0.001 && baseColorSample.g <= 0.001 && baseColorSample.b <= 0.001)) {
        baseColorSample = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    }

    var finalAlbedo = layerAlbedo * baseColorSample;
    finalAlbedo.a = 1.0;

    var out: AlbedoOutput;
    out.albedo = finalAlbedo;
    return out;
}

// ─── Normal/ORM bake fragment shader (Unreal Engine Landscape Standard) ──────
struct NormalORMOutput {
    @location(0) normalORM: vec4<f32>,  // xy=normal(oct), z=roughness, w=occlusion
}

@fragment
fn fs_normal_orm(in: BakeOutput) -> NormalORMOutput {
    let wUV     = in.worldUV;
    let tileUV  = wUV * bakeUniforms.tileScale;

    // Height 샘플링 (가중치 계산용)
    let h0 = pow(clamp(textureSample(heightArray, texSampler, tileUV, 0i).r, 0.0, 1.0), 3.0);
    let h1 = pow(clamp(textureSample(heightArray, texSampler, tileUV, 1i).r, 0.0, 1.0), 3.0);
    let h2 = pow(clamp(textureSample(heightArray, texSampler, tileUV, 2i).r, 0.0, 1.0), 3.0);
    let h3 = pow(clamp(textureSample(heightArray, texSampler, tileUV, 3i).r, 0.0, 1.0), 3.0);
    let layerHeights = vec4<f32>(h0, h1, h2, h3);

    let splat = textureSample(splatTexture, texSampler, wUV);
    var sw = vec4<f32>(splat.r, splat.g, splat.b, splat.a);
    let totalWeightNormal = sw.r + sw.g + sw.b + sw.a;
    if (totalWeightNormal <= 0.001) {
        sw = vec4<f32>(1.0, 0.0, 0.0, 0.0);
    } else {
        sw = sw / totalWeightNormal;
    }
    let w = getHeightBlendedWeights(sw, layerHeights, bakeUniforms.blendContrast);

    // Normal 블렌딩 (언리얼 규격 Octahedral Normal / Tangent Normal Blend)
    let n0 = textureSample(normalArray, texSampler, tileUV, 0i).rg;
    let n1 = textureSample(normalArray, texSampler, tileUV, 1i).rg;
    let n2 = textureSample(normalArray, texSampler, tileUV, 2i).rg;
    let n3 = textureSample(normalArray, texSampler, tileUV, 3i).rg;
    var blendedNormal = n0 * w.r + n1 * w.g + n2 * w.b + n3 * w.a;
    // 디테일 레이어 노멀이 없는 경우 기본 평평한 노멀 (0.5, 0.5)
    if (blendedNormal.r <= 0.001 && blendedNormal.g <= 0.001) {
        blendedNormal = vec2<f32>(0.5, 0.5);
    }

    // ORM 블렌딩
    let o0 = textureSample(ormArray, texSampler, tileUV, 0i);
    let o1 = textureSample(ormArray, texSampler, tileUV, 1i);
    let o2 = textureSample(ormArray, texSampler, tileUV, 2i);
    let o3 = textureSample(ormArray, texSampler, tileUV, 3i);
    var blendedORM = o0 * w.r + o1 * w.g + o2 * w.b + o3 * w.a;
    if (blendedORM.a <= 0.01 || (blendedORM.r <= 0.001 && blendedORM.g <= 0.001)) {
        blendedORM = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    }

    let layerRoughness =
        bakeUniforms.grassRoughnessFactor  * w.r +
        bakeUniforms.sandRoughnessFactor   * w.g +
        bakeUniforms.rockRoughnessFactor   * w.b +
        bakeUniforms.gravelRoughnessFactor * w.a;

    // ormTexture (지형 전체 글로벌 ORM/AO 맵 안전 적용)
    var globalORM = textureSample(ormTexture, texSampler, wUV);
    if (globalORM.a <= 0.01 || (globalORM.r <= 0.001 && globalORM.g <= 0.001 && globalORM.b <= 0.001)) {
        globalORM = vec4<f32>(1.0, 1.0, 1.0, 1.0);
    }

    let finalRoughness = clamp(blendedORM.g * layerRoughness * globalORM.g, 0.04, 1.0);
    let finalOcclusion = clamp(blendedORM.r * globalORM.r, 0.0, 1.0);

    var out: NormalORMOutput;
    out.normalORM = vec4<f32>(blendedNormal, finalRoughness, finalOcclusion);
    return out;
}
