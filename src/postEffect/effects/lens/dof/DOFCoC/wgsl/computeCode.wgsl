let index = vec2<u32>(global_id.xy);
let coord = vec2<i32>(global_id.xy);

let originalColor = textureLoad(sourceTexture, coord).xyzw;

let depth = textureLoad(depthTexture, coord, 0);
let linearDepth = linearizeDepth(depth);

let coc = calculateCoC(linearDepth);

/* CoC를 0~1 범위로 인코딩해서 저장 */
let encodedCoC = encodeCoC(coc);

textureStore(outputTexture, coord, vec4<f32>(originalColor.rgb, encodedCoC));
