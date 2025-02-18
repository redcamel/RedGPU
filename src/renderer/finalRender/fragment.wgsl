
// Sampler and texture 2D variables for texture sampling
@group(1) @binding(0)
var _sampler: sampler;

@group(1) @binding(1)
var _texture: texture_2d<f32>;

// Fragment shader main function, called once per pixel
// fragUV variable holds the UV coordinates for the current fragment
@fragment
fn main(@location(0) fragUV : vec2<f32>) -> @location(0) vec4<f32> {
    // Sample the color from the texture at the UV coordinates
    var diffuseColor: vec4<f32> = textureSample(_texture, _sampler, fragUV);

    // Update the alpha value of the diffuse color
    diffuseColor = vec4<f32>(diffuseColor.rgb, diffuseColor.a);

    // Return the final color of the pixel
    return diffuseColor;
}
