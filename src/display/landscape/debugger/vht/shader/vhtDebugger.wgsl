@group(0) @binding(0) var vhtTexture: texture_2d<f32>;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let texSize = vec2<f32>(textureDimensions(vhtTexture));
    let texCoord = vec2<i32>(clamp(in.uv * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
    let h = textureLoad(vhtTexture, texCoord, 0).r;
    return vec4<f32>(h, h * 0.9 + 0.1, h * 0.8, 1.0);
}
