{
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);
    let c_max = vec2<i32>(screenSizeU) - 1;

    // 1. Cooperatively populate workgroup shared memory (tile + halo) and precompute 3x3 Gaussian weights
    let haloOffset = vec2<i32>(NEIGHBORHOOD_RADIUS, NEIGHBORHOOD_RADIUS);
    let tileOrigin = vec2<i32>(workgroup_id.xy) * WORKGROUP_TILE_SIZE - haloOffset;
    let tid = i32(local_invocation_index);
    let yFlipVec2 = vec2<f32>(1.0, -1.0);
    let jitterOffsetPix = uniforms.currJitterOffset * yFlipVec2;

    if (tid < NEIGHBORHOOD_SAMPLE_COUNT) {
        let gx = (tid % NEIGHBORHOOD_AXIS_COUNT) - NEIGHBORHOOD_RADIUS;
        let gy = (tid / NEIGHBORHOOD_AXIS_COUNT) - NEIGHBORHOOD_RADIUS;
        let delta = vec2<f32>(f32(gx), f32(gy)) + jitterOffsetPix;
        let distSq = dot(delta, delta);
        s_gaussWeights[tid] = exp(-4.85 * distSq);
    }

    let hasHistoryFrame = uniforms.frameIndex > 1.0;

    let lx0 = tid % SHARED_TILE_SIDE;
    let ly0 = tid / SHARED_TILE_SIDE;
    let coord0 = clamp(tileOrigin + vec2<i32>(lx0, ly0), vec2<i32>(0), c_max);
    let rawColor0 = textureLoad(sourceTexture, coord0, 0);
    if (all(rawColor0.rgb == vec3<f32>(0.0))) {
        s_color[ly0][lx0] = vec4<f32>(0.0, 0.0, 0.0, rawColor0.a);
    } else {
        s_color[ly0][lx0] = vec4<f32>(reversible_tonemap(rawColor0.rgb), rawColor0.a);
    }
    if (hasHistoryFrame) {
        s_depth[ly0][lx0] = textureLoad(depthTexture, coord0, 0);
    }

    let tid2 = tid + WORKGROUP_THREAD_COUNT;
    if (tid2 < SHARED_TILE_TEXEL_COUNT) {
        let lx1 = tid2 % SHARED_TILE_SIDE;
        let ly1 = tid2 / SHARED_TILE_SIDE;
        let coord1 = clamp(tileOrigin + vec2<i32>(lx1, ly1), vec2<i32>(0), c_max);
        let rawColor1 = textureLoad(sourceTexture, coord1, 0);
        if (all(rawColor1.rgb == vec3<f32>(0.0))) {
            s_color[ly1][lx1] = vec4<f32>(0.0, 0.0, 0.0, rawColor1.a);
        } else {
            s_color[ly1][lx1] = vec4<f32>(reversible_tonemap(rawColor1.rgb), rawColor1.a);
        }
        if (hasHistoryFrame) {
            s_depth[ly1][lx1] = textureLoad(depthTexture, coord1, 0);
        }
    }

    workgroupBarrier();

    let pixelCoord = vec2<i32>(global_id.xy);
    if (any(pixelCoord >= vec2<i32>(screenSizeU))) { return; }

    // 2. Reconstruct unjittered current pixel color from shared memory
    let localCoord = vec2<i32>(local_id.xy) + haloOffset;
    let currentRGBA = reconstruct_current_color_lds(localCoord);
    let currentRGB = currentRGBA.rgb;
    let currentAlpha = currentRGBA.a;

    // Output reconstructed current frame directly on the first frame or when 3x3 neighborhood has zero alpha (reactiveTrans == 1.0)
    if (!hasHistoryFrame || currentAlpha == 0.0) {
        let finalHDR_RGB = select(inverse_tonemap(currentRGB), vec3<f32>(0.0), all(currentRGB == vec3<f32>(0.0)));
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

    let centerVelocity = textureLoad(gBufferMotionVector, pixelCoord, 0).xy;
    let velocity = textureLoad(gBufferMotionVector, closestCoord, 0).xy;

    // Bypass history accumulation and output unjittered center pixel when the reactive mask sentinel (velocity.x > 10.0) is set
    if (centerVelocity.x > 10.0 || velocity.x > 10.0) {
        let centerRGBA = s_color[localCoord.y][localCoord.x];
        let finalHDR_RGB = select(inverse_tonemap(centerRGBA.rgb), vec3<f32>(0.0), all(centerRGBA.rgb == vec3<f32>(0.0)));
        textureStore(outputTexture, pixelCoord, vec4<f32>(finalHDR_RGB, centerRGBA.a));
        return;
    }

    // 4. Reproject to previous frame UV and resolve history via Catmull-Rom sampling and YCoCg ray-box clipping
    let currentUnjitteredUV = (vec2<f32>(pixelCoord) + 0.5 - jitterOffsetPix) / screenSize;
    let historyUV = currentUnjitteredUV - velocity;

    var finalRGBA: vec4<f32>;

    if (any(historyUV < vec2<f32>(0.0)) || any(historyUV > vec2<f32>(1.0))) {
        finalRGBA = currentRGBA;
    } else {
        let stats = calculate_neighborhood_stats_ycocg_lds(localCoord);
        let currentYCoCg = rgbToYCoCg(currentRGB);
        let rawHistoryRGBA = sample_texture_catmull_rom_antiflicker(historyTexture, basicSampler, historyUV, screenSize);

        let historyRGB = reversible_tonemap(max(rawHistoryRGBA.rgb * systemUniforms.preExposureRatio, vec3<f32>(0.0)));
        let historyYCoCg = rgbToYCoCg(historyRGB);
        let historyAlpha = rawHistoryRGBA.a;

        let motionLen = length(velocity * screenSize);
        let motionSoft = smoothstep(0.0, 1.0, motionLen);

        let velVariance = calculate_velocity_variance(gBufferMotionVector, closestCoord, velocity, screenSize);
        let clippedYCoCg = clip_history_ray_box_ycocg(historyYCoCg, currentYCoCg, stats, motionSoft, velVariance);
        let clippedAlpha = clamp(historyAlpha, stats.minAlpha, stats.maxAlpha);
        let clippedHistoryRGB = YCoCgToRgb(clippedYCoCg);

        // 5. Compute adaptive temporal blend factor from frame age, motion, depth disocclusion, luminance discrepancy, and alpha
        let effectiveAge = min(uniforms.frameIndex, 32.0);
        let convergenceBlend = max(1.0 / max(effectiveAge, 1.0), 0.08);
        var blendFactor = mix(convergenceBlend, 0.20, motionSoft);

        if (motionSoft > 0.0) {
            let historyCoord = clamp(vec2<i32>(historyUV * screenSize), vec2<i32>(0), c_max);
            let prevDepth = textureLoad(prevDepthTexture, historyCoord, 0);
            let depthConfidence = get_geometric_depth_confidence(currentDepth, prevDepth);
            let geometricConfidence = mix(1.0, depthConfidence, motionSoft);
            blendFactor = max(blendFactor, (1.0 - geometricConfidence) * 0.85 * motionSoft);

            let lumaWeight = get_color_discrepancy_weight(stats, clippedYCoCg.x);
            let motionLumaBlend = max(blendFactor, lumaWeight * 0.6);
            blendFactor = mix(blendFactor, motionLumaBlend, motionSoft);
        }

        let reactiveTrans = get_reactive_transparency_weight(stats);
        blendFactor = mix(blendFactor, 1.0, reactiveTrans);

        let clippedHistoryRGBA = vec4<f32>(clippedHistoryRGB, clippedAlpha);
        finalRGBA = mix(clippedHistoryRGBA, currentRGBA, blendFactor);
    }

    // 6. Restore linear HDR radiance via inverse Karis tone map and store to output texture
    let finalHDR_RGB = inverse_tonemap(finalRGBA.rgb);
    textureStore(outputTexture, pixelCoord, vec4<f32>(finalHDR_RGB, finalRGBA.a));
}
