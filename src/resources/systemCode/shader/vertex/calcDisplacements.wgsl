fn calcDisplacementPosition(input_position:vec3<f32>, input_vertexNormal:vec3<f32>,displacementTexture:texture_2d<f32>, displacementTextureSampler:sampler, displacementScale:f32,input_uv:vec2<f32>, mipLevel:f32) -> vec3<f32> {
    let displacementSample = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv, mipLevel).r;
    let scaledDisplacement = (displacementSample - 0.5) * displacementScale;
    let displacedPosition = input_position + input_vertexNormal * scaledDisplacement;
    return displacedPosition;
}
fn calcDisplacementNormal(input_vertexNormal: vec3<f32>, displacementTexture: texture_2d<f32>, displacementTextureSampler: sampler, displacementScale: f32, input_uv: vec2<f32>, mipLevel: f32) -> vec3<f32> {
    let offset = 0.001;

    // MIP 레벨 고정
    let fixedMipLevel = 0.0;

    let left = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(-offset, 0.0), fixedMipLevel).r;
    let right = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(offset, 0.0), fixedMipLevel).r;
    let down = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(0.0, -offset), fixedMipLevel).r;
    let up = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv + vec2<f32>(0.0, offset), fixedMipLevel).r;

    let ddx = ((right - 0.5) - (left - 0.5)) * displacementScale / (2.0 * offset);
    let ddy = ((down - 0.5) - (up - 0.5)) * displacementScale / (2.0 * offset);

    let tangentSpaceNormal = normalize(vec3<f32>(-ddx, -ddy, 1.0));
    let worldNormal = normalize(input_vertexNormal);
    let result = normalize(worldNormal + tangentSpaceNormal * 0.5);

    return result;
}
