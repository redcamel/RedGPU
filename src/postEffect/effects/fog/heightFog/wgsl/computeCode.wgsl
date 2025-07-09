let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

// 현재 픽셀 좌표
let global_id_vec = vec2<f32>(f32(global_id.x), f32(global_id.y));

let screenCoord = vec2<f32>( global_id_vec.x / dimW, global_id_vec.y / dimH );

var depth: f32 = 1.0;
if (dimensions.x > u32(global_id.x) && dimensions.y > u32(global_id.y)) {
    depth = textureLoad(depthTexture, vec2<i32>(global_id.xy), 0);
}

let fogFactor = calculateHeightFogFactor(screenCoord, depth);

let originalColor = textureLoad(sourceTexture, vec2<i32>(global_id.xy)).rgb;
let foggedColor = mix(uniforms.fogColor, originalColor, fogFactor);

textureStore(outputTexture, vec2<i32>(global_id.xy), vec4<f32>(foggedColor, 1.0));
