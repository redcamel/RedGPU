// An array to initialize position coordinates
var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(-1.0, 3.0),
    vec2<f32>(3.0, -1.0)
);

// Struct for vertex output
struct VertexOutput {
  @builtin(position)
  position : vec4<f32>,

  @location(0)
  texCoord : vec2<f32>,
};

// Vertex shader
@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
  var output : VertexOutput;
  output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
  output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  return output;
}

// Sampler and texture for image
@group(0) @binding(0)
var imgSampler : sampler;

@group(0) @binding(1)
var img : texture_2d<f32>;

// Fragment shader (Standard 2x2 bilinear downsample)
@fragment
fn fragmentMain(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
  return textureSample(img, imgSampler, texCoord);
}

// Fragment shader (5-tap Kawase + Karis weighted HDR downsample for 2-pass transmission/TAA stability)
@fragment
fn fragmentMainKawaseKaris(@location(0) texCoord : vec2<f32>) -> @location(0) vec4<f32> {
  let texel = 1.0 / vec2<f32>(textureDimensions(img));
  let cCenter = textureSample(img, imgSampler, texCoord);
  let c0 = textureSample(img, imgSampler, texCoord + vec2<f32>(-texel.x, -texel.y));
  let c1 = textureSample(img, imgSampler, texCoord + vec2<f32>( texel.x, -texel.y));
  let c2 = textureSample(img, imgSampler, texCoord + vec2<f32>(-texel.x,  texel.y));
  let c3 = textureSample(img, imgSampler, texCoord + vec2<f32>( texel.x,  texel.y));

  let lumaCoeff = vec3<f32>(0.2126, 0.7152, 0.0722);
  let wCenter = 0.5 / (1.0 + max(dot(cCenter.rgb, lumaCoeff), 0.0));
  let w0 = 0.125 / (1.0 + max(dot(c0.rgb, lumaCoeff), 0.0));
  let w1 = 0.125 / (1.0 + max(dot(c1.rgb, lumaCoeff), 0.0));
  let w2 = 0.125 / (1.0 + max(dot(c2.rgb, lumaCoeff), 0.0));
  let w3 = 0.125 / (1.0 + max(dot(c3.rgb, lumaCoeff), 0.0));
  let invWeightSum = 1.0 / max(wCenter + w0 + w1 + w2 + w3, 1e-5);

  let rgb = (cCenter.rgb * wCenter + c0.rgb * w0 + c1.rgb * w1 + c2.rgb * w2 + c3.rgb * w3) * invWeightSum;
  let alpha = cCenter.a * 0.5 + (c0.a + c1.a + c2.a + c3.a) * 0.125;
  return vec4<f32>(rgb, alpha);
}
