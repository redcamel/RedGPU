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

    // 수면 위(depth <= 0.001)이거나 최대 유효 침수 깊이(maxPen)를 초과한 깊은 영역은 완전 배제
    if (depth <= 0.001 || depth > maxPen) {
        discard;
    }

    // 수면 표면 접촉 층 (Waterline Interface Band)
    // 수면과 접하는 경계면(0.001 ~ maxPen)에서만 뚜렷한 파문을 형성하고 깊어질수록 부드럽게 감쇄
    let depthRatio = depth / maxPen;
    let surfaceEdge = smoothstep(0.0, 0.15, depthRatio) * (1.0 - smoothstep(0.4, 1.0, depthRatio));

    // 디디는 발(Left vs Right) 판별
    var footWeight: f32 = 1.0;
    if (meshUniforms.speed > 0.15) {
        // footSide: +1.0 (오른발), -1.0 (왼발)
        // input.localX > 0 (오른쪽 몸체), input.localX < 0 (왼쪽 몸체)
        let isStrikingFoot = (input.localX * meshUniforms.footSide) > -0.05;
        footWeight = select(0.15, 2.0, isStrikingFoot);
    }

    // 발걸음 첨벙임 펄스 (Footstep Splash Impact):
    // 발을 디디는 순간(stepPulse)에 해당 발 주변으로 충격량 주입
    let splashImpact = meshUniforms.stepPulse * footWeight * 2.2;
    let baseMovement = clamp(meshUniforms.speed * 0.45, 0.0, 2.0);

    // 총 충격량 주입 (물리적 이동 파문 및 발자국 첨벙임 고리 생성)
    let impulse = surfaceEdge * meshUniforms.waveStrength * (0.04 + baseMovement * 0.35 + splashImpact);

    return vec4<f32>(impulse, 0.0, 0.0, 1.0);
}
