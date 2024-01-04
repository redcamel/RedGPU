@binding(0) @group(0) var imgSampler : sampler;
@binding(1) @group(0) var img : texture_2d<f32>;
@fragment
fn main(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
    return textureSample(img, imgSampler, texCoord);
}