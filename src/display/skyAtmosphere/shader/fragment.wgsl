#redgpu_include SYSTEM_UNIFORM;

struct OutData {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec4<f32>,
};

struct FragmentOutput {
    @location(0) color: vec4<f32>,
    @location(1) normal: vec4<f32>,
    @location(2) motionVector: vec4<f32>,
};

@group(2) @binding(0) var<uniform> uniforms: AtmosphereParameters;
@group(2) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(2) @binding(2) var multiScatteringTexture: texture_2d<f32>;
@group(2) @binding(3) var skyViewTexture: texture_2d<f32>;
@group(2) @binding(4) var tSampler: sampler;

@fragment
fn main(outData: OutData) -> FragmentOutput {
    var output: FragmentOutput;

    let sunDir = normalize(uniforms.sunDirection);
    let sunSize = uniforms.sunSize;
    let atmH = uniforms.atmosphereHeight;
    let exposure = uniforms.exposure;
    let sunIntensity = uniforms.sunIntensity;
    let camH = uniforms.cameraHeight;
    let earthRadius = uniforms.earthRadius;

    let viewDir = normalize(outData.vertexPosition.xyz);

    // [곡률 반영] 카메라 높이에 따른 기하학적 지평선 각도 계산
    let r = earthRadius;
    let h_c = max(0.0001, camH);
    let horizon_sin = -sqrt(max(0.0, h_c * (2.0 * r + h_c))) / (r + h_c);
    let horizon_elevation = asin(clamp(horizon_sin, -1.0, 1.0));

    // 1. Sky-View LUT 샘플링
    let azimuth = atan2(viewDir.z, viewDir.x);
    let elevation = asin(clamp(viewDir.y, -1.0, 1.0));
    let distFromHorizon = elevation - horizon_elevation;
    let absDistFromHorizon = abs(distFromHorizon);

    var skyV: f32;
    if (elevation >= horizon_elevation) {
        let v_range = (PI * 0.5) - horizon_elevation;
        skyV = 0.5 * (1.0 - sqrt(max(0.0, (elevation - horizon_elevation) / v_range)));
    } else {
        let v_range = horizon_elevation + (PI * 0.5);
        skyV = 0.5 * (1.0 + sqrt(max(0.0, (horizon_elevation - elevation) / v_range)));
    }
    let skyU = azimuth / (2.0 * PI) + 0.5;

    // LUT에서 산란광(rgb)과 투과율(a)을 읽음
    let skySample = textureSampleLevel(skyViewTexture, tSampler, vec2<f32>(skyU, skyV), 0.0);
    let skyLuminance = skySample.rgb;
    let lutTransmittance = skySample.a;

    // 2. 태양 및 후광(Halo) 계산
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_angular_radius = sunSize * (PI / 180.0);
    let cosSunRadius = cos(sun_angular_radius);

    // [해결 2] 태양 디스크 붉은색 보정 (Transmittance At Sun Direction 적용)
    let sunTransUV = get_transmittance_uv(camH, sunDir.y, atmH);
    let sunTrans = textureSampleLevel(transmittanceTexture, tSampler, sunTransUV, 0.0).rgb;

    // 태양 디스크 (Direct Sun Disk)
    let sunRadiance = sunIntensity / max(1e-7, 2.0 * PI * (1.0 - cosSunRadius));
    let sunDiskMask = smoothstep(cosSunRadius - 0.001, cosSunRadius + 0.001, view_sun_cos);
    let sunFade = smoothstep(-0.02, 0.05, distFromHorizon);
    let sunDiskLuminance = sunRadiance * sunTrans * sunDiskMask * sunFade;

    // [해결 3] 과도한 블룸 제어 (Mie Scattering 계수 연동)
    let haloStrength = uniforms.mieScattering * 1.2; 
    let p_mie_glow = phase_mie(view_sun_cos, uniforms.mieGlow);
    let p_mie_halo = phase_mie(view_sun_cos, uniforms.mieHalo);
    let sunHalo = sunIntensity * sunTrans * (p_mie_glow * haloStrength + p_mie_halo * (haloStrength * 0.2));

    // 3. 지평선 전이 설정
    let sun_haze_factor = smoothstep(-0.2, 0.5, sunDir.y);
    let haze_amount = mix(0.3, 0.1, sun_haze_factor); 

    // 4. 지표면 영역 계산
    var groundPart = vec3<f32>(0.0);
    let albedo = uniforms.groundAlbedo;
    var hitDist: f32 = 1e6;

    // 지평선 지점(v=0.5)의 색상을 샘플링하여 안개 및 합성의 기준점으로 사용
    let horizonColor = textureSampleLevel(skyViewTexture, tSampler, vec2<f32>(skyU, 0.5), 0.0).rgb * sunIntensity;

    // [개선] 조건문 단순화 및 예외 처리
    {
        let camPos = vec3<f32>(0.0, earthRadius + h_c, 0.0);
        let b = dot(camPos, viewDir);
        let c = dot(camPos, camPos) - earthRadius * earthRadius;
        let delta = b * b - c;

        var fogFactor = 1.0; 
        var finalGroundColor = vec3<f32>(0.0);

        if (delta >= 0.0) {
            // [충돌 성공] 실제 바닥 계산
            let t = -b - sqrt(delta);
            hitDist = t;
            let hitPos = camPos + viewDir * t;
            let groundNormal = normalize(hitPos);
            let localCosSun = dot(groundNormal, sunDir);
            let NdotL = max(0.0, localCosSun);

            let gTransUV = get_transmittance_uv(0.0, localCosSun, atmH);
            let gTrans = textureSampleLevel(transmittanceTexture, tSampler, gTransUV, 0.0).rgb;
            let gLightFade = smoothstep(-0.02, 0.02, localCosSun);

            let ambUV = vec2<f32>(clamp(localCosSun * 0.5 + 0.5, 0.0, 1.0), 0.0);
            let ambLight = textureSampleLevel(multiScatteringTexture, tSampler, ambUV, 0.0).rgb;

            let V = -viewDir;
            let L = sunDir;
            let H = normalize(V + L);
            let NdotH = max(0.0, dot(groundNormal, H));
            let specular = pow(NdotH, uniforms.groundShininess) * uniforms.groundSpecular;

            // [수정 3] 바닥 주변광(Ambient) 강화
            let groundRawColor = albedo * (sunIntensity * gTrans * NdotL * gLightFade + ambLight * sunIntensity * uniforms.groundAmbient)
                               + (sunIntensity * gTrans * specular * gLightFade);
            
            // 물리적 Aerial Perspective (지면 반사광 + 대기 산란광 통합)
            let groundWithAP = (groundRawColor * lutTransmittance) + (skyLuminance * sunIntensity);
            
            // 거리 기반 안개 계산
            let groundFogDensity = uniforms.heightFogDensity * 0.5 + 0.005; 
            fogFactor = 1.0 - exp(-max(0.0, hitDist) * groundFogDensity);
            finalGroundColor = groundWithAP;
        } else {
            // [충돌 실패] 지평선 아래인데 충돌 실패 시 무한히 먼 바닥 처리 (검은 구멍 방지)
            fogFactor = 1.0;
            finalGroundColor = vec3<f32>(0.0);
        }
        
        // 최종 바닥 색상 합성
        groundPart = mix(finalGroundColor, horizonColor, fogFactor);
    }

    // 5. 최종 합성 (Physically-based Composition)
    // 하늘 기본색 (태양 제외)
    let atmosphereColor = skyLuminance * sunIntensity;
    
    // 지평선 마스크 (0: 지면, 1: 하늘)
    // [개선] 라인 현상 방지를 위해 AA 구간을 더 부드럽게 확장함
    let horizonMask = smoothstep(-0.004, 0.004, distFromHorizon);

    // [핵심] 하늘과 땅을 마스크로 확실하게 교체
    var finalHDR = mix(groundPart, atmosphereColor, horizonMask);

    // 태양 및 후광 처리 (지면 차폐 적용)
    let effectiveSun = sunDiskLuminance * horizonMask;
    let effectiveHalo = sunHalo * max(0.1, horizonMask);
    finalHDR += effectiveSun + effectiveHalo;

    // [개선] 지평선 안개 강화 보정
    // 단순히 더하는 양을 대폭 줄이고(1.2 -> 0.3), 범위를 넓혀 부드럽게 만듦
    let horizon_haze_mask = exp(-absDistFromHorizon * (8.0 / haze_amount));
    let haze_boost_color = atmosphereColor * uniforms.horizonHaze * (1.0 - sun_haze_factor * 0.5);
    finalHDR += haze_boost_color * horizon_haze_mask;

    // 6. 통합 높이 안개 적용 (전체적인 공간 깊이감 부여)
    let horizonDist = sqrt(h_c * (2.0 * earthRadius + h_c));
    let fogCalcDist = select(horizonDist, hitDist, hitDist < 1e5);
    let fogT = get_height_fog_transmittance(camH, viewDir.y, fogCalcDist, uniforms.heightFogDensity, uniforms.heightFogFalloff);
    finalHDR = mix(atmosphereColor, finalHDR, fogT);

    output.color = vec4<f32>(finalHDR * exposure, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
