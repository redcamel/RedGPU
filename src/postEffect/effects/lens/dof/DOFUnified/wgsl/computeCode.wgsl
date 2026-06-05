let index = global_id.xy;
let dimensions = textureDimensions(sourceTexture);
if (index.x >= dimensions.x || index.y >= dimensions.y) { return; }

let centerUV = (vec2<f32>(index) + 0.5) / vec2<f32>(dimensions);
let originalSample = textureLoad(sourceTexture, index, 0);
let originalColor = originalSample.rgb;
let originalAlpha = originalSample.a;
let encodedCoC = textureLoad(cocTexture, index, 0).a;

/* CoC 값 디코딩 */
let cocValue = decodeCoC(encodedCoC);

/* CoC 임계값 체크 (초점이 완벽히 맞은 경우) */
if (abs(cocValue) < 0.005) {
    textureStore(outputTexture, index, vec4<f32>(originalColor, originalAlpha));
    return;
}

var finalColor = originalColor;
var finalAlpha = originalAlpha;

/* Near blur 처리 (CoC < 0) */
if (cocValue < 0.0) {
    let blurResult = calculateBlur(centerUV, abs(cocValue), uniforms.nearBlurSize, true);
    let nearBlur = blurResult.rgb;
    let nearBlurAlpha = blurResult.a;
    /* Near strength 블렌딩 - 더 선명한 보케 효과를 위해 곡선 적용 */
    let nearBlend = saturate(pow(abs(cocValue) * uniforms.nearStrength, 0.7));
    finalColor = mix(originalColor, nearBlur, nearBlend);
    finalAlpha = mix(originalAlpha, nearBlurAlpha, nearBlend);
}
/* Far blur 처리 (CoC > 0) */
else if (cocValue > 0.0) {
    let blurResult = calculateBlur(centerUV, cocValue, uniforms.farBlurSize, false);
    let farBlur = blurResult.rgb;
    let farBlurAlpha = blurResult.a;
    let rawBlend = cocValue * uniforms.farStrength;
    let farBlend = saturate(smoothstep(0.0, 0.8, rawBlend));
    finalColor = mix(originalColor, farBlur, farBlend);
    finalAlpha = mix(originalAlpha, farBlurAlpha, farBlend);
}

textureStore(outputTexture, index, vec4<f32>(finalColor, finalAlpha));
