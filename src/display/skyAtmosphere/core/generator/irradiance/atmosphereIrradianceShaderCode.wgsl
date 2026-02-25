@group(0) @binding(0) var irradianceTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var skyViewTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: AtmosphereParameters;

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
            let skyRadiance = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0).rgb;
            
            irradiance += skyRadiance * cos_theta * sin_theta;
        }
    }

    irradiance = irradiance * (PI2 * HPI / f32(samples_phi * samples_theta));
    textureStore(irradianceTexture, global_id.xy, vec4<f32>(irradiance, 1.0));
}
