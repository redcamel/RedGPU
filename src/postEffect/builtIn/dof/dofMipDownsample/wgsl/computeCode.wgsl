const TENT_WEIGHTS = array<f32, 4>(1.0, 3.0, 3.0, 1.0);

let dstCoord = vec2<i32>(global_id.xy);
let srcDims = vec2<i32>(textureDimensions(sourceTexture));
let maxSrcCoord = max(srcDims - vec2<i32>(1), vec2<i32>(0));
let baseCoord = dstCoord * 2;

let xs = array<i32, 4>(
    clamp(baseCoord.x - 1, 0, maxSrcCoord.x),
    clamp(baseCoord.x, 0, maxSrcCoord.x),
    clamp(baseCoord.x + 1, 0, maxSrcCoord.x),
    clamp(baseCoord.x + 2, 0, maxSrcCoord.x)
);
let ys = array<i32, 4>(
    clamp(baseCoord.y - 1, 0, maxSrcCoord.y),
    clamp(baseCoord.y, 0, maxSrcCoord.y),
    clamp(baseCoord.y + 1, 0, maxSrcCoord.y),
    clamp(baseCoord.y + 2, 0, maxSrcCoord.y)
);

// [KO] 중심 2x2 쿼드를 1회만 선행 로드하여 전후 차폐 우선 대표 CoC(refCoC)를 산출하고 4x4 루프에서 재사용 (20회 -> 16회 페치)
// [EN] Pre-load the center 2x2 quad once to compute front-occluding reference CoC (refCoC) and reuse inside the 4x4 loop (20 -> 16 fetches)
let s11 = textureLoad(sourceTexture, vec2<i32>(xs[1], ys[1]), 0);
let s21 = textureLoad(sourceTexture, vec2<i32>(xs[2], ys[1]), 0);
let s12 = textureLoad(sourceTexture, vec2<i32>(xs[1], ys[2]), 0);
let s22 = textureLoad(sourceTexture, vec2<i32>(xs[2], ys[2]), 0);

let minCenterCoC = min(min(s11.a, s21.a), min(s12.a, s22.a));
let maxCenterCoC = max(max(s11.a, s21.a), max(s12.a, s22.a));
let fgDominance = smoothstep(0.15, 0.55, -minCenterCoC);
let bgDominance = (1.0 - fgDominance) * smoothstep(0.15, 0.55, maxCenterCoC);
let focusDominance = max(0.0, 1.0 - fgDominance - bgDominance);
let centerAvgCoC = (s11.a + s21.a + s12.a + s22.a) * 0.25;
let refCoC = mix(mix(centerAvgCoC, maxCenterCoC, bgDominance), minCenterCoC, fgDominance);
let cocBandwidth = max(abs(refCoC) * 0.5, 0.5);

var sumColor = vec3<f32>(0.0);
var sumCoC: f32 = 0.0;
var sumWeight: f32 = 0.0;
var sumCoCWeight: f32 = 0.0;

// [KO] 4x4 이산 B-Spline/Tent 커널([1, 3, 3, 1]) 샘플링 및 전·배경 레이어 분리·상대 CoC 반경 가중치로 경계 번짐과 계단 현상을 동시 억제
// [EN] 4x4 discrete B-Spline/Tent kernel ([1, 3, 3, 1]) sampling with foreground/background layer separation and relative CoC radius weighting to suppress both boundary bleeding and stair-stepping
for (var ky = 0; ky < 4; ky = ky + 1) {
    let wy = TENT_WEIGHTS[ky];
    let sy = ys[ky];

    for (var kx = 0; kx < 4; kx = kx + 1) {
        let wx = TENT_WEIGHTS[kx];
        var s: vec4<f32>;
        if (ky == 1 && kx == 1) {
            s = s11;
        } else if (ky == 1 && kx == 2) {
            s = s21;
        } else if (ky == 2 && kx == 1) {
            s = s12;
        } else if (ky == 2 && kx == 2) {
            s = s22;
        } else {
            s = textureLoad(sourceTexture, vec2<i32>(xs[kx], sy), 0);
        }

        let spatialW = wx * wy;
        let isFgSample = smoothstep(0.10, 0.45, -s.a);
        let isBgSample = smoothstep(0.10, 0.45, s.a);
        let isFocusSample = 1.0 - max(isFgSample, isBgSample);
        let layerGate = max(
            fgDominance * isFgSample + bgDominance * isBgSample + focusDominance * isFocusSample,
            1e-4
        );
        let normCoCDiff = abs(s.a - refCoC) / cocBandwidth;
        let cocDistWeight = 1.0 / (1.0 + normCoCDiff * normCoCDiff);

        let w = spatialW * layerGate * cocDistWeight;
        sumColor += s.rgb * w;
        sumWeight += w;
        sumCoC += s.a * w;
        sumCoCWeight += w;
    }
}

let invW = 1.0 / max(sumWeight, 1e-5);
let invCoCW = 1.0 / max(sumCoCWeight, 1e-5);
textureStore(outputTexture, global_id.xy, vec4<f32>(sumColor * invW, sumCoC * invCoCW));
