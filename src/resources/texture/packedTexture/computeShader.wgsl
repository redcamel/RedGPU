struct VertexOut {
    @builtin(position) position : vec4<f32>,
    @location(0) uv : vec2<f32>,
};

@vertex
fn vertexMain(@builtin(vertex_index) VertexIndex : u32) -> VertexOut {
    var pos = array<vec2<f32>, 6>(
        vec2(-1.0, -1.0),
        vec2( 1.0, -1.0),
        vec2(-1.0,  1.0),
        vec2(-1.0,  1.0),
        vec2( 1.0, -1.0),
        vec2( 1.0,  1.0)
    );

    var uv = array<vec2<f32>, 6>(
        vec2(0.0, 1.0),
        vec2(1.0, 1.0),
        vec2(0.0, 0.0),
        vec2(0.0, 0.0),
        vec2(1.0, 1.0),
        vec2(1.0, 0.0)
    );

    var output : VertexOut;
    output.position = vec4(pos[VertexIndex], 0.0, 1.0);
    output.uv = uv[VertexIndex];
    return output;
}

struct ComponentMapping {
    r_component: u32,
    g_component: u32,
    b_component: u32,
    a_component: u32,
};

@group(0) @binding(0) var textureR: texture_2d<f32>;
@group(0) @binding(1) var textureG: texture_2d<f32>;
@group(0) @binding(2) var textureB: texture_2d<f32>;
@group(0) @binding(3) var textureA: texture_2d<f32>;
@group(0) @binding(4) var sampler0: sampler;
@group(0) @binding(5) var<uniform> mapping: ComponentMapping;

fn getComponent(color: vec4<f32>, componentIndex: u32) -> f32 {
    switch componentIndex {
        case 0u: { return color.r; }
        case 1u: { return color.g; }
        case 2u: { return color.b; }
        case 3u: { return color.a; }
        default: { return 0.0; }
    }
}

@fragment
fn fragmentMain(input: VertexOut) -> @location(0) vec4<f32> {
    let colorR = textureSample(textureR, sampler0, input.uv);
    let colorG = textureSample(textureG, sampler0, input.uv);
    let colorB = textureSample(textureB, sampler0, input.uv);
    let colorA = textureSample(textureA, sampler0, input.uv);

    let r = getComponent(colorR, mapping.r_component);
    let g = getComponent(colorG, mapping.g_component);
    let b = getComponent(colorB, mapping.b_component);
    let a = getComponent(colorA, mapping.a_component);

    return vec4(r, g, b, a);
}
