let index = vec2<u32>(global_id.xy);
let coord = vec2<i32>(global_id.xy);

var sceneColor: vec4<f32> = textureLoad(sourceTexture, coord);
let depth = textureLoad(depthTexture, coord, 0);

let linearDepth = linearizeDepth(depth, systemUniforms.camera.nearClipping, systemUniforms.camera.farClipping);
let fogFactor = calculateFogFactor(linearDepth, systemUniforms.camera.farClipping);

let finalColor = mix(uniforms.fogColor.rgb, sceneColor.rgb, fogFactor);
textureStore(outputTexture, coord, vec4<f32>(finalColor, sceneColor.a));
