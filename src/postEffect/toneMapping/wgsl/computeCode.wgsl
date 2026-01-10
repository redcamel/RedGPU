    let index = vec2<i32>(global_id.xy);
    let inputColor = textureLoad(sourceTexture, index);

    // 1. 톤맵핑 적용 (결과는 선형 공간)
    // let toneMapped = linearToneMapping(inputColor.rgb, uniforms.exposure);
    let toneMapped = khronosPbrNeutralToneMapping(inputColor.rgb, uniforms.exposure);

    // 2. 선형 공간에서의 색상 보정 (수학적 정확도 향상)
    let contrastRGB = applyContrast(toneMapped, uniforms.contrast);
    let finalLinearRGB = applyBrightness(contrastRGB, uniforms.brightness);

    // 3. 최종 감마 보정 (선형 RGB -> sRGB) 및 클램핑
    let finalSRGB = clamp(linearToSRGB(finalLinearRGB), vec3<f32>(0.0), vec3<f32>(1.0));

    let outputColor = vec4<f32>(finalSRGB, inputColor.a);
    textureStore(outputTexture, index, outputColor);



//    let index = vec2<i32>(global_id.xy);
//    let inputColor = textureLoad(sourceTexture, index);
//
//    // 디버깅: 원본 HDR 값 확인 (1.0 초과 여부)
//    // 빨간색이 보이면 HDR 데이터가 정상, 검은색이면 이미 클램핑됨
//    let isHDR = select(0.0, 1.0, inputColor.r > 1.0 || inputColor.g > 1.0 || inputColor.b > 1.0);
//    let debugColor = vec4<f32>(isHDR, 0.0, 0.0, 1.0);
//
//    textureStore(outputTexture, index, debugColor);
