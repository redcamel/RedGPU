{
    let pixelCoord = vec2<u32>(global_id.xy);
    let screenSizeU = textureDimensions(sourceTexture);
    let screenSize = vec2<f32>(screenSizeU);

    if (any(pixelCoord >= screenSizeU)) { return; }

    let currentColor = textureLoad(sourceTexture, pixelCoord);

    // --- UV 계산 시 Y축 뒤집기 ---
    // (screenSize.y - 1.0 - f32(pixelCoord.y)) 를 사용하여 픽셀 좌표를 반전시킵니다.
    let flippedY = screenSize.y - 0.5 - f32(pixelCoord.y);
    let uv = vec2<f32>(f32(pixelCoord.x) + 0.5, flippedY) / screenSize;

    // --- 다시 정수 좌표로 변환 (textureLoad용) ---
    // 만약 히스토리 텍스처도 같은 방식으로 저장되어 있다면 다시 뒤집어서 읽어야 합니다.
    let historyCoord = vec2<u32>(
        u32(uv.x * screenSize.x),
        u32((1.0 - uv.y) * screenSize.y) // UV를 다시 픽셀 좌표로 바꿀 때 반전
    );

    // 사실 단순 누적에서는 (pixelCoord.x, pixelCoord.y)와 동일해집니다.
    let historyColor = textureLoad(previousFrameTexture, historyCoord);

    let blendWeight = clamp(uniforms.temporalBlendFactor, 0.0, 1.0);
    let finalOutputColor = mix(historyColor, currentColor, blendWeight);

    textureStore(outputTexture, pixelCoord, finalOutputColor);
}
