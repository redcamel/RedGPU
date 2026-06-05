let index = vec2<u32>(global_id.xy );
var diffuse:vec4<f32> = textureLoad(
    sourceTexture0,
    index,
);
var blur:vec4<f32> = textureLoad(
    sourceTexture1,
    index,
);

let finalColor = vec4<f32>((diffuse.rgb  * blur.rgb  )  ,diffuse.a);
textureStore(outputTexture, index, finalColor );
