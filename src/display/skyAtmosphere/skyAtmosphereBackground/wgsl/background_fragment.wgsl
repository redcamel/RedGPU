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
@group(1) @binding(1) var bg_multiScatLUT : texture_2d<f32>;
@group(1) @binding(2) var bg_skyViewLUT : texture_2d<f32>;
@group(1) @binding(3) var bg_skyAtmosphereSampler : sampler;

@fragment
fn main(input : VertexOutput) -> FragmentOutput {
    let uniforms = systemUniforms.skyAtmosphere;
    let groundRadius = uniforms.groundRadius;
    let atmosphereHeight = uniforms.atmosphereHeight;
    
    let viewDir = normalize(input.vertexPosition.xyz);
    let viewHeight = max(0.0, uniforms.cameraHeight);

    let camPos = vec3<f32>(0.0, groundRadius + viewHeight, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, groundRadius);
    let isGroundHit = groundRadius > 0.0 && tEarth > 0.0;

    var baseRadiance: vec3<f32>;
    var skyTransmittance: f32 = 1.0;

    if (isGroundHit) {
        // [KO] 1-A. 지면 충돌 시: 지면의 물리적 반사광 계산
        // [EN] 1-A. Ground Hit: Calculate physical ground radiance
        let hitPoint = camPos + viewDir * tEarth;
        let up = normalize(hitPoint);
        let sunDir = normalize(uniforms.sunDirection);
        let localCosSun = dot(up, sunDir);

        // 직접광 투과율 및 다중 산란 에너지 기여도 합산
        let sunT = getTransmittance(bg_transmittanceLUT, bg_skyAtmosphereSampler, 0.0, localCosSun, atmosphereHeight);
        let msUV = vec2<f32>(clamp(localCosSun * 0.5 + 0.5, 0.001, 0.999), 1.0); 
        let msEnergy = textureSampleLevel(bg_multiScatLUT, bg_skyAtmosphereSampler, msUV, 0.0).rgb;

        baseRadiance = evaluateGroundRadiance(localCosSun, sunT, msEnergy, uniforms.groundAlbedo);
        skyTransmittance = 0.0; 
    } else {
        // [KO] 1-B. 하늘 영역: SkyView LUT에서 산란광 샘플링
        // [EN] 1-B. Sky Region: Sample radiance from SkyView LUT
        let skyUV = getSkyViewUV(viewDir, viewHeight, groundRadius, atmosphereHeight);
        let skySample = textureSampleLevel(bg_skyViewLUT, bg_skyAtmosphereSampler, skyUV, 0.0);
        baseRadiance = skySample.rgb;
        skyTransmittance = skySample.a;
    }

    // 기초 광량에 태양 강도와 노출 적용
    var finalRadiance = baseRadiance * uniforms.sunIntensity * systemUniforms.preExposure;

    // [KO] 2. 절차적 구름 레이어 합성 (Simple Procedural Clouds)
    // [EN] 2. Composite procedural cloud layer
    if (!isGroundHit && viewDir.y > 0.0) {
        let cloudR = groundRadius + uniforms.cloudHeight;
        let tCloud = getRaySphereIntersection(camPos, viewDir, cloudR);
        
        if (tCloud > 0.0) {
            let hitP = camPos + viewDir * tCloud;
            let cloudMask = getCloudDensity(hitP, uniforms);
            
            if (cloudMask > 0.0) {
                let sunDir = normalize(uniforms.sunDirection);
                let sunT = getTransmittance(bg_transmittanceLUT, bg_skyAtmosphereSampler, uniforms.cloudHeight, sunDir.y, atmosphereHeight);
                
                // 구름용 가짜 조명(Pseudo-Lighting) 및 색상 결정
                let cloudNormal = getCloudNormal(hitP, uniforms);
                let cloudShadow = saturate(dot(cloudNormal, sunDir) * 0.5 + 0.5);
                let cloudColor = (sunT * uniforms.sunIntensity * 0.5 + baseRadiance * 0.5) * cloudShadow * systemUniforms.preExposure;
                
                // 최종 합성
                finalRadiance = mix(finalRadiance, cloudColor, cloudMask * skyTransmittance);
            }
        }
    }

    var output : FragmentOutput;
    output.color = vec4<f32>(finalRadiance, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    return output;
}
