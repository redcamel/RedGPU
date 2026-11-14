{
    let inputColor = textureLoad(sourceTexture, index, 0);
    if (all(inputColor == vec4<f32>(0.0))) {
        discard;
    }

    let toneMappedColor = acesFilmicNarkowiczToneMapping(inputColor.rgb);

    let finalSRGB = getFinalSRGB( toneMappedColor, uniforms.contrast, uniforms.brightness );
    return vec4<f32>(finalSRGB, inputColor.a);
}
