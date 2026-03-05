#redgpu_include systemStruct.SkyAtmosphere
#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(0) var reflectionTexture: texture_cube<f32>;
@group(0) @binding(1) var atmosphereSampler: sampler;
@group(0) @binding(2) var outTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(3) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;
@group(0) @binding(4) var<uniform> params: SkyAtmosphere;
@group(0) @binding(5) var transmittanceTexture: texture_2d<f32>;

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.INV_PI
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

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outTexture).xy;
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

    let up = select(vec3<f32>(1.0, 0.0, 0.0), vec3<f32>(0.0, 0.0, 1.0), abs(normal.z) < 0.999);
    let tbn = getTBN(normal, up);

    var irradiance = vec3<f32>(0.0);
    let totalSamples = 1024u;

    // [KO] 소스 반사 맵의 해상도 정보 추출
    let envSize = f32(textureDimensions(reflectionTexture).x);
    let saTexel = 4.0 * PI / (6.0 * envSize * envSize);

    for (var i = 0u; i < totalSamples; i = i + 1u) {
        let xi = hammersley(i, totalSamples);

        // [KO] 코사인 가중치 반구 샘플링
        let phi = PI2 * xi.x;
        let cosTheta = sqrt(1.0 - xi.y);
        let sinTheta = sqrt(xi.y);

        let sampleVec = vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);
        let worldSample = normalize(tbn * sampleVec);

        let pdf = max(cosTheta, 0.001) * INV_PI;
        let saSample = 1.0 / (f32(totalSamples) * pdf + 0.0001);
        let mipLevel = max(0.5 * log2(saSample / saTexel) + 1.0, 0.0);

        let sampleColor = textureSampleLevel(reflectionTexture, atmosphereSampler, worldSample, mipLevel).rgb;
        
        irradiance += min(sampleColor, vec3<f32>(20.0));
    }

    // [KO] 적분 결과 (Unit scale)
    irradiance = (irradiance / f32(totalSamples)) * PI;

    // [KO] 태양의 직접 기여도 추가 (분석적 모델)
    // [EN] Add direct contribution from the sun (analytical model)
    let sunDir = params.sunDirection;
    let NdotL = max(dot(normal, sunDir), 0.0);
    if (NdotL > 0.0) {
        let camH = params.cameraHeight;
        let atmH = params.atmosphereHeight;
        let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, atmH);
        
        // [KO] 태양의 직접 조도 (Unit radiance 기준)
        // [EN] Direct irradiance from sun (Unit radiance based)
        irradiance += sunTrans * NdotL;
    }

    textureStore(outTexture, global_id.xy, face, vec4<f32>(irradiance, 1.0));
}
