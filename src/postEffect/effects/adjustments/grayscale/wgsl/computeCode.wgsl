let index = vec2<u32>(global_id.xy );
var color:vec4<f32> = textureLoad( sourceTexture, index, 0 );
let gray = (color.r  + color.g + color.b)/3.0 ;
textureStore(
    outputTexture,
    index,
    mix( color, vec4<f32>( gray, gray, gray, color.a), uniforms.amount )
);
