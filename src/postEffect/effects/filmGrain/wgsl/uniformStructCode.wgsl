#redgpu_include color.getLuminance
#redgpu_include math.hash.getHash1D_vec3
#redgpu_include math.getInterleavedGradientNoise

struct Uniforms {
    filmGrainIntensity: f32,
    filmGrainResponse: f32,
    filmGrainScale: f32,
    coloredGrain: f32,
    grainSaturation: f32,
    time: f32,
    devicePixelRatio: f32
};

/**
 * [KO] 고품질 시네마틱 필름 그레인을 생성합니다.
 */
fn getFilmicGrain(coord: vec2<f32>, time: f32, coloredGrain: f32) -> vec3<f32> {
    // [KO] 프레임 시드 무작위성 극대화 (줄무늬 간섭 방지)
    // 소수점 단위를 크게 점프시켜 프레임 간 노이즈 상관관계를 완전히 파괴함
    let frameSeed = floor(time * 60.0) * 1.337;
    
    // 1. 단색 입자
    let monoSeed = vec3<f32>(coord, frameSeed);
    let monoNoise = getHash1D_vec3(monoSeed);
    
    // 2. 색상 입자 (시드 오프셋 대폭 증축)
    let chromaNoise = vec3<f32>(
        getHash1D_vec3(vec3<f32>(coord + 127.3, frameSeed + 13.11)),
        getHash1D_vec3(vec3<f32>(coord + 311.9, frameSeed + 27.22)),
        getHash1D_vec3(vec3<f32>(coord + 74.5, frameSeed + 43.33))
    );
    
    let noise = mix(vec3<f32>(monoNoise), chromaNoise, coloredGrain);
    
    // 3. IGN은 고정된 픽셀 그리드에서 추출 (화면 떨림 방지)
    let ign = getInterleavedGradientNoise(coord);
    
    // [KO] 두 요소를 결합 (IGN 비중을 낮춰서 규칙적인 선형 간섭 최소화)
    let finalNoise = mix(noise, vec3<f32>(ign), 0.05);
    
    return (finalNoise - 0.5) * 2.0;
}
