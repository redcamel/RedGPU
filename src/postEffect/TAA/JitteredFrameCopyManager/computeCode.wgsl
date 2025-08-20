@group(0) @binding(0) var sourceTexture: texture_2d<f32>;
@group(0) @binding(1) var targetTexture: texture_storage_2d<rgba8unorm, write>;
@group(0) @binding(2) var<uniform> frameParams: vec4<f32>; // [frameIndex, sliceIndex, jitterStrength, randomSeed]

// 🎯 간단하고 효과적인 Halton 시퀀스
fn halton(index: u32, base: u32) -> f32 {
    var result = 0.0;
    var fraction = 1.0;
    var i = index;

    while (i > 0u) {
        fraction /= f32(base);
        result += f32(i % base) * fraction;
        i = i / base;
    }
    return result;
}

// 🎯 단순하고 안정적인 지터 계산
fn calculateSimpleTAAJitter(frameIndex: u32, jitterStrength: f32, randomSeed: f32) -> vec2<f32> {
    let cycleIndex = (frameIndex % 16u) + 1u;

    // 🔧 범위를 -1.0 ~ 1.0으로 확대
    let haltonX = (halton(cycleIndex, 2u) - 0.5) * 2.0;
    let haltonY = (halton(cycleIndex, 3u) - 0.5) * 2.0;

    let timeNoiseX = sin(randomSeed * 0.01 + f32(frameIndex) * 0.02) * 0.1; // 노이즈도 증가
    let timeNoiseY = cos(randomSeed * 0.01 + f32(frameIndex) * 0.03) * 0.1;

    let finalX = haltonX + timeNoiseX;
    let finalY = haltonY + timeNoiseY;

    // 🔧 클램핑 범위도 확대
    return clamp(vec2<f32>(finalX, finalY) * jitterStrength, vec2<f32>(-1.0), vec2<f32>(1.0));
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = vec2<u32>(global_id.xy);
    let dimensions = textureDimensions(sourceTexture);

    if (index.x >= dimensions.x || index.y >= dimensions.y) {
        return;
    }

    let frameIndex = u32(frameParams.x);
    let jitterStrength = frameParams.z;
    let randomSeed = frameParams.w;

    // 🎯 간단한 지터 계산
    let jitter = calculateSimpleTAAJitter(frameIndex, jitterStrength, randomSeed);
    let jitteredCoord = vec2<f32>(f32(index.x), f32(index.y)) + jitter;

    var sampledColor: vec4<f32>;

    // 🎯 고품질 바이리니어 보간만 사용
    if (jitteredCoord.x >= 0.5 && jitteredCoord.y >= 0.5 &&
        jitteredCoord.x < f32(dimensions.x) - 0.5 && jitteredCoord.y < f32(dimensions.y) - 0.5) {

        let coordFloor = floor(jitteredCoord);
        let coordFract = jitteredCoord - coordFloor;

        let coord00 = vec2<u32>(coordFloor);
        let coord10 = coord00 + vec2<u32>(1u, 0u);
        let coord01 = coord00 + vec2<u32>(0u, 1u);
        let coord11 = coord00 + vec2<u32>(1u, 1u);

        let sample00 = textureLoad(sourceTexture, clamp(coord00, vec2<u32>(0u), dimensions - vec2<u32>(1u)), 0);
        let sample10 = textureLoad(sourceTexture, clamp(coord10, vec2<u32>(0u), dimensions - vec2<u32>(1u)), 0);
        let sample01 = textureLoad(sourceTexture, clamp(coord01, vec2<u32>(0u), dimensions - vec2<u32>(1u)), 0);
        let sample11 = textureLoad(sourceTexture, clamp(coord11, vec2<u32>(0u), dimensions - vec2<u32>(1u)), 0);

        let top = mix(sample00, sample10, coordFract.x);
        let bottom = mix(sample01, sample11, coordFract.x);
        sampledColor = mix(top, bottom, coordFract.y);
    } else {
        let clampedCoord = clamp(vec2<u32>(jitteredCoord), vec2<u32>(0u), dimensions - vec2<u32>(1u));
        sampledColor = textureLoad(sourceTexture, clampedCoord, 0);
    }

    textureStore(targetTexture, index, sampledColor);
}
