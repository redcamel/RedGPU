/**
 * [Stage: Common (Vertex, Fragment, Compute)]
 * [KO] YCoCg 색상을 RGB 색 공간으로 복원합니다.
 * [EN] Restores YCoCg color back to RGB color space.
 */
fn YCoCgToRgb(ycocg: vec3<f32>) -> vec3<f32> {
    let y = ycocg.x;
    let co = ycocg.y;
    let cg = ycocg.z;
    return vec3<f32>(y + co - cg, y + cg, y - co - cg);
}
