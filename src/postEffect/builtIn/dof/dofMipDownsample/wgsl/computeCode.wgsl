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
let centerSpread = max(maxCenterCoC - minCenterCoC, 0.5);
let cw11 = exp(-(s11.a - minCenterCoC) / centerSpread);
let cw21 = exp(-(s21.a - minCenterCoC) / centerSpread);
let cw12 = exp(-(s12.a - minCenterCoC) / centerSpread);
let cw22 = exp(-(s22.a - minCenterCoC) / centerSpread);
let refCoC = (s11.a * cw11 + s21.a * cw21 + s12.a * cw12 + s22.a * cw22) / (cw11 + cw21 + cw12 + cw22);
let bilateralScale = max(abs(refCoC) * 0.35, 0.5);

var sumColor = vec3<f32>(0.0);
var sumCoC: f32 = 0.0;
var sumWeight: f32 = 0.0;

// [KO] 4x4 이산 B-Spline/Tent 커널([1, 3, 3, 1]) 샘플링 및 refCoC 기준 연속 양방향(Bilateral) 가중치로 임계값 지글거림 및 부호 상쇄 원천 차단
// [EN] 4x4 discrete B-Spline/Tent kernel ([1, 3, 3, 1]) sampling with continuous refCoC bilateral weighting to eliminate threshold shimmering and sign cancellation
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
        let cocDiff = abs(s.a - refCoC) / bilateralScale;
        let bilateralW = 1.0 / (1.0 + cocDiff * cocDiff);

        let w = spatialW * bilateralW;
        sumColor += s.rgb * w;
        sumCoC += s.a * w;
        sumWeight += w;
    }
}

let invW = 1.0 / max(sumWeight, 1e-4);
textureStore(outputTexture, global_id.xy, vec4<f32>(sumColor * invW, sumCoC * invW));
