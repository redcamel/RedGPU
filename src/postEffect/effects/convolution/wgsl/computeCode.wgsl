let index = vec2<i32>(global_id.xy);
var color:vec4<f32> = vec4<f32>(0.0);
let kernelWeight_value : f32 = uniforms.kernelWeight;
let kernel_value : mat3x3<f32> = uniforms.kernel ;

color += textureLoad(sourceTexture, index + vec2<i32>(-1,-1), 0) * kernel_value[0][0]  ;
color += textureLoad(sourceTexture, index + vec2<i32>(0,-1), 0) * kernel_value[0][1] ;
color += textureLoad(sourceTexture, index + vec2<i32>(1,-1), 0) * kernel_value[0][2] ;
color += textureLoad(sourceTexture, index + vec2<i32>(-1,0), 0) * kernel_value[1][0] ;
color += textureLoad(sourceTexture, index + vec2<i32>(0,0), 0) * kernel_value[1][1] ;
color += textureLoad(sourceTexture, index + vec2<i32>(1,0), 0) * kernel_value[1][2] ;
color += textureLoad(sourceTexture, index + vec2<i32>(-1,1), 0) * kernel_value[2][0] ;
color += textureLoad(sourceTexture, index + vec2<i32>(0,1), 0) * kernel_value[2][1] ;
color += textureLoad(sourceTexture, index + vec2<i32>(1,1), 0) * kernel_value[2][2] ;
textureStore(outputTexture, index, color / kernelWeight_value );
