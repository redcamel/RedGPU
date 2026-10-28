{
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let c_max = vec2<i32>(screenSizeU) - 1;

    // 1. Cooperatively populate 10x10 workgroup shared memory (8x8 tile + 1px halo) with Karis-tonemapped color and depth
    let tileOrigin = vec2<i32>(workgroup_id.xy) * 8 - vec2<i32>(1, 1);
    let tid = i32(local_invocation_index);

    let lx0 = tid % 10;
    let ly0 = tid / 10;
    let coord0 = clamp(tileOrigin + vec2<i32>(lx0, ly0), vec2<i32>(0), c_max);
    let rawColor0 = textureLoad(sourceTexture, coord0, 0);
    s_color[ly0][lx0] = vec4<f32>(reversible_tonemap(rawColor0.rgb), rawColor0.a);
    s_depth[ly0][lx0] = textureLoad(depthTexture, coord0, 0);

    let tid2 = tid + 64;
    if (tid2 < 100) {
        let lx1 = tid2 % 10;
        let ly1 = tid2 / 10;
        let coord1 = clamp(tileOrigin + vec2<i32>(lx1, ly1), vec2<i32>(0), c_max);
        let rawColor1 = textureLoad(sourceTexture, coord1, 0);
        s_color[ly1][lx1] = vec4<f32>(reversible_tonemap(rawColor1.rgb), rawColor1.a);
        s_depth[ly1][lx1] = textureLoad(depthTexture, coord1, 0);
    }

    workgroupBarrier();

    let pixelCoord = vec2<i32>(global_id.xy);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 2. Compute 3x3 YCoCg neighborhood statistics and reconstruct unjittered current pixel color
    let localCoord = vec2<i32>(local_id.xy) + vec2<i32>(1, 1);
    let yFlipVec2 = vec2<f32>(1.0, -1.0);

    let stats = calculate_neighborhood_stats_ycocg_lds(localCoord);

    let jitterOffsetPix = uniforms.currJitterOffset * yFlipVec2;
    let reconstructedCurrent = reconstruct_current_color_ycocg_lds(localCoord, jitterOffsetPix);
    let currentRGB = reconstructedCurrent.rgb;
    let currentAlpha = reconstructedCurrent.alpha;
    let currentRGBA = vec4<f32>(currentRGB, currentAlpha);

    // Output reconstructed current frame directly on the first frame after initialization or reset
    if (uniforms.frameIndex <= 1.0) {
        let finalHDR_RGB = inverse_tonemap(currentRGB);
        textureStore(outputTexture, pixelCoord, vec4<f32>(finalHDR_RGB, currentAlpha));
        return;
    }

    // 3. 3x3 closest-depth velocity dilation to preserve foreground object edges during motion
    let currentDepth = s_depth[localCoord.y][localCoord.x];
    var closestDepth = currentDepth;
    var closestCoord = pixelCoord;

    let d_l  = s_depth[localCoord.y][localCoord.x - 1];
    let d_r  = s_depth[localCoord.y][localCoord.x + 1];
    let d_t  = s_depth[localCoord.y - 1][localCoord.x];
    let d_b  = s_depth[localCoord.y + 1][localCoord.x];
    let d_tl = s_depth[localCoord.y - 1][localCoord.x - 1];
    let d_tr = s_depth[localCoord.y - 1][localCoord.x + 1];
    let d_bl = s_depth[localCoord.y + 1][localCoord.x - 1];
    let d_br = s_depth[localCoord.y + 1][localCoord.x + 1];

    if (d_l  < closestDepth) { closestDepth = d_l;  closestCoord = clamp(pixelCoord + vec2<i32>(-1,  0), vec2<i32>(0), c_max); }
    if (d_r  < closestDepth) { closestDepth = d_r;  closestCoord = clamp(pixelCoord + vec2<i32>( 1,  0), vec2<i32>(0), c_max); }
    if (d_t  < closestDepth) { closestDepth = d_t;  closestCoord = clamp(pixelCoord + vec2<i32>( 0, -1), vec2<i32>(0), c_max); }
    if (d_b  < closestDepth) { closestDepth = d_b;  closestCoord = clamp(pixelCoord + vec2<i32>( 0,  1), vec2<i32>(0), c_max); }
    if (d_tl < closestDepth) { closestDepth = d_tl; closestCoord = clamp(pixelCoord + vec2<i32>(-1, -1), vec2<i32>(0), c_max); }
    if (d_tr < closestDepth) { closestDepth = d_tr; closestCoord = clamp(pixelCoord + vec2<i32>( 1, -1), vec2<i32>(0), c_max); }
    if (d_bl < closestDepth) { closestDepth = d_bl; closestCoord = clamp(pixelCoord + vec2<i32>(-1,  1), vec2<i32>(0), c_max); }
    if (d_br < closestDepth) { closestDepth = d_br; closestCoord = clamp(pixelCoord + vec2<i32>( 1,  1), vec2<i32>(0), c_max); }

    let velocity = textureLoad(gBufferMotionVector, closestCoord, 0).xy;

    // Bypass history accumulation when the reactive mask sentinel (velocity.x > 10.0) is set
    if (velocity.x > 10.0) {
        let finalHDR_RGB = inverse_tonemap(currentRGB);
        textureStore(outputTexture, pixelCoord, vec4<f32>(finalHDR_RGB, currentAlpha));
        return;
    }

    // 4. Reproject to previous frame UV and resolve history via Catmull-Rom sampling and YCoCg ray-box clipping
    let currentUnjitteredUV = (vec2<f32>(pixelCoord) + 0.5 - jitterOffsetPix) / screenSize;
    let historyUV = currentUnjitteredUV - velocity;

    var finalRGBA: vec4<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalRGBA = currentRGBA;
    } else {
        let historyCoord = clamp(vec2<i32>(historyUV * screenSize), vec2<i32>(0), c_max);
        let prevDepth = textureLoad(prevDepthTexture, historyCoord, 0);
        let rawHistoryData = sample_texture_catmull_rom_antiflicker(historyTexture, basicSampler, historyUV, screenSize);

        var historyData: SampledColor;
        historyData.rgb = reversible_tonemap(rawHistoryData.rgb);
        historyData.ycocg = rgbToYCoCg(historyData.rgb);
        historyData.alpha = rawHistoryData.alpha;

        let motionLen = length(velocity * screenSize);
        let motionSoft = smoothstep(0.0, 1.0, motionLen);

        let velVariance = calculate_velocity_variance(gBufferMotionVector, closestCoord, velocity, screenSize);
        let clippedYCoCg = clip_history_ray_box_ycocg(historyData.ycocg, reconstructedCurrent.ycocg, stats, motionSoft, velVariance);
        let clippedAlpha = clamp(historyData.alpha, stats.minAlpha, stats.maxAlpha);
        let clippedHistoryRGB = YCoCgToRgb(clippedYCoCg);

        // 5. Compute adaptive temporal blend factor from frame age, motion, depth disocclusion, luminance discrepancy, and alpha
        let lumaWeight = get_color_discrepancy_weight(stats, clippedYCoCg.x);

        let effectiveAge = min(uniforms.frameIndex, 32.0);
        let convergenceBlend = max(1.0 / max(effectiveAge, 1.0), 0.08);
        let baseBlend = mix(convergenceBlend, 0.20, motionSoft);

        let depthConfidence = get_geometric_depth_confidence(currentDepth, prevDepth);

        let geometricConfidence = mix(1.0, depthConfidence, motionSoft);
        var blendFactor = max(baseBlend, (1.0 - geometricConfidence) * 0.85 * motionSoft);

        let motionLumaBlend = max(blendFactor, lumaWeight * 0.6);
        blendFactor = mix(blendFactor, motionLumaBlend, motionSoft);

        let reactiveTrans = get_reactive_transparency_weight(stats);
        blendFactor = mix(blendFactor, 1.0, reactiveTrans);

        let clippedHistoryRGBA = vec4<f32>(clippedHistoryRGB, clippedAlpha);
        finalRGBA = mix(clippedHistoryRGBA, currentRGBA, blendFactor);
    }

    // 6. Restore linear HDR radiance via inverse Karis tone map and store to output texture
    let finalHDR_RGB = inverse_tonemap(finalRGBA.rgb);
    textureStore(outputTexture, pixelCoord, vec4<f32>(finalHDR_RGB, finalRGBA.a));
}
