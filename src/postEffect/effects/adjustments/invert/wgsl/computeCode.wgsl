let index = vec2<u32>(global_id.xy );
let dimensions: vec2<u32> = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);
let uv = 	vec2<f32>(f32(index.x)/dimW,f32(index.y)/dimH);
var color:vec4<f32> = textureLoad( sourceTexture, index, );

textureStore(
    outputTexture,
    index,
    mix( color, vec4<f32>( 1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a), uniforms.amount )
);

