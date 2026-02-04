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
@group(0) @binding(1) var textureSampler: sampler;

struct PrefilterUniforms {
    faceMatrix: mat4x4<f32>,
    roughness: f32,
}
@group(0) @binding(2) var<uniform> uniforms: PrefilterUniforms;

const PI: f32 = 3.14159265359;

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

fn importanceSampleGGX(xi: vec2<f32>, N: vec3<f32>, roughness: f32) -> vec3<f32> {
    let a = roughness * roughness;
    let phi = 2.0 * PI * xi.x;
    let cosTheta = sqrt((1.0 - xi.y) / (1.0 + (a * a - 1.0) * xi.y));
    let sinTheta = sqrt(max(0.0, 1.0 - cosTheta * cosTheta));

    let H = vec3<f32>(cos(phi) * sinTheta, sin(phi) * sinTheta, cosTheta);

    let up = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 0.0, 1.0), abs(N.z) < 0.999);
    let tangent = normalize(cross(up, N));
    let bitangent = cross(N, tangent);

    return normalize(tangent * H.x + bitangent * H.y + N * H.z);
}

@fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let x = input.texCoord.x * 2.0 - 1.0;
    let y = input.texCoord.y * 2.0 - 1.0;

    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let N = normalize((uniforms.faceMatrix * localPos).xyz);
    
    // Split Sum Approximation: R = V = N
    let R = N;
    let V = R;

    let roughness = uniforms.roughness;
    var prefilteredColor = vec3<f32>(0.0);
    var totalWeight = 0.0;
    let numSamples = 1024u;

    for (var i = 0u; i < numSamples; i++) {
        let xi = hammersley(i, numSamples);
        let H = importanceSampleGGX(xi, N, roughness);
        let L = normalize(2.0 * dot(V, H) * H - V);

        let NdotL = max(dot(N, L), 0.0);
        if (NdotL > 0.0) {
            prefilteredColor += textureSampleLevel(environmentTexture, textureSampler, L, 0.0).rgb * NdotL;
            totalWeight += NdotL;
        }
    }

    if (totalWeight > 0.0) {
        return vec4<f32>(prefilteredColor / totalWeight, 1.0);
    } else {
        return textureSampleLevel(environmentTexture, textureSampler, N, 0.0);
    }
}