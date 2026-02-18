/**
 * [KO] RGB 색상의 휘도(Luminance)를 계산합니다. (Rec. 709 표준 가중치 적용)
 * [EN] Calculates the luminance of an RGB color. (Applying Rec. 709 standard weights)
 *
 * @param rgb - [KO] 입력 RGB 색상 [EN] Input RGB color
 * @returns [KO] 계산된 휘도 값 [EN] Calculated luminance value
 */
fn getLuminance(rgb: vec3<f32>) -> f32 {
    return dot(rgb, vec3<f32>(0.2126, 0.7152, 0.0722));
}
