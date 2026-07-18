#redgpu_include SYSTEM_UNIFORM
#redgpu_include systemStruct.OutputFragment
#redgpu_include math.getMotionVector

struct InputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,
    @location(9) @interpolate(flat) globalFragmentSlotIndex: u32,

    @location(11) combinedOpacity: f32,
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let globalFragmentData = globalFragmentSSBO_BuiltIn[inputData.globalFragmentSlotIndex];
    
    // 지형의 와이어프레임 및 입체 형상 식별을 위한 기본 회색 조명 머티리얼 구성
    let diffuseColor = vec3<f32>(0.5, 0.5, 0.5);
    let finalAlpha = globalFragmentData.opacity * inputData.combinedOpacity;
    
    output.color = vec4<f32>(diffuseColor, finalAlpha);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
