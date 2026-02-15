let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);

if (any(index >= dimensions)) {
    return;
}

let centerRGBA = textureLoad(sourceTexture, index);
let leftRGBA   = textureLoad(sourceTexture, index - vec2<u32>(select(0u, 1u, index.x > 0u), 0u));
let rightRGBA  = textureLoad(sourceTexture, min(index + vec2<u32>(1u, 0u), dimensions - 1u));
let upRGBA     = textureLoad(sourceTexture, index - vec2<u32>(0u, select(0u, 1u, index.y > 0u)));
let downRGBA   = textureLoad(sourceTexture, min(index + vec2<u32>(0u, 1u), dimensions - 1u));

let lCenter = get_luminance(centerRGBA.rgb);
let lLeft   = get_luminance(leftRGBA.rgb);
let lRight  = get_luminance(rightRGBA.rgb);
let lUp     = get_luminance(upRGBA.rgb);
let lDown   = get_luminance(downRGBA.rgb);

let minL = min(lCenter, min(min(lLeft, lRight), min(lUp, lDown)));
let maxL = max(lCenter, max(max(lLeft, lRight), max(lUp, lDown)));
let contrast = maxL - minL;

var finalRGBA: vec4<f32>;
let k = uniforms.sharpness * 0.2;

if (contrast > 0.001) {
    let edgeRGB = 4.0 * centerRGBA.rgb - (leftRGBA.rgb + rightRGBA.rgb + upRGBA.rgb + downRGBA.rgb);
    let sharpRGB = centerRGBA.rgb + edgeRGB * k;

    let edgeAlpha = 4.0 * centerRGBA.a - (leftRGBA.a + rightRGBA.a + upRGBA.a + downRGBA.a);
    let sharpAlpha = centerRGBA.a + edgeAlpha * k;

    finalRGBA = vec4<f32>(sharpRGB, sharpAlpha);
} else {
    finalRGBA = centerRGBA;
}

textureStore(outputTexture, index, saturate(finalRGBA));