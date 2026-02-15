let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture0);
if (index.x >= dimensions.x || index.y >= dimensions.y) { return; }

let diffuseSample = textureLoad(sourceTexture0, index);
let blurSample = textureLoad(sourceTexture1, index);

let diffuseRGB = diffuseSample.rgb;
let blurRGB = blurSample.rgb * uniforms.bloomStrength;

// [KO] YCoCg 공간으로 변환하여 밝기 중심의 정밀 합성 수행
// [EN] Convert to YCoCg space for precise luminance-centered blending
let diffuseYCoCg = rgb_to_ycocg(diffuseRGB);
let blurYCoCg = rgb_to_ycocg(blurRGB);

// [KO] 가산 혼합 수행 (밝기는 더하고 색차 성분은 에너지를 보존하며 합성)
// [EN] Perform additive blending (Add luminance, blend chroma while preserving energy)
var finalYCoCg: vec3<f32>;
finalYCoCg.x = diffuseYCoCg.x + blurYCoCg.x; // Brightness addition
finalYCoCg.y = diffuseYCoCg.y + blurYCoCg.y * 0.5; // Soften chroma bleeding
finalYCoCg.z = diffuseYCoCg.z + blurYCoCg.z * 0.5;

// [KO] RGB로 복원 및 노출 적용
let finalRGB = ycocg_to_rgb(finalYCoCg) * uniforms.exposure;

textureStore(outputTexture, index, vec4<f32>(finalRGB, diffuseSample.a));
