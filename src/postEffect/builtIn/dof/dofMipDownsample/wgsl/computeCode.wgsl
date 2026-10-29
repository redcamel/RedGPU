let dstCoord = vec2<i32>(global_id.xy);
let srcDims = vec2<i32>(textureDimensions(sourceTexture));
let maxSrcCoord = max(srcDims - vec2<i32>(1), vec2<i32>(0));
let baseCoord = dstCoord * 2;

// [KO] 중심 2x2 쿼드의 부호 있는 CoC 범위를 먼저 확인하여 전경(Near < 0), 배경(Far > 0), 초점(In-Focus) 우세 레이어를 판별
// [EN] Inspect the signed CoC range of the center 2x2 quad first to classify Foreground (Near < 0), Background (Far > 0), or In-Focus dominance
let c00 = textureLoad(sourceTexture, clamp(baseCoord + vec2<i32>(0, 0), vec2<i32>(0), maxSrcCoord), 0).a;
let c10 = textureLoad(sourceTexture, clamp(baseCoord + vec2<i32>(1, 0), vec2<i32>(0), maxSrcCoord), 0).a;
let c01 = textureLoad(sourceTexture, clamp(baseCoord + vec2<i32>(0, 1), vec2<i32>(0), maxSrcCoord), 0).a;
let c11 = textureLoad(sourceTexture, clamp(baseCoord + vec2<i32>(1, 1), vec2<i32>(0), maxSrcCoord), 0).a;

let minCenterCoC = min(min(c00, c10), min(c01, c11));
let maxCenterCoC = max(max(c00, c10), max(c01, c11));
let fgDominance = smoothstep(-0.15, -0.55, minCenterCoC);
let bgDominance = (1.0 - fgDominance) * smoothstep(0.15, 0.55, maxCenterCoC);
let focusDominance = max(0.0, 1.0 - fgDominance - bgDominance);

let tentWeights = array<f32, 4>(1.0, 3.0, 3.0, 1.0);
var sumColor = vec3<f32>(0.0);
var sumCoC: f32 = 0.0;
var sumWeight: f32 = 0.0;

// [KO] 4x4 이산 B-Spline/Tent 커널([1, 3, 3, 1]) 샘플링 및 연속 레이어 가중치 블렌딩으로 경계 플리커링 및 가짜 초점 상쇄 방지
// [EN] 4x4 discrete B-Spline/Tent kernel ([1, 3, 3, 1]) sampling with continuous layer dominance blending to prevent boundary flickering and phantom focus cancellation
for (var ky = 0; ky < 4; ky = ky + 1) {
    let wy = tentWeights[ky];
    let sy = clamp(baseCoord.y + ky - 1, 0, maxSrcCoord.y);

    for (var kx = 0; kx < 4; kx = kx + 1) {
        let wx = tentWeights[kx];
        let sx = clamp(baseCoord.x + kx - 1, 0, maxSrcCoord.x);
        let s = textureLoad(sourceTexture, vec2<i32>(sx, sy), 0);
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
