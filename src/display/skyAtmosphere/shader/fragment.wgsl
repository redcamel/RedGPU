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
    sunDirection: vec3<f32>,
    sunSize: f32,
    atmosphereHeight: f32,
    exposure: f32,
    sunIntensity: f32,
    cameraHeight: f32,
    earthRadius: f32,
    heightFogDensity: f32,
    heightFogFalloff: f32,
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

// [추가] 지수적 높이 안개 투과율 계산 (Exponential Height Fog)
fn get_height_fog_transmittance(cam_h: f32, ray_dir_y: f32, dist: f32, density: f32, falloff: f32) -> f32 {
    if (density <= 0.0) { return 1.0; }
    let h = max(0.0, cam_h);
    let k = falloff;
    let d = dist;
    let y = ray_dir_y;
    
    var exponent: f32;
    if (abs(y) < 0.0001) {
        exponent = density * exp(-k * h) * d;
    } else {
        exponent = (density * exp(-k * h)) / (k * y) * (1.0 - exp(-k * y * d));
    }
    return exp(-max(0.0, exponent));
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
    // 두 개의 로브를 혼합하여 중심은 강하고 주변은 부드러운 Glow 구현
    let p_mie_glow = henyey_greenstein_phase(view_sun_cos, 0.75);
    let p_mie_halo = henyey_greenstein_phase(view_sun_cos, 0.99);
    let sunHalo = sunIntensity * sunTransmittance * (p_mie_glow * 0.02 + p_mie_halo * 0.005);

    // 3. 지평선 전이 및 안티앨리어싱 설정 (물리적 경계면 보호)
    let distFromHorizon = elevation - horizon_elevation;
    let absDistFromHorizon = abs(distFromHorizon);
    let horizonAA = smoothstep(-0.002, 0.002, distFromHorizon);

    // 4. 지표면 영역 계산
    var groundPart = vec3<f32>(0.0);
    let albedo = vec3<f32>(0.15);
    var hitDist: f32 = 1e6;

    // 지평선 아래일 경우에만 물리적 지면 계산
    if (distFromHorizon < 0.01) {
        let camPos = vec3<f32>(0.0, earthRadius + h_c, 0.0);
        let b = dot(camPos, viewDir);
        let c = dot(camPos, camPos) - earthRadius * earthRadius;
        let delta = b * b - c;

        if (delta >= 0.0) {
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
            let specular = pow(NdotH, 512.0) * 4.0;

            let groundRawColor = albedo * (sunIntensity * gTrans * NdotL * gLightFade + ambLight * sunIntensity * 0.1)
                               + (sunIntensity * gTrans * specular * gLightFade);
            
            // 지면 반사광은 대기 투과율에 의해서만 감쇄됨 (물리적 Aerial Perspective)
            groundPart = groundRawColor * lutTransmittance;
        }
    }

    // 5. 물리 기반 최종 합성 (Physically-based Composition)
    let atmosphereColor = skyLuminance * sunIntensity;
    
    // 태양 및 후광 처리 (지면 차폐 적용)
    let groundMask = horizonAA;
    let effectiveSun = sunDiskLuminance * groundMask;
    let effectiveHalo = sunHalo * max(0.1, groundMask);

    // [합성] 대기 산란광 + (지면 반사광 OR 태양 직접광)
    // 지평선 AA를 통해 기하학적 경계면에서의 샘플링 튀는 현상만 보정
    var finalHDR = atmosphereColor + effectiveHalo;
    finalHDR = mix(finalHDR + groundPart, finalHDR + effectiveSun, horizonAA);

    // 6. 통합 높이 안개 적용 (지수적 감쇄 모델)
    let horizonDist = sqrt(h_c * (2.0 * earthRadius + h_c));
    let fogCalcDist = select(horizonDist, hitDist, hitDist < 1e5);
    let fogT = get_height_fog_transmittance(camH, viewDir.y, fogCalcDist, uniforms.heightFogDensity, uniforms.heightFogFalloff);
    finalHDR = mix(atmosphereColor, finalHDR, fogT);

    output.color = vec4<f32>(finalHDR * exposure, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
