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

@group(1) @binding(0) var bg_transmittanceLUT : texture_2d<f32>;
@group(1) @binding(1) var bg_skyViewLUT : texture_2d<f32>;
@group(1) @binding(2) var bg_skyAtmosphereSampler : sampler;

@fragment
fn main(input : VertexOutput) -> FragmentOutput {
    let uniforms = systemUniforms.skyAtmosphere;
    let groundRadius = uniforms.groundRadius;
    let atmosphereHeight = uniforms.atmosphereHeight;
    
    let viewDir = normalize(input.vertexPosition.xyz);
    let sunDir = normalize(uniforms.sunDirection);
    let viewHeight = max(0.0, uniforms.cameraHeight);

    let camPos = vec3<f32>(0.0, groundRadius + viewHeight, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, groundRadius);
    let isGroundHit = groundRadius > 0.0 && tEarth > 0.0;

    let skyUV = getSkyViewUV(viewDir, viewHeight, groundRadius, atmosphereHeight);
    let skySample = textureSampleLevel(bg_skyViewLUT, bg_skyAtmosphereSampler, skyUV, 0.0);
    
    var atmosphereRadiance = skySample.rgb;

    // 수평선 부드럽게 처리 (Horizon Smoothing)
    let horizonCos = -sqrt(max(0.0, 1.0 - pow(groundRadius / (groundRadius + viewHeight), 2.0)));
    let viewDirCos = viewDir.y;
    let horizonDistance = viewDirCos - horizonCos;
    let horizonFade = clamp(horizonDistance * 100.0, 0.0, 1.0); // 수평선 근처에서 0~1 사이로 부드럽게 변화

    let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);
    
    let transToEdge = select(
        getTransmittance(bg_transmittanceLUT, bg_skyAtmosphereSampler, viewHeight, viewDir.y, atmosphereHeight), 
        vec3<f32>(skySample.a), 
        isGroundHit
    );

    let sunShadow = getPlanetShadowMask(camPos, sunDir, groundRadius, uniforms);
    
    // 지면 히트 시에도 대기 산란광을 자연스럽게 섞음
    if (sunShadow > 0.0) {
        let mieGlow = getMieGlowAmountUnit(viewSunCos, viewHeight, uniforms, bg_transmittanceLUT, bg_skyAtmosphereSampler, transToEdge, 0.0);
        let sunDisk = getSunDiskRadianceUnit(viewSunCos, uniforms.sunSize, uniforms.sunLimbDarkening, transToEdge, 0.01, uniforms);
        
        let additionalRadiance = (mieGlow + sunDisk) * sunShadow;
        // 지면일 경우 horizonFade를 이용하여 수평선 근처만 부드럽게 추가
        atmosphereRadiance += select(additionalRadiance * horizonFade, additionalRadiance, !isGroundHit);
    }

    // 지면 색상과 대기광 합성 (여기서는 배경이므로 지면을 대기 산란광으로 덮어 부드럽게 처리)
    if (isGroundHit) {
        let groundColor = uniforms.groundAlbedo * 0.01; // 매우 어두운 기본 지면색
        atmosphereRadiance = mix(atmosphereRadiance, groundColor, horizonFade * 0.5);
    }

    let finalRadiance = atmosphereRadiance * uniforms.sunIntensity * systemUniforms.preExposure;

    var output : FragmentOutput;
    output.color = vec4<f32>(finalRadiance, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    return output;
}