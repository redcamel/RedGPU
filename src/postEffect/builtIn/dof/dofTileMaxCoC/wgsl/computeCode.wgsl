let tileIndex = vec2<i32>(global_id.xy);
let halfDims = vec2<i32>(textureDimensions(sourceTexture));
let maxCoord = max(halfDims - vec2<i32>(1), vec2<i32>(0));
let tileOrigin = tileIndex * 8;

var minNearCoC: f32 = 0.0;
var maxFarCoC: f32 = 0.0;
var minFarCoC: f32 = 64.0;
var hasFarSample: bool = false;

// [KO] 언리얼 Diaphragm DOF의 3-Tile 광역 확장(Tile Flatten & Dilate): 현재 8x8 타일 중심으로부터 주변 ±24 Half-Res 텍셀(원본 48px) 반경을 스캔하여 대구경 근접 전경 보케가 타일 경계에서 절단되지 않도록 보장
// [EN] Unreal Diaphragm DOF 3-Tile wide dilation (Tile Flatten & Dilate): scan ±24 half-res texels (48px full-res) around the current 8x8 tile to ensure large-aperture near bokeh is never clipped at tile boundaries
for (var y = -24; y < 32; y = y + 3) {
    for (var x = -24; x < 32; x = x + 3) {
        let sampleCoord = clamp(tileOrigin + vec2<i32>(x, y), vec2<i32>(0), maxCoord);
        let coc = textureLoad(sourceTexture, sampleCoord, 0).a;
        let distToTile = max(0.0, length(vec2<f32>(f32(x) - 3.5, f32(y) - 3.5)) - 5.5);

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
