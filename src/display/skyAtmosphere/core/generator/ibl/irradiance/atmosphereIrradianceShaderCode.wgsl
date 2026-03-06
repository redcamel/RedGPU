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
    
    // [KO] WebGPU 표준 큐브맵 좌표계에 따른 방향 계산 (Normal)
    // [EN] Calculate direction (Normal) according to WebGPU standard cubemap coordinate system
    let tex = uv * 2.0 - 1.0;
    var dir: vec3<f32>;
    switch (face) {
        case 0u: { dir = vec3<f32>(1.0, -tex.y, -tex.x); } // +X
        case 1u: { dir = vec3<f32>(-1.0, -tex.y, tex.x); } // -X
        case 2u: { dir = vec3<f32>(tex.x, 1.0, tex.y); }  // +Y
        case 3u: { dir = vec3<f32>(tex.x, -1.0, -tex.y); } // -Y
        case 4u: { dir = vec3<f32>(tex.x, -tex.y, 1.0); }  // +Z
        case 5u: { dir = vec3<f32>(-tex.x, -tex.y, -1.0); } // -Z
        default: { dir = vec3<f32>(0.0); }
    }
    let normal = normalize(dir);

    let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(normal.y) > 0.999);
    let tbn = getTBN(normal, up);

    var irradiance = vec3<f32>(0.0);
    let totalSamples = 1024u;

    for (var i = 0u; i < totalSamples; i = i + 1u) {
        let xi = hammersley(i, totalSamples);

        let phi = PI2 * xi.x;
        let cosTheta = sqrt(1.0 - xi.y);
        let sinTheta = sqrt(xi.y);

        let sampleVec = vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);
        let worldSample = normalize(tbn * sampleVec);

        // [KO] 소스 큐브맵의 밉맵을 활용하여 부드러운 적분 수행
        let sampleColor = textureSampleLevel(reflectionTexture, atmosphereSampler, worldSample, 5.0).rgb;
        irradiance += sampleColor;
    }

    // [KO] 적분 결과 (Unit scale)
    irradiance = irradiance / f32(totalSamples);

    // [KO] 태양의 직접 기여도 추가 (분석적 모델)
    // [KO] 정오(SunElevation 90)일 때 대기 투과율이 최대이므로 가장 밝게 표현됩니다.
    let sunDir = params.sunDirection;
    let NdotL = max(dot(normal, sunDir), 0.0);
    if (NdotL > 0.0) {
        let camH = params.cameraHeight;
        let atmH = params.atmosphereHeight;
        
        // [KO] 태양의 대기 투과율 계산 (고도각 sunDir.y 기준)
        let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, atmH);
        
        // [KO] 태양의 직접 조도 (E = L * cos(theta))
        // [KO] 머티리얼에서 최종적으로 sunIntensity를 곱하므로, 여기서는 (Transmittance * NdotL) / PI 만 더해줍니다.
        irradiance += (sunTrans * NdotL) * INV_PI;
    }

    textureStore(outTexture, global_id.xy, face, vec4<f32>(irradiance, 1.0));
}
