/**
 * [KO] YCoCg 색상을 RGB 색 공간으로 복원합니다.
 * [EN] Restores YCoCg color back to RGB color space.
 *
 * @param ycocg [KO] 입력 YCoCg 색상 [EN] Input YCoCg color
 * @returns [KO] 복원된 RGB 색상 [EN] Restored RGB color
 */
fn YCoCgToRgb(ycocg: vec3<f32>) -> vec3<f32> {
    let y = ycocg.x;
    let co = ycocg.y;
    let cg = ycocg.z;
    return vec3<f32>(y + co - cg, y + cg, y - co - cg);
}
