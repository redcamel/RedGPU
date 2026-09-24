struct CaptureGlobalUniforms {
    orthoViewProj: mat4x4<f32>,
    waterLevel: f32,
    maxPenetration: f32,
    padding01: f32,
    padding02: f32,
};

struct MeshUniforms {
    modelMatrix: mat4x4<f32>,
    waveStrength: f32,
    speed: f32,
    stepPulse: f32,
    footSide: f32,
};

struct SkinnedVertex {
    position: vec3<f32>,
    normal: vec3<f32>,
    tangent: vec4<f32>,
    currentClipPos: vec4<f32>,
};

@group(0) @binding(0) var<uniform> globalUniforms: CaptureGlobalUniforms;
@group(1) @binding(0) var<uniform> meshUniforms: MeshUniforms;
@group(1) @binding(1) var<storage, read> skinnedVertices: array<SkinnedVertex>;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) worldY: f32,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var output: VertexOutput;
    let skinnedPos = skinnedVertices[vertexIndex].position;
    let worldPos = meshUniforms.modelMatrix * vec4<f32>(skinnedPos, 1.0);
    output.position = globalUniforms.orthoViewProj * worldPos;
    output.worldY = worldPos.y;
    return output;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
    let depth = globalUniforms.waterLevel - input.worldY;
    let maxPen = max(0.05, globalUniforms.maxPenetration);

    if (depth <= 0.001 || depth > maxPen) {
        discard;
    }

    let depthRatio = depth / maxPen;
    let surfaceEdge = smoothstep(0.0, 0.15, depthRatio) * (1.0 - smoothstep(0.4, 1.0, depthRatio));

    let splashImpact = meshUniforms.stepPulse * 2.5;
    let baseMovement = clamp(meshUniforms.speed * 0.45, 0.0, 2.0);

    let impulse = surfaceEdge * meshUniforms.waveStrength * (0.04 + baseMovement * 0.35 + splashImpact);

    return vec4<f32>(impulse, 0.0, 0.0, 1.0);
}
