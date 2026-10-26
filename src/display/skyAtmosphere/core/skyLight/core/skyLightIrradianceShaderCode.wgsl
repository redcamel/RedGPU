#redgpu_include skyAtmosphere.skyAtmosphereFn
@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(5) var skyViewTexture: texture_2d<f32>;

#redgpu_include math.hash.getHammersley

/**
 * [KO] 간접 난반사 조명(Irradiance) 컨볼루션의 소스 환경 큐브맵을 대기 산란 및 태양 디스크 데이터로부터 생성합니다.
 * [EN] Generates the source environment cubemap for indirect diffuse (Irradiance) convolution from atmospheric scattering and sun disk data.
 */
@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outputTexture).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let baseCoord = vec2<f32>(global_id.xy) + 0.5;
    let face = global_id.z;
    
    var totalRadiance = vec3<f32>(0.0);
    const SAMPLE_COUNT: u32 = 4u; 

    // [KO] Hammersley 준난수 오프셋을 사용해 큐브맵 각 면의 대기 및 태양 복사휘도를 멀티 샘플링합니다.
    // [EN] Multi-sample atmospheric and solar radiance for each cubemap face using Hammersley quasi-random offsets.
    for (var i = 0u; i < SAMPLE_COUNT; i = i + 1u) {
        let offset = getHammersley(i, SAMPLE_COUNT) - 0.5;
        let uv = (baseCoord + offset * 0.8) / size;
        
        let rawDir = getCubeMapDirection(uv, face);
        let invLen = inverseSqrt(dot(rawDir, rawDir));
        var viewDir = rawDir * invLen;
        
        if (abs(viewDir.y) > 0.9999) {
            viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
        }

        totalRadiance += evaluateIBLRadiance(viewDir, params, transmittanceTexture, skyViewTexture, atmosphereSampler, true);
    }

    const INV_SAMPLE_COUNT_PI: f32 = (1.0 / f32(SAMPLE_COUNT)) * PI;
    let radiance = totalRadiance * INV_SAMPLE_COUNT_PI;
    textureStore(outputTexture, global_id.xy, face, vec4<f32>(radiance, 1.0));
}
