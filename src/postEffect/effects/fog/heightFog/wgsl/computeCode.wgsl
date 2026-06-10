// [KO] 1. 기초 데이터 로드 및 좌표 계산
// [EN] 1. Load basic data and calculate coordinates
let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

let global_id_vec = vec2<f32>(global_id.xy);
let screenCoord = (global_id_vec + 0.5) / vec2<f32>(dimW, dimH);

// [KO] 2. 깊이값 로드 및 월드 좌표 복원을 위한 데이터 준비
// [EN] 2. Load depth and prepare data for world position reconstruction
var depth: f32 = 1.0;
if (dimensions.x > u32(global_id.x) && dimensions.y > u32(global_id.y)) {
    depth = textureLoad(depthTexture, vec2<i32>(global_id.xy), 0);
}

// [KO] 3. 높이 기반 안개 계수 계산 (고정밀 로직 호출)
// [EN] 3. Calculate height-based fog factor (Invoke high-precision logic)
let fogFactor = calculateHeightFogFactor(screenCoord, depth);

// [KO] 4. 최종 색상 합성 및 저장
// [EN] 4. Final color composition and storage
let originalColor = textureLoad(sourceTexture, vec2<i32>(global_id.xy), 0).rgb;
let foggedColor = mix(uniforms.fogColor, originalColor, fogFactor);

textureStore(outputTexture, vec2<i32>(global_id.xy), vec4<f32>(foggedColor, 1.0));
