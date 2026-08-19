struct TileMipParams {
    srcOrigin: vec2<u32>,
    dstOrigin: vec2<u32>,
    dstSize: vec2<u32>,
    _pad0: vec2<u32>,
};

@group(0) @binding(0) var<uniform> params: TileMipParams;
@group(0) @binding(1) var srcBaseColor: texture_2d<f32>;
@group(0) @binding(2) var dstBaseColor: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(3) var srcNormal: texture_2d<f32>;
@group(0) @binding(4) var dstNormal: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(5) var srcORM: texture_2d<f32>;
@group(0) @binding(6) var dstORM: texture_storage_2d<rgba8unorm, write>;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let localDstX = globalId.x;
    let localDstY = globalId.y;

    if (localDstX >= params.dstSize.x || localDstY >= params.dstSize.y) {
        return;
    }

    let dstCoord = vec2<i32>(params.dstOrigin + vec2<u32>(localDstX, localDstY));
    let srcCoord00 = vec2<i32>(params.srcOrigin + vec2<u32>(localDstX * 2u, localDstY * 2u));
    let srcCoord10 = srcCoord00 + vec2<i32>(1, 0);
    let srcCoord01 = srcCoord00 + vec2<i32>(0, 1);
    let srcCoord11 = srcCoord00 + vec2<i32>(1, 1);

    let bc00 = textureLoad(srcBaseColor, srcCoord00, 0);
    let bc10 = textureLoad(srcBaseColor, srcCoord10, 0);
    let bc01 = textureLoad(srcBaseColor, srcCoord01, 0);
    let bc11 = textureLoad(srcBaseColor, srcCoord11, 0);
    let avgBaseColor = (bc00 + bc10 + bc01 + bc11) * 0.25;
    textureStore(dstBaseColor, dstCoord, avgBaseColor);

    let n00 = textureLoad(srcNormal, srcCoord00, 0).rgb * 2.0 - vec3<f32>(1.0);
    let n10 = textureLoad(srcNormal, srcCoord10, 0).rgb * 2.0 - vec3<f32>(1.0);
    let n01 = textureLoad(srcNormal, srcCoord01, 0).rgb * 2.0 - vec3<f32>(1.0);
    let n11 = textureLoad(srcNormal, srcCoord11, 0).rgb * 2.0 - vec3<f32>(1.0);
    let avgN = normalize(n00 + n10 + n01 + n11);
    let packedN = avgN * 0.5 + vec3<f32>(0.5);
    textureStore(dstNormal, dstCoord, vec4<f32>(packedN, 1.0));

    let orm00 = textureLoad(srcORM, srcCoord00, 0);
    let orm10 = textureLoad(srcORM, srcCoord10, 0);
    let orm01 = textureLoad(srcORM, srcCoord01, 0);
    let orm11 = textureLoad(srcORM, srcCoord11, 0);
    let avgORM = (orm00 + orm10 + orm01 + orm11) * 0.25;
    textureStore(dstORM, dstCoord, avgORM);
}
