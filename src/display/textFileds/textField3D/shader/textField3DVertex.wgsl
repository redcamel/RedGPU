#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;
#redgpu_include calcBillboard;
#redgpu_include billboardPicking;
#redgpu_include billboardShadow;

struct MatrixList {
    localMatrix: mat4x4<f32>,
    modelMatrix: mat4x4<f32>,
    prevModelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}

struct VertexUniforms {
    matrixList: MatrixList,
    pickingId: u32,
    useBillboard: u32,
    usePixelSize: u32,
    pixelSize: f32,
    _renderRatioX: f32,
    _renderRatioY: f32,
    combinedOpacity: f32,
    segmentW: f32,
    segmentH: f32,
    totalFrame: f32,
    currentIndex: f32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

struct InputData {
    @location(0) position: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
};

struct OutputData {
    @builtin(position) position: vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(11) combinedOpacity: f32,
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowPos: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // TextField3D는 선명도를 위해 noneJitterProjectionMatrix 사용
    let billboardResult = calcBillboard(
        inputData.position,
        inputData.vertexNormal,
        vertexUniforms.matrixList.modelMatrix,
        systemUniforms.camera.cameraMatrix,
        systemUniforms.noneJitterProjectionMatrix,
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
    output.combinedOpacity = vertexUniforms.combinedOpacity;

    output.currentClipPos = systemUniforms.noneJitterProjectionCameraMatrix * vec4<f32>(billboardResult.vertexPosition, 1.0);
    output.prevClipPos = systemUniforms.prevNoneJitterProjectionCameraMatrix * vertexUniforms.matrixList.prevModelMatrix * vec4<f32>(inputData.position, 1.0);

    return output;
}