#redgpu_include systemStruct.SkyAtmosphere
#redgpu_include skyAtmosphere.skyAtmosphereFn
#redgpu_include math.hash.getHammersley

@group(0) @binding(0) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(1) var skyAtmosphereSampler: sampler;
@group(0) @binding(2) var outTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(5) var skyViewTexture: texture_2d<f32>;

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.INV_PI
#redgpu_include math.tnb.getTBN
#redgpu_include color.getLuminance

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outTexture).xy;
    let size = vec2<f32>(size_u);
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / size;
    let dir = getCubeMapDirection(uv, face);
    let normal = normalize(dir);
    
    // [KO] 법선을 기준으로 Orthonormal Basis 생성
    let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(normal.y) > 0.999);
    let tbn = getTBN(normal, up);

    var irradiance = vec3<f32>(0.0);
    const SAMPLE_COUNT: u32 = 256u; // [KO] 적분 품질과 성능의 최적 밸런스

    for (var i = 0u; i < SAMPLE_COUNT; i = i + 1u) {
        let xi = getHammersley(i, SAMPLE_COUNT);
        
        // [KO] 코사인 가중치 반구 샘플링 (Cosine-weighted Hemisphere Sampling)
        let phi = PI2 * xi.x;
        let cosTheta = sqrt(1.0 - xi.y);
        let sinTheta = sqrt(xi.y);
        
        let sampleVec = vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);
        let worldSample = normalize(tbn * sampleVec);
        
        // [KO] 실시간 대기 광휘 평가
        irradiance += evaluateIBLRadiance(worldSample, params, transmittanceTexture, multiScatTexture, skyViewTexture, skyAtmosphereSampler);
    }

    // [KO] 물리적 조도 보정: E = PI * (Sum / N)
    // [KO] 코사인 가중치 샘플링을 사용하므로 최종 결과에 PI를 곱하여 조도 단위로 변환
    irradiance = (irradiance * PI) / f32(SAMPLE_COUNT);
    
    textureStore(outTexture, global_id.xy, face, vec4<f32>(irradiance, 1.0));
}
