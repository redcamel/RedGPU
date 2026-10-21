struct VHTGlobalBakeUniforms {
    targetOffset: vec2<u32>,
    targetSize: vec2<u32>,
    uvBounds: vec4<f32>,
};

@group(0) @binding(0) var globalHeightTexture: texture_2d<f32>;
@group(0) @binding(1) var dstVhtAtlasTexture: texture_storage_2d<r32float, write>;
@group(0) @binding(2) var<uniform> uniforms: VHTGlobalBakeUniforms;

fn sampleBicubicBSpline(uv: vec2<f32>, texDims: vec2<f32>, maxCoord: vec2<i32>) -> f32 {
    let coord = uv * texDims - vec2<f32>(0.5);
    let base = vec2<i32>(floor(coord));
    let f = fract(coord);
    let f2 = f * f;
    let f3 = f2 * f;
    let omf = vec2<f32>(1.0) - f;
    let omf3 = omf * omf * omf;

    let wx = vec4<f32>(
        omf3.x / 6.0,
        (3.0 * f3.x - 6.0 * f2.x + 4.0) / 6.0,
        (-3.0 * f3.x + 3.0 * f2.x + 3.0 * f.x + 1.0) / 6.0,
        f3.x / 6.0
    );
    let wy = vec4<f32>(
        omf3.y / 6.0,
        (3.0 * f3.y - 6.0 * f2.y + 4.0) / 6.0,
        (-3.0 * f3.y + 3.0 * f2.y + 3.0 * f.y + 1.0) / 6.0,
        f3.y / 6.0
    );

    let x0 = clamp(base.x - 1, 0, maxCoord.x);
    let x1 = clamp(base.x,     0, maxCoord.x);
    let x2 = clamp(base.x + 1, 0, maxCoord.x);
    let x3 = clamp(base.x + 2, 0, maxCoord.x);

    var sum = 0.0;
    for (var j = -1; j <= 2; j = j + 1) {
        let y = clamp(base.y + j, 0, maxCoord.y);
        let row = vec4<f32>(
            textureLoad(globalHeightTexture, vec2<i32>(x0, y), 0).r,
            textureLoad(globalHeightTexture, vec2<i32>(x1, y), 0).r,
            textureLoad(globalHeightTexture, vec2<i32>(x2, y), 0).r,
            textureLoad(globalHeightTexture, vec2<i32>(x3, y), 0).r
        );
        sum += dot(row, wx) * wy[j + 1];
    }
    return sum;
}

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

    let srcDimsU = textureDimensions(globalHeightTexture, 0);
    let srcDims = vec2<f32>(srcDimsU);
    let maxCoord = vec2<i32>(srcDimsU) - vec2<i32>(1);
    let heightVal = sampleBicubicBSpline(sampleUV, srcDims, maxCoord);

    let dstX = uniforms.targetOffset.x + localX;
    let dstY = uniforms.targetOffset.y + localY;
    let dstCoord = vec2<i32>(i32(dstX), i32(dstY));

    textureStore(dstVhtAtlasTexture, dstCoord, vec4<f32>(heightVal, 0.0, 0.0, 1.0));
}
