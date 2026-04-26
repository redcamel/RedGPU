#redgpu_include skyAtmosphere.skyAtmosphereFn
@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(5) var skyViewTexture: texture_2d<f32>;

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.INV_PI

#redgpu_include math.hash.getHammersley
#redgpu_include color.getLuminance

/**
 * [KO] IBL 반사 맵 전용 대기 휘도를 계산합니다.
 * [EN] Calculates atmospheric radiance specifically for IBL reflection maps.
 *
 * [KO] 태양 본체(Sun Disk)를 제외하여 파이어플라이를 방지하고, 대기 산란 및 부드러운 Mie Glow만 포함합니다.
 * [EN] Prevents fireflies by excluding the Sun Disk, including only atmospheric scattering and soft Mie Glow.
 */
fn getIBLAtmosphereRadiance(viewDir: vec3<f32>) -> vec3<f32> {
    // [KO] 1. 태양 본체가 포함되지 않은 순수 대기 산란광을 평가합니다. (evaluateIBLRadiance 사용)
    // [EN] 1. Evaluate pure atmospheric scattering without the sun disk. (Using evaluateIBLRadiance)
    // [KO] evaluateIBLRadiance는 SkyViewLUT와 Mie Glow만 합산하며, 날카로운 태양 디스크는 포함하지 않습니다.
    var radiance = evaluateIBLRadiance(viewDir, params, transmittanceTexture, multiScatTexture, skyViewTexture, atmosphereSampler);

    // [KO] 2. 반사 맵의 안정성을 위해 휘도의 극단적인 피크를 소프트 클램핑합니다.
    // [EN] 2. Soft-clamp extreme luminance peaks for reflection map stability.
    // [KO] 태양 방향의 Mie Glow가 너무 강할 경우를 대비하여 상한선을 둡니다.
    let maxIBLLuminance: f32 = 10000.0; 
    let lum = getLuminance(radiance);
    if (lum > maxIBLLuminance) {
        radiance *= (maxIBLLuminance / lum);
    }

    return radiance;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outputTexture).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let face = global_id.z;
    
    var totalRadiance = vec3<f32>(0.0);
    const SAMPLE_COUNT: u32 = 8u; // [KO] 고품질 적분을 위한 샘플 수 (UE5 등급)

    for (var i = 0u; i < SAMPLE_COUNT; i = i + 1u) {
        let offset = getHammersley(i, SAMPLE_COUNT) - 0.5;
        let uv = (vec2<f32>(global_id.xy) + 0.5 + offset) / size;
        
        var viewDir = getCubeMapDirection(uv, face);
        viewDir = normalize(viewDir);
        
        if (abs(viewDir.y) > 0.9999) {
            viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
        }

        // [KO] 태양 본체가 제거된 전용 함수를 사용하여 반사 맵 휘도를 누적합니다.
        // [EN] Accumulate reflection map radiance using the dedicated function with the sun disk removed.
        totalRadiance += getIBLAtmosphereRadiance(viewDir);
    }

    let radiance = totalRadiance / f32(SAMPLE_COUNT);
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
