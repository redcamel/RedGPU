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
    var totalWeight: f32 = 0.0;
    
    let start = global_id.xy * blockSize;
    let end = min(start + blockSize, srcSize);
    
    // [KO] 화면 중심점 계산 [EN] Calculate screen center
    let center = vec2<f32>(srcSize) * 0.5;
    
    for (var y = start.y; y < end.y; y = y + 1u) {
        for (var x = start.x; x < end.x; x = x + 1u) {
            let texColor = textureLoad(sourceTexture, vec2<i32>(i32(x), i32(y)), 0);
            if (texColor.a > 0.0) {
                // [KO] 상대적 위치에 따른 가중치 계산 (중심부 가중치)
                // [EN] Calculate weight based on relative position (Center-weighted)
                let pos = vec2<f32>(f32(x), f32(y));
                let distToCenter = distance(pos, center) / length(center);
                let weight = exp(-distToCenter * distToCenter * 2.0); // Gaussian-like weight
                
                let lum = getLuminance(texColor.rgb);
                // [KO] 아주 어두운 영역이 평균을 너무 깎아먹지 않도록 하한선 설정
                // [EN] Set a lower bound so that very dark areas don't drag down the average too much
                avgLogLum += log(max(lum, 0.001)) * weight;
                totalWeight += weight;
            }
        }
    }
    
    let finalAvg = select(0.0, avgLogLum / totalWeight, totalWeight > 0.0);
    textureStore(outputTexture, vec2<i32>(i32(global_id.x), i32(global_id.y)), vec4<f32>(finalAvg, totalWeight, 0.0, 1.0));
}
