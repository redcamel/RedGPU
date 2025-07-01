struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) texCoord: vec2<f32>,
}

@vertex fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var pos = array<vec2<f32>, 6>(
        vec2<f32>(-1.0, -1.0), vec2<f32>( 1.0, -1.0), vec2<f32>(-1.0,  1.0),
        vec2<f32>(-1.0,  1.0), vec2<f32>( 1.0, -1.0), vec2<f32>( 1.0,  1.0)
    );

    var texCoord = array<vec2<f32>, 6>(
        vec2<f32>(1.0, 0.0), vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 1.0),
        vec2<f32>(1.0, 1.0), vec2<f32>(0.0, 0.0), vec2<f32>(0.0, 1.0)
    );

    var output: VertexOutput;
    output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
    output.texCoord = texCoord[vertexIndex];
    return output;
}

@group(0) @binding(0) var equirectangularTexture: texture_2d<f32>;
@group(0) @binding(1) var textureSampler: sampler;
@group(0) @binding(2) var<uniform> faceMatrix: mat4x4<f32>;

@fragment fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let ndc = vec2<f32>(
        input.texCoord.x * 2.0 - 1.0,
        (1.0 - input.texCoord.y) * 2.0 - 1.0
    );

    var localDirection = vec3<f32>(ndc.x, ndc.y, 1.0);
    let worldDirection = normalize((faceMatrix * vec4<f32>(localDirection, 0.0)).xyz);

    let theta = atan2(worldDirection.z, worldDirection.x);
    let phi = acos(clamp(worldDirection.y, -1.0, 1.0));

    var u = (theta + 3.14159265359) / (2.0 * 3.14159265359);
    var v = phi / 3.14159265359;

    u = fract(u + 1.0);
    v = clamp(v, 0.0001, 0.9999);

    let color = textureSample(equirectangularTexture, textureSampler, vec2<f32>(u, v));
    return color;
}
