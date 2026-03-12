#redgpu_include systemStruct.SkyAtmosphere
#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(0) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(1) var atmosphereSampler: sampler;
@group(0) @binding(2) var outTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(5) var skyViewTexture: texture_2d<f32>;

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.INV_PI
#redgpu_include math.tnb.getTBN
#redgpu_include color.getLuminance

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
    let dir = getCubeMapDirection(uv, face);
    let normal = normalize(dir);

    let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(normal.y) > 0.999);
    let tbn = getTBN(normal, up);

    var irradiance = vec3<f32>(0.0);
    var totalWeight = 0.0;
    let totalSamples = 1024u;

    for (var i = 0u; i < totalSamples; i = i + 1u) {
        let xi = hammersley(i, totalSamples);

        let phi = PI2 * xi.x;
        let cosTheta = sqrt(1.0 - xi.y);
        let sinTheta = sqrt(xi.y);

        let sampleVec = vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);
        let worldSample = normalize(tbn * sampleVec);

        // [KO] 텍스처 샘플링 대신 대기 휘도를 직접 계산 (완벽한 독립화)
        // [EN] Directly calculate atmosphere radiance instead of texture sampling (complete independence)
        irradiance += evaluateIBLRadiance(worldSample, params, transmittanceTexture, multiScatTexture, skyViewTexture, atmosphereSampler, 0u);
        totalWeight += 1.0;
    }

    // [KO] 적분 결과 (Unit scale)
    irradiance = irradiance / totalWeight;

    textureStore(outTexture, global_id.xy, face, vec4<f32>(irradiance, 1.0));
}
