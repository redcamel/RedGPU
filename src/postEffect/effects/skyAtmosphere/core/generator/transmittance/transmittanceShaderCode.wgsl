// [KO] UE5 표준 Transmittance LUT 생성

@group(0) @binding(0) var transmittanceTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var<uniform> params: AtmosphereParameters;

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(transmittanceTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    // [KO] 텍셀 중심 매핑으로 정밀도 향상
    // [EN] Improve precision with pixel center mapping
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let cos_theta = uv.x * 2.0 - 1.0;
    
    // [KO] V = 1.0 - (h / H_atm) -> h = (1.0 - V) * H_atm
    // [EN] V = 1.0 - (h / H_atm) -> h = (1.0 - V) * H_atm
    let h = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);

    let T = exp(-min(get_optical_depth(h, cos_theta), vec3<f32>(MAX_TAU)));
    textureStore(transmittanceTexture, global_id.xy, vec4<f32>(T, 1.0));
}

fn get_optical_depth(h: f32, cos_theta: f32) -> vec3<f32> {
    let r = params.earthRadius;
    let ray_origin = vec3<f32>(0.0, h + r, 0.0);
    let sin_theta = sqrt(max(0.0, 1.0 - cos_theta * cos_theta));
    let ray_dir = vec3<f32>(sin_theta, cos_theta, 0.0);

    // [KO] 지면 충돌 확인 (약간의 오프셋으로 자기 교차 방지)
    // [EN] Check ground intersection (with a small offset to prevent self-intersection)
    let t_earth = get_ray_sphere_intersection(ray_origin, ray_dir, r);
    if (t_earth > 0.01) { return vec3<f32>(MAX_TAU); }

    let t_max = get_ray_sphere_intersection(ray_origin, ray_dir, r + params.atmosphereHeight);
    if (t_max < 0.0) { return vec3<f32>(0.0); }

    let steps = 40;
    let step_size = t_max / f32(steps);
    var opt_r = 0.0;
    var opt_m = 0.0;
    var opt_o = 0.0;

    for (var i = 0; i < steps; i = i + 1) {
        let t = (f32(i) + 0.5) * step_size;
        let cur_pos = ray_origin + ray_dir * t;
        let cur_h = length(cur_pos) - r;
        
        opt_r += exp(-max(0.0, cur_h) / params.rayleighScaleHeight) * step_size;
        opt_m += exp(-max(0.0, cur_h) / params.mieScaleHeight) * step_size;
        
        // [KO] 오존층: 단순 선형 모델에서 정규 분포와 유사하게 개선
        // [EN] Ozone layer: Improved from simple linear model to something closer to normal distribution
        let ozone_dist = abs(cur_h - params.ozoneLayerCenter);
        opt_o += exp(-max(0.0, ozone_dist * ozone_dist) / (params.ozoneLayerWidth * params.ozoneLayerWidth)) * step_size;
    }

    // [KO] Mie 항을 vec3로 캐스팅하여 타입 오류 해결
    // [EN] Fix type error by casting Mie term to vec3
    return params.rayleighScattering * opt_r + vec3<f32>(params.mieExtinction * opt_m) + params.ozoneAbsorption * opt_o;
}
