let tileIndex = vec2<i32>(global_id.xy);
let tileDims = vec2<i32>(postEffectOutputDimensions);
let halfDims = vec2<i32>(textureDimensions(sourceTexture));
let maxCoord = max(halfDims - vec2<i32>(1), vec2<i32>(0));

let tileSpan = max(vec2<i32>(ceil(vec2<f32>(halfDims) / max(vec2<f32>(tileDims), vec2<f32>(1.0)))), vec2<i32>(1));
let tileOrigin = tileIndex * tileSpan;
let tileMaxLocal = vec2<f32>(max(tileSpan - vec2<i32>(1), vec2<i32>(0)));

let dpr = min(systemUniforms.devicePixelRatio, 2.0);
let maxHalfCoC = 0.5 * uniforms.maxCoC * dpr;
let searchStep: i32 = 4;
let searchRadius = i32(ceil(maxHalfCoC / f32(searchStep))) * searchStep;

var minNearCoC: f32 = 0.0;
var maxFarCoC: f32 = 0.0;
var minFarCoC: f32 = maxHalfCoC;
var hasFarSample: bool = false;

// [KO] maxCoC 및 DPR에 연동된 동적 반경(searchRadius)과 타일 AABB 유클리드 거리(distToTile)를 계산하여 전/배경 최대 CoC를 광역 확장
// [EN] Dynamically compute search radius (searchRadius) from maxCoC and DPR and exact Euclidean distance to the tile AABB (distToTile) for wide near/far CoC dilation
for (var y = -searchRadius; y < tileSpan.y + searchRadius; y = y + searchStep) {
    for (var x = -searchRadius; x < tileSpan.x + searchRadius; x = x + searchStep) {
        let sampleCoord = clamp(tileOrigin + vec2<i32>(x, y), vec2<i32>(0), maxCoord);
        let coc = textureLoad(sourceTexture, sampleCoord, 0).a;
        let samplePos = vec2<f32>(f32(x), f32(y));
        let closestInTile = clamp(samplePos, vec2<f32>(0.0), tileMaxLocal);
        let distToTile = distance(samplePos, closestInTile);

        if (coc < -0.25 && (-coc) >= distToTile) {
            minNearCoC = min(minNearCoC, coc);
        }
        if (coc > 0.25 && coc >= distToTile) {
            maxFarCoC = max(maxFarCoC, coc);
            minFarCoC = min(minFarCoC, coc);
            hasFarSample = true;
        }
    }
}

let validMinFarCoC = select(0.0, minFarCoC, hasFarSample);
let defocusSpread = max(0.0, maxFarCoC - validMinFarCoC);

textureStore(outputTexture, global_id.xy, vec4<f32>(minNearCoC, maxFarCoC, validMinFarCoC, defocusSpread));
