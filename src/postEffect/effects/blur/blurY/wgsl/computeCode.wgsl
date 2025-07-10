let index = vec2<u32>(global_id.xy);
let dimensions = textureDimensions(sourceTexture);
let dimH = f32(dimensions.y);
let size_value: f32 = uniforms.size;
var sum: vec4<f32> = vec4<f32>(0.0, 0.0, 0.0, 0.0);

var offset = random(global_id, 0.0);
var total = 0.0;
let loopSize = 10.0;

for (var t = -loopSize; t <= loopSize; t = t + 1.0) {
    var percent = (t + offset - 0.5) / loopSize;
    var weight = 1.0 - abs(percent);
    var iy = clamp((f32(global_id.y) + f32(size_value * percent)), 0.0, dimH - 1.0);
    let delta = vec2<i32>(i32(global_id.x), i32(iy));
    sum += textureLoad(sourceTexture, delta).xyzw * weight;
    total += weight;
}

sum /= total;

textureStore(outputTexture, vec2<i32>(global_id.xy), sum);
