#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;
struct MatrixList{
    modelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}
struct VertexUniforms {
    matrixList:MatrixList,
    pickingId:u32,
    useBillboardPerspective:u32,
    useBillboard:u32,
    combinedOpacity:f32,
};

@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

struct InputData {
    @location(0) a_position : vec3<f32>,
    @location(1) a_normal : vec3<f32>,
    @location(2) a_uv : vec2<f32>,
    @location(3) position : vec3<f32>,
    @location(4) alpha : f32,
    @location(5) rotation : vec3<f32>,
    @location(6) scale : f32,
};
struct OutputData {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(3) combinedOpacity: f32,
    //
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowPos: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
};
fn mat4_inverse(a: mat4x4<f32>) -> mat4x4<f32> {
    var a00: f32 = a[0][0];
    var a01: f32 = a[0][1];
    var a02: f32 = a[0][2];
    var a03: f32 = a[0][3];
    var a10: f32 = a[1][0];
    var a11: f32 = a[1][1];
    var a12: f32 = a[1][2];
    var a13: f32 = a[1][3];
    var a20: f32 = a[2][0];
    var a21: f32 = a[2][1];
    var a22: f32 = a[2][2];
    var a23: f32 = a[2][3];
    var a30: f32 = a[3][0];
    var a31: f32 = a[3][1];
    var a32: f32 = a[3][2];
    var a33: f32 = a[3][3];

    var b00: f32 = a00*a11 - a01*a10;
    var b01: f32 = a00*a12 - a02*a10;
    var b02: f32 = a00*a13 - a03*a10;
    var b03: f32 = a01*a12 - a02*a11;
    var b04: f32 = a01*a13 - a03*a11;
    var b05: f32 = a02*a13 - a03*a12;
    var b06: f32 = a20*a31 - a21*a30;
    var b07: f32 = a20*a32 - a22*a30;
    var b08: f32 = a20*a33 - a23*a30;
    var b09: f32 = a21*a32 - a22*a31;
    var b10: f32 = a21*a33 - a23*a31;
    var b11: f32 = a22*a33 - a23*a32;

    // Calculate the determinant
    var det: f32 = b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06;

    // Check if the matrix is invertible
    if (det != 0.0) {
        det = 1.0 / det;
        return mat4x4<f32>(
            (a11*b11 - a12*b10 + a13*b09) * det,
            (a02*b10 - a01*b11 - a03*b09) * det,
            (a31*b05 - a32*b04 + a33*b03) * det,
            (a22*b04 - a21*b05 - a23*b03) * det,
            (a12*b08 - a10*b11 - a13*b07) * det,
            (a00*b11 - a02*b08 + a03*b07) * det,
            (a32*b02 - a30*b05 - a33*b01) * det,
            (a20*b05 - a22*b02 + a23*b01) * det,
            (a10*b10 - a11*b08 + a13*b06) * det,
            (a01*b08 - a00*b10 - a03*b06) * det,
            (a30*b04 - a31*b02 + a33*b00) * det,
            (a21*b02 - a20*b04 - a23*b00) * det,
            (a11*b07 - a10*b09 - a12*b06) * det,
            (a00*b09 - a01*b07 + a02*b06) * det,
            (a31*b01 - a30*b03 - a32*b00) * det,
            (a20*b03 - a21*b01 + a22*b00) * det
        );
    }

    // If the matrix isn't invertible, return the zero matrix
    return mat4x4<f32>(
        0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0
    );
}
fn rotationMTX(t:vec3<f32>)->mat4x4<f32>
{
    var s:f32 = sin(t.x);
    var c:f32 = cos(t.x);
    var m1 = mat4x4<f32>(1, 0,  0, 0,
                         0, c, -s, 0,
                         0, s,  c, 0,
                         0, 0,  0, 1);

    s = sin(t[1]);c = cos(t[1]);
    var m2 = mat4x4<f32>(c, 0, s, 0,
                         0, 1, 0, 0,
                        -s, 0, c, 0,
                         0, 0, 0, 1);

    s = sin(t[2]);c = cos(t[2]);
    var m3 = mat4x4<f32>(c,-s,0,0,
                         s, c,0,0,
                         0, 0,1,0,
                         0, 0,0,1);

    return m1 * m2 * m3;
}

@vertex
fn main( inputData:InputData) -> OutputData {
  var output : OutputData;

  //
  let u_projectionMatrix = systemUniforms.projectionMatrix;
  let u_projectionCameraMatrix = systemUniforms.projectionCameraMatrix;
  let u_resolution = systemUniforms.resolution;
  let u_camera = systemUniforms.camera;
  let u_cameraMatrix = u_camera.cameraMatrix;
  let u_cameraPosition = u_camera.cameraPosition;
  //
  let u_modelMatrix = vertexUniforms.matrixList.modelMatrix;
  let u_normalModelMatrix = vertexUniforms.matrixList.normalModelMatrix;
//
  let u_useBillboardPerspective = vertexUniforms.useBillboardPerspective == 1u;
  let u_useBillboard = vertexUniforms.useBillboard == 1u;

  //
  let input_position = inputData.position;
  var position:vec4<f32>;
  var normalPosition:vec4<f32>;
    var scaleMTX = mat4x4<f32>(
        inputData.scale, 0, 0, 0,
        0, inputData.scale, 0, 0,
        0, 0, inputData.scale, 0,
        0,0,0, 1
    ) ;


    var translateTX = mat4x4<f32>(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      inputData.position.x,inputData.position.y,inputData.position.z, 1
    );


    var temp:mat4x4<f32>;
    if(u_useBillboard){
        var rotateMTX2 = rotationMTX( vec3(0,0, inputData.rotation.z) ) ;
        temp = translateTX * rotateMTX2;
        position = rotateMTX2 * vec4<f32>(inputData.a_position  , 1);
        output.position =  u_projectionMatrix *  getBillboardMatrixNoScaleRatio( u_cameraMatrix,  temp ) * scaleMTX * position;
    }else{
        var rotateMTX = rotationMTX( inputData.rotation ) ;
        temp = translateTX * rotateMTX * scaleMTX;
        position = temp * vec4<f32>(inputData.a_position , 1);
        output.position = u_projectionCameraMatrix * position;
    }

  output.vertexPosition = position.xyz;
  output.vertexNormal =  (transpose(mat4_inverse(temp)  ) *  vec4<f32>(inputData.a_normal,1.0)).xyz;
  output.uv = inputData.a_uv;
  output.combinedOpacity = inputData.alpha;
  return output;
}
struct OutputShadowData {
    @builtin(position) position : vec4<f32>,
};
