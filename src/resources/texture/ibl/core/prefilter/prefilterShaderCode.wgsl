// [KO] Prefilter 생성 컴퓨트 쉐이더
// [EN] Prefilter generation compute shader

@group(0) @binding(0) var environmentTexture: texture_cube<f32>;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var outTexture: texture_storage_2d_array<rgba16float, write>;

struct PrefilterUniforms {
    faceMatrices: array<mat4x4<f32>, 6>,
    roughness: f32,
}
@group(0) @binding(3) var<uniform> uniforms: PrefilterUniforms;

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

fn distribution_ggx(NdotH: f32, roughness: f32) -> f32 {
    let a = roughness * roughness;
    let a2 = a * a;
    let NdotH2 = NdotH * NdotH;
    let denom = (NdotH2 * (a2 - 1.0) + 1.0);
    return a2 / (PI * denom * denom);
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

@compute @workgroup_size(8, 8, 1)
fn cs_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(outTexture);
    if (global_id.x >= size.x || global_id.y >= size.y || global_id.z >= 6u) {
        return;
    }

    let face = global_id.z;
    // 하프 픽셀 보정 및 정규화된 UV 좌표 (0.0 ~ 1.0)
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    
    // UV를 로컬 좌표 (-1.0 ~ 1.0)로 변환
    let x = uv.x * 2.0 - 1.0;
    let y = uv.y * 2.0 - 1.0;

    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let N = normalize((uniforms.faceMatrices[face] * localPos).xyz);
    
    let R = N;
    let V = R;

    let roughness = uniforms.roughness;
    var prefilteredColor = vec3<f32>(0.0);
    var totalWeight = 0.0;
    let numSamples = 1024u;
    
    // NdotV가 0이 되는 것을 방지
    let NdotV = max(dot(N, V), 0.001);

    let envSize = f32(textureDimensions(environmentTexture).x);
    // 밉맵 기반 노이즈 억제를 위한 상수
    let saTexel = 4.0 * PI / (6.0 * envSize * envSize);

    for (var i = 0u; i < numSamples; i++) {
        let xi = hammersley(i, numSamples);
        let H = importanceSampleGGX(xi, N, roughness);
        let L = normalize(2.0 * dot(V, H) * H - V);

        let NdotL = max(dot(N, L), 0.0);
        if (NdotL > 0.0) {
            // Filtered Importance Sampling 로직
            let NdotH = max(dot(N, H), 0.001);
            let VdotH = max(dot(V, H), 0.001);
            
            // PDF 계산
            let D = distribution_ggx(NdotH, roughness);
            let pdf = (D * NdotH / (4.0 * VdotH)) + 0.0001;
            
            // 샘플의 입체각(Solid Angle) 계산
            let saSample = 1.0 / (f32(numSamples) * pdf + 0.0001);
            // 밉레벨 결정 (바이어스 축소: 0.5 -> 0.25)
            let mipLevel = select(max(0.25 * log2(saSample / saTexel), 0.0), 0.0, roughness == 0.0);

            prefilteredColor += textureSampleLevel(environmentTexture, textureSampler, L, mipLevel).rgb * NdotL;
            totalWeight += NdotL;
        }
    }

    if (totalWeight > 0.0) {
        textureStore(outTexture, global_id.xy, global_id.z, vec4<f32>(prefilteredColor / totalWeight, 1.0));
    } else {
        textureStore(outTexture, global_id.xy, global_id.z, textureSampleLevel(environmentTexture, textureSampler, N, 0.0));
    }
}