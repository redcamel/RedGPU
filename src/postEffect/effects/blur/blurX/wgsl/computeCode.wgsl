let index = vec2<u32>(global_id.xy);
let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let size_value: f32 = uniforms.size;
var sum: vec4<f32> = vec4<f32>(0.0, 0.0, 0.0, 0.0);

var offset = getHash1D_vec2(vec2<f32>(global_id.xy));
var total = 0.0;
let loopSize = 10.0;

for (var t = -loopSize; t <= loopSize; t = t + 1.0) {
    var percent = (t + offset - 0.5) / loopSize;
    var weight = 1.0 - abs(percent);
    var ix = clamp((f32(global_id.x) + f32(size_value * percent)), 0.0, dimW - 1.0);
    let delta = vec2<i32>(i32(ix), i32(global_id.y));
    sum += textureLoad(sourceTexture, delta).xyzw * weight;
    total += weight;
}

sum /= total;

textureStore(outputTexture, vec2<i32>(global_id.xy), sum);
