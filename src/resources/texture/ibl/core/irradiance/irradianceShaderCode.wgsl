// [KO] Irradiance 생성 컴퓨트 쉐이더
// [EN] Irradiance generation compute shader

@group(0) @binding(0) var environmentTexture: texture_cube<f32>;
@group(0) @binding(1) var environmentSampler: sampler;
@group(0) @binding(2) var outTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(3) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;

#redgpu_include math.PI
#redgpu_include math.PI2

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

@compute @workgroup_size(8, 8, 1)
fn cs_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outTexture);
    let size = vec2<f32>(size_u);
    
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) {
        return;
    }

    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / size;
    
    let x = uv.x * 2.0 - 1.0;
    let y = uv.y * 2.0 - 1.0;

    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let normal = normalize((faceMatrices[face] * localPos).xyz);

    // Duff Orthonormal Basis
    let s = select(1.0, -1.0, normal.z < 0.0);
    let a = -1.0 / (s + normal.z);
    let b = normal.x * normal.y * a;
    let tangent = vec3<f32>(1.0 + s * normal.x * normal.x * a, s * b, -s * normal.x);
    let bitangent = vec3<f32>(b, s + normal.y * normal.y * a, -normal.y);

    var irradiance = vec3<f32>(0.0);
    var totalWeight = 0.0;
    let totalSamples = 1024u;

    // 원본 환경맵의 해상도
    let envSize = f32(textureDimensions(environmentTexture).x);
    let saTexel = 4.0 * PI / (6.0 * envSize * envSize); // 텍셀당 입체각

    for (var i = 0u; i < totalSamples; i++) {
        let xi = hammersley(i, totalSamples);

        // Cosine-weighted hemisphere sampling
        let phi = PI2 * xi.x;
        let cosTheta = sqrt(1.0 - xi.y);
        let sinTheta = sqrt(xi.y);

        let sampleVec = vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);
        let worldSample = normalize(tangent * sampleVec.x + bitangent * sampleVec.y + normal * sampleVec.z);

        // PDF 계산: 코사인 가중치 샘플링의 경우 cosTheta / PI
        let pdf = max(cosTheta, 0.001) / PI;

        let saSample = 1.0 / (f32(totalSamples) * pdf + 0.0001);
        let mipLevel = max(0.5 * log2(saSample / saTexel), 0.0);

        let sampleColor = textureSampleLevel(environmentTexture, environmentSampler, worldSample, mipLevel);

        irradiance += sampleColor.rgb;
        totalWeight += 1.0;
    }

    irradiance = irradiance / totalWeight;

    textureStore(outTexture, global_id.xy, face, vec4<f32>(irradiance, 1.0));
}