// [KO] UE5 표준 Transmittance LUT 생성

@group(0) @binding(0) var transmittanceTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var<uniform> params: SkyAtmosphere;

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

    let t_max = get_ray_sphere_intersection(ray_origin, ray_dir, r + params.atmosphereHeight);
    if (t_max < 0.0) { return vec3<f32>(0.0); }

    // [KO] 지면 교차점 계산 (t_in, t_out 모두 확보)
    // [EN] Calculate earth intersections (get both t_in and t_out)
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - r * r;
    let delta = b * b - c;
    
    var opt_ext = vec3<f32>(0.0);
    if (delta >= 0.0) {
        let s = sqrt(delta);
        let t_in = -b - s;
        let t_out = -b + s;

        // [KO] useGround가 활성화된 경우에만 지면 아래를 불투명 처리합니다.
        if (params.useGround > 0.5 && t_in > EPSILON) { 
            return vec3<f32>(MAX_TAU); 
        }

        // [KO] 지면 관통 시 (useGround가 꺼져 있는 경우 포함): 구간 분할 적분
        if (t_in > EPSILON && t_in < t_max) {
             // 1. 앞쪽 대기 구간 (진입점까지)
             opt_ext += integrate_optical_depth(ray_origin, ray_dir, 0.0, t_in, 20u, params);
             // 2. 뒤쪽 대기 구간 (탈출점부터 대기 끝까지)
             if (t_out > 0.0 && t_max > t_out) {
                 opt_ext += integrate_optical_depth(ray_origin, ray_dir, t_out, t_max, 20u, params);
             }
        } else {
             // 지면을 비껴가는 일반적인 경로
             opt_ext = integrate_optical_depth(ray_origin, ray_dir, 0.0, t_max, 40u, params);
        }
    } else {
        // 지면과 전혀 만나지 않는 경로
        opt_ext = integrate_optical_depth(ray_origin, ray_dir, 0.0, t_max, 40u, params);
    }

    return opt_ext;
}
