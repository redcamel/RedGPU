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
        // [Ground Hit] 지면의 물리적 반사광 계산
        let hitPoint = camPos + viewDir * tEarth;
        let up = normalize(hitPoint);
        let sunDir = normalize(uniforms.sunDirection);
        let localCosSun = dot(up, sunDir);

        // 직접광 투과율 (Direct Light Transmittance)
        let sunT = getTransmittance(bg_transmittanceLUT, bg_skyAtmosphereSampler, 0.0, localCosSun, atmosphereHeight);
        
        // 다중 산란 에너지 (Multi-Scattering Energy / Indirect Light)
        let msUV = vec2<f32>(clamp(localCosSun * 0.5 + 0.5, 0.001, 0.999), 1.0); // 지면(h=0)은 UV.v = 1.0
        let msEnergy = textureSampleLevel(bg_multiScatLUT, bg_skyAtmosphereSampler, msUV, 0.0).rgb;

        // 지면 휘도 평가 (Direct + Indirect)
        baseRadiance = evaluateGroundRadiance(localCosSun, sunT, msEnergy, uniforms.groundAlbedo);
        skyTransmittance = 0.0; // 지면 아래는 투과율 없음
    } else {
        // [Sky] SkyViewLUT에서 대기 산란 기초 광량 가져오기
        let skyUV = getSkyViewUV(viewDir, viewHeight, groundRadius, atmosphereHeight);
        let skySample = textureSampleLevel(bg_skyViewLUT, bg_skyAtmosphereSampler, skyUV, 0.0);
        baseRadiance = skySample.rgb;
        skyTransmittance = skySample.a;
    }

    // 1. 기초 광량에 태양 강도와 노출 적용
    var finalRadiance = baseRadiance * uniforms.sunIntensity * systemUniforms.preExposure;

    // 2. 심플 절차적 구름 레이어 추가 (Simple Procedural Clouds)
    if (!isGroundHit && viewDir.y > 0.0) {
        let cloudR = groundRadius + uniforms.cloudHeight;
        let tCloud = getRaySphereIntersection(camPos, viewDir, cloudR);
        
        if (tCloud > 0.0) {
            let hitP = camPos + viewDir * tCloud;
            let cloudMask = getCloudDensity(hitP, uniforms);
            
            if (cloudMask > 0.0) {
                let sunDir = normalize(uniforms.sunDirection);
                let sunT = getTransmittance(bg_transmittanceLUT, bg_skyAtmosphereSampler, uniforms.cloudHeight, sunDir.y, atmosphereHeight);
                
                // 가짜 조명 (Pseudo-Lighting)
                let cloudNormal = getCloudNormal(hitP, uniforms);
                let cloudShadow = saturate(dot(cloudNormal, sunDir) * 0.5 + 0.5);
                
                // [KO] 구름 색상 결정: 태양광 투과율 반영 및 기본 밝기 확보
                let cloudColor = (sunT * uniforms.sunIntensity * 0.5 + baseRadiance * 0.5) * cloudShadow * systemUniforms.preExposure;
                
                // [KO] 최종 합성: 하늘 색상과 구름 색상을 마스크에 따라 블렌딩
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
