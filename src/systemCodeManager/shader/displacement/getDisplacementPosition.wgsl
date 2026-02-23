fn getDisplacementPosition(input_position:vec3<f32>, input_vertexNormal:vec3<f32>,displacementTexture:texture_2d<f32>, displacementTextureSampler:sampler, displacementScale:f32,input_uv:vec2<f32>, mipLevel:f32) -> vec3<f32> {
    let displacementSample = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv, mipLevel).r;
    let scaledDisplacement = (displacementSample - 0.5) * displacementScale;
    let displacedPosition = input_position + input_vertexNormal * scaledDisplacement;
    return displacedPosition;
}
