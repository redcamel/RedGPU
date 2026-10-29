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

// [KO] 중심 2x2 쿼드를 1회만 선행 로드하여 전경(Near < 0), 배경(Far > 0), 초점(In-Focus) 우세 레이어를 판별하고 4x4 루프에서 재사용 (20회 -> 16회 페치)
// [EN] Pre-load the center 2x2 quad once to classify Foreground (Near < 0), Background (Far > 0), or In-Focus dominance and reuse inside the 4x4 loop (20 -> 16 fetches)
let s11 = textureLoad(sourceTexture, vec2<i32>(xs[1], ys[1]), 0);
let s21 = textureLoad(sourceTexture, vec2<i32>(xs[2], ys[1]), 0);
let s12 = textureLoad(sourceTexture, vec2<i32>(xs[1], ys[2]), 0);
let s22 = textureLoad(sourceTexture, vec2<i32>(xs[2], ys[2]), 0);

let minCenterCoC = min(min(s11.a, s21.a), min(s12.a, s22.a));
let maxCenterCoC = max(max(s11.a, s21.a), max(s12.a, s22.a));
let fgDominance = smoothstep(-0.15, -0.55, minCenterCoC);
let bgDominance = (1.0 - fgDominance) * smoothstep(0.15, 0.55, maxCenterCoC);
let focusDominance = max(0.0, 1.0 - fgDominance - bgDominance);

var sumColor = vec3<f32>(0.0);
var sumCoC: f32 = 0.0;
var sumWeight: f32 = 0.0;

// [KO] 4x4 이산 B-Spline/Tent 커널([1, 3, 3, 1]) 샘플링 및 연속 레이어 가중치 블렌딩으로 경계 플리커링 및 가짜 초점 상쇄 방지
// [EN] 4x4 discrete B-Spline/Tent kernel ([1, 3, 3, 1]) sampling with continuous layer dominance blending to prevent boundary flickering and phantom focus cancellation
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
        let fgGate = smoothstep(-0.15, -0.75, s.a);
        let bgGate = smoothstep(0.15, 0.75, s.a);
        let focusGate = 1.0 - smoothstep(0.25, 1.0, abs(s.a));
        let layerGate = fgGate * fgDominance + bgGate * bgDominance + focusGate * focusDominance;

        let w = spatialW * max(layerGate, 1e-4);
        sumColor += s.rgb * w;
        sumCoC += s.a * w;
        sumWeight += w;
    }
}

let invW = 1.0 / max(sumWeight, 1e-4);
textureStore(outputTexture, global_id.xy, vec4<f32>(sumColor * invW, sumCoC * invW));
