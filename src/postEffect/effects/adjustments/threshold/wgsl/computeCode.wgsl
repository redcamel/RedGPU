let index = vec2<u32>(global_id.xy );
let dimensions: vec2<u32> = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);
var color:vec4<f32> = textureLoad( sourceTexture, index, );

let threshold_value : f32 = uniforms.threshold / 255.0;
var v = 0.0;
if( getLuminance(color.rgb) >= threshold_value) {
  v = 1.0;
}
color = vec4<f32>(v,v,v,color.a);
textureStore(outputTexture, index, color );
