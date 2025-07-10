let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);
let dimensionsVec = vec2<f32>(dimW, dimH);

let amount = uniforms.amount / min(dimW, dimH);

const loopSize = 30.0;
let offset = random(global_id, 0.0);

let center = vec2<f32>(dimW * 0.5 + uniforms.centerX, dimH * 0.5 + uniforms.centerY);
let global_id_vec = vec2<f32>(f32(global_id.x), f32(global_id.y));
let dir = (center - global_id_vec) * amount;

var sum = vec4<f32>(0.0, 0.0, 0.0, 0.0);
var total = 0.0;

for (var t = -loopSize; t <= loopSize; t = t + 1.0) {
    var percent = 1.0 - (t + offset - 0.5) / loopSize;
    var weight = 3.0 * (percent - percent * percent);
    let deltaPercent = dir * percent;

    let delta = vec2<i32>(
        i32(clamp(global_id_vec.x + deltaPercent.x, 0.0, dimW - 1.0)),
        i32(clamp(global_id_vec.y + deltaPercent.y, 0.0, dimH - 1.0))
    );

    sum += textureLoad(sourceTexture, delta).xyzw * weight;
    total += weight;
}

textureStore(outputTexture, vec2<i32>(global_id.xy), sum / total);
