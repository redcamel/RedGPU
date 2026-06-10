/**
 * [KO] RGB 색상을 YCoCg 색 공간으로 변환합니다. (TAA 및 압축 효율 최적화)
 * [EN] Converts RGB color to YCoCg color space. (Optimized for TAA and compression efficiency)
 *
 * @param rgb [KO] 입력 RGB 색상 [EN] Input RGB color
 * @returns [KO] 변환된 YCoCg 색상 [EN] Converted YCoCg color
 */
fn rgbToYCoCg(rgb: vec3<f32>) -> vec3<f32> {
    let y = dot(rgb, vec3<f32>(0.25, 0.5, 0.25));
    let co = dot(rgb, vec3<f32>(0.5, 0.0, -0.5));
    let cg = dot(rgb, vec3<f32>(-0.25, 0.5, -0.25));
    return vec3<f32>(y, co, cg);
}
