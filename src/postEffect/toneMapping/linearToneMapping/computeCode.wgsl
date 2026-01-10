{
    let index = vec2<i32>(global_id.xy);
    let inputColor = textureLoad(sourceTexture, index);

    // 모든 인자를 한꺼번에 넘겨서 처리합니다.
    let finalLinear = linearToneMapping(
        inputColor.rgb,
        uniforms.exposure,
        uniforms.contrast,
        uniforms.brightness
    );

    // 최종 sRGB 변환
    let finalSRGB = linearToSRGB(inputColor.rgb);

    textureStore(outputTexture, index, vec4<f32>(finalSRGB, inputColor.a));

}