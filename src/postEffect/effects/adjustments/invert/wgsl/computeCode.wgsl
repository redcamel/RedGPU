let index = vec2<u32>(global_id.xy );
var color:vec4<f32> = textureLoad( sourceTexture, index, 0 );

textureStore(
    outputTexture,
    index,
    mix( color, vec4<f32>( 1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a), uniforms.amount )
);

