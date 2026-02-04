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

@group(0) @binding(0) var environmentTexture: texture_cube<f32>;
@group(0) @binding(1) var environmentSampler: sampler;
@group(0) @binding(2) var<uniform> faceMatrix: mat4x4<f32>;

const PI = 3.14159265359;

fn radicalInverse_VdC(bits_in: u32) -> f32 {
    var bits = bits_in;
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return f32(bits) * 2.3283064365386963e-10;
}

fn hammersley(i: u32, n: u32) -> vec2<f32> {
    return vec2<f32>(f32(i) / f32(n), radicalInverse_VdC(i));
}

@fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let x = input.texCoord.x * 2.0 - 1.0;
    let y = input.texCoord.y * 2.0 - 1.0;

    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let normal = normalize((faceMatrix * localPos).xyz);

    let s = select(1.0, -1.0, normal.z < 0.0);
    let a = -1.0 / (s + normal.z);
    let b = normal.x * normal.y * a;
    let tangent = vec3<f32>(1.0 + s * normal.x * normal.x * a, s * b, -s * normal.x);
    let bitangent = cross(normal, tangent);

    var irradiance = vec3<f32>(0.0);
    let totalSamples = 512u;

    for (var i = 0u; i < totalSamples; i++) {
        let xi = hammersley(i, totalSamples);
        let phi = 2.0 * PI * xi.x;
        let cosTheta = sqrt(1.0 - xi.y);
        let sinTheta = sqrt(xi.y);

        let sampleVec = vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);
        let worldSample = normalize(tangent * sampleVec.x + bitangent * sampleVec.y + normal * sampleVec.z);

        let sampleColor = textureSampleLevel(environmentTexture, environmentSampler, worldSample, 0.0);
        irradiance += sampleColor.rgb;
    }

    return vec4<f32>(irradiance / f32(totalSamples), 1.0);
}