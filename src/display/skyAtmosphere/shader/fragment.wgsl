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
@group(2) @binding(5) var sceneDepthTexture: texture_depth_2d;
@group(2) @binding(6) var tSampler: sampler;

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
    let atmosphereColor = skyLuminance * sunIntensity;

    // 2. 깊이 버퍼를 이용한 메시 거리 계산 (언리얼 스타일)
    let rawDepth = textureLoad(sceneDepthTexture, vec2<i32>(outData.position.xy), 0);
    let near = systemUniforms.camera.nearClipping;
    let far = systemUniforms.camera.farClipping;
    let sceneDist = near * far / (far - rawDepth * (far - near));
    
    // 3. 태양 및 후광 (하늘 전용)
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_angular_radius = sunSize * (PI / 180.0);
    let cosSunRadius = cos(sun_angular_radius);
    let sunTrans = get_transmittance(transmittanceTexture, tSampler, camH, sunDir.y, atmH);
    let sunRadiance = sunIntensity / max(1e-7, 2.0 * PI * (1.0 - cosSunRadius));
    let sunDiskMask = smoothstep(cosSunRadius - 0.001, cosSunRadius + 0.001, view_sun_cos);
    let sunFade = smoothstep(-0.02, 0.05, distFromHorizon);
    let sunDiskLuminance = sunRadiance * sunTrans * sunDiskMask * sunFade;

    let haloStrength = uniforms.mieScattering * 1.2; 
    let p_mie_glow = phase_mie(view_sun_cos, uniforms.mieGlow);
    let p_mie_halo = phase_mie(view_sun_cos, uniforms.mieHalo);
    let sunHalo = sunIntensity * sunTrans * (p_mie_glow * haloStrength + p_mie_halo * (haloStrength * 0.2));

    // 4. 지표면 및 메시 공중 투시 합성
    var finalHDR: vec3<f32>;
    let haze_amount = mix(0.3, 0.1, smoothstep(-0.2, 0.5, sunDir.y));

    // 물체(메시)가 있는 영역 처리
    if (rawDepth < 1.0) {
        // 메시 위에 3D LUT Aerial Perspective 적용 로직
        // (현재는 SkyAtmosphere가 가장 뒤에 그려지므로 discard 하여 메시가 보이게 함)
        // 실제 완전한 합성을 위해서는 별도의 포스트 프로세스 패스가 필요합니다.
        discard; 
    } else {
        // 하늘 영역 (메시 없음)
        finalHDR = atmosphereColor;
        
        // 가상 지면 충돌 (하늘 끝부분 채우기)
        let camPos = vec3<f32>(0.0, earthRadius + h_c, 0.0);
        let b = dot(camPos, viewDir);
        let c = dot(camPos, camPos) - earthRadius * earthRadius;
        let delta = b * b - c;
        if (delta >= 0.0) {
            let t = -b - sqrt(delta);
            let hitPos = camPos + viewDir * t;
            let noiseVal = get_ground_noise(hitPos * 0.1) * 0.5 + get_ground_noise(hitPos * 2.0) * 0.25;
            let albedo = mix(uniforms.groundAlbedo * 0.7, uniforms.groundAlbedo * 1.3, noiseVal) / PI;
            
            let u = azimuth / (2.0 * PI) + 0.5;
            let v = elevation / PI + 0.5;
            let w = sqrt(clamp((t / 1000.0) / 100.0, 0.0, 1.0));
            let apSample = textureSampleLevel(cameraVolumeTexture, tSampler, vec3<f32>(u, v, w), 0.0);
            finalHDR = (albedo * apSample.a * sunIntensity) + (apSample.rgb * sunIntensity);
        }

        finalHDR += sunDiskLuminance + sunHalo * 0.1;
    }

    // 공통 시각 보정
    let horizon_haze_mask = exp(-abs(distFromHorizon) * (15.0 / (haze_amount + 0.01)));
    finalHDR += atmosphereColor * uniforms.horizonHaze * horizon_haze_mask * 0.2;

    output.color = vec4<f32>(finalHDR * exposure * 0.2, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}