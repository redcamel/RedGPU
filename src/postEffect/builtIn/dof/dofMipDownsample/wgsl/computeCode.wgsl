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
let isFgDomain = minCenterCoC < -0.15;
let isBgDomain = !isFgDomain && (maxCenterCoC > 0.15);

var sumColor = vec3<f32>(0.0);
var sumCoC: f32 = 0.0;
var sumWeight: f32 = 0.0;

// [KO] 4x4 이산 B-Spline/Tent 커널([1, 3, 3, 1]) 샘플링 및 배타적 부호 도메인 게이팅으로 전·배경 양·음수 CoC 상쇄(CoC ≈ 0) 원천 차단
// [EN] 4x4 discrete B-Spline/Tent kernel ([1, 3, 3, 1]) sampling with mutually exclusive sign-domain gating to prevent foreground/background positive/negative CoC cancellation
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
        var layerGate: f32;
        if (isFgDomain) {
            layerGate = select(0.0, smoothstep(-0.05, -0.55, s.a), s.a < -0.05);
        } else if (isBgDomain) {
            layerGate = select(0.0, smoothstep(0.05, 0.55, s.a), s.a > 0.05);
        } else {
            layerGate = 1.0 - smoothstep(0.25, 1.0, abs(s.a));
        }

        let w = spatialW * layerGate;
        sumColor += s.rgb * w;
        sumCoC += s.a * w;
        sumWeight += w;
    }
}

let hasValidSum = sumWeight > 1e-5;
let invW = 1.0 / max(sumWeight, 1e-5);
let outColor = select(s11.rgb, sumColor * invW, hasValidSum);
let outCoC = select(s11.a, sumCoC * invW, hasValidSum);
textureStore(outputTexture, global_id.xy, vec4<f32>(outColor, outCoC));
