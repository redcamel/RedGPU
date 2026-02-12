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

struct Uniforms {
    sunData: vec4<f32>,          // xyz: sunDirection, w: sunSize
    atmosphereParams: vec4<f32>, // x: atmHeight, y: exposure, z: sunIntensity, w: cameraHeight
    earthParams: vec4<f32>,      // x: earthRadius, yzw: padding
};

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@group(2) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(2) @binding(2) var multiScatteringTexture: texture_2d<f32>;
@group(2) @binding(3) var skyViewTexture: texture_2d<f32>;
@group(2) @binding(4) var tSampler: sampler;

const PI: f32 = 3.14159265359;

// Henyey-Greenstein phase function (for Mie scattering)
fn henyey_greenstein_phase(cos_theta: f32, g: f32) -> f32 {
    let g2 = g * g;
    return (1.0 - g2) / (4.0 * PI * pow(max(0.0001, 1.0 + g2 - 2.0 * g * cos_theta), 1.5));
}

fn get_transmittance_uv(h: f32, cos_theta: f32, atm_h: f32) -> vec2<f32> {
    let v = sqrt(clamp(h / atm_h, 0.0, 1.0));
    let u = clamp(cos_theta * 0.5 + 0.5, 0.0, 1.0);
    return vec2<f32>(u, v);
}

@fragment
fn main(outData: OutData) -> FragmentOutput {
    var output: FragmentOutput;

    let sunDir = normalize(uniforms.sunData.xyz);
    let sunSize = uniforms.sunData.w;
    let atmH = uniforms.atmosphereParams.x;
    let exposure = uniforms.atmosphereParams.y;
    let sunIntensity = uniforms.atmosphereParams.z;
    let camH = uniforms.atmosphereParams.w;
    let earthR = uniforms.earthParams.x;

    let viewDir = normalize(outData.vertexPosition.xyz);

    // [곡률 반영] 카메라 높이에 따른 기하학적 지평선 각도 계산
    let r = earthR;
    let h_c = max(0.0001, camH);
    let horizon_sin = -sqrt(max(0.0, h_c * (2.0 * r + h_c))) / (r + h_c);
    let horizon_elevation = asin(clamp(horizon_sin, -1.0, 1.0));

    // 1. Sky-View LUT 샘플링
    let azimuth = atan2(viewDir.z, viewDir.x);
    let elevation = asin(clamp(viewDir.y, -1.0, 1.0));

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
    let skySample = textureSample(skyViewTexture, tSampler, vec2<f32>(skyU, skyV));
    let skyLuminance = skySample.rgb;
    let lutTransmittance = skySample.a;

    // 2. 태양 및 후광(Halo) 계산
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_angular_radius = sunSize * (PI / 180.0);
    let cosSunRadius = cos(sun_angular_radius);

    let viewTransUV = get_transmittance_uv(camH, viewDir.y, atmH);
    let sunTransmittance = textureSampleLevel(transmittanceTexture, tSampler, viewTransUV, 0.0).rgb;

    // 태양 디스크 (Direct Sun Disk)
    let sunRadiance = sunIntensity / max(1e-7, 2.0 * PI * (1.0 - cosSunRadius));
    let sunDiskMask = smoothstep(cosSunRadius - 0.001, cosSunRadius + 0.001, view_sun_cos);
    let sunDiskLuminance = sunRadiance * sunTransmittance * sunDiskMask;

    // [개선] Henyey-Greenstein 페이즈 함수를 이용한 물리적 태양 후광 (Mie Halo)
    // LUT의 해상도 한계를 극복하기 위해 프래그먼트 셰이더에서 직접 계산하여 부드러운 Glow 구현
    let p_mie = henyey_greenstein_phase(view_sun_cos, 0.99); // 태양 주변의 강한 전방 산란
    let sunHalo = sunIntensity * sunTransmittance * p_mie * 0.01;

    // 3. 지평선 및 대기 안개(Haze) 계산
    let sun_haze_factor = smoothstep(0.0, 0.2, sunDir.y);
    let haze_amount = mix(0.02, 0.001, sun_haze_factor) + clamp(0.005 / max(0.001, camH), 0.0, 0.02);
    let horizon_fade = smoothstep(horizon_elevation - haze_amount, horizon_elevation + haze_amount * 0.5, elevation);

    // 4. 지표면 영역 계산
    var groundPart = vec3<f32>(0.0);
    let albedo = vec3<f32>(0.15);
    
    if (elevation < horizon_elevation + haze_amount) {
        let camPos = vec3<f32>(0.0, r + h_c, 0.0);
        let b = dot(camPos, viewDir);
        let c = dot(camPos, camPos) - r * r;
        let delta = b * b - c;

        if (delta >= 0.0) {
            let t = -b - sqrt(delta);
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
            let specular = pow(NdotH, 512.0) * 4.0;

            let groundRawColor = albedo * (sunIntensity * gTrans * NdotL * gLightFade + ambLight * sunIntensity * 0.1)
                               + (sunIntensity * gTrans * specular * gLightFade);
            
            groundPart = groundRawColor * lutTransmittance;
        }
    }

    // 5. 최종 합성
    // [개선] 스카이뷰 LUT에서 가져온 산란광에 태양 디스크와 직접 계산한 후광을 더함
    var finalHDR = (skyLuminance * sunIntensity) + sunHalo + mix(groundPart, sunDiskLuminance, horizon_fade);

    // [보정] 지평선 아래에서 후광이 너무 밝게 튀는 현상 방지
    let halo_ground_fade = smoothstep(horizon_elevation - 0.1, horizon_elevation + 0.05, elevation);
    finalHDR = mix(finalHDR - sunHalo, finalHDR, max(0.15, halo_ground_fade));

    output.color = vec4<f32>(finalHDR * exposure, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
