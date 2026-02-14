// [KO] Aerial Perspective 3D LUT 생성을 위한 Compute Shader

@group(0) @binding(0) var cameraVolumeTexture: texture_storage_3d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var tSampler: sampler;
@group(0) @binding(4) var<uniform> params: AtmosphereParameters;

@compute @workgroup_size(4, 4, 4)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(cameraVolumeTexture);
    if (global_id.x >= size.x || global_id.y >= size.y || global_id.z >= size.z) { return; }

    let uvw = (vec3<f32>(global_id) + 0.5) / vec3<f32>(size);
    
    // UVW를 뷰 공간의 방향과 거리로 변환
    let azimuth = (uvw.x - 0.5) * 2.0 * PI;
    let elevation = (uvw.y - 0.5) * PI;
    let view_dir = vec3<f32>(cos(elevation) * cos(azimuth), sin(elevation), cos(elevation) * sin(azimuth));
    
    // 거리 매핑 (언리얼과 유사하게 비선형적으로 설정, 최대 100km)
    let max_dist = 100.0;
    let slice_dist = uvw.z * uvw.z * max_dist; 

    let r = params.earthRadius;
    let h_c = max(0.0001, params.cameraHeight);
    let ray_origin = vec3<f32>(0.0, h_c + r, 0.0);

    // 적분 시작
    var luminance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    let steps = 32;
    let step_size = slice_dist / f32(steps);

    if (slice_dist > 0.0) {
        for (var i = 0; i < steps; i = i + 1) {
            let t = (f32(i) + 0.5) * step_size;
            let p = ray_origin + view_dir * t;
            let p_len = length(p);
            let cur_h = p_len - r;

            // 지표면 아래인 경우 중단
            if (cur_h < 0.0) { break; }

            let up = p / p_len;
            let cos_sun = dot(up, params.sunDirection);
            let sun_trans = get_transmittance(transmittanceTexture, tSampler, cur_h, cos_sun, params.atmosphereHeight);

            let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
            let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);
            let rho_f = exp(-max(0.0, cur_h) * params.heightFogFalloff);
            
            // [KO] 오존층 흡수 기여분
            let ozone_dist = abs(cur_h - params.ozoneLayerCenter);
            let rho_o = exp(-max(0.0, ozone_dist * ozone_dist) / (params.ozoneLayerWidth * params.ozoneLayerWidth));

            let view_sun_cos = dot(view_dir, params.sunDirection);
            
            // [KO] 물리적으로 올바른 산란광 계산 (페이즈 함수 포함)
            // [EN] Physically correct scattering calculation (including phase functions)
            let scat_r = params.rayleighScattering * rho_r * phase_rayleigh(view_sun_cos);
            let scat_m = vec3<f32>(params.mieScattering * rho_m * phase_mie(view_sun_cos, params.mieAnisotropy));
            let scat_f = vec3<f32>(params.heightFogDensity * rho_f * phase_mie(view_sun_cos, 0.7)); // 안개용 페이즈 함수 (고정된 비등방성)
            
            let step_scat = (scat_r + scat_m + scat_f) * sun_trans;

            // [KO] 다중 산란 기여분 (에너지 보존 고려)
            let multi_scat_uv = vec2<f32>(clamp(cos_sun * 0.5 + 0.5, 0.0, 1.0), 1.0 - clamp(cur_h / params.atmosphereHeight, 0.0, 1.0));
            let multi_scat_energy = textureSampleLevel(multiScatTexture, tSampler, multi_scat_uv, 0.0).rgb;
            let total_scat_coeff = params.rayleighScattering * rho_r + vec3<f32>((params.mieScattering * rho_m) + (params.heightFogDensity * rho_f));
            let scat_ms = multi_scat_energy * total_scat_coeff;

            // [KO] 전체 소멸 계수 (에너지 소실)
            let extinction = params.rayleighScattering * rho_r + vec3<f32>(params.mieExtinction * rho_m) + params.ozoneAbsorption * rho_o + vec3<f32>(params.heightFogDensity * rho_f);

            luminance += transmittance * (step_scat + scat_ms) * step_size;
            transmittance *= exp(-extinction * step_size);
        }
    }

    // 결과 저장 (RGB: 산란광, A: 평균 투과율)
    let avg_trans = (transmittance.r + transmittance.g + transmittance.b) / 3.0;
    textureStore(cameraVolumeTexture, global_id, vec4<f32>(luminance, avg_trans));
}
