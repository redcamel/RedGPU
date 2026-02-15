let index = vec2<i32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);
let uv = vec2<f32>(f32(index.x) / dimW, f32(index.y) / dimH);

let originalColor = textureLoad(sourceTexture, index);

let filmGrainIntensity_value: f32 = uniforms.filmGrainIntensity;
let filmGrainResponse_value: f32 = uniforms.filmGrainResponse;
let filmGrainScale_value: f32 = uniforms.filmGrainScale;
let coloredGrain_value: f32 = uniforms.coloredGrain;
let grainSaturation_value: f32 = uniforms.grainSaturation;
let time_value: f32 = uniforms.time;
let devicePixelRatio_value: f32 = uniforms.devicePixelRatio;

if (filmGrainIntensity_value <= 0.0) {
    textureStore(outputTexture, index, originalColor);
    return;
}

let baseScale = max(filmGrainScale_value, 0.1);
let scaledUV = uv * vec2<f32>(dimW, dimH) * devicePixelRatio_value / baseScale;

let timeOffset = vec2<f32>(
    fract(time_value * 0.0317) * 100.0,
    fract(time_value * 0.0271) * 100.0
);
let grainCoord = scaledUV + timeOffset;

let sampleOffset = 1.0 / baseScale;
let noiseR = (filmGrainNoise(grainCoord) +
             filmGrainNoise(grainCoord + vec2<f32>(sampleOffset, 0.0)) +
             filmGrainNoise(grainCoord + vec2<f32>(0.0, sampleOffset))) / 3.0;
let noiseG = filmGrainNoise(grainCoord + vec2<f32>(127.1, 311.7));
let noiseB = filmGrainNoise(grainCoord + vec2<f32>(269.5, 183.3));

let monoGrain = (noiseR + noiseG + noiseB) / 3.0;
let colorGrain = vec3<f32>(noiseR, noiseG, noiseB);

var grainColor = mix(vec3<f32>(monoGrain), colorGrain, coloredGrain_value);

let grainLuminance = get_luminance(grainColor);
grainColor = mix(vec3<f32>(grainLuminance), grainColor, grainSaturation_value);

let luminance = get_luminance(originalColor.rgb);
let luminanceWeight = pow(max(luminance, 0.01), filmGrainResponse_value);

let grainIntensity = filmGrainIntensity_value * luminanceWeight;
let grain = grainColor * grainIntensity;

let finalColor = originalColor.rgb + grain;

let outputColor = vec4<f32>(clamp(finalColor, vec3<f32>(0.0), vec3<f32>(1.0)), originalColor.a);

textureStore(outputTexture, index, outputColor);
