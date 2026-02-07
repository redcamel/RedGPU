// [KO] BRDF 통합 컴퓨트 쉐이더 (DFG LUT 생성용)
// [EN] BRDF integration compute shader (for DFG LUT generation)

@group(0) @binding(0) var outTexture: texture_storage_2d<rgba16float, write>;

const PI = 3.14159265359;

fn radicalInverse_VdC(bits: u32) -> f32 {
    var b = bits;
    b = (b << 16u) | (b >> 16u);
    b = ((b & 0x55555555u) << 1u) | ((b & 0xAAAAAAAAu) >> 1u);
    b = ((b & 0x33333333u) << 2u) | ((b & 0xCCCCCCCCu) >> 2u);
    b = ((b & 0x0F0F0F0Fu) << 4u) | ((b & 0xF0F0F0F0u) >> 4u);
    b = ((b & 0x00FF00FFu) << 8u) | ((b & 0xFF00FF00u) >> 8u);
    return f32(b) * 2.3283064365386963e-10; // / 0x100000000
}

fn hammersley(i: u32, N: u32) -> vec2<f32> {
    return vec2<f32>(f32(i) / f32(N), radicalInverse_VdC(i));
}

fn importanceSampleGGX(Xi: vec2<f32>, N: vec3<f32>, roughness: f32) -> vec3<f32> {
    let a = roughness * roughness;
    let phi = 2.0 * PI * Xi.x;
    let cosTheta = sqrt((1.0 - Xi.y) / (1.0 + (a * a - 1.0) * Xi.y));
    let sinTheta = sqrt(1.0 - cosTheta * cosTheta);

    let H = vec3<f32>(cos(phi) * sinTheta, sin(phi) * sinTheta, cosTheta);

    let up = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 0.0, 1.0), abs(N.z) < 0.999);
    let tangent = normalize(cross(up, N));
    let bitangent = cross(N, tangent);

    return normalize(tangent * H.x + bitangent * H.y + N * H.z);
}

fn geometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {
    let a = roughness;
    let k = (a * a) / 2.0;
    let nom = NdotV;
    let denom = NdotV * (1.0 - k) + k;
    return nom / denom;
}

fn geometrySmith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {
    let NdotV = max(dot(N, V), 0.0);
    let NdotL = max(dot(N, L), 0.0);
    let ggx2 = geometrySchlickGGX(NdotV, roughness);
    let ggx1 = geometrySchlickGGX(NdotL, roughness);
    return ggx1 * ggx2;
}

fn integrateBRDF(in_NdotV: f32, roughness: f32) -> vec2<f32> {
    let NdotV = max(in_NdotV, 0.001);
    var V: vec3<f32>;
    V.x = sqrt(1.0 - NdotV * NdotV);
    V.y = 0.0;
    V.z = NdotV;

    var A = 0.0;
    var B = 0.0;

    let N = vec3<f32>(0.0, 0.0, 1.0);
    let sampleCount = 1024u;

    for (var i = 0u; i < sampleCount; i = i + 1u) {
        let Xi = hammersley(i, sampleCount);
        let H = importanceSampleGGX(Xi, N, roughness);
        let L = normalize(2.0 * dot(V, H) * H - V);

        let NdotL = max(L.z, 0.0);
        let NdotH = max(H.z, 0.0);
        let VdotH = max(dot(V, H), 0.0);

        if (NdotL > 0.0) {
            let G = geometrySmith(N, V, L, roughness);
            let G_Vis = (G * VdotH) / (max(NdotH * NdotV, 0.001));
            let Fc = pow(1.0 - VdotH, 5.0);

            A = A + (1.0 - Fc) * G_Vis;
            B = B + Fc * G_Vis;
        }
    }

    return vec2<f32>(A, B) / f32(sampleCount);
}

@compute @workgroup_size(16, 16)
fn cs_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(outTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) {
        return;
    }

    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let integratedBRDF = integrateBRDF(uv.x, uv.y);
    textureStore(outTexture, global_id.xy, vec4<f32>(integratedBRDF, 0.0, 1.0));
}

