#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;

struct VertexUniforms {
    pickingId: u32,
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
    useBillboardPerspective: u32,
    useBillboard: u32,
    combinedOpacity: f32,
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
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(15) pickingId: vec4<f32>,
};

struct OutputShadowData {
    @builtin(position) position: vec4<f32>,
};

@vertex
fn main(inputData: InputData) -> OutputData {
    var output: OutputData;

    // 시스템 Uniform 변수 가져오기
    let u_resolution = systemUniforms.resolution;
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex별 Uniform 변수 가져오기
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.normalModelMatrix;
    let u_useBillboardPerspective = vertexUniforms.useBillboardPerspective;
    let u_useBillboard = vertexUniforms.useBillboard;

    // 입력 데이터
    let input_position = inputData.position;
    let input_vertexNormal = inputData.vertexNormal;
    let input_positionVec4 = vec4<f32>(input_position, 1.0);
    let input_vertexNormalVec4 = vec4<f32>(input_vertexNormal, 1.0);
    let input_uv = inputData.uv;

    // 처리에 필요한 변수 초기화
    var position: vec4<f32>;
    var normalPosition: vec4<f32>;

    // 거리 기반 스케일링 계산
    let cameraPosition = vec3<f32>((u_cameraMatrix * u_modelMatrix)[3].xyz);
    let objectPosition = input_position.xyz;
    let distance = length(cameraPosition - objectPosition);
    let scaleFactor = distance;

    var scaleMatrix: mat4x4<f32> = mat4x4<f32>(
        10.0, 0.0, 0.0, 0.0,
        0.0, 10.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    // 빌보드와 퍼스펙티브 조건 처리
    #redgpu_if useBillboard
    {
        // 퍼스펙티브 스케일 처리
        if (u_useBillboardPerspective != 1) {
            scaleMatrix = mat4x4<f32>(
                scaleFactor, 0.0, 0.0, 0.0,
                0.0, scaleFactor, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            );
        }

        // 빌보드 변환 처리
        position = getBillboardMatrix(u_cameraMatrix, u_modelMatrix) * scaleMatrix * vec4<f32>(objectPosition, 1.0);
        normalPosition = getBillboardMatrix(u_cameraMatrix, u_normalModelMatrix) * scaleMatrix * vec4<f32>(input_vertexNormal, 1.0);

        // 투영 변환 적용
        output.position = u_projectionMatrix * position;

        // 추가 위치 보정 (퍼스펙티브가 비활성화된 경우)
        if (u_useBillboardPerspective != 1) {
            var temp = output.position / output.position.w;
            output.position = vec4<f32>(
                temp.xy + objectPosition.xy * vec2<f32>(
                    (u_projectionMatrix * u_modelMatrix)[0][0],
                    (u_projectionMatrix * u_modelMatrix)[1][1]
                ),
                temp.zw
            );
        }
    }
    #redgpu_else
    {
        // 일반적인 변환 처리
        position = u_cameraMatrix * u_modelMatrix * scaleMatrix * vec4<f32>(objectPosition, 1.0);
        normalPosition = u_cameraMatrix * u_normalModelMatrix * scaleMatrix * vec4<f32>(input_vertexNormal, 1.0);
        output.position = u_projectionMatrix * position;
    }
    #redgpu_endIf

    // 출력 데이터 설정
    output.vertexPosition = position.xyz;
    output.vertexNormal = normalPosition.xyz;
    output.uv = input_uv;
    output.combinedOpacity = vertexUniforms.combinedOpacity;

    return output;
}

@vertex
fn picking(inputData: InputData) -> OutputData {
    var output: OutputData;

    // 시스템 Uniform 변수 가져오기
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_camera = systemUniforms.camera;
    let u_cameraMatrix = u_camera.cameraMatrix;
    let u_cameraPosition = u_camera.cameraPosition;

    // Vertex별 Uniform 변수 가져오기
    let u_modelMatrix = vertexUniforms.modelMatrix;
    let u_normalModelMatrix = vertexUniforms.normalModelMatrix;
    let u_useBillboardPerspective = vertexUniforms.useBillboardPerspective;
    let u_useBillboard = vertexUniforms.useBillboard;

    // 입력 데이터
    let input_position = inputData.position;
    let input_positionVec4 = vec4<f32>(input_position, 1.0);
    let input_uv = inputData.uv;

    // 처리에 필요한 변수 초기화
    var position: vec4<f32>;

    // 거리 기반 스케일링 계산
    let cameraPosition = vec3<f32>((u_cameraMatrix * u_modelMatrix)[3].xyz);
    let objectPosition = input_position.xyz;
    let distance = length(cameraPosition - objectPosition);
    let scaleFactor = distance;

    var scaleMatrix: mat4x4<f32> = mat4x4<f32>(
        10.0, 0.0, 0.0, 0.0,
        0.0, 10.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    );

    // 빌보드와 퍼스펙티브 조건 처리
    if (u_useBillboard == 1) {
        // 퍼스펙티브 스케일 처리
        if (u_useBillboardPerspective != 1) {
            scaleMatrix = mat4x4<f32>(
                scaleFactor, 0.0, 0.0, 0.0,
                0.0, scaleFactor, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            );
        }

        // 빌보드 변환 처리
        position = getBillboardMatrix(u_cameraMatrix, u_modelMatrix) * scaleMatrix * vec4<f32>(objectPosition, 1.0);

        // 투영 변환 적용
        output.position = u_projectionMatrix * position;

        // 추가 위치 보정 (퍼스펙티브가 비활성화된 경우)
        if (u_useBillboardPerspective != 1) {
            var temp = output.position / output.position.w;
            output.position = vec4<f32>(
                temp.xy + objectPosition.xy * vec2<f32>(
                    (u_projectionMatrix * u_modelMatrix)[0][0],
                    (u_projectionMatrix * u_modelMatrix)[1][1]
                ),
                temp.zw
            );
        }
    } else {
        // 일반적인 변환 처리
        position = u_cameraMatrix * u_modelMatrix * scaleMatrix * vec4<f32>(objectPosition, 1.0);
        output.position = u_projectionMatrix * position;
    }

    // 피킹 ID 설정
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);

    return output;
}
