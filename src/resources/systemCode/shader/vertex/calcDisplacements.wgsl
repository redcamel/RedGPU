fn calcDisplacementPosition(input_position:vec3<f32>, input_vertexNormal:vec3<f32>,displacementTexture:texture_2d<f32>, displacementTextureSampler:sampler, displacementScale:f32,input_uv:vec2<f32>, mipLevel:f32) -> vec3<f32> {
    let displacementSample = textureSampleLevel(displacementTexture, displacementTextureSampler, input_uv, mipLevel).r;
    let scaledDisplacement = (displacementSample - 0.5) * displacementScale;
    let displacedPosition = input_position + input_vertexNormal * scaledDisplacement;
    return displacedPosition;
}
fn calcDisplacementNormal(input_vertexNormal:vec3<f32>,displacementTexture:texture_2d<f32>, displacementTextureSampler:sampler, displacementScale:f32, input_uv:vec2<f32>, mipLevel:f32) -> vec3<f32> {
    let textureSize = textureDimensions(displacementTexture);
    let texelSizeX = 1.0 / f32(textureSize.x);
    let texelSizeY = 1.0 / f32(textureSize.y);

    let displacementRight = textureSampleLevel(displacementTexture, displacementTextureSampler,
                                            input_uv + vec2<f32>(texelSizeX, 0.0), mipLevel).r;
    let displacementLeft = textureSampleLevel(displacementTexture, displacementTextureSampler,
                                           input_uv - vec2<f32>(texelSizeX, 0.0), mipLevel).r;
    let displacementUp = textureSampleLevel(displacementTexture, displacementTextureSampler,
                                          input_uv + vec2<f32>(0.0, texelSizeY), mipLevel).r;
    let displacementDown = textureSampleLevel(displacementTexture, displacementTextureSampler,
                                            input_uv - vec2<f32>(0.0, texelSizeY), mipLevel).r;

    let gradientX = ((displacementRight - 0.5) - (displacementLeft - 0.5)) * displacementScale * 0.2;
    let gradientY = ((displacementUp - 0.5) - (displacementDown - 0.5)) * displacementScale * 0.2;

    let up = vec3<f32>(0.0, 1.0, 0.0);
    let tangent = normalize(cross(up, input_vertexNormal));
    let bitangent = normalize(cross(input_vertexNormal, tangent));

    let tangentSpaceNormal = normalize(vec3<f32>(gradientX, gradientY, 1.0));

    let objectSpaceNormal = tangentSpaceNormal.x * tangent +
                           tangentSpaceNormal.y * bitangent +
                           tangentSpaceNormal.z * input_vertexNormal;

    return normalize(objectSpaceNormal);

}
