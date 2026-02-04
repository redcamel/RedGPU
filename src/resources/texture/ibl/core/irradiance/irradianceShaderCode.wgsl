struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
     var pos = array<vec2<f32>, 6>(
            vec2<f32>(-1.0, -1.0), vec2<f32>( 1.0, -1.0), vec2<f32>(-1.0,  1.0),
            vec2<f32>(-1.0,  1.0), vec2<f32>( 1.0, -1.0), vec2<f32>( 1.0,  1.0)
    );

    // WebGPU 큐브맵 렌더링을 위한 표준 UV (Top-Left 0,0 기반)
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

// Hammersley 시퀀스를 위한 비트 반전 함수 (표준 IBL 기법)
fn radicalInverse_VdC(bits_in: u32) -> f32 {
    var bits = bits_in;
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return f32(bits) * 2.3283064365386963e-10; // / 0x100000000
}

fn hammersley(i: u32, n: u32) -> vec2<f32> {
    return vec2<f32>(f32(i) / f32(n), radicalInverse_VdC(i));
}
@fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let x = input.texCoord.x * 2.0 - 1.0;
    let y = input.texCoord.y * 2.0 - 1.0;

    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let normal = normalize((faceMatrix * localPos).xyz);

    // Duff Orthonormal Basis
    let s = select(1.0, -1.0, normal.z < 0.0);
    let a = -1.0 / (s + normal.z);
    let b = normal.x * normal.y * a;
    let tangent = vec3<f32>(1.0 + s * normal.x * normal.x * a, s * b, -s * normal.x);
    let bitangent = vec3<f32>(b, s + normal.y * normal.y * a, -normal.y);

    var irradiance = vec3<f32>(0.0);
    var totalWeight = 0.0;
    let totalSamples = 1024u;

    // 원본 환경맵의 해상도 (예: 1024x1024 가정)를 고려한 밉 선택 상수
    let envSize = f32(textureDimensions(environmentTexture).x);
    let saTexel = 4.0 * PI / (6.0 * envSize * envSize); // 텍셀당 입체각

    for (var i = 0u; i < totalSamples; i++) {
        let xi = hammersley(i, totalSamples);

        // Cosine-weighted hemisphere sampling
        let phi = 2.0 * PI * xi.x;
        let cosTheta = sqrt(1.0 - xi.y);
        let sinTheta = sqrt(xi.y);

        let sampleVec = vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);
        let worldSample = normalize(tangent * sampleVec.x + bitangent * sampleVec.y + normal * sampleVec.z);

        // PDF 계산: 코사인 가중치 샘플링의 경우 cosTheta / PI
        let pdf = max(cosTheta, 0.001) / PI;

        // 언리얼 스타일: 샘플의 입체각을 계산하여 적절한 LOD를 선택합니다.
        // 이를 통해 저해상도 Irradiance 맵에서도 앨리어싱(계단 현상)을 원천 차단합니다.
        let saSample = 1.0 / (f32(totalSamples) * pdf + 0.0001);
        let mipLevel = select(0.5 * log2(saSample / saTexel), 0.0, saSample <= 0.0);

        let sampleColor = textureSampleLevel(environmentTexture, environmentSampler, worldSample, mipLevel);

        // 물리적 정확도를 위해 가중치 누적 (여기서는 코사인 샘플링이므로 단순 누적 후 평균)
        irradiance += sampleColor.rgb;
        totalWeight += 1.0;
    }

    irradiance = irradiance / totalWeight;

    // 최종 결과 반환
    return vec4<f32>(irradiance, 1.0);
}