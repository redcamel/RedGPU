let dimensions = textureDimensions(sourceTexture);
let dimW = f32(dimensions.x);
let dimH = f32(dimensions.y);

let direction = vec2<f32>(uniforms.directionX, uniforms.directionY);
let dirLength = length(direction);
let normalizedDir = select(vec2<f32>(0.0), direction / dirLength, dirLength > 0.0);

let dir = normalizedDir * uniforms.amount;

const loopSize = 30.0;
let offset = getHash1D_vec2(vec2<f32>(global_id.xy));

let global_id_vec = vec2<f32>(f32(global_id.x), f32(global_id.y));

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
