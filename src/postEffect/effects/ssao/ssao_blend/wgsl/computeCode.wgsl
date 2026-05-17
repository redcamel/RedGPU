let index = vec2<u32>(global_id.xy );
let dimensions: vec2<u32> = textureDimensions(sourceTexture0);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);
let uv = 	vec2<f32>(f32(index.x)/dimW,f32(index.y)/dimH);
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
