// [KO] Equirectangular(2D) 텍스처를 CubeMap으로 변환하는 컴퓨트 쉐이더
// [EN] Compute shader that converts an Equirectangular (2D) texture to a CubeMap.

@group(0) @binding(0) var equirectangularTexture: texture_2d<f32>;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var outTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(3) var<uniform> faceMatrices: array<mat4x4<f32>, 6>;

#redgpu_include math.PI

fn directionToSphericalUV(dir: vec3<f32>) -> vec2<f32> {
    let normalizedDir = normalize(dir);
    let theta = atan2(normalizedDir.x, normalizedDir.z);
    let phi = acos(clamp(normalizedDir.y, -1.0, 1.0));
    return vec2<f32>(0.5 - theta / (2.0 * PI), phi / PI);
}

@compute @workgroup_size(8, 8, 1)
fn cs_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(outTexture);
    if (global_id.x >= size.x || global_id.y >= size.y || global_id.z >= 6u) {
        return;
    }

    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);

    let x = uv.x * 2.0 - 1.0;
    let y = uv.y * 2.0 - 1.0;

    let localPos = vec4<f32>(x, y, 1.0, 1.0);
    let direction = (faceMatrices[face] * localPos).xyz;
    
    let sphericalUV = directionToSphericalUV(direction);
    let color = textureSampleLevel(equirectangularTexture, textureSampler, sphericalUV, 0.0);
    textureStore(outTexture, global_id.xy, face, color);
}

