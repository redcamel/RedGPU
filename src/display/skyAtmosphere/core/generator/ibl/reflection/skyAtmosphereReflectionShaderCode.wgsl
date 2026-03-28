#redgpu_include skyAtmosphere.skyAtmosphereFn
@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(5) var skyViewTexture: texture_2d<f32>;

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.INV_PI

#redgpu_include math.hash.getHammersley

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outputTexture).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let face = global_id.z;
    
    var totalRadiance = vec3<f32>(0.0);
    const SAMPLE_COUNT: u32 = 4u; // [KO] 고품질 적분을 위한 샘플 수

    for (var i = 0u; i < SAMPLE_COUNT; i = i + 1u) {
        let offset = getHammersley(i, SAMPLE_COUNT) - 0.5;
        let uv = (vec2<f32>(global_id.xy) + 0.5 + offset) / size;
        
        var viewDir = getCubeMapDirection(uv, face);
        viewDir = normalize(viewDir);
        
        if (abs(viewDir.y) > 0.9999) {
            viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
        }

        // [KO] 태양 디스크 및 스펙큘러 로브를 제외한 대기 산란 휘도만 평가
        totalRadiance += evaluateIBLRadiance(viewDir, params, transmittanceTexture, multiScatTexture, skyViewTexture, atmosphereSampler);
    }

    let radiance = totalRadiance / f32(SAMPLE_COUNT);
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
