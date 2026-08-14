struct VHTUniforms {
    targetOffset: vec2<u32>,
    tileSize: vec2<u32>,
};

@group(0) @binding(0) var srcTileTexture: texture_2d<f32>;
@group(0) @binding(1) var dstVhtAtlasTexture: texture_storage_2d<r32float, write>;
@group(0) @binding(2) var<uniform> uniforms: VHTUniforms;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let localX = global_id.x;
    let localY = global_id.y;

    if (localX >= uniforms.tileSize.x || localY >= uniforms.tileSize.y) {
        return;
    }

    let srcCoord = vec2<i32>(i32(localX), i32(localY));
    let heightSample = textureLoad(srcTileTexture, srcCoord, 0);

    let dstX = uniforms.targetOffset.x + localX;
    let dstY = uniforms.targetOffset.y + localY;
    let dstCoord = vec2<i32>(i32(dstX), i32(dstY));

    textureStore(dstVhtAtlasTexture, dstCoord, heightSample);
}
