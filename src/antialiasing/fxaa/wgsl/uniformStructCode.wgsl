struct Uniforms {
  subpix: f32,
  edgeThreshold: f32,
  edgeThresholdMin: f32,
  padding: f32
};

#redgpu_include color.get_luminance

fn fetchColor4(pos: vec2<i32>, dims: vec2<u32>) -> vec4<f32> {
    let p = vec2<u32>(clamp(vec2<u32>(pos), vec2<u32>(0), dims - 1));
    return textureLoad(sourceTexture, p);
}
