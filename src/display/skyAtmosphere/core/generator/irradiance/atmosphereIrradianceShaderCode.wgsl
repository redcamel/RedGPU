@group(0) @binding(0) var irradianceTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var skyViewTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var atmosphereSampler: sampler;
@group(0) @binding(4) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(irradianceTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    // [KO] 2D 매핑: x = Elevation, y = Relative Azimuth to Sun
    // [EN] 2D Mapping: x = Elevation, y = Relative Azimuth to Sun
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    
    // 법선 벡터의 고도 (Elevation)
    let elevation = (uv.x - 0.5) * PI; 
    // 법선 벡터의 태양 대비 방위각 (Relative Azimuth)
    let rel_azimuth = (uv.y - 0.5) * PI2;

    // [KO] 태양의 실제 방위각 고려
    let sun_azimuth = atan2(params.sunDirection.z, params.sunDirection.x);
    let world_azimuth = sun_azimuth + rel_azimuth;

    // 최종 법선 벡터 구축
    let normal = normalize(vec3<f32>(
        cos(elevation) * cos(world_azimuth),
        sin(elevation),
        cos(elevation) * sin(world_azimuth)
    ));

    // [KO] 법선 방향으로 정렬하기 위한 로컬 기저(TBN) 생성
    let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(normal.y) > 0.99);
    let tangent = normalize(cross(up, normal));
    let bitangent = cross(normal, tangent);
    let tbn = mat3x3<f32>(tangent, normal, bitangent);

    let r = params.earthRadius;
    let camH = params.cameraHeight;
    let atmH = params.atmosphereHeight;

    var irradiance = vec3<f32>(0.0);
    
    // [KO] 반구 샘플링 (람베르트 코사인 가중치 적분)
    const samples_phi = 12u;
    const samples_theta = 6u;
    
    for (var i = 0u; i < samples_phi; i = i + 1u) {
        let phi = (f32(i) + 0.5) / f32(samples_phi) * PI2;
        for (var j = 0u; j < samples_theta; j = j + 1u) {
            let theta = (f32(j) + 0.5) / f32(samples_theta) * HPI;
            
            let cos_theta = cos(theta);
            let sin_theta = sin(theta);
            let localL = vec3<f32>(sin_theta * cos(phi), cos_theta, sin_theta * sin(phi));
            
            let L = tbn * localL;
            
            let skyUV = get_sky_view_uv(L, camH, r, atmH);
            var skyRadiance = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0).rgb;
            
            // [KO] 지평선 아래 방향 샘플링 시, SkyView에서 지면이 지워졌다면 직접 지면 조도를 계산합니다.
            // [EN] When sampling below the horizon, if the ground was removed from SkyView, calculate ground irradiance directly.
            if (params.useGround > 0.5 && L.y < -0.001) {
                let t_ground = get_ray_sphere_intersection(vec3<f32>(0.0, r + camH, 0.0), L, r);
                if (t_ground > 0.0) {
                    let hit_p = vec3<f32>(0.0, r + camH, 0.0) + L * t_ground;
                    let cos_s = max(0.0, dot(normalize(hit_p), params.sunDirection));
                    let sun_t = get_physical_transmittance(hit_p, params.sunDirection, r, atmH, params);
                    let ms_energy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(dot(normalize(hit_p), params.sunDirection) * 0.5 + 0.5, 0.0), 0.0).rgb;
                    
                    let ground_albedo = params.groundAlbedo * INV_PI;
                    skyRadiance = (sun_t * cos_s + ms_energy + params.groundAmbient) * ground_albedo;
                }
            }
            
            irradiance += skyRadiance * cos_theta * sin_theta;
        }
    }

    irradiance = irradiance * (PI2 * HPI / f32(samples_phi * samples_theta));
    textureStore(irradianceTexture, global_id.xy, vec4<f32>(irradiance, 1.0));
}
