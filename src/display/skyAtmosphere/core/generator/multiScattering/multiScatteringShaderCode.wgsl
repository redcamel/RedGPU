// [KO] 다중 산란(Multi-Scattering) 에너지 보정 LUT 생성을 위한 Compute Shader
@group(0) @binding(0) var multiScatTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var tSampler: sampler;

struct AtmosphereParameters {
    earthRadius: f32,
    atmosphereHeight: f32,
    mieScattering: f32,
    mieExtinction: f32,
    rayleighScattering: vec3<f32>,
    dummy1: f32,
    mieAnisotropy: f32,
    rayleighScaleHeight: f32,
    mieScaleHeight: f32,
    cameraHeight: f32,
    ozoneAbsorption: vec3<f32>,
    dummy2: f32,
};
@group(0) @binding(3) var<uniform> params: AtmosphereParameters;

const PI: f32 = 3.14159265359;

fn get_ray_sphere_intersection(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    let sol = -b + sqrt(delta);
    return select(-1.0, sol, sol > 0.0);
}

fn get_transmittance(h: f32, cos_theta: f32) -> vec3<f32> {
    // [표준] Transmittance LUT 생성 로직과 정확히 일치하는 역함수 매핑
    let v = sqrt(clamp(h / params.atmosphereHeight, 0.0, 1.0));
    let u = clamp(cos_theta * 0.5 + 0.5, 0.0, 1.0);
    return textureSampleLevel(transmittanceTexture, tSampler, vec2<f32>(u, v), 0.0).rgb;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(multiScatTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);

    // [표준] v=0 -> h=0, v=1 -> h=H (제곱 매핑)
    let h = (uv.y * uv.y) * params.atmosphereHeight;
    let cos_sun_theta = uv.x * 2.0 - 1.0;

    let ray_origin = vec3<f32>(0.0, h + params.earthRadius, 0.0);
    let sun_dir = vec3<f32>(sqrt(max(0.0, 1.0 - cos_sun_theta * cos_sun_theta)), cos_sun_theta, 0.0);

    var lum_total = vec3<f32>(0.0);
    var fms = vec3<f32>(0.0);

    let sample_count = 64;
    
    // 지평선 소프트 쉐도우
    let r = params.earthRadius;
    let horizon_cosine = -sqrt(h * (2.0 * r + h)) / (r + h);
    let light_fade = smoothstep(horizon_cosine - 0.1, horizon_cosine + 0.1, cos_sun_theta);
    var sun_transmittance = get_transmittance(h, cos_sun_theta) * light_fade;

    for (var i = 0; i < sample_count; i = i + 1) {
        let step = f32(i) + 0.5;
        let theta = acos(1.0 - 2.0 * step / f32(sample_count));
        let phi = (sqrt(5.0) + 1.0) * PI * step;

        let ray_dir = vec3<f32>(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));

        let t_max = get_ray_sphere_intersection(ray_origin, ray_dir, params.earthRadius + params.atmosphereHeight);
        let t_earth = get_ray_sphere_intersection(ray_origin, ray_dir, params.earthRadius);

        if (t_max > 0.0 && t_earth < 0.0) {
            let ray_transmittance = get_transmittance(h, ray_dir.y);
            let nu = dot(ray_dir, sun_dir);
            let phase = 3.0 / (16.0 * PI) * (1.0 + nu * nu);
            let scattering = 1.0 - ray_transmittance;

            lum_total += scattering * sun_transmittance * phase;
            fms += scattering * (1.0 / f32(sample_count));
        }
    }

    let final_energy = lum_total / f32(sample_count) * 4.0 * PI;
    let output = final_energy / (1.0 - min(fms, vec3<f32>(0.999)));

    textureStore(multiScatTexture, global_id.xy, vec4<f32>(output, 1.0));
}
