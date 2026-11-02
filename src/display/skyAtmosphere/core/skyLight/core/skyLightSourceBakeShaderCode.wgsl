#redgpu_include skyAtmosphere.skyAtmosphereFn
@group(0) @binding(0) var reflectionSourceOut: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var irradianceSourceOut: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(5) var skyViewTexture: texture_2d<f32>;

#redgpu_include math.hash.getHammersley
#redgpu_include color.getLuminance

/**
 * [KO] 정반사 IBL 베이킹을 위해 대기 복사휘도를 조회하고 파이어플라이(Firefly) 방지를 위해 최대 휘도를 제한합니다.
 * [EN] Evaluates atmospheric radiance for specular IBL baking and clamps maximum luminance to prevent fireflies.
 */
fn getIBLAtmosphereRadiance(viewDir: vec3<f32>) -> vec3<f32> {
    var radiance = evaluateIBLRadiance(viewDir, params, transmittanceTexture, skyViewTexture, atmosphereSampler, false);

    let maxIBLLuminance: f32 = 10000.0;
    let lum = getLuminance(radiance);
    if (lum > maxIBLLuminance) {
        radiance *= (maxIBLLuminance / lum);
    }

    return radiance;
}

/**
 * [KO] 간접 정반사 조명(Reflection) 및 간접 난반사 조명(Irradiance)의 소스 환경 큐브맵을 단일 컴퓨트 패스에서 동시에 생성합니다.
 * [EN] Simultaneously generates the source environment cubemaps for indirect specular (Reflection) and indirect diffuse (Irradiance) lighting in a single compute pass.
 */
@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(reflectionSourceOut).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let baseCoord = vec2<f32>(global_id.xy) + 0.5;
    let face = global_id.z;

    // 1. Reflection Source (8-Tap Hammersley, includeSunDisk = false, maxIBLLuminance = 10000.0)
    var totalReflectionRadiance = vec3<f32>(0.0);
    const REFLECTION_SAMPLE_COUNT: u32 = 8u;
    for (var i = 0u; i < REFLECTION_SAMPLE_COUNT; i = i + 1u) {
        let offset = getHammersley(i, REFLECTION_SAMPLE_COUNT) - 0.5;
        let uv = (baseCoord + offset) / size;

        let rawDir = getCubeMapDirection(uv, face);
        let invLen = inverseSqrt(dot(rawDir, rawDir));
        var viewDir = rawDir * invLen;

        if (abs(viewDir.y) > 0.9999) {
            viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
        }

        totalReflectionRadiance += getIBLAtmosphereRadiance(viewDir);
    }
    const INV_REFLECTION_SAMPLE_COUNT_PI: f32 = (1.0 / f32(REFLECTION_SAMPLE_COUNT)) * PI;
    let reflectionRadiance = totalReflectionRadiance * INV_REFLECTION_SAMPLE_COUNT_PI;
    textureStore(reflectionSourceOut, global_id.xy, face, vec4<f32>(reflectionRadiance, 1.0));

    // 2. Irradiance Source (4-Tap Hammersley, offset * 0.8, includeSunDisk = true, unclamped)
    var totalIrradianceRadiance = vec3<f32>(0.0);
    const IRRADIANCE_SAMPLE_COUNT: u32 = 4u;
    for (var j = 0u; j < IRRADIANCE_SAMPLE_COUNT; j = j + 1u) {
        let offset = getHammersley(j, IRRADIANCE_SAMPLE_COUNT) - 0.5;
        let uv = (baseCoord + offset * 0.8) / size;

        let rawDir = getCubeMapDirection(uv, face);
        let invLen = inverseSqrt(dot(rawDir, rawDir));
        var viewDir = rawDir * invLen;

        if (abs(viewDir.y) > 0.9999) {
            viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
        }

        totalIrradianceRadiance += evaluateIBLRadiance(viewDir, params, transmittanceTexture, skyViewTexture, atmosphereSampler, true);
    }
    const INV_IRRADIANCE_SAMPLE_COUNT_PI: f32 = (1.0 / f32(IRRADIANCE_SAMPLE_COUNT)) * PI;
    let irradianceRadiance = totalIrradianceRadiance * INV_IRRADIANCE_SAMPLE_COUNT_PI;
    textureStore(irradianceSourceOut, global_id.xy, face, vec4<f32>(irradianceRadiance, 1.0));
}
