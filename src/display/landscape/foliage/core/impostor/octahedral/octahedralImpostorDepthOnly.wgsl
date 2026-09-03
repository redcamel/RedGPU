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

fn hemiOctahedralUVToDir(uv: vec2<f32>) -> vec3<f32> {
    let uPrime = 2.0 * uv.x - 1.0;
    let vPrime = 2.0 * uv.y - 1.0;
    let dirX = (uPrime - vPrime) * 0.5;
    let dirZ = (uPrime + vPrime) * 0.5;
    let dirY = max(1.0 - (abs(dirX) + abs(dirZ)), 0.0);
    return normalize(vec3<f32>(dirX, dirY, dirZ));
}

fn getSubTileRotatedUVFast(p: vec2<f32>, lenVH: f32, angleV: f32, gridDir: vec3<f32>) -> vec2<f32> {
    let gridH = vec2<f32>(gridDir.x, gridDir.z);
    let lenGH = length(gridH);

    var rotAngle = 0.0;
    if (lenVH > 0.01 && lenGH > 0.01) {
        let angleG = atan2(gridDir.z, gridDir.x);
        var diff = angleV - angleG;
        
        diff = diff - floor((diff + 3.14159265) / 6.2831853) * 6.2831853;

        let poleFade = clamp(min(lenVH, lenGH) * 5.0, 0.0, 1.0);
        rotAngle = diff * poleFade;
    }

    let c = cos(rotAngle);
    let s = sin(rotAngle);
    let rotatedP = vec2<f32>(p.x * c - p.y * s, p.x * s + p.y * c);
    return rotatedP + vec2<f32>(0.5);
}

fn getSubTileRotatedUV(quadUV: vec2<f32>, viewDir: vec3<f32>, gridDir: vec3<f32>) -> vec2<f32> {
    let viewH = vec2<f32>(viewDir.x, viewDir.z);
    let gridH = vec2<f32>(gridDir.x, gridDir.z);
    let lenVH = length(viewH);
    let lenGH = length(gridH);

    var rotAngle = 0.0;
    if (lenVH > 0.01 && lenGH > 0.01) {
        let angleV = atan2(viewDir.z, viewDir.x);
        let angleG = atan2(gridDir.z, gridDir.x);
        var diff = angleV - angleG;
        
        diff = diff - floor((diff + 3.14159265) / 6.2831853) * 6.2831853;

        let poleFade = clamp(min(lenVH, lenGH) * 5.0, 0.0, 1.0);
        rotAngle = diff * poleFade;
    }

    let c = cos(rotAngle);
    let s = sin(rotAngle);

    let p = quadUV - vec2<f32>(0.5);
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

    let dir00 = hemiOctahedralUVToDir((g00 + vec2<f32>(0.5)) / n);
    let dir10 = hemiOctahedralUVToDir((g10 + vec2<f32>(0.5)) / n);
    let dir01 = hemiOctahedralUVToDir((g01 + vec2<f32>(0.5)) / n);
    let dir11 = hemiOctahedralUVToDir((g11 + vec2<f32>(0.5)) / n);

    // 🚀 [최적화 P0 / Step 11] localView의 atan2 및 length를 1회만 계산하여 4개 서브타일에서 재사용 (초월함수 연산 75% 절감!)
    let pQuad = inputData.uv - vec2<f32>(0.5);
    let viewH = vec2<f32>(localView.x, localView.z);
    let lenVH = length(viewH);
    var angleV = 0.0;
    if (lenVH > 0.01) {
        angleV = atan2(localView.z, localView.x);
    }

    let uv00 = getSubTileRotatedUVFast(pQuad, lenVH, angleV, dir00);
    let uv10 = getSubTileRotatedUVFast(pQuad, lenVH, angleV, dir10);
    let uv01 = getSubTileRotatedUVFast(pQuad, lenVH, angleV, dir01);
    let uv11 = getSubTileRotatedUVFast(pQuad, lenVH, angleV, dir11);

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

    // 🚀 [최적화 P1 / Step 7 - Dominant 1-Tap 다이어트]
    // 그림자 맵은 광원 방향의 실루엣만 굽는 패스이므로, 대표 각도 1개만 샘플링하여 회전 삼각함수 및 텍스처 호출 75% 삭감!
    let dominantGrid = clamp(floor(octUV * n), vec2<f32>(0.0), vec2<f32>(n - 1.0));
    let dirDom = hemiOctahedralUVToDir((dominantGrid + vec2<f32>(0.5)) / n);
    let uvDom = getSubTileRotatedUV(inputData.uv, localView, dirDom);

    let ddxUV = dpdx(inputData.uv);
    let ddyUV = dpdy(inputData.uv);
    let ddxAtlas = ddxUV / n;
    let ddyAtlas = ddyUV / n;

    let sDom = sampleOctahedralAtlas(baseColorTexture, baseColorTextureSampler, dominantGrid, uvDom, n, ddxAtlas, ddyAtlas);

    let alpha = sDom.a;
    // 🚀 [최적화 P0 / Step 6] 완전 투명 픽셀(공기) 즉시 탈출 (ALU 0ms)
    if (alpha < 0.001) {
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

    if (alpha <= 0.35) {
        discard;
    }
}
