// [KO] 1. 인덱스 및 컬러 로드
// [EN] 1. Load index and color
let index = global_id.xy;
var color: vec4<f32> = textureLoad(sourceTexture, index, 0);

// [KO] 2. 원본 휘도 계산 및 영역별 가중치 산출
// [EN] 2. Calculate original luminance and zone weights
let original_luminance = getLuminance(color.rgb);

// [KO] Shadow(0.0~0.5), Highlight(0.5~1.0) 영역을 부드럽게 분리
// [EN] Smoothly separate Shadow (0.0-0.5) and Highlight (0.5-1.0) zones
let shadow_weight = 1.0 - smoothstep(0.0, 0.5, original_luminance);
let highlight_weight = smoothstep(0.5, 1.0, original_luminance);
let midtone_weight = 1.0 - shadow_weight - highlight_weight;

// [KO] 3. 각 영역별 컬러 축 이동량 합산
// [EN] 3. Accumulate color axis shifts per zone
let cyan_red = shadow_weight * uniforms.shadowCyanRed +
               midtone_weight * uniforms.midtoneCyanRed +
               highlight_weight * uniforms.highlightCyanRed;

let magenta_green = shadow_weight * uniforms.shadowMagentaGreen +
                    midtone_weight * uniforms.midtoneMagentaGreen +
                    highlight_weight * uniforms.highlightMagentaGreen;

let yellow_blue = shadow_weight * uniforms.shadowYellowBlue +
                  midtone_weight * uniforms.midtoneYellowBlue +
                  highlight_weight * uniforms.highlightYellowBlue;

// [KO] 4. 색상 보정 적용 (0.01 스케일로 감도 조절)
// [EN] 4. Apply color correction (sensitivity adjusted with 0.01 scale)
color.r += cyan_red * 0.01;
color.g += magenta_green * 0.01;
color.b += yellow_blue * 0.01;

// [KO] 5. 밝기 보존(Preserve Luminosity) 로직
// [EN] 5. Preserve Luminosity logic
// [KO] 색상 변화 후에도 원본 밝기를 유지하여 순수하게 '색감'만 변경되도록 보정합니다.
// [EN] Maintains original brightness after color changes to ensure only the 'tint' is modified.
let adjusted_luminance = getLuminance(color.rgb);
if (uniforms.preserveLuminosity == 1u && adjusted_luminance > 0.0) {
    let ratio = original_luminance / adjusted_luminance;
    color = vec4<f32>(color.rgb * ratio, color.a);
}

// [KO] 6. 결과 저장
// [EN] 6. Store result
textureStore(outputTexture, index, color);
