#redgpu_include math.PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include SYSTEM_UNIFORM;
#redgpu_include skyAtmosphere.skyAtmosphereFn;

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec4<f32>,
};

struct FragmentOutput {
    @location(0) color : vec4<f32>,
    @location(1) normal : vec4<f32>,
    @location(2) motionVector : vec4<f32>,
};

@group(2) @binding(0) var bg_transmittanceLUT : texture_2d<f32>;
@group(2) @binding(1) var bg_skyViewLUT : texture_2d<f32>;
@group(2) @binding(2) var bg_skyAtmosphereSampler : sampler;

@fragment
fn main(input : VertexOutput) -> FragmentOutput {
    let uniforms = systemUniforms.skyAtmosphere;
    let groundRadius = uniforms.groundRadius;
    let atmosphereHeight = uniforms.atmosphereHeight;
    
    let viewDir = normalize(input.vertexPosition.xyz);
    let sunDir = normalize(uniforms.sunDirection);
    let viewHeight = max(0.0, uniforms.cameraHeight);

    // [KO] 행성(지면) 충돌 판정
    // [EN] Planet (ground) intersection test
    let camPos = vec3<f32>(0.0, groundRadius + viewHeight, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, groundRadius);
    let isGroundHit = groundRadius > 0.0 && tEarth > 0.0;

    // [KO] 1. SkyViewLUT 샘플링 (주 대기 산란광)
    // [EN] 1. SkyViewLUT sampling (Main atmospheric scattering)
    // [KO] SkyViewLUT는 이미 다중 산란과 부드러운 Mie 성분을 포함한 '단위 광휘'를 저장하고 있음
    let skyUV = getSkyViewUV(viewDir, viewHeight, groundRadius, atmosphereHeight);
    let skySample = textureSampleLevel(bg_skyViewLUT, bg_skyAtmosphereSampler, skyUV, 0.0);
    
    // [KO] 모든 광휘(Radiance) 연산은 Unit Scale로 진행 후 마지막에 노출(Intensity)을 적용함
    var atmosphereRadiance = skySample.rgb;

    // [KO] 2. 하이브리드 Mie Glow (전방 산란 피크 보강)
    // [KO] LUT 생성 시 손실된 날카로운 Mie 성분을 분석적으로 계산하여 합산 (UE5 스타일)
    // [EN] 2. Hybrid Mie Glow (Forward scattering peak reinforcement)
    // [EN] Analytically add the sharp Mie scattering component lost during LUT generation (UE5 style)
    let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);
    
    // [KO] 투과율 결정: 지면 충돌 시에는 카메라~지면(skySample.a), 하늘 방향은 카메라~대기 경계 투과율 사용
    // [EN] Determine transmittance: Use camera-to-ground (skySample.a) for ground hits, and camera-to-atmosphere edge for sky directions
    let transToEdge = select(
        getTransmittance(bg_transmittanceLUT, bg_skyAtmosphereSampler, viewHeight, viewDir.y, atmosphereHeight), 
        vec3<f32>(skySample.a), 
        isGroundHit
    );

    let mieGlow = getMieGlowAmountUnit(viewSunCos, viewHeight, uniforms, bg_transmittanceLUT, bg_skyAtmosphereSampler, transToEdge, 0.0);
    atmosphereRadiance += mieGlow;

    // [KO] 3. 태양 디스크 (Sun Disk)
    // [KO] 지면에 가려지지 않은 경우에만 태양 본체를 렌더링함
    // [EN] 3. Sun Disk
    // [EN] Render the sun body only if it's not obscured by the ground
    if (!isGroundHit) {
        let sunDisk = getSunDiskRadianceUnit(viewSunCos, uniforms.sunSize, uniforms.sunLimbDarkening, transToEdge, 0.01, uniforms);
        atmosphereRadiance += sunDisk;
    }

    // [KO] 최종 노출 적용: 태양 강도 및 시스템 Pre-Exposure를 곱해 최종 색상 결정
    // [EN] Apply final exposure: Multiply by sun intensity and system pre-exposure to determine the final color
    let finalRadiance = atmosphereRadiance * uniforms.sunIntensity * systemUniforms.preExposure;

    var output : FragmentOutput;
    output.color = vec4<f32>(finalRadiance, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    return output;
}
