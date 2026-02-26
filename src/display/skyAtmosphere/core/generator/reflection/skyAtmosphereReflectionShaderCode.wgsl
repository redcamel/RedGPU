@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var atmosphereSampler: sampler;
@group(0) @binding(4) var<uniform> params: AtmosphereParameters;
@group(0) @binding(5) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(outputTexture).xy;
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let clipPos = vec4<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0, 1.0, 1.0);
    
    // [KO] 큐브맵 페이스 행렬을 이용해 월드 공간 방향 계산
    // [EN] Calculate world space direction using cubemap face matrix
    let worldPos = faceMatrices[face] * clipPos;
    let view_dir = normalize(worldPos.xyz);
    
    let r = params.earthRadius;
    let h_c = max(0.0001, params.cameraHeight);
    let ray_origin = vec3<f32>(0.0, h_c + r, 0.0);

    let t_max = get_ray_sphere_intersection(ray_origin, view_dir, r + params.atmosphereHeight);
    let t_earth = get_ray_sphere_intersection(ray_origin, view_dir, r);
    let dist_limit = select(t_max, t_earth, t_earth > 0.0);

    var radiance = vec3<f32>(0.0);
    var transmittance = vec3<f32>(1.0);

    if (dist_limit > 0.0) {
        // [KO] 품질을 위해 32단계 적분 (SkyView보다 작게 설정하여 성능 확보)
        // [EN] 32-step integration for quality (set smaller than SkyView for performance)
        let steps = 32;
        let step_size = dist_limit / f32(steps);

        for (var i = 0; i < steps; i = i + 1) {
            let t = (f32(i) + 0.5) * step_size;
            let p = ray_origin + view_dir * t;
            let p_len = length(p);
            let up = p / p_len;
            let cur_h = p_len - r;

            let cos_sun = dot(up, params.sunDirection);
            let sun_trans = get_transmittance(transmittanceTexture, atmosphereSampler, cur_h, cos_sun, params.atmosphereHeight);

            // [KO] 행성 그림자 [EN] Planet shadow
            var shadow_mask = 1.0;
            if (get_ray_sphere_intersection(p, params.sunDirection, r) > 0.0) { shadow_mask = 0.0; }

            let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
            let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);
            let rho_f = exp(-max(0.0, cur_h) * params.heightFogFalloff);

            let view_sun_cos = dot(view_dir, params.sunDirection);
            
            // [KO] 산란광 계산 (물리적 정합성 교정 완료된 로직 적용)
            let scat_r = params.rayleighScattering * rho_r * phase_rayleigh(view_sun_cos);
            let scat_m = vec3<f32>(params.mieScattering * rho_m * phase_mie(view_sun_cos, params.mieAnisotropy));
            let scat_f = vec3<f32>(params.heightFogDensity * rho_f * phase_mie(view_sun_cos, 0.7)); 
            
            let scat = (scat_r + scat_m + scat_f) * sun_trans * shadow_mask;

            // [KO] 다중 산란 기여분
            let ms_uv = vec2<f32>(cos_sun * 0.5 + 0.5, 1.0 - clamp(cur_h / params.atmosphereHeight, 0.0, 1.0));
            let ms_energy = textureSampleLevel(multiScatTexture, atmosphereSampler, ms_uv, 0.0).rgb;
            let total_scat_coeff = params.rayleighScattering * rho_r + vec3<f32>(params.mieScattering * rho_m + params.heightFogDensity * rho_f);
            let ms_scat = ms_energy * total_scat_coeff * shadow_mask;

            let extinction = get_total_extinction(cur_h, params) + vec3<f32>(params.heightFogDensity * rho_f);

            radiance += transmittance * (scat + ms_scat) * step_size;
            transmittance *= exp(-extinction * step_size);
            if (all(transmittance < vec3<f32>(0.001))) { break; }
        }

        // [KO] 지면 반사광 추가
        if (t_earth > 0.0) {
            let hitPos = ray_origin + view_dir * t_earth;
            let up = normalize(hitPos);
            let cos_sun = dot(up, params.sunDirection);
            let sun_trans = get_transmittance(transmittanceTexture, atmosphereSampler, 0.0, cos_sun, params.atmosphereHeight);
            
            let albedo = params.groundAlbedo * INV_PI;
            let ms_energy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cos_sun * 0.5 + 0.5, 0.0), 0.0).rgb;
            
            let ground_radiance = (sun_trans * max(0.0, cos_sun) + ms_energy) * albedo;
            radiance += transmittance * ground_radiance;
        }
    }

    // [KO] 최종 광도 저장 (태양 강도는 재질에서 샘플링 시 곱함)
    // [EN] Store final radiance (sun intensity is multiplied when sampling in the material)
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
