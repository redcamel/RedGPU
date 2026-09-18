struct CaptureGlobalUniforms {
    orthoViewProj: mat4x4<f32>,
    waterLevel: f32,
    maxPenetration: f32,
    pad1: f32,
    pad2: f32,
};

struct MeshUniforms {
    modelMatrix: mat4x4<f32>,
    waveStrength: f32,
    foamGeneration: f32,
    speed: f32,
    stepPulse: f32,
    footSide: f32,
    pad1: f32,
    pad2: f32,
    pad3: f32,
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
    if (depth <= 0.001) {
        discard;
    }

    // 수면 표면 접촉 층 (Waterline Interface)
    let surfaceEdge = exp(-depth * 2.5) * smoothstep(0.001, 0.08, depth);

    // 디디는 발(Left vs Right) 판별
    var footWeight: f32 = 1.0;
    if (meshUniforms.speed > 0.15) {
        // footSide: +1.0 (오른발), -1.0 (왼발)
        // input.localX > 0 (오른쪽 몸체), input.localX < 0 (왼쪽 몸체)
        let isStrikingFoot = (input.localX * meshUniforms.footSide) > -0.05;
        footWeight = select(0.15, 2.0, isStrikingFoot);
    }

    // 발걸음 첨벙임 펄스 (Footstep Splash Impact):
    // 발을 디디는 순간(stepPulse)에 해당 발 주변으로 폭발적인 파문 충격량 주입
    let splashImpact = meshUniforms.stepPulse * footWeight * 1.8;
    let baseMovement = clamp(meshUniforms.speed * 0.35, 0.0, 1.0);

    // 총 충격량 주입 (발자국에 따른 선명한 첨벙임 고리 생성)
    let impulse = surfaceEdge * meshUniforms.waveStrength * (0.02 + baseMovement * 0.12 + splashImpact);

    // 발을 찰박 치는 순간 거품(Foam/Splash) 트리거 폭발
    let foamTrigger = surfaceEdge * meshUniforms.foamGeneration * (meshUniforms.stepPulse * footWeight * 1.5 + smoothstep(1.5, 3.5, meshUniforms.speed) * 0.5);

    return vec4<f32>(impulse, foamTrigger, 0.0, 1.0);
}
