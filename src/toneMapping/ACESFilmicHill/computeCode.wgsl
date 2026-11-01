{
    let index = global_id.xy;
    let inputColor = textureLoad(sourceTexture, index, 0);
    if (all(inputColor == vec4<f32>(0.0))) {
        textureStore(outputTexture, index, vec4<f32>(0.0));
        return;
    }

    let toneMappedColor = acesFilmicHillToneMapping(inputColor.rgb);

    let finalSRGB = getFinalSRGB( toneMappedColor, uniforms.contrast, uniforms.brightness );
    textureStore(outputTexture, index, vec4<f32>(finalSRGB, inputColor.a));

}
