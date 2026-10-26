fn ditherFadeDiscard(fragCoordXY: vec2<f32>, fadeValue: f32, frameIndex: u32) {
    if (fadeValue < 0.999) {
        let px = u32(fragCoordXY.x) & 3u;
        let py = u32(fragCoordXY.y) & 3u;
        let frameIdx = frameIndex & 3u;
        let idx = (((py ^ frameIdx) << 2u) | (px ^ frameIdx)) & 15u;
        let packed = select(0x6E4C2A80u, 0x5D7F91B3u, idx >= 8u);
        let threshold = f32(extractBits(packed, (idx & 7u) * 4u, 4u)) * 0.0625;
        if (fadeValue < threshold) {
            discard;
        }
    }
}

fn dirToHemiOctahedralUV(dir: vec3<f32>) -> vec2<f32> {
    let d = normalize(vec3<f32>(dir.x, max(dir.y, 0.0), dir.z));
    let l1 = abs(d.x) + d.y + abs(d.z);
    let invL1 = select(1.0 / l1, 1.0, l1 < 0.0001);
    let halfInvL1 = 0.5 * invL1;
    let u = (d.x + d.z) * halfInvL1 + 0.5;
    let v = (d.z - d.x) * halfInvL1 + 0.5;
    return saturate(vec2<f32>(u, v));
}
