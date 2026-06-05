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

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    // [KO] 1. 인덱스 및 기초 데이터 로드
    // [EN] 1. Index and basic data loading
    let size_u = textureDimensions(outputTexture).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let face = global_id.z;
    
    var totalRadiance = vec3<f32>(0.0);
    // 큐브맵 품질을 위한 멀티 샘플링 개수
    const SAMPLE_COUNT: u32 = 4u; 

    // [KO] 2. 큐브맵 각 면(Face)의 방향에 따른 대기 산란광 적분
    // [EN] 2. Integrate atmospheric radiance according to each cubemap face direction
    for (var i = 0u; i < SAMPLE_COUNT; i = i + 1u) {
        // Hammersley 시퀀스를 이용한 정밀 샘플링
        let offset = getHammersley(i, SAMPLE_COUNT) - 0.5;
        let uv = (vec2<f32>(global_id.xy) + 0.5 + offset * 0.8) / size;
        
        var viewDir = getCubeMapDirection(uv, face);
        viewDir = normalize(viewDir);
        
        // 수직 방향 극점 보정 (Pole correction)
        if (abs(viewDir.y) > 0.9999) {
            viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
        }

        // [KO] 에너지 보정된 대기 광량 산출 (하드웨어 선형 샘플링 활용)
        // [EN] Calculate energy-compensated atmospheric radiance (Using hardware linear sampling)
        totalRadiance += evaluateIBLRadianceCompensated(viewDir, params, transmittanceTexture, multiScatTexture, skyViewTexture, atmosphereSampler);
    }

    // [KO] 3. 결과 평균화 및 큐브맵 텍스처 배열에 저장
    // [EN] 3. Average results and store in cubemap texture array
    let radiance = totalRadiance / f32(SAMPLE_COUNT);
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
