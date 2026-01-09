{
    let index = vec2<i32>(global_id.xy);
    let inputColor = textureLoad(sourceTexture, index);

    // 1. 톤매핑 적용 (노출 포함)
    let toneMapped = khronosPbrNeutralToneMapping(inputColor.rgb, uniforms.exposure);

    // 2. 감마 보정 (정확한 sRGB 커브 적용)
    let gammaCorrected = vec3<f32>(
        linearToSRGB(toneMapped.r),
        linearToSRGB(toneMapped.g),
        linearToSRGB(toneMapped.b)
    );

    // 4. 명암 및 밝기 (감마 보정 후 0~1 범위에서 수행)
    let contrastRGB = (gammaCorrected - 0.5) * uniforms.contrast + 0.5;
    let finalRGB = clamp(contrastRGB + uniforms.brightness, vec3<f32>(0.0), vec3<f32>(1.0));

    let outputColor = vec4<f32>(finalRGB, inputColor.a);
    textureStore(outputTexture, index, outputColor);
}