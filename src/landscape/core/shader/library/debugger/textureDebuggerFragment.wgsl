@group(0) @binding(0) var targetTexture: texture_2d<f32>;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let texDim = vec2<f32>(textureDimensions(targetTexture));
    let texCoord = vec2<i32>(clamp(in.uv * texDim, vec2<f32>(0.0), texDim - vec2<f32>(1.0)));
    let sampleColor = textureLoad(targetTexture, texCoord, 0).rgb;
    return vec4<f32>(sampleColor, 1.0);
}
