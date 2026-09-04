#redgpu_include SYSTEM_UNIFORM;
#redgpu_include systemStruct.OutputFragment;

@group(2) @binding(1) var baseColorTextureSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) uv1: vec2<f32>,
    @location(4) vertexColor_0: vec4<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(6) instanceRotQuat: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(10) localNodeScale_volumeScale: vec2<f32>,
    @location(11) combinedOpacity: f32,

    @location(12) motionVector: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

fn dirToHemiOctahedralUV(dir: vec3<f32>) -> vec2<f32> {
    let d = normalize(vec3<f32>(dir.x, max(dir.y, 0.0), dir.z));
    let l1 = abs(d.x) + d.y + abs(d.z);
    let invL1 = select(1.0 / l1, 1.0, l1 < 0.0001);
    let u = (d.x + d.z) * 0.5 * invL1 + 0.5;
    let v = (d.z - d.x) * 0.5 * invL1 + 0.5;
    return clamp(vec2<f32>(u, v), vec2<f32>(0.0), vec2<f32>(1.0));
}

// 🚀 [최적화 P0 / Step 20 - 옥타헤드럴 64개 격자 방향/각도 LUT 테이블화]
// 8x8 = 64개 옥타헤드럴 타일 중심 3D 방향 벡터 사전 계산 LUT (매 픽셀 역투영/정규화 연산 100% 제거)
const OCT_GRID_DIRS: array<vec3<f32>, 64> = array<vec3<f32>, 64>(
    vec3<f32>(0.0000000, 0.1414214, -0.9899495),
    vec3<f32>(0.1622214, 0.1622214, -0.9733285),
    vec3<f32>(0.3651484, 0.1825742, -0.9128709),
    vec3<f32>(0.5883484, 0.1961161, -0.7844645),
    vec3<f32>(0.7844645, 0.1961161, -0.5883484),
    vec3<f32>(0.9128709, 0.1825742, -0.3651484),
    vec3<f32>(0.9733285, 0.1622214, -0.1622214),
    vec3<f32>(0.9899495, 0.1414214, 0.0000000),
    vec3<f32>(-0.1622214, 0.1622214, -0.9733285),
    vec3<f32>(0.0000000, 0.3713907, -0.9284767),
    vec3<f32>(0.2182179, 0.4364358, -0.8728716),
    vec3<f32>(0.4850713, 0.4850713, -0.7276069),
    vec3<f32>(0.7276069, 0.4850713, -0.4850713),
    vec3<f32>(0.8728716, 0.4364358, -0.2182179),
    vec3<f32>(0.9284767, 0.3713907, 0.0000000),
    vec3<f32>(0.9733285, 0.1622214, 0.1622214),
    vec3<f32>(-0.3651484, 0.1825742, -0.9128709),
    vec3<f32>(-0.2182179, 0.4364358, -0.8728716),
    vec3<f32>(0.0000000, 0.7071068, -0.7071068),
    vec3<f32>(0.2672612, 0.8017837, -0.5345225),
    vec3<f32>(0.5345225, 0.8017837, -0.2672612),
    vec3<f32>(0.7071068, 0.7071068, 0.0000000),
    vec3<f32>(0.8728716, 0.4364358, 0.2182179),
    vec3<f32>(0.9128709, 0.1825742, 0.3651484),
    vec3<f32>(-0.5883484, 0.1961161, -0.7844645),
    vec3<f32>(-0.4850713, 0.4850713, -0.7276069),
    vec3<f32>(-0.2672612, 0.8017837, -0.5345225),
    vec3<f32>(0.0000000, 0.9701425, -0.2425356),
    vec3<f32>(0.2425356, 0.9701425, 0.0000000),
    vec3<f32>(0.5345225, 0.8017837, 0.2672612),
    vec3<f32>(0.7276069, 0.4850713, 0.4850713),
    vec3<f32>(0.7844645, 0.1961161, 0.5883484),
    vec3<f32>(-0.7844645, 0.1961161, -0.5883484),
    vec3<f32>(-0.7276069, 0.4850713, -0.4850713),
    vec3<f32>(-0.5345225, 0.8017837, -0.2672612),
    vec3<f32>(-0.2425356, 0.9701425, 0.0000000),
    vec3<f32>(0.0000000, 0.9701425, 0.2425356),
    vec3<f32>(0.2672612, 0.8017837, 0.5345225),
    vec3<f32>(0.4850713, 0.4850713, 0.7276069),
    vec3<f32>(0.5883484, 0.1961161, 0.7844645),
    vec3<f32>(-0.9128709, 0.1825742, -0.3651484),
    vec3<f32>(-0.8728716, 0.4364358, -0.2182179),
    vec3<f32>(-0.7071068, 0.7071068, 0.0000000),
    vec3<f32>(-0.5345225, 0.8017837, 0.2672612),
    vec3<f32>(-0.2672612, 0.8017837, 0.5345225),
    vec3<f32>(0.0000000, 0.7071068, 0.7071068),
    vec3<f32>(0.2182179, 0.4364358, 0.8728716),
    vec3<f32>(0.3651484, 0.1825742, 0.9128709),
    vec3<f32>(-0.9733285, 0.1622214, -0.1622214),
    vec3<f32>(-0.9284767, 0.3713907, 0.0000000),
    vec3<f32>(-0.8728716, 0.4364358, 0.2182179),
    vec3<f32>(-0.7276069, 0.4850713, 0.4850713),
    vec3<f32>(-0.4850713, 0.4850713, 0.7276069),
    vec3<f32>(-0.2182179, 0.4364358, 0.8728716),
    vec3<f32>(0.0000000, 0.3713907, 0.9284767),
    vec3<f32>(0.1622214, 0.1622214, 0.9733285),
    vec3<f32>(-0.9899495, 0.1414214, 0.0000000),
    vec3<f32>(-0.9733285, 0.1622214, 0.1622214),
    vec3<f32>(-0.9128709, 0.1825742, 0.3651484),
    vec3<f32>(-0.7844645, 0.1961161, 0.5883484),
    vec3<f32>(-0.5883484, 0.1961161, 0.7844645),
    vec3<f32>(-0.3651484, 0.1825742, 0.9128709),
    vec3<f32>(-0.1622214, 0.1622214, 0.9733285),
    vec3<f32>(0.0000000, 0.1414214, 0.9899495)
);

// 8x8 = 64개 옥타헤드럴 타일의 [수평 회전각(angleG), 수평 길이(lenGH)] 사전 계산 LUT (매 픽셀 atan2/length 100% 제거)
const OCT_GRID_ANGLE_LEN: array<vec2<f32>, 64> = array<vec2<f32>, 64>(
    vec2<f32>(-1.5707963, 0.9899495),
    vec2<f32>(-1.4056476, 0.9867545),
    vec2<f32>(-1.1902899, 0.9831921),
    vec2<f32>(-0.9272952, 0.9805807),
    vec2<f32>(-0.6435011, 0.9805807),
    vec2<f32>(-0.3805064, 0.9831921),
    vec2<f32>(-0.1651487, 0.9867545),
    vec2<f32>(0.0000000, 0.9899495),
    vec2<f32>(-1.7359451, 0.9867545),
    vec2<f32>(-1.5707963, 0.9284767),
    vec2<f32>(-1.3258177, 0.8997354),
    vec2<f32>(-0.9827937, 0.8744746),
    vec2<f32>(-0.5880026, 0.8744746),
    vec2<f32>(-0.2449787, 0.8997354),
    vec2<f32>(0.0000000, 0.9284767),
    vec2<f32>(0.1651487, 0.9867545),
    vec2<f32>(-1.9513028, 0.9831921),
    vec2<f32>(-1.8157750, 0.8997354),
    vec2<f32>(-1.5707963, 0.7071068),
    vec2<f32>(-1.1071487, 0.5976143),
    vec2<f32>(-0.4636476, 0.5976143),
    vec2<f32>(0.0000000, 0.7071068),
    vec2<f32>(0.2449787, 0.8997354),
    vec2<f32>(0.3805064, 0.9831921),
    vec2<f32>(-2.2142974, 0.9805807),
    vec2<f32>(-2.1587989, 0.8744746),
    vec2<f32>(-2.0344439, 0.5976143),
    vec2<f32>(-1.5707963, 0.2425356),
    vec2<f32>(0.0000000, 0.2425356),
    vec2<f32>(0.4636476, 0.5976143),
    vec2<f32>(0.5880026, 0.8744746),
    vec2<f32>(0.6435011, 0.9805807),
    vec2<f32>(-2.4980915, 0.9805807),
    vec2<f32>(-2.5535901, 0.8744746),
    vec2<f32>(-2.6779450, 0.5976143),
    vec2<f32>(3.1415927, 0.2425356),
    vec2<f32>(1.5707963, 0.2425356),
    vec2<f32>(1.1071487, 0.5976143),
    vec2<f32>(0.9827937, 0.8744746),
    vec2<f32>(0.9272952, 0.9805807),
    vec2<f32>(-2.7610863, 0.9831921),
    vec2<f32>(-2.8966139, 0.8997354),
    vec2<f32>(3.1415927, 0.7071068),
    vec2<f32>(2.6779450, 0.5976143),
    vec2<f32>(2.0344439, 0.5976143),
    vec2<f32>(1.5707963, 0.7071068),
    vec2<f32>(1.3258177, 0.8997354),
    vec2<f32>(1.1902899, 0.9831921),
    vec2<f32>(-2.9764439, 0.9867545),
    vec2<f32>(3.1415927, 0.9284767),
    vec2<f32>(2.8966139, 0.8997354),
    vec2<f32>(2.5535901, 0.8744746),
    vec2<f32>(2.1587989, 0.8744746),
    vec2<f32>(1.8157750, 0.8997354),
    vec2<f32>(1.5707963, 0.9284767),
    vec2<f32>(1.4056476, 0.9867545),
    vec2<f32>(3.1415927, 0.9899495),
    vec2<f32>(2.9764439, 0.9867545),
    vec2<f32>(2.7610863, 0.9831921),
    vec2<f32>(2.4980915, 0.9805807),
    vec2<f32>(2.2142974, 0.9805807),
    vec2<f32>(1.9513028, 0.9831921),
    vec2<f32>(1.7359451, 0.9867545),
    vec2<f32>(1.5707963, 0.9899495)
);

fn getSubTileRotatedUVLUT(p: vec2<f32>, lenVH: f32, angleV: f32, gridIdx: u32) -> vec2<f32> {
    let angleLen = OCT_GRID_ANGLE_LEN[gridIdx];
    let angleG = angleLen.x;
    let lenGH = angleLen.y;

    var rotAngle = 0.0;
    if (lenVH > 0.01 && lenGH > 0.01) {
        var diff = angleV - angleG;
        diff = diff - floor((diff + 3.14159265) * 0.15915494) * 6.2831853;

        let poleFade = clamp(min(lenVH, lenGH) * 5.0, 0.0, 1.0);
        rotAngle = diff * poleFade;
    }

    let c = cos(rotAngle);
    let s = sin(rotAngle);
    let rotatedP = vec2<f32>(p.x * c - p.y * s, p.x * s + p.y * c);
    return rotatedP + vec2<f32>(0.5);
}

fn sampleOctahedralAtlas(
    tex: texture_2d<f32>,
    smp: sampler,
    gridCoords: vec2<f32>,
    subUV: vec2<f32>,
    n: f32,
    ddx: vec2<f32>,
    ddy: vec2<f32>
) -> vec4<f32> {
    let isInside = (subUV.x >= 0.0 && subUV.x <= 1.0 && subUV.y >= 0.0 && subUV.y <= 1.0);
    let clampedGrid = clamp(gridCoords, vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let oneTexelInTile = 1.0 / 256.0;
    let safeSubUV = clamp(subUV, vec2<f32>(oneTexelInTile), vec2<f32>(1.0 - oneTexelInTile));
    let atlasUV = (clampedGrid + safeSubUV) / n;

    let sampled = textureSampleGrad(tex, smp, atlasUV, ddx, ddy);
    return select(vec4<f32>(0.0), sampled, isInside);
}

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;

    let camPos = systemUniforms.camera.cameraPosition.xyz;
    var localView = inputData.vertexTangent.xyz;
    if (inputData.vertexTangent.w > -500.0) {
        localView = normalize(camPos - inputData.vertexPosition);
    }

    let n = 8.0;
    let octUV = dirToHemiOctahedralUV(localView);

    let gridPos = octUV * n - 0.5;
    let baseGrid = floor(gridPos);
    let frac = gridPos - baseGrid;

    let g00 = clamp(baseGrid + vec2<f32>(0.0, 0.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let g10 = clamp(baseGrid + vec2<f32>(1.0, 0.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let g01 = clamp(baseGrid + vec2<f32>(0.0, 1.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let g11 = clamp(baseGrid + vec2<f32>(1.0, 1.0), vec2<f32>(0.0), vec2<f32>(n - 1.0));

    let idx00 = u32(g00.y) * 8u + u32(g00.x);
    let idx10 = u32(g10.y) * 8u + u32(g10.x);
    let idx01 = u32(g01.y) * 8u + u32(g01.x);
    let idx11 = u32(g11.y) * 8u + u32(g11.x);

    // 🚀 [최적화 P0 / Step 20 - 옥타헤드럴 LUT 룩업]
    // 64개 정적 LUT 테이블을 통해 매 픽셀 hemiOctahedralUVToDir(역투영 4회) 및 atan2(초월함수 4회), length(제곱근 4회)를 100% 제거!
    let pQuad = inputData.uv - vec2<f32>(0.5);
    let viewH = vec2<f32>(localView.x, localView.z);
    let lenVH = length(viewH);
    var angleV = 0.0;
    if (lenVH > 0.01) {
        angleV = atan2(localView.z, localView.x);
    }

    let uv00 = getSubTileRotatedUVLUT(pQuad, lenVH, angleV, idx00);
    let uv10 = getSubTileRotatedUVLUT(pQuad, lenVH, angleV, idx10);
    let uv01 = getSubTileRotatedUVLUT(pQuad, lenVH, angleV, idx01);
    let uv11 = getSubTileRotatedUVLUT(pQuad, lenVH, angleV, idx11);

    let ddxUV = dpdx(inputData.uv);
    let ddyUV = dpdy(inputData.uv);
    let ddxAtlas = ddxUV / n;
    let ddyAtlas = ddyUV / n;

    let s00 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g00, uv00, n, ddxAtlas, ddyAtlas);
    let s10 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g10, uv10, n, ddxAtlas, ddyAtlas);
    let s01 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g01, uv01, n, ddxAtlas, ddyAtlas);
    let s11 = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, g11, uv11, n, ddxAtlas, ddyAtlas);

    let w00 = (1.0 - frac.x) * (1.0 - frac.y);
    let w10 = frac.x * (1.0 - frac.y);
    let w01 = (1.0 - frac.x) * frac.y;
    let w11 = frac.x * frac.y;

    let cov00 = w00 * s00.a;
    let cov10 = w10 * s10.a;
    let cov01 = w01 * s01.a;
    let cov11 = w11 * s11.a;
    let totalCoverage = cov00 + cov10 + cov01 + cov11;

    // 🚀 [최적화 P0 / Step 6] 완전 투명 픽셀(공기) 즉시 탈출 (ALU 0ms)
    if (totalCoverage < 0.001) {
        discard;
    }

    let fadeOpacity = inputData.combinedOpacity;
    if (fadeOpacity < 0.999) {
        let px = u32(inputData.position.x) & 3u;
        let py = u32(inputData.position.y) & 3u;
        let idx = (py << 2u) | px;
        let packed = select(0x6E4C2A80u, 0x5D7F91B3u, idx >= 8u);
        let threshold = f32((packed >> ((idx & 7u) * 4u)) & 0xFu) * 0.0625;
        if (fadeOpacity < threshold) {
            discard;
        }
    }

    let linearAlpha = totalCoverage;
    let maxAlpha = max(max(s00.a, s10.a), max(s01.a, s11.a));
    let maxCornerWeight = max(max(w00, w10), max(w01, w11));
    let sharpnessFactor = clamp((maxCornerWeight - 0.25) / 0.75, 0.0, 1.0);
    let reconstructedAlpha = mix(linearAlpha, maxAlpha, mix(0.70, 0.95, sharpnessFactor));

    let px = u32(inputData.position.x) & 3u;
    let py = u32(inputData.position.y) & 3u;
    let frameIdx = systemUniforms.time.frameIndex & 3u;
    let ditherIdx = (((py ^ frameIdx) << 2u) | (px ^ frameIdx)) & 15u;
    let bayerPacked = select(0x6E4C2A80u, 0x5D7F91B3u, ditherIdx >= 8u);
    let ditherThreshold = f32((bayerPacked >> ((ditherIdx & 7u) * 4u)) & 0xFu) * 0.0625;

    let dynamicCutOff = mix(0.20, 0.55, ditherThreshold);
    if (reconstructedAlpha <= dynamicCutOff) {
        discard;
    }

    return output;
}

// 🚀 [최적화 P1 / Step 18] 경량 섀도우 버텍스 출력(FoliageShadowOutput)에 일치하는 ShadowInputData 정의
struct ShadowInputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(5) vertexTangent: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,
    @location(11) combinedOpacity: f32,
};

@fragment
fn shadowMain(inputData: ShadowInputData) {
    let camPos = systemUniforms.camera.cameraPosition.xyz;
    var localView = inputData.vertexTangent.xyz;
    if (inputData.vertexTangent.w > -500.0) {
        localView = normalize(camPos - inputData.vertexPosition);
    }

    let n = 8.0;
    let octUV = dirToHemiOctahedralUV(localView);

    // 🚀 [최적화 P1 / Step 7 - Dominant 1-Tap 다이어트 & LUT 적용]
    // 그림자 맵은 광원 방향의 실루엣만 굽는 패스이므로, 대표 각도 1개만 샘플링하여 회전 삼각함수 및 텍스처 호출 75% 삭감!
    let dominantGrid = clamp(floor(octUV * n), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let idxDom = u32(dominantGrid.y) * 8u + u32(dominantGrid.x);
    let pQuad = inputData.uv - vec2<f32>(0.5);
    let viewH = vec2<f32>(localView.x, localView.z);
    let lenVH = length(viewH);
    var angleV = 0.0;
    if (lenVH > 0.01) {
        angleV = atan2(localView.z, localView.x);
    }
    let uvDom = getSubTileRotatedUVLUT(pQuad, lenVH, angleV, idxDom);

    let ddxUV = dpdx(inputData.uv);
    let ddyUV = dpdy(inputData.uv);
    let ddxAtlas = ddxUV / n;
    let ddyAtlas = ddyUV / n;

    let sDom = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, dominantGrid, uvDom, n, ddxAtlas, ddyAtlas);

    let alpha = sDom.a;
    if (alpha <= 0.20) {
        discard;
    }
}
