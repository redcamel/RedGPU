{
    let pixelCoord = vec2<i32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let c_max = vec2<i32>(screenSizeU) - 1;

    // 1. Fetch 3x3 neighborhood texels:
    // [ a, b, c ]
    // [ d, e, f ]
    // [ g, h, i ]
    let a = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>(-1, -1), vec2<i32>(0), c_max), 0);
    let b = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 0, -1), vec2<i32>(0), c_max), 0);
    let c = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 1, -1), vec2<i32>(0), c_max), 0);
    let d = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>(-1,  0), vec2<i32>(0), c_max), 0);
    let e = textureLoad(sourceTexture, clamp(pixelCoord, vec2<i32>(0), c_max), 0);
    let f = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 1,  0), vec2<i32>(0), c_max), 0);
    let g = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>(-1,  1), vec2<i32>(0), c_max), 0);
    let h = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 0,  1), vec2<i32>(0), c_max), 0);
    let i = textureLoad(sourceTexture, clamp(pixelCoord + vec2<i32>( 1,  1), vec2<i32>(0), c_max), 0);

    let eRGB = e.rgb;

    // 2. Evaluate soft min/max bounds combining cross (b, d, f, h, e) and diagonal (a, c, g, i) neighbors
    let minRGB_cross = min(min(b.rgb, d.rgb), min(f.rgb, h.rgb));
    let maxRGB_cross = max(max(b.rgb, d.rgb), max(f.rgb, h.rgb));

    var minRGB = min(minRGB_cross, eRGB);
    var maxRGB = max(maxRGB_cross, eRGB);

    let minRGB_diag = min(min(a.rgb, c.rgb), min(g.rgb, i.rgb));
    let maxRGB_diag = max(max(a.rgb, c.rgb), max(g.rgb, i.rgb));

    minRGB += min(minRGB, minRGB_diag);
    maxRGB += max(maxRGB, maxRGB_diag);

    // 3. Compute per-channel adaptive sharpening weight (wRGB) proportional to headroom before clipping (0.0 or 2.0)
    let distanceToLimit = min(minRGB, vec3<f32>(2.0) - maxRGB);
    let ampRGB = saturate(distanceToLimit / max(maxRGB, vec3<f32>(1e-4)));

    let clampedSharpness = saturate(uniforms.sharpness);
    let peak = (-1.0 / mix(8.0, 5.0, clampedSharpness)) * clampedSharpness;
    let wRGB = sqrt(ampRGB) * peak;

    // 4. Apply normalized 5-tap cross sharpening filter and clamp to valid [0, 1] LDR range
    let sumCross = b.rgb + d.rgb + f.rgb + h.rgb;
    let denom = vec3<f32>(1.0) + 4.0 * wRGB;
    let sharpRGB = (eRGB + sumCross * wRGB) / denom;

    let finalRGB = saturate(sharpRGB);

    textureStore(outputTexture, pixelCoord, vec4<f32>(finalRGB, e.a));
}
