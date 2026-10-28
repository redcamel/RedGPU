// [KO] 1. 인덱스 및 UV 좌표 계산
// [EN] 1. Index and UV coordinates calculation
let index = vec2<u32>(global_id.xy);
let dimensions: vec2<f32> = vec2<f32>(postEffectOutputDimensions);
let uv = (vec2<f32>(index) + 0.5) / dimensions;

// [KO] 2. 원본 디퓨즈(무손실 Load)와 다운샘플 블러된 블룸 데이터(Bilinear 업샘플링) 로드
// [EN] 2. Load original diffuse (lossless Load) and downsampled blurred bloom data (Bilinear upsampling)
let diffuseSample = textureLoad(sourceTexture0, index, 0);
let blurSample = textureSampleLevel(sourceTexture1, basicSampler, uv, 0.0);

let diffuseRGB = diffuseSample.rgb;
let blurRGB = blurSample.rgb * uniforms.bloomStrength;

// [KO] 3. YCoCg 공간으로 변환하여 밝기 중심의 정밀 합성 수행
// [EN] 3. Convert to YCoCg space for precise luminance-centered blending
// [KO] RGB보다 에너지 보존 측면에서 유리하며 색 번짐(Chroma Bleeding)을 정교하게 제어할 수 있습니다.
// [EN] Advantageous for energy conservation and allows precise control over Chroma Bleeding compared to RGB.
let diffuseYCoCg = rgbToYCoCg(diffuseRGB);
let blurYCoCg = rgbToYCoCg(blurRGB);

// [KO] 4. 가산 혼합 수행 (밝기는 단순 합산, 색차 성분은 에너지를 조절하며 합성)
// [EN] 4. Perform additive blending (Luminance is added, chroma components are blended with energy adjustment)
var finalYCoCg: vec3<f32>;
finalYCoCg.x = diffuseYCoCg.x + blurYCoCg.x; // Brightness addition
finalYCoCg.y = diffuseYCoCg.y + blurYCoCg.y * 0.5; // Soften chroma bleeding
finalYCoCg.z = diffuseYCoCg.z + blurYCoCg.z * 0.5;

// [KO] 5. RGB로 복원 및 노출(Exposure) 적용
// [EN] 5. Restore to RGB and apply exposure
let finalRGB = YCoCgToRgb(finalYCoCg) * uniforms.exposure;

// [KO] 6. 결과 저장 (알파 채널은 원본 유지)
// [EN] 6. Store result (Maintain original alpha channel)
textureStore(outputTexture, index, vec4<f32>(finalRGB, diffuseSample.a));
