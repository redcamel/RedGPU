let index = vec2<u32>(global_id.xy);
let coord = vec2<i32>(global_id.xy);

let originalColor = textureLoad(sourceTexture, coord).xyzw;

let depth = textureLoad(depthTexture, coord, 0);
// [KO] 표준 라이브러리 함수 사용 (uniforms.nearPlane, farPlane 전달)
let linearDepth = getLinearizeDepth(depth, uniforms.nearPlane, uniforms.farPlane);

let coc = calculateCoC(linearDepth);

/* CoC를 0~1 범위로 인코딩해서 저장 */
let encodedCoC = encodeCoC(coc);

textureStore(outputTexture, coord, vec4<f32>(originalColor.rgb, encodedCoC));
