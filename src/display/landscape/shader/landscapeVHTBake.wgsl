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

    let srcDims = vec2<f32>(textureDimensions(srcTileTexture, 0));
    let normUV = vec2<f32>(f32(localX) + 0.5, f32(localY) + 0.5) / vec2<f32>(uniforms.tileSize);

    // 바이리니어(Bilinear) 서브픽셀 보간 좌표 계산 (계단식 테라싱/등고선 줄무늬 완벽 제거)
    let srcCoord = normUV * srcDims - vec2<f32>(0.5);
    let iCoord = floor(srcCoord);
    let fCoord = fract(srcCoord);

    let maxCoord = vec2<i32>(srcDims) - vec2<i32>(1);
    let c0 = vec2<i32>(clamp(iCoord, vec2<f32>(0.0), vec2<f32>(maxCoord)));
    let c1 = vec2<i32>(clamp(iCoord + vec2<f32>(1.0, 0.0), vec2<f32>(0.0), vec2<f32>(maxCoord)));
    let c2 = vec2<i32>(clamp(iCoord + vec2<f32>(0.0, 1.0), vec2<f32>(0.0), vec2<f32>(maxCoord)));
    let c3 = vec2<i32>(clamp(iCoord + vec2<f32>(1.0, 1.0), vec2<f32>(0.0), vec2<f32>(maxCoord)));

    let h0 = textureLoad(srcTileTexture, c0, 0).r;
    let h1 = textureLoad(srcTileTexture, c1, 0).r;
    let h2 = textureLoad(srcTileTexture, c2, 0).r;
    let h3 = textureLoad(srcTileTexture, c3, 0).r;

    let top = mix(h0, h1, fCoord.x);
    let bot = mix(h2, h3, fCoord.x);
    let heightSample = vec4<f32>(mix(top, bot, fCoord.y), 0.0, 0.0, 1.0);

    let dstX = uniforms.targetOffset.x + localX;
    let dstY = uniforms.targetOffset.y + localY;
    let dstCoord = vec2<i32>(i32(dstX), i32(dstY));

    textureStore(dstVhtAtlasTexture, dstCoord, heightSample);
}
