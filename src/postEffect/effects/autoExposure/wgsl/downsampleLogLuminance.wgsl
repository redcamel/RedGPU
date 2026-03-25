#redgpu_include color.getLuminance

@group(0) @binding(0) var sourceTexture : texture_2d<f32>;
@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;

@compute @workgroup_size(16, 16, 1)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let srcSize = textureDimensions(sourceTexture);
    let dstSize = textureDimensions(outputTexture);
    
    if (global_id.x >= dstSize.x || global_id.y >= dstSize.y) {
        return;
    }
    
    let blockSize = srcSize / dstSize;
    var avgLogLum: f32 = 0.0;
    var count: f32 = 0.0;
    
    let start = global_id.xy * blockSize;
    let end = min(start + blockSize, srcSize);
    
    for (var y = start.y; y < end.y; y = y + 1u) {
        for (var x = start.x; x < end.x; x = x + 1u) {
            let texColor = textureLoad(sourceTexture, vec2<i32>(i32(x), i32(y)), 0);
            if (texColor.a > 0.0) {
                let lum = getLuminance(texColor.rgb);
                avgLogLum += log(max(lum, 0.000001));
                count += 1.0;
            }
        }
    }
    
    let finalAvg = select(0.0, avgLogLum / count, count > 0.0);
    textureStore(outputTexture, vec2<i32>(i32(global_id.x), i32(global_id.y)), vec4<f32>(finalAvg, count, 0.0, 1.0));
}
