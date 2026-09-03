

@group(0) @binding(0) var inputTexture: texture_2d<f32>;
@group(0) @binding(1) var outputTexture: texture_storage_2d<rgba8unorm, write>;

struct DilationUniforms {
    atlasSize: vec2<u32>,
    tileSize: u32,
    stepOffset: i32,
};

@group(0) @binding(2) var<uniform> uniforms: DilationUniforms;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let px = global_id.xy;
    if (px.x >= uniforms.atlasSize.x || px.y >= uniforms.atlasSize.y) {
        return;
    }

    let centerSample = textureLoad(inputTexture, px, 0);

    if (centerSample.a > 0.05) {
        textureStore(outputTexture, px, centerSample);
        return;
    }

    let tileSize = uniforms.tileSize;
    let tileMinX = (px.x / tileSize) * tileSize;
    let tileMaxX = tileMinX + tileSize - 1u;
    let tileMinY = (px.y / tileSize) * tileSize;
    let tileMaxY = tileMinY + tileSize - 1u;

    let step = uniforms.stepOffset;
    var bestColor = centerSample;
    var foundValid = false;

    let offsets = array<vec2<i32>, 8>(
        vec2<i32>(-step, 0),
        vec2<i32>(step, 0),
        vec2<i32>(0, -step),
        vec2<i32>(0, step),
        vec2<i32>(-step, -step),
        vec2<i32>(step, -step),
        vec2<i32>(-step, step),
        vec2<i32>(step, step)
    );

    for (var i = 0u; i < 8u; i = i + 1u) {
        let sampleCoord = vec2<i32>(px) + offsets[i];
        let clampedCoord = vec2<u32>(
            clamp(u32(max(0, sampleCoord.x)), tileMinX, tileMaxX),
            clamp(u32(max(0, sampleCoord.y)), tileMinY, tileMaxY)
        );

        let neighbor = textureLoad(inputTexture, clampedCoord, 0);
        if (neighbor.a > 0.05) {
            bestColor = vec4<f32>(neighbor.rgb, 0.0); 
            foundValid = true;
            break;
        }
    }

    textureStore(outputTexture, px, bestColor);
}
