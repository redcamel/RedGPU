/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.29 22:10:29
 *
 */

export default class ShareGLSL {
  static MESH_UNIFORM_POOL_NUM = 25;
  static GLSL_VERSION = '#version 460';
  static MAX_DIRECTIONAL_LIGHT = 3;
  static MAX_POINT_LIGHT = 10;
  static MAX_SPOT_LIGHT = 1;
  static SET_INDEX_ComputeUniforms = 0;
  static SET_INDEX_SystemUniforms_vertex = 0;
  static SET_INDEX_SystemUniforms_fragment = 1;
  static SET_INDEX_MeshUniforms = 2;
  static SET_INDEX_VertexUniforms = 3;
  static SET_INDEX_FragmentUniforms = 3;
  static GLSL_SystemUniforms_vertex = {
    systemUniforms: `
		const float TRUTHY = 1.0;
		layout( set =  ${ShareGLSL.SET_INDEX_SystemUniforms_vertex}, binding = 0 ) uniform SystemUniforms {
	        mat4 perspectiveMTX;
	        mat4 cameraMTX;
	        vec2 resolution;
	        float time;
	    } systemUniforms;
	    `,
    meshUniforms: `
		layout( set = ${ShareGLSL.SET_INDEX_MeshUniforms}, binding = 0 ) uniform MeshMatrixUniforms {
	        mat4 modelMatrix[${ShareGLSL.MESH_UNIFORM_POOL_NUM}];
	        mat4 normalMatrix[${ShareGLSL.MESH_UNIFORM_POOL_NUM}];
	    } meshMatrixUniforms;
	    layout( set = ${ShareGLSL.SET_INDEX_MeshUniforms}, binding = 1 ) uniform MeshUniformIndex {
	        float index;
	        float mouseColorID;
	        float sumOpacity;
	    } meshUniforms;
		`,
    calcDisplacement: (
        vNormal='vNormal',
        displacementFlowSpeedX='displacementFlowSpeedX',
        displacementFlowSpeedY='displacementFlowSpeedY',
        displacementPower='displacementPower',
        targetUV='targetUV',
        targetDisplacementTexture='targetDisplacementTexture',
        targetSampler='targetSampler'
    )=>{
        return `
        normalize(${vNormal})
        * texture(
            sampler2D(${targetDisplacementTexture}, ${targetSampler}),
            ${targetUV} + vec2(
                ${displacementFlowSpeedX} * (systemUniforms.time/1000.0),
                ${displacementFlowSpeedY} * (systemUniforms.time/1000.0)
            )
        ).x * ${displacementPower};
		`
    },
    getSprite3DMatrix: `
		mat4 getSprite3DMatrix(mat4 cameraMTX, mat4 mvMatrix){
			mat4 tMTX = cameraMTX * mvMatrix;
			tMTX[0][0] = mvMatrix[0][0], tMTX[0][1] = 0.0, tMTX[0][2] = 0.0;
			tMTX[1][0] = 0.0, tMTX[1][1] = mvMatrix[1][1], tMTX[1][2] = 0.0;
			tMTX[2][0] = 0.0, tMTX[2][1] = 0.0, tMTX[2][2] = mvMatrix[2][2];
			return tMTX;
		}
		`
  };
  static GLSL_SystemUniforms_fragment = {
    systemUniforms: `
		const float TRUTHY = 1.0;
		const int MAX_DIRECTIONAL_LIGHT = ${ShareGLSL.MAX_DIRECTIONAL_LIGHT};
		const int MAX_POINT_LIGHT =  ${ShareGLSL.MAX_POINT_LIGHT};
		const int MAX_SPOT_LIGHT =  ${ShareGLSL.MAX_SPOT_LIGHT};
		struct DirectionalLight {
	        vec4 color;
	        vec3 position;
	        float intensity;
		};
		struct PointLight {
	        vec4 color;
	        vec3 position;
	        float intensity;
	        float radius;
		};
		struct AmbientLight {
	        vec4 color;
	        float intensity;
		};
		struct SpotLight {
	        vec4 color;
	        vec3 position;
	        float intensity;
	        float cutoff;
	        float exponent;
		};
		layout( set =  ${ShareGLSL.SET_INDEX_SystemUniforms_fragment}, binding = 0 ) uniform SystemUniforms {
	        float directionalLightCount;
	        float pointLightCount;
	        float spotLightCount;
	        DirectionalLight directionalLightList[MAX_DIRECTIONAL_LIGHT];
	        PointLight pointLightList[MAX_POINT_LIGHT];
	        AmbientLight ambientLight;
	        SpotLight spotLightList[MAX_SPOT_LIGHT];
	        vec2 resolution;
	        vec3 cameraPosition;
        } systemUniforms;
        /////////////////////////////////////////////////////////////////////////////
        vec4 la = systemUniforms.ambientLight.color * systemUniforms.ambientLight.intensity;
        vec4 calcDirectionalLight(
            vec4 diffuseColor,
            vec3 N,
			float loopNum,
			DirectionalLight[MAX_DIRECTIONAL_LIGHT] lightList,
			float shininess,
			float specularPower,
			vec4 specularColor,
			float specularTextureValue
		){
		    vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
		    vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);

		    vec3 L;
		    vec4 lightColor;

		    float lambertTerm;
		    float intensity;
		    float specular;

		    DirectionalLight lightInfo;
		    for(int i = 0; i< loopNum; i++){
		        lightInfo = lightList[i];
			    L = normalize(-lightInfo.position);
			    lightColor = lightInfo.color;
			    lambertTerm = dot(N,-L);
			    intensity = lightInfo.intensity;
			    if(lambertTerm > 0.0){
					ld += lightColor * diffuseColor * lambertTerm * intensity;
					specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower * specularTextureValue;
					ls +=  specularColor * specular * intensity ;
			    }
		    }
		    return ld + ls;
		}
		/////////////////////////////////////////////////////////////////////////////
		vec4 calcPointLight(
            vec4 diffuseColor,
            vec3 N,
			float loopNum,
			PointLight[MAX_POINT_LIGHT] lightList,
			float shininess,
			float specularPower,
			vec4 specularColor,
			float specularTextureValue,
			vec3 vVertexPosition
		){
			vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
		    vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);

		    vec3 L;
		    vec4 lightColor;

		    float lambertTerm;
		    float intensity;
		    float specular;

		    PointLight lightInfo;
		    float distanceLength ;
		    float attenuation;
		    for(int i = 0; i< loopNum; i++){
		        lightInfo = lightList[i];
		        L = -lightInfo.position + vVertexPosition;
			    distanceLength = abs(length(L));
			    if(lightInfo.radius> distanceLength){
			        L = normalize(L);
              lightColor = lightInfo.color;
              lambertTerm = dot(N,-L);
              intensity = lightInfo.intensity;
              if(lambertTerm > 0.0){
                  attenuation = clamp(1.0 - distanceLength*distanceLength/(lightInfo.radius*lightInfo.radius), 0.0, 1.0);
                  attenuation *= attenuation;
            	    ld += lightColor* diffuseColor * lambertTerm * intensity * attenuation;

                  specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower * specularTextureValue;
                  ls +=  specularColor * specular * intensity * attenuation;
              }
			    }
		    }
		    return ld + ls;
		}
		vec4 calcSpotLight(
            vec4 diffuseColor,
            vec3 N,
			float loopNum,
			SpotLight[MAX_SPOT_LIGHT] lightList,
			float shininess,
			float specularPower,
			vec4 specularColor,
			float specularTextureValue,
			vec3 vVertexPosition
		){
			vec4 ld = vec4(0.0, 0.0, 0.0, 1.0);
		    vec4 ls = vec4(0.0, 0.0, 0.0, 1.0);

		    vec3 L;
		    vec4 lightColor;

		    float lambertTerm;
		    float intensity;
		    float specular;

		    SpotLight lightInfo;
	        float distanceLength ;
		    float attenuation;
		    for(int i = 0; i< loopNum; i++){
		        lightInfo = lightList[i];
		        L = -lightInfo.position + vVertexPosition;
			    distanceLength = abs(length(L));
			    vec3 spotDirection = vec3(0.1,-1,0);
			    L = normalize(L);
			    lambertTerm = dot(N,-L);
				float spotEffect = dot(normalize(spotDirection),L);
                lightColor = lightInfo.color;
		        float limit = 10;
		        float inLight = step(cos(limit * 3.141592653589793/180), spotEffect);
                float light = inLight * spotEffect;
			    if(lambertTerm > 0 && spotEffect > lightInfo.cutoff ){
			        if(spotEffect > cos(limit * 3.141592653589793/180) ){
				        spotEffect = pow(spotEffect, lightInfo.exponent);
		                attenuation = spotEffect * light ;
					    intensity = lightInfo.intensity;

						ld += lightColor * diffuseColor * intensity * attenuation;
						specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower * specularTextureValue;
						ls +=  specularColor * specular * intensity * attenuation ;
					}
			    }
		    }
		    return ld + ls;
		}
		/////////////////////////////////////////////////////////////////////////////
		vec3 getFlatNormal(vec3 vertexPosition){
			vec3 dx = dFdx(vertexPosition.xyz);
			vec3 dy = dFdy(vertexPosition.xyz);
			return normalize(cross(normalize(dy), normalize(dx)));
		}
		`,
    perturb_normal: `
		vec3 perturb_normal( vec3 N, vec3 V, vec2 texcoord, vec3 normalColor , float normalPower)
		{
			vec3 map = normalColor;
			map =  map * 255./127. - 128./127.;
			map.xy *= -normalPower;
			mat3 TBN = cotangent_frame(N, V, texcoord);
			return normalize(TBN * map);
		}
		`,
    cotangent_frame: `
		mat3 cotangent_frame(vec3 N, vec3 p, vec2 uv)
		{

			vec3 dp1 = dFdx( p );
			vec3 dp2 = dFdy( p );
			vec2 duv1 = dFdx( uv );
			vec2 duv2 = dFdy( uv );

			vec3 dp2perp = cross( dp2, N );
			vec3 dp1perp = cross( N, dp1 );
			vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
			vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;

			float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );
			return mat3( T * invmax, B * invmax, N );
		}
		`
  };

}
