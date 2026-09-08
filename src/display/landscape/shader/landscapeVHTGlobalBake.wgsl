struct VHTGlobalBakeUniforms {
    targetOffset: vec2<u32>,
    targetSize: vec2<u32>,
    uvBounds: vec4<f32>,
};

@group(0) @binding(0) var globalHeightTexture: texture_2d<f32>;
@group(0) @binding(1) var dstVhtAtlasTexture: texture_storage_2d<r32float, write>;
@group(0) @binding(2) var<uniform> uniforms: VHTGlobalBakeUniforms;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let localX = global_id.x;
    let localY = global_id.y;

    if (localX >= uniforms.targetSize.x || localY >= uniforms.targetSize.y) {
        return;
    }

    let normU = (f32(localX) + 0.5) / f32(uniforms.targetSize.x);
    let normV = (f32(localY) + 0.5) / f32(uniforms.targetSize.y);

    let sampleU = mix(uniforms.uvBounds.x, uniforms.uvBounds.z, normU);
    let sampleV = mix(uniforms.uvBounds.y, uniforms.uvBounds.w, normV);

    let texDims = vec2<f32>(textureDimensions(globalHeightTexture, 0));
    let maxCoord = vec2<i32>(texDims) - vec2<i32>(1, 1);

    // Continuous pixel coordinate
    let px = sampleU * texDims.x - 0.5;
    let py = sampleV * texDims.y - 0.5;

    let x0 = clamp(i32(floor(px)), 0, maxCoord.x);
    let y0 = clamp(i32(floor(py)), 0, maxCoord.y);
    let x1 = clamp(x0 + 1, 0, maxCoord.x);
    let y1 = clamp(y0 + 1, 0, maxCoord.y);

    let fx = fract(px);
    let fy = fract(py);

    let h00 = textureLoad(globalHeightTexture, vec2<i32>(x0, y0), 0).r;
    let h10 = textureLoad(globalHeightTexture, vec2<i32>(x1, y0), 0).r;
    let h01 = textureLoad(globalHeightTexture, vec2<i32>(x0, y1), 0).r;
    let h11 = textureLoad(globalHeightTexture, vec2<i32>(x1, y1), 0).r;

    let h0 = mix(h00, h10, fx);
    let h1 = mix(h01, h11, fx);
    let heightSample = mix(h0, h1, fy);

    let dstX = uniforms.targetOffset.x + localX;
    let dstY = uniforms.targetOffset.y + localY;
    let dstCoord = vec2<i32>(i32(dstX), i32(dstY));

    textureStore(dstVhtAtlasTexture, dstCoord, vec4<f32>(heightSample, 0.0, 0.0, 1.0));
}
