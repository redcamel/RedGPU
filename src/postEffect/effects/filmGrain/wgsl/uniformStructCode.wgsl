#redgpu_include color.getLuminance
#redgpu_include math.hash.getHash1D_vec3
#redgpu_include math.getInterleavedGradientNoise

struct Uniforms {
    filmGrainIntensity: f32,
    filmGrainResponse: f32,
    filmGrainScale: f32,
    coloredGrain: f32,
    grainSaturation: f32,
    devicePixelRatio: f32
};

/**
 * [KO] 고품질 시네마틱 필름 그레인을 생성합니다.
 */
fn getFilmicGrain(coord: vec2<f32>, frameIndex: u32, coloredGrain: f32) -> vec3<f32> {
    // [KO] 황금비(1.618...)를 활용하여 프레임 간 시드 변화의 비선형성 확보
    // [EN] Use Golden Ratio (1.618...) to ensure non-linear seed changes between frames
    let fIndex = f32(frameIndex % 4096u);
    let frameSeed = fIndex * 1.61803398875;
    
    // [KO] 좌표 스크램블링: 대각선 줄무늬 방지를 위해 X, Y축 상관관계를 강제로 파괴
    // [EN] Coordinate Scrambling: Forcing the destruction of X, Y axis correlation to prevent diagonal patterning
    let scrambledX = coord.x * 12.9898 + frameSeed;
    let scrambledY = coord.y * 78.233 + frameSeed;
    
    // 1. 단색 입자 (R, G, B 채널이 서로 다른 시드 평면을 샘플링하도록 설계)
    let n1 = getHash1D_vec3(vec3<f32>(scrambledX, scrambledY, frameSeed));
    let n2 = getHash1D_vec3(vec3<f32>(scrambledY, frameSeed, scrambledX));
    let n3 = getHash1D_vec3(vec3<f32>(frameSeed, scrambledX, scrambledY));
    
    // [KO] n1을 기본 명도로 사용하되, 유색 그레인 설정 시 각기 다른 평면의 값을 채널별로 할당
    // [EN] Use n1 as base luminance, but assign values from different planes per channel when colored grain is set
    var noise = mix(vec3<f32>(n1), vec3<f32>(n1, n2, n3), coloredGrain);
    
    // [KO] IGN은 극미량만 섞어 입자의 미세한 질감만 보강 (대각선 간섭 방지를 위해 비중 축소)
    // [EN] Mix a tiny amount of IGN to reinforce fine grain texture (reduced weight to avoid diagonal interference)
    let ign = getInterleavedGradientNoise(coord + frameSeed);
    let finalNoise = mix(noise, vec3<f32>(ign), 0.02);
    
    return (finalNoise - 0.5) * 2.0;
}
