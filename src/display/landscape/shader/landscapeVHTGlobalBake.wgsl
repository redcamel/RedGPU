struct VHTGlobalBakeUniforms {
    targetOffset: vec2<u32>,
    targetSize: vec2<u32>,
    uvBounds: vec4<f32>,
};

@group(0) @binding(0) var globalHeightTexture: texture_2d<f32>;
@group(0) @binding(1) var globalHeightSampler: sampler;
@group(0) @binding(2) var dstVhtAtlasTexture: texture_storage_2d<r32float, write>;
@group(0) @binding(3) var<uniform> uniforms: VHTGlobalBakeUniforms;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let localX = global_id.x;
    let localY = global_id.y;

    if (localX >= uniforms.targetSize.x || localY >= uniforms.targetSize.y) {
        return;
    }

    let normU = (f32(localX) + 0.5) / f32(uniforms.targetSize.x);
    let normV = (f32(localY) + 0.5) / f32(uniforms.targetSize.y);

    let sampleUV = vec2<f32>(
        mix(uniforms.uvBounds.x, uniforms.uvBounds.z, normU),
        mix(uniforms.uvBounds.y, uniforms.uvBounds.w, normV)
    );

    let heightSample = textureSampleLevel(globalHeightTexture, globalHeightSampler, sampleUV, 0.0);

    let dstX = uniforms.targetOffset.x + localX;
    let dstY = uniforms.targetOffset.y + localY;
    let dstCoord = vec2<i32>(i32(dstX), i32(dstY));

    textureStore(dstVhtAtlasTexture, dstCoord, heightSample);
}
