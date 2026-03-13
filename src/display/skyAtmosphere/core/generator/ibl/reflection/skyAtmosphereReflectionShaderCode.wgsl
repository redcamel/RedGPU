#redgpu_include skyAtmosphere.skyAtmosphereFn
@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(5) var skyViewTexture: texture_2d<f32>;

struct ReflectionParams {
    mode: u32,
    pad0: u32,
    pad1: u32,
    pad2: u32,
    _pad: vec4<u32>
}
@group(0) @binding(6) var<uniform> reflectionParams: ReflectionParams;

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.INV_PI

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outputTexture).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / size;

    var viewDir = getCubeMapDirection(uv, face);
    viewDir = normalize(viewDir);
    
    if (abs(viewDir.y) > 0.9999) {
        viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
    }

    // [KO] reflectionParams.mode를 사용하여 SoftCut(1u) 또는 NoSoftCut(2u) 결정
    // [EN] Determine SoftCut (1u) or NoSoftCut (2u) using reflectionParams.mode
    let radiance = evaluateIBLRadiance(viewDir, params, transmittanceTexture, multiScatTexture, skyViewTexture, atmosphereSampler, reflectionParams.mode);

    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
