#redgpu_include skyAtmosphere.skyAtmosphereFn
@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(5) var skyViewTexture: texture_2d<f32>;

#redgpu_include math.hash.getHammersley
#redgpu_include color.getLuminance

/**
 * [KO] 정반사 IBL 베이킹을 위해 대기 복사휘도를 조회하고 파이어플라이(Firefly) 방지를 위해 최대 휘도를 제한합니다.
 * [EN] Evaluates atmospheric radiance for specular IBL baking and clamps maximum luminance to prevent fireflies.
 */
fn getIBLAtmosphereRadiance(viewDir: vec3<f32>) -> vec3<f32> {
    var radiance = evaluateIBLRadiance(viewDir, params, transmittanceTexture, skyViewTexture, atmosphereSampler, false);

    let maxIBLLuminance: f32 = 10000.0; 
    let lum = getLuminance(radiance);
    if (lum > maxIBLLuminance) {
        radiance *= (maxIBLLuminance / lum);
    }

    return radiance;
}

/**
 * [KO] 간접 정반사 조명(Reflection) 프리필터링의 소스 환경 큐브맵을 대기 산란 데이터로부터 생성합니다.
 * [EN] Generates the source environment cubemap for indirect specular (Reflection) prefiltering from atmospheric scattering data.
 */
@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outputTexture).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let baseCoord = vec2<f32>(global_id.xy) + 0.5;
    let face = global_id.z;
    
    var totalRadiance = vec3<f32>(0.0);
    const SAMPLE_COUNT: u32 = 8u;

    // [KO] Hammersley 시퀀스를 이용해 큐브맵 각 면의 대기 산란광을 멀티 샘플링합니다.
    // [EN] Multi-sample atmospheric scattered radiance across each cubemap face using the Hammersley sequence.
    for (var i = 0u; i < SAMPLE_COUNT; i = i + 1u) {
        let offset = getHammersley(i, SAMPLE_COUNT) - 0.5;
        let uv = (baseCoord + offset) / size;
        
        let rawDir = getCubeMapDirection(uv, face);
        let invLen = inverseSqrt(dot(rawDir, rawDir));
        var viewDir = rawDir * invLen;
        
        if (abs(viewDir.y) > 0.9999) {
            viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
        }

        totalRadiance += getIBLAtmosphereRadiance(viewDir);
    }

    const INV_SAMPLE_COUNT_PI: f32 = (1.0 / f32(SAMPLE_COUNT)) * PI;
    let radiance = totalRadiance * INV_SAMPLE_COUNT_PI;
    textureStore(outputTexture, global_id.xy, face, vec4<f32>(radiance, 1.0));
}
