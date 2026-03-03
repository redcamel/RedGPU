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
    let relAzimuth = (uv.y - 0.5) * PI2;

    // [KO] 태양의 실제 방위각 고려
    let sunAzimuth = atan2(params.sunDirection.z, params.sunDirection.x);
    let worldAzimuth = sunAzimuth + relAzimuth;

    // 최종 법선 벡터 구축
    let normal = normalize(vec3<f32>(
        cos(elevation) * cos(worldAzimuth),
        sin(elevation),
        cos(elevation) * sin(worldAzimuth)
    ));

    // [KO] 법선 방향으로 정렬하기 위한 로컬 기저(TBN) 생성
    let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(normal.y) > 0.99);
    let tangent = normalize(cross(up, normal));
    let bitangent = cross(normal, tangent);
    let tbn = mat3x3<f32>(tangent, normal, bitangent);

    let r = params.earthRadius;
    let camH = max(0.0001, params.cameraHeight);
    let atmH = params.atmosphereHeight;

    var irradiance = vec3<f32>(0.0);
    
    // [KO] 반구 샘플링 (람베르트 코사인 가중치 적분)
    const samplesPhi = 32u;
    const samplesTheta = 16u;
    
    for (var i = 0u; i < samplesPhi; i = i + 1u) {
        let phi = (f32(i) + 0.5) / f32(samplesPhi) * PI2;
        for (var j = 0u; j < samplesTheta; j = j + 1u) {
            let theta = (f32(j) + 0.5) / f32(samplesTheta) * HPI;
            
            let cosTheta = cos(theta);
            let sinTheta = sin(theta);
            let localL = vec3<f32>(sinTheta * cos(phi), cosTheta, sinTheta * sin(phi));
            
            let L = tbn * localL;
            
            let skyUV = getSkyViewUV(L, camH, r, atmH);
            var skyRadiance = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0).rgb;
            
            // [KO] 지평선 아래 방향 샘플링 시, 지면 조도를 계산합니다.
            // [EN] When sampling below the horizon, calculate ground irradiance.
            if (params.useGround > 0.5 && L.y < -0.001) {
                let tGround = getRaySphereIntersection(vec3<f32>(0.0, r + camH, 0.0), L, r);
                if (tGround > 0.0) {
                    let hitP = vec3<f32>(0.0, r + camH, 0.0) + L * tGround;
                    let cosS = max(0.0, dot(normalize(hitP), params.sunDirection));
                    let sunT = getPhysicalTransmittance(hitP, params.sunDirection, r, atmH, params);
                    let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(dot(normalize(hitP), params.sunDirection) * 0.5 + 0.5, 1.0), 0.0).rgb;
                    
                    let groundAlbedo = params.groundAlbedo * INV_PI;
                    skyRadiance = (sunT * cosS + msEnergy + params.groundAmbient) * groundAlbedo;
                }
            }
            
            irradiance += skyRadiance * cosTheta * sinTheta;
        }
    }

    irradiance = irradiance * (PI2 * HPI / f32(samplesPhi * samplesTheta));
    textureStore(irradianceTexture, global_id.xy, vec4<f32>(irradiance, 1.0));
}
