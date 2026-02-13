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

// [추가] 절차적 지형 노이즈 함수
fn hash33(p: vec3<f32>) -> vec3<f32> {
    var p3 = fract(p * vec3<f32>(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}

fn get_ground_noise(p: vec3<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(dot(hash33(i + vec3<f32>(0.0, 0.0, 0.0)), f - vec3<f32>(0.0, 0.0, 0.0)),
                       dot(hash33(i + vec3<f32>(1.0, 0.0, 0.0)), f - vec3<f32>(1.0, 0.0, 0.0)), u.x),
                   mix(dot(hash33(i + vec3<f32>(0.0, 1.0, 0.0)), f - vec3<f32>(0.0, 1.0, 0.0)),
                       dot(hash33(i + vec3<f32>(1.0, 1.0, 0.0)), f - vec3<f32>(1.0, 1.0, 0.0)), u.x), u.y),
               mix(mix(dot(hash33(i + vec3<f32>(0.0, 0.0, 1.0)), f - vec3<f32>(0.0, 0.0, 1.0)),
                       dot(hash33(i + vec3<f32>(1.0, 0.0, 1.0)), f - vec3<f32>(1.0, 0.0, 1.0)), u.x),
                   mix(dot(hash33(i + vec3<f32>(0.0, 1.0, 1.0)), f - vec3<f32>(0.0, 1.0, 1.0)),
                       dot(hash33(i + vec3<f32>(1.0, 1.0, 1.0)), f - vec3<f32>(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}

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
            var groundNormal = normalize(hitPos);

            // [개선] 절차적 지형 디테일 추가
            // hitPos를 이용해 미세한 노이즈와 색상 변화 생성 (멀리서도 보이도록 큰 스케일과 작은 스케일 혼합)
            let noiseVal = get_ground_noise(hitPos * 0.1) * 0.5 + get_ground_noise(hitPos * 2.0) * 0.25;
            let detailAlbedo = mix(uniforms.groundAlbedo * 0.7, uniforms.groundAlbedo * 1.3, noiseVal);
            let albedo = detailAlbedo / PI;

            // 법선 변조 (거친 표면감 부여)
            let nNoise = hash33(hitPos * 100.0) * 0.02;
            groundNormal = normalize(groundNormal + nNoise);

            // 태양과 지면의 각도
            let localCosSun = dot(groundNormal, sunDir);
            let NdotL = max(0.0, localCosSun); 

            // 지면으로 떨어지는 투과율 계산
            let gTrans = get_transmittance(transmittanceTexture, tSampler, 0.0, localCosSun, atmH);

            // 직사광 부드러운 감쇠 (Shadow Terminator)
            let gLightFade = smoothstep(-0.05, 0.05, localCosSun);

            // [핵심 수정 1] 야간 Ambient 차단 (Ambient Fade)
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
            let diffuseLight = sunIntensity * gTrans * NdotL * gLightFade;
            let ambientLight = ambLight * sunIntensity * uniforms.groundAmbient * ambientFade;
            let specularLight = sunIntensity * gTrans * specular * gLightFade;

            let groundRawColor = albedo * (diffuseLight + ambientLight) + specularLight;

            // [언리얼 스타일] 3D LUT 기반 Aerial Perspective (공중 투시)
            // azimuth와 elevation은 상단에서 계산된 값을 재사용합니다.
            let u = azimuth / (2.0 * PI) + 0.5;
            let v = elevation / PI + 0.5;
            let max_dist = 100.0;
            let w = sqrt(clamp(hitDist / max_dist, 0.0, 1.0));

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
    // [언리얼 스타일] 지평선 합성 개편
    var finalHDR: vec3<f32>;
    
    // 행성 충돌 여부에 따른 분리 합성
    if (hitDist > 0.0 && hitDist < 1e6) {
        // [지면 영역]
        // 3D LUT 기반 Aerial Perspective를 통해 물리적인 지면 색상 결정
        // (aerialScattering에 이미 후광과 연무가 포함되어 있음)
        finalHDR = groundPart;
    } else {
        // [하늘 영역]
        finalHDR = atmosphereColor;
        
        // 하늘 영역에만 직접적인 태양 디스크와 후광 보정 추가 (2D LUT 보완)
        // Sky-View LUT의 해상도 한계를 보완하기 위해 셰이더에서 직접 합산
        finalHDR += sunDiskLuminance + sunHalo * 0.1; 
    }

    // [시각적 보정] 지평선 연무 (필요한 경우에만 매우 미세하게)
    // 물리적 적분 외에 예술적 허용치로 지평선을 아주 살짝 풀어줌
    let horizon_haze_mask = exp(-abs(distFromHorizon) * (15.0 / (haze_amount + 0.01)));
    finalHDR += atmosphereColor * uniforms.horizonHaze * horizon_haze_mask * 0.2;

    // 6. Height Fog (거리 안개)
    let horizonDist = sqrt(h_c * (2.0 * earthRadius + h_c));
    let fogCalcDist = select(horizonDist, hitDist, hitDist < 1e6);
    let fogT = get_height_fog_transmittance(camH, viewDir.y, fogCalcDist, uniforms.heightFogDensity, uniforms.heightFogFalloff);
    
    // 안개 적용
    finalHDR = mix(atmosphereColor, finalHDR, fogT);

    // [최종 출력] 톤맵핑 없음 (시스템에서 처리)
    output.color = vec4<f32>(finalHDR * exposure * 0.2, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}