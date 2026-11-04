// [KO] 1. 인덱스 계산 및 원본 컬러/패킹된 AO 데이터 로드 (1:1 Full-Res 직결)
// [EN] 1. Index calculation and load original color / packed AO data (1:1 Full-Res direct)
let index = vec2<i32>(global_id.xy);

let diffuse = textureLoad(sourceTexture0, index, 0);
let aoData  = textureLoad(sourceTexture1, index, 0).rg;
let finalAO = saturate(aoData.r);
let linearZ = aoData.g;

// 배경(하늘) 또는 무효 깊이 픽셀(linearZ <= 0.0) 및 비차폐 픽셀(finalAO >= 1.0)은 원본 HDR 컬러 그대로 출력
if (linearZ <= 0.0 || finalAO >= 1.0) {
    textureStore(outputTexture, index, diffuse);
    return;
}

// [KO] 2. GTAO Multi-Bounce(다중 반사 색번짐 다항식) 또는 단일 차폐 합성
// [EN] 2. GTAO Multi-Bounce polynomial or single-bounce occlusion composition
var aoColor = vec3<f32>(finalAO);
if (uniforms.useMultiBounce == 1u) {
    let hdrPeak = max(1.0, max(diffuse.r, max(diffuse.g, diffuse.b)));
    let albedo  = saturate(diffuse.rgb / hdrPeak);
    aoColor     = gtaoMultiBounce(finalAO, albedo);
}

let finalColor = vec4<f32>(diffuse.rgb * aoColor, diffuse.a);
textureStore(outputTexture, index, finalColor);
