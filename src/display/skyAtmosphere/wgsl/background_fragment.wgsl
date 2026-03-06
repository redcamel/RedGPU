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

@group(2) @binding(0) var bg_atmosphereTransmittanceTexture : texture_2d<f32>;
@group(2) @binding(1) var bg_atmosphereSkyViewTexture : texture_2d<f32>;
@group(2) @binding(2) var bg_atmosphereSampler : sampler;

@fragment
fn main(input : VertexOutput) -> FragmentOutput {
    let uniforms = systemUniforms.skyAtmosphere;
    let camH = uniforms.cameraHeight;
    let r = uniforms.earthRadius;
    let atmH = uniforms.atmosphereHeight;
    let viewDir = normalize(input.vertexPosition.xyz);
    let sunDir = normalize(uniforms.sunDirection);

    // [KO] 매핑 안정화를 위한 클램핑 고도 (Sea Level Offset 반영된 camH 기준)
    let mappingH = max(0.0, camH);
    let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(bg_atmosphereSkyViewTexture, bg_atmosphereSampler, skyUV, 0.0);
    var atmosphereBackground = skySample.rgb * (uniforms.sunIntensity * uniforms.skyViewScatMult);

    // [KO] 하이브리드 Mie Glow: LUT에 없는 날카로운 산란 피크를 실시간으로 합산
    // [EN] Hybrid Mie Glow: Add sharp scattering peaks not present in LUT in real-time
    let viewSunCos = dot(viewDir, sunDir);
    let miePhaseSharp = phaseMie(viewSunCos, uniforms.mieHalo);
    let sunTransForGlow = getTransmittance(bg_atmosphereTransmittanceTexture, bg_atmosphereSampler, mappingH, sunDir.y, uniforms.atmosphereHeight);
    
    // [KO] 산란 강도 근사: SunIntensity * Transmittance * (Scat/Ext) * Phase * Glow * (1 - RayTrans)
    // [EN] Scattering intensity approximation: SunIntensity * Transmittance * (Scat/Ext) * Phase * Glow * (1 - RayTrans)
    let skyTrans = getTransmittance(bg_atmosphereTransmittanceTexture, bg_atmosphereSampler, mappingH, viewDir.y, uniforms.atmosphereHeight);
    let mieGlowAmount = (uniforms.sunIntensity * uniforms.skyViewScatMult) * sunTransForGlow * (uniforms.mieScattering / max(0.0001, uniforms.mieExtinction)) 
                        * (miePhaseSharp * uniforms.mieGlow) * (1.0 - skyTrans);
    
    atmosphereBackground += mieGlowAmount;

    let camPos = vec3<f32>(0.0, r + camH, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, r);
    
    if (uniforms.useGround < 0.5 || tEarth <= 0.0 || uniforms.showGround < 0.5) {
        // [KO] 수평선 압축(Horizon Squashing) 보정: 고도가 낮을 때 태양이 수직으로 납작해지는 효과
        // [EN] Horizon Squashing correction: Effect where the sun flattens vertically at low elevations
        let sunElevationParam = saturate(sunDir.y * 10.0); // [KO] 고도 약 5.7도 이하에서 작동 [EN] Works below ~5.7 deg elevation
        let squashFactor = mix(0.85, 1.0, sunElevationParam); // [KO] 최대 15% 압축 [EN] Max 15% squashing
        
        let verticalDist = viewDir.y - sunDir.y;
        let squashCorrection = (1.0 / (squashFactor * squashFactor) - 1.0) * (verticalDist * verticalDist);
        let viewSunCos = dot(viewDir, sunDir) - squashCorrection;

        let sunRad = uniforms.sunSize * DEG_TO_RAD;
        let cosSunRad = cos(sunRad);
        
        // [KO] 태양 경계 안티앨리어싱 마스크
        // [EN] Anti-aliasing mask for sun edge
        let sunMask = smoothstep(cosSunRad - 0.0005, cosSunRad, viewSunCos);
        
        if (sunMask > 0.0) {
            // [KO] 물리적 주연 감광(Limb Darkening) 계산: 중심에서 가장자리로 갈수록 비선형적으로 어두워짐
            // [EN] Physical Limb Darkening: Non-linearly darkens from center to edge
            let normalizedDist = saturate((1.0 - viewSunCos) / max(0.00001, 1.0 - cosSunRad));
            let limbDarkening = pow(max(0.00001, 1.0 - normalizedDist), uniforms.sunLimbDarkening);
            
            // [KO] 투과율 및 부스트된 강도 적용
            // [KO] 픽셀 단위 투과율(Per-pixel Transmittance) 보정: 각 픽셀의 시선 방향 고도(viewDir.y)를 사용하여 투과율 재계산
            // [EN] Apply transmittance and boosted intensity
            // [EN] Per-pixel Transmittance: Recalculate transmittance using each pixel's view direction elevation (viewDir.y)
            let sunTrans = getTransmittance(bg_atmosphereTransmittanceTexture, bg_atmosphereSampler, mappingH, viewDir.y, uniforms.atmosphereHeight);
            atmosphereBackground += sunMask * limbDarkening * sunTrans * (uniforms.sunIntensity * uniforms.solarIntensityMult);
        }
    }
    
    var output : FragmentOutput;
    output.color = vec4<f32>(atmosphereBackground, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    return output;
}
