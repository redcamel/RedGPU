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
    let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(normal.y) > 0.999);
    let tbn = getTBN(normal, up);

    var irradiance = vec3<f32>(0.0);
    var totalWeight = 0.0;

    for (var i = 0u; i < IRRADIANCE_SAMPLES; i = i + 1u) {
        let xi = getHammersley(i, IRRADIANCE_SAMPLES);
        let phi = PI2 * xi.x;
        let cosTheta = sqrt(1.0 - xi.y);
        let sinTheta = sqrt(xi.y);
        let sampleVec = vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);
        let worldSample = normalize(tbn * sampleVec);
        irradiance += evaluateIBLRadiance(worldSample, params, transmittanceTexture, multiScatTexture, skyViewTexture, skyAtmosphereSampler);
        totalWeight += 1.0;
    }

    irradiance = irradiance / totalWeight;
    textureStore(outTexture, global_id.xy, face, vec4<f32>(irradiance, 1.0));
}
