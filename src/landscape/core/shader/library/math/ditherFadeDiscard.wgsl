fn ditherFadeDiscard(fragCoordXY: vec2<f32>, fadeValue: f32, frameIndex: u32) {
    if (fadeValue < 0.999) {
        let px = u32(fragCoordXY.x) & 3u;
        let py = u32(fragCoordXY.y) & 3u;
        let frameIdx = frameIndex & 3u;
        let idx = (((py ^ frameIdx) << 2u) | (px ^ frameIdx)) & 15u;
        let packed = select(0x6E4C2A80u, 0x5D7F91B3u, idx >= 8u);
        let threshold = f32((packed >> ((idx & 7u) * 4u)) & 0xFu) * 0.0625;
        if (fadeValue < threshold) {
            discard;
        }
    }
}

