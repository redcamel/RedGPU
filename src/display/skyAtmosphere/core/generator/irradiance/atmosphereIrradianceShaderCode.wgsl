@group(0) @binding(0) var irradianceTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var skyViewTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: AtmosphereParameters;

@compute @workgroup_size(32, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(irradianceTexture);
    if (global_id.x >= size.x) { return; }

    // [KO] 픽셀 중심 매핑으로 법선 방향(Zenith) 결정
    // [EN] Normal direction (Zenith) determination with pixel-center mapping
    let u = (f32(global_id.x) + 0.5) / f32(size.x);
    let normal_y = u * 2.0 - 1.0;
    let normal = normalize(vec3<f32>(0.0, normal_y, sqrt(max(0.0, 1.0 - normal_y * normal_y))));

    // [KO] 법선 방향으로 정렬하기 위한 로컬 기저(TBN) 생성
    // [EN] Create local basis (TBN) to align with normal direction
    let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(normal.y) > 0.99);
    let tangent = normalize(cross(up, normal));
    let bitangent = cross(normal, tangent);
    let tbn = mat3x3<f32>(tangent, normal, bitangent);

    let r = params.earthRadius;
    let camH = params.cameraHeight;
    let atmH = params.atmosphereHeight;

    var irradiance = vec3<f32>(0.0);
    
    // [KO] 반구 샘플링 (람베르트 코사인 가중치 적분)
    const samples_phi = 16u;
    const samples_theta = 8u;
    
    for (var i = 0u; i < samples_phi; i = i + 1u) {
        let phi = (f32(i) + 0.5) / f32(samples_phi) * PI2;
        for (var j = 0u; j < samples_theta; j = j + 1u) {
            let theta = (f32(j) + 0.5) / f32(samples_theta) * HPI;
            
            // [KO] 로컬 반구 샘플 방향 (Y-Up 기준)
            let cos_theta = cos(theta);
            let sin_theta = sin(theta);
            let localL = vec3<f32>(sin_theta * cos(phi), cos_theta, sin_theta * sin(phi));
            
            // [KO] 월드 공간으로 광선 회전
            let L = tbn * localL;
            
            // [KO] Sky-View LUT에서 해당 방향의 대기광 샘플링
            let skyUV = get_sky_view_uv(L, camH, r, atmH);
            let skyRadiance = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0).rgb;
            
            // [KO] 람베르트 가중치 적용 (cos_theta)
            irradiance += skyRadiance * cos_theta * sin_theta;
        }
    }

    // [KO] 적분 정규화 및 출력
    irradiance = irradiance * (PI2 * HPI / f32(samples_phi * samples_theta));
    textureStore(irradianceTexture, vec2<u32>(global_id.x, 0u), vec4<f32>(irradiance, 1.0));
}
