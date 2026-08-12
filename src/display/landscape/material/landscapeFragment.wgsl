#redgpu_include SYSTEM_UNIFORM
#redgpu_include color.getTintBlendMode
#redgpu_include entryPoint.mesh.entryPointPickingFragment
#redgpu_include systemStruct.OutputFragment
#redgpu_include math.getMotionVector

@group(2) @binding(1) var diffuseTextureSampler: sampler;
@group(2) @binding(2) var diffuseTexture: texture_2d<f32>;

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
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@fragment
fn main(inputData: InputData) -> OutputFragment {
    var output: OutputFragment;
    let globalFragmentData = globalFragmentSSBO_BuiltIn[inputData.globalFragmentSlotIndex];
    
    // 💡 LOD 청크 크기에 영향받지 않는 전체 지형 (10km x 10km) 월드 UV 좌표 산출
    let worldSize = 10000.0;
    let halfWorldSize = 5000.0;
    
    let rawWorldU = (inputData.vertexPosition.x + halfWorldSize) / worldSize;
    let rawWorldV = 1.0 - ((inputData.vertexPosition.z + halfWorldSize) / worldSize);
    let worldUV = clamp(vec2<f32>(rawWorldU, rawWorldV), vec2<f32>(0.0), vec2<f32>(1.0));

    var finalColor: vec4<f32> = vec4<f32>(0.2, 0.2, 0.2, 1.0);
    #redgpu_if diffuseTexture
    finalColor = textureSample(diffuseTexture, diffuseTextureSampler, worldUV);
    #redgpu_endIf

    let alpha2D = select(finalColor.a, 1.0, systemUniforms.isView3D == 1u);
    finalColor = vec4<f32>(finalColor.rgb * alpha2D, finalColor.a * globalFragmentData.opacity * inputData.combinedOpacity);

    #redgpu_if useTint
    finalColor = getTintBlendMode(finalColor, globalFragmentData.tintBlendMode, globalFragmentData.tint);
    #redgpu_endIf

    if (systemUniforms.isView3D == 1 && finalColor.a == 0.0) {
        discard;
    }

    output.color = vec4<f32>(finalColor.rgb, finalColor.a);
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    return output;
}
