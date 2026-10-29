const SEARCH_STEP: i32 = 4;
const DOF_MAX_COC_FULL_PX: f32 = 36.0;

let tileIndex = vec2<i32>(global_id.xy);
let tileDims = vec2<i32>(postEffectOutputDimensions);
let halfDims = vec2<i32>(textureDimensions(sourceTexture));
let maxCoord = max(halfDims - vec2<i32>(1), vec2<i32>(0));

let tileSpan = max(vec2<i32>(ceil(vec2<f32>(halfDims) / max(vec2<f32>(tileDims), vec2<f32>(1.0)))), vec2<i32>(1));
let tileOrigin = tileIndex * tileSpan;
let tileMaxLocal = vec2<f32>(max(tileSpan - vec2<i32>(1), vec2<i32>(0)));

let dpr = clamp(systemUniforms.devicePixelRatio, 1.0, 2.0);
let maxHalfCoC = 0.5 * DOF_MAX_COC_FULL_PX * dpr;
let maxHalfCoCSq = maxHalfCoC * maxHalfCoC;
let searchRadius = i32(ceil(maxHalfCoC / f32(SEARCH_STEP))) * SEARCH_STEP;

var minNearCoC: f32 = 0.0;
var maxFarCoC: f32 = 0.0;

// [KO] maxCoC 및 DPR에 연동된 동적 반경과 타일 AABB 유클리드 제곱 거리(distToTileSq)를 계산하여 sqrt 없이 전/배경 최대 CoC를 광역 확장
// [EN] Dynamically compute search radius from maxCoC/DPR and squared Euclidean distance to the tile AABB (distToTileSq) for sqrt-free near/far CoC dilation
for (var y = -searchRadius; y < tileSpan.y + searchRadius; y = y + SEARCH_STEP) {
    let sampleY = f32(y);
    let dy = sampleY - clamp(sampleY, 0.0, tileMaxLocal.y);
    let dySq = dy * dy;
    let clampedCoordY = clamp(tileOrigin.y + y, 0, maxCoord.y);

    for (var x = -searchRadius; x < tileSpan.x + searchRadius; x = x + SEARCH_STEP) {
        let sampleX = f32(x);
        let dx = sampleX - clamp(sampleX, 0.0, tileMaxLocal.x);
        let distToTileSq = dx * dx + dySq;
        if (distToTileSq > maxHalfCoCSq) {
            continue;
        }

        let clampedCoordX = clamp(tileOrigin.x + x, 0, maxCoord.x);
        let coc = textureLoad(sourceTexture, vec2<i32>(clampedCoordX, clampedCoordY), 0).a;
        let cocSq = coc * coc;

        if (coc < -0.25 && cocSq >= distToTileSq) {
            minNearCoC = min(minNearCoC, coc);
        }
        if (coc > 0.25 && cocSq >= distToTileSq) {
            maxFarCoC = max(maxFarCoC, coc);
        }
    }
}

textureStore(outputTexture, global_id.xy, vec4<f32>(minNearCoC, maxFarCoC, 0.0, 0.0));
