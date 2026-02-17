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

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.tnb.getTBN

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
    let phi = PI2 * xi.x;
    let cosTheta = sqrt((1.0 - xi.y) / (1.0 + (a * a - 1.0) * xi.y));
    let sinTheta = sqrt(max(0.0, 1.0 - cosTheta * cosTheta));

    let H_local = vec3<f32>(cos(phi) * sinTheta, sin(phi) * sinTheta, cosTheta);

    // [KO] 공통 라이브러리 math.getTBN을 사용하여 일관된 기저 생성
    // [EN] Create consistent basis using common library math.getTBN
    let up = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 0.0, 1.0), abs(N.z) < 0.999);
    let tbn = getTBN(N, up);

    return normalize(tbn * H_local);
}

@compute @workgroup_size(8, 8, 1)
fn cs_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outTexture);
    let size = vec2<f32>(size_u);
    
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) {
        return;
    }

    let face = global_id.z;
    let roughness = uniforms.roughness;

    // UV를 로컬 좌표 (-1.0 ~ 1.0)로 변환 (중앙 샘플링 보정)
    let uv = (vec2<f32>(global_id.xy) + 0.5) / size;
    let x = uv.x * 2.0 - 1.0;
    let y = uv.y * 2.0 - 1.0;

    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let N = normalize((uniforms.faceMatrices[face] * localPos).xyz);
    
    // Roughness가 0인 경우 (완전 거울) 특수 처리하여 선명도 극대화
    if (roughness <= 0.0) {
        textureStore(outTexture, global_id.xy, face, textureSampleLevel(environmentTexture, textureSampler, N, 0.0));
        return;
    }

    let R = N;
    let V = R;

    var prefilteredColor = vec3<f32>(0.0);
    var totalWeight = 0.0;
    let numSamples = 1024u;
    
    let envSize = f32(textureDimensions(environmentTexture).x);
    let saTexel = 4.0 * PI / (6.0 * envSize * envSize);

    for (var i = 0u; i < numSamples; i++) {
        let xi = hammersley(i, numSamples);
        let H = importanceSampleGGX(xi, N, roughness);
        let L = normalize(2.0 * dot(V, H) * H - V);

        let NdotL = max(dot(N, L), 0.0);
        if (NdotL > 0.0) {
            let NdotH = max(dot(N, H), 0.001);
            let VdotH = max(dot(V, H), 0.001);
            
            let D = distribution_ggx(NdotH, roughness);
            let pdf = (D * NdotH / (4.0 * VdotH)) + 0.0001;
            
            let saSample = 1.0 / (f32(numSamples) * pdf + 0.0001);
            let mipLevel = max(0.25 * log2(saSample / saTexel), 0.0);

            prefilteredColor += textureSampleLevel(environmentTexture, textureSampler, L, mipLevel).rgb * NdotL;
            totalWeight += NdotL;
        }
    }

    if (totalWeight > 0.0) {
        textureStore(outTexture, global_id.xy, face, vec4<f32>(prefilteredColor / totalWeight, 1.0));
    } else {
        textureStore(outTexture, global_id.xy, face, textureSampleLevel(environmentTexture, textureSampler, N, 0.0));
    }
}