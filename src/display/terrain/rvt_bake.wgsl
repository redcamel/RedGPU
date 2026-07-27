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

// ─── Albedo bake fragment shader ──────────────────────────────────────────────
struct AlbedoOutput {
    @location(0) albedo: vec4<f32>,
}

@fragment
fn fs_albedo(in: BakeOutput) -> AlbedoOutput {
    let wUV      = in.worldUV;
    let tileUV   = wUV * bakeUniforms.tileScale;
    let macroUV  = wUV * bakeUniforms.macroScale;

    // 카메라-독립 매크로 블렌드: 베이킹 시에는 항상 중간값(0.5)으로 고정
    let macroBlend = 0.5;

    // Diffuse 샘플링
    let d0 = mix(textureSample(diffuseArray, texSampler, tileUV, 0i), textureSample(diffuseArray, texSampler, macroUV, 0i), macroBlend);
    let d1 = mix(textureSample(diffuseArray, texSampler, tileUV, 1i), textureSample(diffuseArray, texSampler, macroUV, 1i), macroBlend);
    let d2 = mix(textureSample(diffuseArray, texSampler, tileUV, 2i), textureSample(diffuseArray, texSampler, macroUV, 2i), macroBlend);
    let d3 = mix(textureSample(diffuseArray, texSampler, tileUV, 3i), textureSample(diffuseArray, texSampler, macroUV, 3i), macroBlend);

    // Height 샘플링
    let h0 = pow(clamp(mix(textureSample(heightArray, texSampler, tileUV, 0i).r, textureSample(heightArray, texSampler, macroUV, 0i).r, macroBlend), 0.0, 1.0), 3.0);
    let h1 = pow(clamp(mix(textureSample(heightArray, texSampler, tileUV, 1i).r, textureSample(heightArray, texSampler, macroUV, 1i).r, macroBlend), 0.0, 1.0), 3.0);
    let h2 = pow(clamp(mix(textureSample(heightArray, texSampler, tileUV, 2i).r, textureSample(heightArray, texSampler, macroUV, 2i).r, macroBlend), 0.0, 1.0), 3.0);
    let h3 = pow(clamp(mix(textureSample(heightArray, texSampler, tileUV, 3i).r, textureSample(heightArray, texSampler, macroUV, 3i).r, macroBlend), 0.0, 1.0), 3.0);
    let layerHeights = vec4<f32>(h0, h1, h2, h3);

    // Splat 가중치
    let splat = textureSample(splatTexture, texSampler, wUV);
    var sw = vec4<f32>(splat.r, splat.g, splat.b, splat.a);
    if (sw.r + sw.g + sw.b + sw.a <= 0.1) { sw = vec4<f32>(1.0, 0.0, 0.0, 0.0); }
    else {
        let sa = select(splat.a, max(0.0, 1.0 - (splat.r + splat.g + splat.b)), splat.a == 1.0);
        sw = vec4<f32>(splat.r, splat.g, splat.b, sa);
    }

    let w = getHeightBlendedWeights(sw, layerHeights, bakeUniforms.blendContrast);
    let finalAlbedo = d0 * w.r + d1 * w.g + d2 * w.b + d3 * w.a;

    var out: AlbedoOutput;
    out.albedo = finalAlbedo;
    return out;
}

// ─── Normal/ORM bake fragment shader ─────────────────────────────────────────
struct NormalORMOutput {
    @location(0) normalORM: vec4<f32>,  // xy=normal(oct), z=roughness, w=occlusion
}

@fragment
fn fs_normal_orm(in: BakeOutput) -> NormalORMOutput {
    let wUV     = in.worldUV;
    let tileUV  = wUV * bakeUniforms.tileScale;
    let macroUV = wUV * bakeUniforms.macroScale;
    let macroBlend = 0.5;

    // Height 샘플링 (가중치 계산용)
    let h0 = pow(clamp(mix(textureSample(heightArray, texSampler, tileUV, 0i).r, textureSample(heightArray, texSampler, macroUV, 0i).r, macroBlend), 0.0, 1.0), 3.0);
    let h1 = pow(clamp(mix(textureSample(heightArray, texSampler, tileUV, 1i).r, textureSample(heightArray, texSampler, macroUV, 1i).r, macroBlend), 0.0, 1.0), 3.0);
    let h2 = pow(clamp(mix(textureSample(heightArray, texSampler, tileUV, 2i).r, textureSample(heightArray, texSampler, macroUV, 2i).r, macroBlend), 0.0, 1.0), 3.0);
    let h3 = pow(clamp(mix(textureSample(heightArray, texSampler, tileUV, 3i).r, textureSample(heightArray, texSampler, macroUV, 3i).r, macroBlend), 0.0, 1.0), 3.0);
    let layerHeights = vec4<f32>(h0, h1, h2, h3);

    let splat = textureSample(splatTexture, texSampler, wUV);
    var sw = vec4<f32>(splat.r, splat.g, splat.b, splat.a);
    if (sw.r + sw.g + sw.b + sw.a <= 0.1) { sw = vec4<f32>(1.0, 0.0, 0.0, 0.0); }
    else {
        let sa = select(splat.a, max(0.0, 1.0 - (splat.r + splat.g + splat.b)), splat.a == 1.0);
        sw = vec4<f32>(splat.r, splat.g, splat.b, sa);
    }
    let w = getHeightBlendedWeights(sw, layerHeights, bakeUniforms.blendContrast);

    // Normal 블렌딩 (XY octahedral 방식으로 저장)
    let n0 = mix(textureSample(normalArray, texSampler, tileUV, 0i).rg, textureSample(normalArray, texSampler, macroUV, 0i).rg, macroBlend);
    let n1 = mix(textureSample(normalArray, texSampler, tileUV, 1i).rg, textureSample(normalArray, texSampler, macroUV, 1i).rg, macroBlend);
    let n2 = mix(textureSample(normalArray, texSampler, tileUV, 2i).rg, textureSample(normalArray, texSampler, macroUV, 2i).rg, macroBlend);
    let n3 = mix(textureSample(normalArray, texSampler, tileUV, 3i).rg, textureSample(normalArray, texSampler, macroUV, 3i).rg, macroBlend);
    let blendedNormal = n0 * w.r + n1 * w.g + n2 * w.b + n3 * w.a;

    // ORM 블렌딩
    let o0 = mix(textureSample(ormArray, texSampler, tileUV, 0i), textureSample(ormArray, texSampler, macroUV, 0i), macroBlend);
    let o1 = mix(textureSample(ormArray, texSampler, tileUV, 1i), textureSample(ormArray, texSampler, macroUV, 1i), macroBlend);
    let o2 = mix(textureSample(ormArray, texSampler, tileUV, 2i), textureSample(ormArray, texSampler, macroUV, 2i), macroBlend);
    let o3 = mix(textureSample(ormArray, texSampler, tileUV, 3i), textureSample(ormArray, texSampler, macroUV, 3i), macroBlend);
    let blendedORM = o0 * w.r + o1 * w.g + o2 * w.b + o3 * w.a;

    let layerRoughness =
        bakeUniforms.grassRoughnessFactor  * w.r +
        bakeUniforms.sandRoughnessFactor   * w.g +
        bakeUniforms.rockRoughnessFactor   * w.b +
        bakeUniforms.gravelRoughnessFactor * w.a;

    let finalRoughness  = max(blendedORM.g * layerRoughness, layerRoughness * 0.5);
    let finalOcclusion  = blendedORM.r;

    var out: NormalORMOutput;
    // RG = blended normal XY (encoded 0~1), B = roughness, A = occlusion
    out.normalORM = vec4<f32>(blendedNormal, finalRoughness, finalOcclusion);
    return out;
}
