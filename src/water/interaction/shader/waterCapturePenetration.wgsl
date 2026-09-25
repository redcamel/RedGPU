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

@group(0) @binding(0) var<uniform> globalUniforms: CaptureGlobalUniforms;
@group(1) @binding(0) var<uniform> meshUniforms: MeshUniforms;

struct VertexInput {
    @location(0) position: vec3<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) worldY: f32,
    @location(1) localX: f32,
};

@vertex
fn vs_main(input: VertexInput) -> VertexOutput {
    var output: VertexOutput;
    let worldPos = meshUniforms.modelMatrix * vec4<f32>(input.position, 1.0);
    output.position = globalUniforms.orthoViewProj * worldPos;
    output.worldY = worldPos.y;
    output.localX = input.position.x;
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

    var footWeight: f32 = 1.0;
    if (meshUniforms.speed > 0.15) {
        let isStrikingFoot = (input.localX * meshUniforms.footSide) > -0.05;
        footWeight = select(0.15, 2.0, isStrikingFoot);
    }

    let splashImpact = meshUniforms.stepPulse * footWeight * 2.2;
    let baseMovement = clamp(meshUniforms.speed * 0.45, 0.0, 2.0);

    let impulse = surfaceEdge * meshUniforms.waveStrength * (0.04 + baseMovement * 0.35 + splashImpact);

    return vec4<f32>(impulse, 0.0, 0.0, 1.0);
}
