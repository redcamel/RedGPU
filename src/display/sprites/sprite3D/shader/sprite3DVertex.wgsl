#redgpu_include SYSTEM_UNIFORM;
#redgpu_include math.billboard.getBillboardMatrix;
#redgpu_include math.billboard.getBillboardResult;
#redgpu_include entryPoint.billboard.entryPointPickingVertex;
#redgpu_include entryPoint.empty.entryPointShadowVertex;

struct Sprite3DVertexUniforms {
    useBillboard: u32,
    usePixelSize: u32,
    pixelSize: f32,
    _renderRatioX: f32,
    _renderRatioY: f32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: Sprite3DVertexUniforms;

struct InputData {
    @builtin(instance_index) globalVertexBufferSlotIndex: u32,
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(11) combinedOpacity: f32,
    //
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};



@vertex
fn main(inputData: InputData) -> VertexOutput {
    var output: VertexOutput;
    let globalVertexUniforms = globalSSAOVertexBuffer[inputData.globalVertexBufferSlotIndex];
    let billboardResult = getBillboardResult(
        inputData.position,
        inputData.vertexNormal,
        globalVertexUniforms.matrixList.modelMatrix,
        systemUniforms.camera.viewMatrix,
        systemUniforms.projection.projectionMatrix,
        systemUniforms.resolution,
        vertexUniforms.useBillboard,
        vertexUniforms.usePixelSize,
        vertexUniforms.pixelSize,
        vertexUniforms._renderRatioX,
        vertexUniforms._renderRatioY
    );

    output.position = billboardResult.position;
    output.vertexPosition = billboardResult.vertexPosition;
    output.vertexNormal = billboardResult.vertexNormal;
    output.uv = inputData.uv;
    output.combinedOpacity = globalVertexUniforms.combinedOpacity;

    return output;
}

