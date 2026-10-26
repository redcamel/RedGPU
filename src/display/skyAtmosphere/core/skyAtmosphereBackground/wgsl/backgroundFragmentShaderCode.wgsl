#redgpu_include SYSTEM_UNIFORM;
#redgpu_include skyAtmosphere.skyAtmosphereFn;

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
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

/**
 * [KO] SkyView, Transmittance, Multi-Scattering LUT를 샘플링하여 하늘 배경, 지표면 반사, 태양 디스크, 미 산란 광륜 및 절차적 구름을 렌더링하는 프래그먼트 셰이더입니다.
 * [EN] Fragment shader that samples SkyView, Transmittance, and Multi-Scattering LUTs to render the sky background, ground reflectance, sun disk, Mie glow, and procedural clouds.
 */
@fragment
fn main(input : VertexOutput) -> FragmentOutput {
    let uniforms = systemUniforms.skyAtmosphere;
    let groundRadius = uniforms.groundRadius;
    let atmosphereHeight = uniforms.atmosphereHeight;
    
    let viewDir = normalize(input.vertexPosition);
    let viewHeight = max(0.0, uniforms.cameraHeight);

    let camPos = vec3<f32>(0.0, groundRadius + viewHeight, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, groundRadius);
    let isGroundHit = groundRadius > 0.0 && tEarth > 0.0;

    let sunDir = uniforms.sunDirection;

    var baseRadiance: vec3<f32>;
    var skyTransmittance: f32 = 1.0;

    if (isGroundHit) {
        // [KO] 1-A. 지면 교차 시 직접광 투과율과 다중 산란 에너지를 결합하여 지표면 반사 복사휘도를 계산합니다.
        // [EN] 1-A. On ground intersection, combine direct sun transmittance and multi-scattering energy to evaluate ground radiance.
        let hitPoint = camPos + viewDir * tEarth;
        let up = hitPoint * inverseSqrt(dot(hitPoint, hitPoint));
        let localCosSun = dot(up, sunDir);

        let sunT = getTransmittance(bg_transmittanceLUT, bg_skyAtmosphereSampler, 0.0, localCosSun, atmosphereHeight);
        let msUV = vec2<f32>(clamp(localCosSun * 0.5 + 0.5, 0.001, 0.999), 1.0); 
        let msEnergy = textureSampleLevel(bg_multiScatLUT, bg_skyAtmosphereSampler, msUV, 0.0).rgb;

        baseRadiance = evaluateGroundRadiance(localCosSun, sunT, msEnergy, uniforms.groundAlbedo);
        skyTransmittance = 0.0; 
    } else {
        // [KO] 1-B. 하늘 영역일 때 SkyView LUT에서 대기 산란 복사휘도와 투과율을 조회합니다.
        // [EN] 1-B. For sky regions, sample atmospheric scattering radiance and transmittance from the SkyView LUT.
        let skyUV = getSkyViewUV(viewDir, viewHeight, groundRadius);
        let skySample = textureSampleLevel(bg_skyViewLUT, bg_skyAtmosphereSampler, skyUV, 0.0);
        baseRadiance = skySample.rgb;
        skyTransmittance = skySample.a;
    }

    // [KO] 2. 비차폐 하늘 영역에 전방 미 산란 광륜(Mie Glow)과 태양 디스크 복사휘도를 계산합니다.
    // [EN] 2. Compute forward Mie glow and sun disk radiance for unoccluded sky regions.
    var addedRadiance = vec3<f32>(0.0);
    if (!isGroundHit && getPlanetShadowMask(camPos, sunDir, groundRadius) > 0.0) {
        let viewSunCos = dot(viewDir, sunDir);
        let skyTransVec = vec3<f32>(skyTransmittance);
        let mieGlow = getMieGlowAmountUnit(viewSunCos, viewHeight, uniforms, bg_transmittanceLUT, bg_skyAtmosphereSampler, skyTransVec);
        let sunDisk = getSunDiskRadianceUnit(viewSunCos, uniforms.sunSize, uniforms.sunLimbDarkening, skyTransVec);
        addedRadiance = mieGlow + sunDisk;
    }

    // [KO] 3. 상공 시선에 대해 절차적 구름 레이어를 평가하고 하늘 산란광 및 태양 디스크를 마스킹합니다.
    // [EN] 3. Evaluate the procedural cloud layer for upward rays and mask sky scattering and sun disk radiance.
    if (!isGroundHit && viewDir.y > 0.0 && uniforms.cloudCoverage > 0.0) {
        let cloudR = groundRadius + uniforms.cloudHeight;
        let tCloud = getRaySphereIntersection(camPos, viewDir, cloudR);
        
        if (tCloud > 0.0) {
            let hitP = camPos + viewDir * tCloud;
            let warpedUV = getCloudWarpedUV(hitP, uniforms);
            let rawCloudDensity = cloud_fbm(warpedUV);
            let finalCloudMask = getCloudDensity(rawCloudDensity, uniforms);
            
            if (finalCloudMask > 0.0) {
                let sunT = getTransmittance(bg_transmittanceLUT, bg_skyAtmosphereSampler, uniforms.cloudHeight, sunDir.y, atmosphereHeight);
                
                let cloudNormal = getCloudNormal(warpedUV, rawCloudDensity);
                let cloudShadow = saturate(dot(cloudNormal, sunDir) * 0.5 + 0.5);
                let cloudColor = (sunT * INV_PI + baseRadiance) * 0.5 * cloudShadow;
                
                baseRadiance = mix(baseRadiance, cloudColor, finalCloudMask * skyTransmittance);
                addedRadiance *= (1.0 - finalCloudMask);
            }
        }
    }

    // [KO] 4. 태양 광도와 사전 노출(preExposure)을 적용하여 최종 배경 색상을 출력합니다.
    // [EN] 4. Apply sun intensity and pre-exposure to output the final background color.
    let scaledSunIntensity = uniforms.sunIntensity * systemUniforms.preExposure;
    let finalRadiance = (baseRadiance * PI + addedRadiance) * scaledSunIntensity;

    var output : FragmentOutput;
    output.color = vec4<f32>(finalRadiance, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    return output;
}
