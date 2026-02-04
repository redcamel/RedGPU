struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var pos = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0), vec2<f32>( 1.0, -1.0), vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0), vec2<f32>( 1.0, -1.0), vec2<f32>( 1.0,  1.0)
    );

    var texCoord = array<vec2<f32>, 6>(
        vec2<f32>(0.0, 1.0), vec2<f32>(1.0, 1.0), vec2<f32>(0.0, 0.0),
        vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 1.0), vec2<f32>(1.0, 0.0)
    );

    var output: VertexOutput;
    output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
    output.texCoord = texCoord[vertexIndex];
    return output;
}

@group(0) @binding(0) var equirectangularTexture: texture_2d<f32>;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var<uniform> faceMatrix: mat4x4<f32>;

const PI: f32 = 3.14159265359;

fn directionToSphericalUV(dir: vec3<f32>) -> vec2<f32> {
    let normalizedDir = normalize(dir);
    let theta = atan2(normalizedDir.x, normalizedDir.z);
    let phi = acos(clamp(normalizedDir.y, -1.0, 1.0));
    return vec2<f32>(0.5 - theta / (2.0 * PI), phi / PI);
}

@fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let x = input.texCoord.x * 2.0 - 1.0;
    let y = input.texCoord.y * 2.0 - 1.0;

    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let direction = (faceMatrix * localPos).xyz;
    
    let uv = directionToSphericalUV(direction);
    return textureSampleLevel(equirectangularTexture, textureSampler, uv, 0.0);
}
