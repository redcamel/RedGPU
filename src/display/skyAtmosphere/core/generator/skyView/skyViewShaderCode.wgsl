// [KO] Sky-View LUT 생성을 위한 Compute Shader
@group(0) @binding(0) var skyViewTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var tSampler: sampler;

// [중요] 16바이트 정렬을 강제한 구조체 선언 (CPU 오프셋과 1:1 매칭)
struct AtmosphereParameters {
    earthRadius: f32,
    atmosphereHeight: f32,
    mieScattering: f32,
    mieExtinction: f32,

    rayleighScattering: vec3<f32>,
    mieAnisotropy: f32,

    rayleighScaleHeight: f32,
    mieScaleHeight: f32,
    cameraHeight: f32,
    multiScatteringAmbient: f32,

    ozoneAbsorption: vec3<f32>,
    ozoneLayerCenter: f32,

    sunDirection: vec3<f32>,
    ozoneLayerWidth: f32,
};
@group(0) @binding(4) var<uniform> params: AtmosphereParameters;

const PI: f32 = 3.14159265359;

fn get_ray_sphere_intersection(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    let t = -b + sqrt(delta);
    return select(-1.0, t, t > 0.0);
}

fn get_transmittance(h: f32, cos_theta: f32) -> vec3<f32> {
    let v = sqrt(clamp(h / params.atmosphereHeight, 0.0, 1.0));
    let u = clamp(cos_theta * 0.5 + 0.5, 0.0, 1.0);
    return textureSampleLevel(transmittanceTexture, tSampler, vec2<f32>(u, v), 0.0).rgb;
}

fn phase_rayleigh(cos_theta: f32) -> f32 {
    return 3.0 / (16.0 * PI) * (1.0 + cos_theta * cos_theta);
}

fn phase_mie(cos_theta: f32) -> f32 {
    let g = params.mieAnisotropy;
    let g2 = g * g;
    return 1.0 / (4.0 * PI) * ((1.0 - g2) / pow(max(0.001, 1.0 + g2 - 2.0 * g * cos_theta), 1.5));
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(skyViewTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let azimuth = (uv.x - 0.5) * 2.0 * PI;

    let r = params.earthRadius;
    let h_c = max(0.0001, params.cameraHeight);
    
    // 기하학적 지평선 계산
    let horizon_sin = -sqrt(max(0.0, h_c * (2.0 * r + h_c))) / (r + h_c);
    let horizon_elevation = asin(clamp(horizon_sin, -1.0, 1.0));

    let v_coord = uv.y;
    var elevation: f32;
    if (v_coord <= 0.5) {
        let coord = 1.0 - v_coord * 2.0; 
        elevation = horizon_elevation + (coord * coord) * (PI * 0.5 - horizon_elevation);
    } else {
        let coord = (v_coord - 0.5) * 2.0; 
        elevation = horizon_elevation - (coord * coord) * (horizon_elevation + PI * 0.5);
    }

    let view_dir = vec3<f32>(cos(elevation) * cos(azimuth), sin(elevation), cos(elevation) * sin(azimuth));
    let ray_origin = vec3<f32>(0.0, h_c + r, 0.0);

    let t_max = get_ray_sphere_intersection(ray_origin, view_dir, r + params.atmosphereHeight);
    let t_earth = get_ray_sphere_intersection(ray_origin, view_dir, r);

    var dist_limit = t_max;
    if (t_earth > 0.0) { dist_limit = min(t_max, t_earth); }

    var luminance = vec3<f32>(0.0);
    var transmittance_to_camera = vec3<f32>(1.0);

    if (dist_limit > 0.0) {
        let steps = 128;
        let step_size = dist_limit / f32(steps);

        for (var i = 0; i < steps; i = i + 1) {
            let t = (f32(i) + 0.5) * step_size;
            let p = ray_origin + view_dir * t;
            let p_len = length(p);
            let up = p / p_len;
            let cur_h = p_len - r;

            // [물리 보정] 해당 지점에서의 로컬 태양 고도 계산
            let cos_sun = dot(up, params.sunDirection); 
            let current_horizon_cos = -sqrt(max(0.0, cur_h * (2.0 * r + cur_h))) / (r + cur_h);
            let light_fade = smoothstep(current_horizon_cos - 0.1, current_horizon_cos + 0.1, cos_sun);

            let sun_trans = get_transmittance(cur_h, cos_sun) * light_fade;

            // [수정] 이진 그림자 대신 부드러운 그림자 마스크 사용
            var shadow_mask = 1.0;
            let t_earth_shadow = get_ray_sphere_intersection(p, params.sunDirection, r);
            if (t_earth_shadow > 0.0) { 
                shadow_mask = smoothstep(-0.05, 0.02, cos_sun); // 지평선 근처에서 부드럽게 감쇄
            }
            shadow_mask = min(shadow_mask, light_fade);

            let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
            let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);
            
            // [추가] 오존 밀도 프로파일 (Tent Function)
            let o_width = max(1e-3, params.ozoneLayerWidth);
            let rho_o = max(0.0, 1.0 - abs(cur_h - params.ozoneLayerCenter) / o_width);

            let view_sun_cos = dot(view_dir, params.sunDirection);
            let step_scat = (params.rayleighScattering * rho_r * phase_rayleigh(view_sun_cos) + 
                             params.mieScattering * rho_m * phase_mie(view_sun_cos)) * sun_trans * shadow_mask;

            let multi_scat_uv = vec2<f32>(clamp(cos_sun * 0.5 + 0.5, 0.0, 1.0), sqrt(clamp(max(0.0, cur_h) / params.atmosphereHeight, 0.0, 1.0)));
            let multi_scat_energy = textureSampleLevel(multiScatTexture, tSampler, multi_scat_uv, 0.0).rgb;
            let total_density = params.rayleighScattering * rho_r + params.mieScattering * rho_m;
            let scat_ms = multi_scat_energy * total_density * params.multiScatteringAmbient;

            // [보정] 소멸 계수(Extinction)에 오존 흡수 성분 추가하여 천정의 푸른색 강화
            let extinction = params.rayleighScattering * rho_r + params.mieExtinction * rho_m + params.ozoneAbsorption * rho_o;

            luminance += transmittance_to_camera * (step_scat + scat_ms) * step_size;
            transmittance_to_camera *= exp(-extinction * step_size);

            if (all(transmittance_to_camera < vec3<f32>(0.001))) { break; }
        }
    }

    // [수정] 지평선 하단 감쇄를 완전히 제거 (지면 위 Aerial Perspective 보존)
    // if (elevation < horizon_elevation) {
    //    luminance *= smoothstep(horizon_elevation - 0.005, horizon_elevation, elevation);
    // }

    // 카메라에서 dist_limit(지면 혹은 대기끝)까지의 투과율을 alpha에 저장
    let avg_transmittance = (transmittance_to_camera.r + transmittance_to_camera.g + transmittance_to_camera.b) / 3.0;
    textureStore(skyViewTexture, global_id.xy, vec4<f32>(luminance, avg_transmittance));
}
