/**
 * [KO] (Legacy) 객체에 공중 투시(Aerial Perspective) 효과를 적용합니다.
 * [EN] (Legacy) Applies the Aerial Perspective effect to an object.
 * 
 * ::: warning
 * [KO] 이 함수는 더 이상 사용되지 않습니다. 대기 효과는 이제 포스트 프로세스 패스에서 화면 전체에 일괄 적용됩니다.
 * [EN] This function is deprecated. Atmospheric effects are now applied globally via post-process pass.
 * :::
 */
fn getAerialPerspective(finalColor: vec4<f32>, worldPosition: vec3<f32>) -> vec4<f32> {
    // [KO] 아무 작업도 수행하지 않고 원본 색상을 반환합니다.
    // [EN] Does nothing and returns the original color.
    return finalColor;
}
