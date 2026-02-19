#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;
#redgpu_include entryPoint.mesh.entryPointShadowVertex;
#redgpu_include entryPoint.mesh.entryPointPickingVertex;

#redgpu_include meshVertexBasicUniform;

const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;
@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;


@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // Input data
    let input_position = inputData.position;
    let input_position_vec4 = vec4<f32>(input_position, 1.0);
    let input_vertexNormal = inputData.vertexNormal;

    // System uniforms
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_projectionCameraMatrix = systemUniforms.projectionCameraMatrix;
    let u_noneJitterProjectionCameraMatrix = systemUniforms.noneJitterProjectionCameraMatrix;
    let u_prevNoneJitterProjectionCameraMatrix = systemUniforms.prevNoneJitterProjectionCameraMatrix;
    let u_resolution = systemUniforms.resolution;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex uniforms
    let u_matrixList = vertexUniforms.matrixList;
    let u_localMatrix = u_matrixList.localMatrix;
    let u_modelMatrix = u_matrixList.modelMatrix;
    let u_normalModelMatrix = u_matrixList.normalModelMatrix;
    let u_prevModelMatrix = u_matrixList.prevModelMatrix;
    let u_receiveShadow = vertexUniforms.receiveShadow;

    // Light uniforms
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;

    // Position and normal calculation
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    position = u_modelMatrix * input_position_vec4;
    normalPosition = u_normalModelMatrix * vec4<f32>(input_vertexNormal, 0.0);

    // Basic output assignments
    output.position = u_projectionCameraMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalize(normalPosition.xyz);
    output.uv = inputData.uv;
    output.uv1 = inputData.uv1;
    output.vertexColor_0 = inputData.vertexColor_0;

    let transformedTangentXYZ = (u_normalModelMatrix * vec4<f32>(inputData.vertexTangent.xyz, 0.0)).xyz;
    output.vertexTangent = vec4<f32>( normalize(transformedTangentXYZ), inputData.vertexTangent.w );



    // Shadow calculation
    #redgpu_if receiveShadow
    {
        output.shadowCoord = getShadowCoord(position.xyz, u_directionalLightProjectionViewMatrix);
        output.receiveShadow = vertexUniforms.receiveShadow;
    }
    #redgpu_endIf

    // Motion vector calculation
    {
        output.currentClipPos = u_noneJitterProjectionCameraMatrix * position;
        output.prevClipPos = u_prevNoneJitterProjectionCameraMatrix * u_prevModelMatrix * input_position_vec4;

    }

    // Scale calculations
    let nodeScaleX = length(u_localMatrix[0].xyz);
    let nodeScaleY = length(u_localMatrix[1].xyz);
    let nodeScaleZ = length(u_localMatrix[2].xyz);


    let volumeScaleX = length(u_modelMatrix[0].xyz);
    let volumeScaleY = length(u_modelMatrix[1].xyz);
    let volumeScaleZ = length(u_modelMatrix[2].xyz);
    output.localNodeScale_volumeScale = vec2<f32>(
        pow(nodeScaleX * nodeScaleY * nodeScaleZ, 1.0 / 3.0),
        pow(volumeScaleX * volumeScaleY * volumeScaleZ, 1.0 / 3.0)
    );

    return output;
}
