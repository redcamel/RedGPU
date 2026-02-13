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
@group(2) @binding(4) var cameraVolumeTexture: texture_3d<f32>;
@group(2) @binding(5) var tSampler: sampler;

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

    // 2. 최종 대기광 계산 (지면 계산에서 활용하기 위해 상단으로 이동)
    let atmosphereColor = skyLuminance * sunIntensity;

    // 3. 태양 및 후광(Halo) 계산
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_angular_radius = sunSize * (PI / 180.0);
    let cosSunRadius = cos(sun_angular_radius);

    // [해결 2] 태양 디스크 붉은색 보정 (Transmittance At Sun Direction 적용)
    let sunTrans = get_transmittance(transmittanceTexture, tSampler, camH, sunDir.y, atmH);

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

    // [중요 Check] JS에서 groundAlbedo를 1.0으로 보내면 안 됩니다.
    // 보통 아스팔트/흙은 0.1 ~ 0.3 정도입니다. 물리적으로는 PI로 나누어야 합니다.
    let albedo = uniforms.groundAlbedo / PI;
    var hitDist: f32 = 1e6;

    // 충돌 판별 및 바닥 색상 계산
    {
        let camPos = vec3<f32>(0.0, earthRadius + h_c, 0.0);
        let b = dot(camPos, viewDir);
        let c = dot(camPos, camPos) - earthRadius * earthRadius;
        let delta = b * b - c;

        var finalGroundColor = vec3<f32>(0.0);

        if (delta >= 0.0) {
            // [충돌 성공]
            let t = -b - sqrt(delta);
            hitDist = t;
            let hitPos = camPos + viewDir * t;
            let groundNormal = normalize(hitPos);

            // 태양과 지면의 각도
            let localCosSun = dot(groundNormal, sunDir);
            let NdotL = max(0.0, localCosSun); // 직사광(Direct Light)은 음수가 될 수 없음

            // 지면으로 떨어지는 투과율 계산
            let gTransUV = get_transmittance_uv(0.0, localCosSun, atmH);
            let gTrans = textureSampleLevel(transmittanceTexture, tSampler, gTransUV, 0.0).rgb;

            // 직사광 부드러운 감쇠 (Shadow Terminator)
            let gLightFade = smoothstep(-0.02, 0.02, localCosSun);

            // [핵심 수정 1] 야간 Ambient 차단 (Ambient Fade)
            // 태양이 지평선 아래(-0.1)로 내려가면 환경광도 꺼져야 합니다.
            // 이게 없으면 밤에도 MultiScattering 텍스처가 바닥을 밝게 비춰 색이 탁해집니다.
            let ambientFade = smoothstep(-0.4, 0.1, sunDir.y);

            // Multi-Scattering(환경광) 샘플링
            let ambUV = vec2<f32>(clamp(localCosSun * 0.5 + 0.5, 0.0, 1.0), 0.0);
            let ambLight = textureSampleLevel(multiScatteringTexture, tSampler, ambUV, 0.0).rgb;

            // Specular 계산
            let V = -viewDir;
            let L = sunDir;
            let H = normalize(V + L);
            let NdotH = max(0.0, dot(groundNormal, H));
            let specular = pow(NdotH, uniforms.groundShininess) * uniforms.groundSpecular;

            // [핵심 수정 2] 바닥 최종 색상 조합
            // ambientFade를 곱해주어 밤에 바닥이 검게 되도록 함
            let diffuseLight = sunIntensity * gTrans * NdotL * gLightFade;
            let ambientLight = ambLight * sunIntensity * uniforms.groundAmbient * ambientFade;
            let specularLight = sunIntensity * gTrans * specular * gLightFade;

            let groundRawColor = albedo * (diffuseLight + ambientLight) + specularLight;

            // [언리얼 스타일] 3D LUT 기반 Aerial Perspective (공중 투시)
            // 3D LUT에서 해당 방향과 거리에 맞는 산란광과 투과율을 가져옵니다.
            let azimuth = atan2(viewDir.z, viewDir.x);
            let elevation = asin(clamp(viewDir.y, -1.0, 1.0));
            
            let u = azimuth / (2.0 * PI) + 0.5;
            let v = elevation / PI + 0.5;
            let max_dist = 100.0;
            let w = sqrt(clamp(hitDist / max_dist, 0.0, 1.0)); // Generator의 w 매핑과 일치해야 함

            let apSample = textureSampleLevel(cameraVolumeTexture, tSampler, vec3<f32>(u, v, w), 0.0);
            let aerialScattering = apSample.rgb;
            let aerialTransmittance = apSample.a;

            finalGroundColor = (groundRawColor * aerialTransmittance) + (aerialScattering * sunIntensity);

        } else {
            // 바닥 충돌 없음 (하늘)
            finalGroundColor = vec3<f32>(0.0);
        }

        groundPart = finalGroundColor;
    }

    // 5. 최종 합성
    // (atmosphereColor는 상단에서 이미 정의됨)

    // [개선] 지평선 AA 및 전이 처리 (더 부드러운 범위 설정)
    // 기존 0.002에서 0.008로 확장하여 경계를 더 부드럽게 만듦
    let horizonMask = smoothstep(-0.008, 0.008, distFromHorizon);

    // 하늘과 바닥 합성
    var finalHDR = mix(groundPart, atmosphereColor, horizonMask);

    // 태양/후광 추가
    let effectiveSun = sunDiskLuminance * horizonMask;
    let effectiveHalo = sunHalo * max(0.2, horizonMask); // 후광은 지평선 아래로도 약간 번지도록 설정
    finalHDR += effectiveSun + effectiveHalo;

    // [개선] 지평선 안개 및 연무 보정 (Horizon Haze)
    // 지평선 부근의 산란광을 강화하여 경계를 시각적으로 부드럽게 만듦
    let haze_range = mix(0.1, 0.2, 1.0 - sun_haze_factor); // 태양이 낮을수록 연무 범위 확대
    let horizon_haze_mask = exp(-absDistFromHorizon * (5.0 / (haze_amount + 0.01)));
    let haze_boost = atmosphereColor * uniforms.horizonHaze * 0.8;
    finalHDR += haze_boost * horizon_haze_mask;

    // 6. Height Fog (거리 안개)
    let horizonDist = sqrt(h_c * (2.0 * earthRadius + h_c));
    let fogCalcDist = select(horizonDist, hitDist, hitDist < 1e5);
    let fogT = get_height_fog_transmittance(camH, viewDir.y, fogCalcDist, uniforms.heightFogDensity, uniforms.heightFogFalloff);
    
    // 안개 적용 시에도 지평선 부근은 대기색과 더 자연스럽게 섞이도록 처리
    finalHDR = mix(atmosphereColor, finalHDR, fogT);

    // [최종 출력] 톤맵핑 없음 (시스템에서 처리)
    // 최종 보정된 Linear HDR 상태로 내보냄
    output.color = vec4<f32>(finalHDR * exposure * 0.2, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}