let index = vec2<u32>(global_id.xy );
var color:vec4<f32> = textureLoad( sourceTexture, index, 0 );

let original_luminance = getLuminance(color.rgb);

let shadow_weight = 1.0 - smoothstep(0.0, 0.5, original_luminance);
let highlight_weight = smoothstep(0.5, 1.0, original_luminance);
let midtone_weight = 1.0 - shadow_weight - highlight_weight;

let cyan_red = shadow_weight * uniforms.shadowCyanRed +
midtone_weight * uniforms.midtoneCyanRed +
highlight_weight * uniforms.highlightCyanRed;

let magenta_green = shadow_weight * uniforms.shadowMagentaGreen +
midtone_weight * uniforms.midtoneMagentaGreen +
highlight_weight * uniforms.highlightMagentaGreen;

let yellow_blue = shadow_weight * uniforms.shadowYellowBlue +
midtone_weight * uniforms.midtoneYellowBlue +
highlight_weight * uniforms.highlightYellowBlue;

color.r += cyan_red * 0.01;
color.g += magenta_green * 0.01;
color.b += yellow_blue * 0.01;

let adjusted_luminance = getLuminance(color.rgb);
if (uniforms.preserveLuminosity == 1 && adjusted_luminance > 0.0) {
    let ratio = original_luminance / adjusted_luminance;
    color = color * ratio;
}

textureStore(outputTexture, index, color );
