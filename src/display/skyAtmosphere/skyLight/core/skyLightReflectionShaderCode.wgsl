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
 * [KO] IBL용 대기 광량을 산출하고 극단적인 밝기를 제어합니다.
 * [EN] Calculate atmospheric radiance for IBL and control extreme brightness.
 */
fn getIBLAtmosphereRadiance(viewDir: vec3<f32>) -> vec3<f32> {
    // [KO] 하드웨어 선형 샘플링을 통해 기초 대기 광량 조회
    // [EN] Retrieve base atmospheric radiance via hardware linear sampling
    var radiance = evaluateIBLRadiance(viewDir, params, transmittanceTexture, multiScatTexture, skyViewTexture, atmosphereSampler);

    // [KO] IBL 베이킹 시 태양 등의 극단적인 고휘도가 텍셀을 깨뜨리지 않도록 임계값 클램핑
    // [EN] Clamp radiance to prevent extreme highlights (like the sun) from breaking texels during IBL baking
    let maxIBLLuminance: f32 = 10000.0; 
    let lum = getLuminance(radiance);
    if (lum > maxIBLLuminance) {
        radiance *= (maxIBLLuminance / lum);
    }

    return radiance;
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    // [KO] 1. 인덱스 및 기초 데이터 로드
    // [EN] 1. Index and basic data loading
    let size_u = textureDimensions(outputTexture).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let face = global_id.z;
    
    var totalRadiance = vec3<f32>(0.0);
    const SAMPLE_COUNT: u32 = 8u;

    // [KO] 2. 큐브맵 베이킹을 위한 대기 산란광 샘플링 루프
    // [EN] 2. Atmospheric radiance sampling loop for cubemap baking
    for (var i = 0u; i < SAMPLE_COUNT; i = i + 1u) {
        let offset = getHammersley(i, SAMPLE_COUNT) - 0.5;
        let uv = (vec2<f32>(global_id.xy) + 0.5 + offset) / size;
        
        var viewDir = getCubeMapDirection(uv, face);
        viewDir = normalize(viewDir);
        
        if (abs(viewDir.y) > 0.9999) {
            viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
        }

        totalRadiance += getIBLAtmosphereRadiance(viewDir);
    }

    // [KO] 3. 평균 산란광 저장
    // [EN] 3. Store average radiance
    let radiance = totalRadiance / f32(SAMPLE_COUNT);
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
