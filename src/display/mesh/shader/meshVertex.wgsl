#redgpu_include SYSTEM_UNIFORM;
#redgpu_include shadow.getShadowCoord;
#redgpu_include drawDirectionalShadowDepth;
#redgpu_include entryPointPickingVertex;
#redgpu_include calcDisplacements;

#redgpu_include meshVertexBasicUniform;

const maxDistance: f32 = 1000.0;
const maxMipLevel: f32 = 10.0;

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;
@group(1) @binding(1) var displacementTextureSampler: sampler;
@group(1) @binding(2) var displacementTexture: texture_2d<f32>;


@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // System uniforms
    #redgpu_if disableJitter
    {
        let u_projectionMatrix = systemUniforms.noneJitterProjectionCameraMatrix;
    }
    #redgpu_else
    {
        let u_projectionMatrix = systemUniforms.projectionMatrix;
    }
    #redgpu_endIf

    let u_projectionCameraMatrix = systemUniforms.projectionCameraMatrix;
    let u_noneJitterProjectionCameraMatrix = systemUniforms.noneJitterProjectionCameraMatrix;
    let u_prevNoneJitterProjectionCameraMatrix = systemUniforms.prevNoneJitterProjectionCameraMatrix;
    let u_resolution = systemUniforms.resolution;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex uniforms
    let u_matrixList = vertexUniforms.matrixList;
    let u_modelMatrix = u_matrixList.modelMatrix;
    let u_prevModelMatrix = u_matrixList.prevModelMatrix;
    let u_normalModelMatrix = u_matrixList.normalModelMatrix;
    let u_displacementScale = vertexUniforms.displacementScale;
    let u_useDisplacementTexture = vertexUniforms.useDisplacementTexture == 1u;
    let u_receiveShadow = vertexUniforms.receiveShadow;

    // Light uniforms
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;

    // Input data
    let input_position = inputData.position;
    let input_position_vec4 = vec4<f32>(input_position, 1.0);
    let input_vertexNormal = inputData.vertexNormal;
    let input_uv = inputData.uv;

    // Position and normal calculation
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;


    #redgpu_if useDisplacementTexture
        let tempPosition = u_modelMatrix * input_position_vec4;
        let distance = distance(tempPosition.xyz, u_cameraPosition);
        let mipLevel = (distance / maxDistance) * maxMipLevel;

        let displacedPosition = calcDisplacementPosition(
            input_position,
            input_vertexNormal,
            displacementTexture,
            displacementTextureSampler,
            u_displacementScale,
            input_uv,
            mipLevel
        );

        position = u_modelMatrix * vec4<f32>(displacedPosition, 1.0);

        let worldUV = input_uv;
        let displacedNormal = calcDisplacementNormal(
            normalize((u_normalModelMatrix * vec4<f32>(input_vertexNormal, 0.0)).xyz),
            displacementTexture,
            displacementTextureSampler,
            u_displacementScale,
            worldUV,
            mipLevel
        );
        normalPosition = vec4<f32>(displacedNormal, 0.0);
    #redgpu_else
        position = u_modelMatrix * input_position_vec4;
        normalPosition = u_normalModelMatrix * vec4<f32>(input_vertexNormal, 1.0);
    #redgpu_endIf

    // Basic output assignments
    output.position = u_projectionCameraMatrix * position;
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = input_uv * vertexUniforms.uvTransform.zw + vertexUniforms.uvTransform.xy;

    output.combinedOpacity = vertexUniforms.combinedOpacity;

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

    return output;
}
