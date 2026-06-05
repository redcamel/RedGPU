let index = vec2<u32>(global_id.xy );
var color:vec4<f32> = textureLoad( sourceTexture, index );

let brightness_value : f32 = uniforms.brightness / 255.0;
let contrast_value : f32 = uniforms.contrast / 255.0;

var tempColor:vec3<f32>;
if ( contrast_value > 0.0 ) {
    tempColor = ( color.rgb - 0.5 ) / ( 1.0 - contrast_value ) + 0.5;
}else {
    tempColor= ( color.rgb - 0.5 ) * ( 1.0 + contrast_value ) + 0.5;
}
color = vec4<f32>(tempColor + brightness_value, color.a);

textureStore(outputTexture, index, color );
