let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);

if (index.x >= dimensions.x || index.y >= dimensions.y) {
    return;
}

let originalSample = textureLoad(sourceTexture, index);
let originalColor = originalSample.rgb;
let originalAlpha = originalSample.a;
let encodedCoC = textureLoad(cocTexture, index).a;

/* CoC 값 디코딩 */
let cocValue = decodeCoC(encodedCoC);

/* CoC 임계값 체크 */
if (abs(cocValue) < 0.005) {
    textureStore(outputTexture, index, vec4<f32>(originalColor, originalAlpha));
    return;
}

var finalColor = originalColor;
var finalAlpha = originalAlpha;

/* Near blur 처리 (CoC < 0) */
if (cocValue < 0.0) {
    let blurResult = calculateBlur(index, abs(cocValue), uniforms.nearBlurSize, true);
    let nearBlur = blurResult.rgb;
    let nearBlurAlpha = blurResult.a;
    /* Near strength 블렌딩 개선 - 더 강한 효과 */
    let nearBlend = saturate(pow(abs(cocValue) * uniforms.nearStrength, 0.7));
    finalColor = mix(originalColor, nearBlur, nearBlend);
    finalAlpha = mix(originalAlpha, nearBlurAlpha, nearBlend);
}
/* Far blur 처리 (CoC > 0) */
else if (cocValue > 0.0) {
    let blurResult = calculateBlur(index, cocValue, uniforms.farBlurSize, false);
    let farBlur = blurResult.rgb;
    let farBlurAlpha = blurResult.a;
    let rawBlend = cocValue * uniforms.farStrength;
    let farBlend = saturate(smoothstep(0.0, 0.8, rawBlend));
    finalColor = mix(originalColor, farBlur, farBlend);
    finalAlpha = mix(originalAlpha, farBlurAlpha, farBlend);
}

textureStore(outputTexture, index, vec4<f32>(finalColor, finalAlpha));
