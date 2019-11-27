/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2019.11.26 19:46:12
 *
 */

"use strict";
export default class RedShareGLSL {
	static MAX_DIRECTIONAL_LIGHT = 3;
	static MAX_POINT_LIGHT = 100;
	static GLSL_SystemUniforms_vertex = {
		systemUniforms: `
		layout(set=0,binding = 0) uniform SystemUniforms {
	        mat4 perspectiveMTX;
	        mat4 cameraMTX;
	        float time;
	    } systemUniforms;
	    `
	};
	static GLSL_SystemUniforms_fragment = {
		systemUniformsWithLight: `
		vec4 LD = vec4(0.0, 0.0, 0.0, 1.0);
		vec4 LA = vec4(0.0, 0.0, 0.0, 0.2);
		vec4 LS = vec4(0.0, 0.0, 0.0, 1.0);
		const int MAX_DIRECTIONAL_LIGHT = ${RedShareGLSL.MAX_DIRECTIONAL_LIGHT};
		const int MAX_POINT_LIGHT =  ${RedShareGLSL.MAX_POINT_LIGHT};
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
		layout(set=1,binding = 0) uniform SystemUniforms {
	        float directionalLightCount;
	        float pointLightCount;
	        DirectionalLight directionalLightList[MAX_DIRECTIONAL_LIGHT];
	        PointLight pointLightList[MAX_POINT_LIGHT];	        
        } systemUniforms;
        
        void calcDirectionalLight(
            vec4 diffuseColor,
            vec3 N,		
			float loopNum,
			DirectionalLight[MAX_DIRECTIONAL_LIGHT] lightList,
			float shininess,
			float specularPower,
			vec4 specularColor
		){
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
					LD += lightColor * diffuseColor * lambertTerm * intensity;
					specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower;
					LS +=  specularColor * specular * intensity;
			    }
		    }
		}
		
		void calcPointLight(
            vec4 diffuseColor,
            vec3 N,		
			float loopNum,
			PointLight[MAX_POINT_LIGHT] lightList,
			float shininess,
			float specularPower,
			vec4 specularColor,
			vec3 vVertexPosition
		){
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
				        attenuation = 1.0 / (0.01 + 0.02 * distanceLength + 0.03 * distanceLength * distanceLength) * 0.5;
						LD += lightColor * diffuseColor * lambertTerm * intensity * attenuation;
						specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower;
						LS +=  specularColor * specular * intensity * attenuation;
				    }
			    }
		    }
		}
		`,
		perturb_normal: `
		vec3 perturb_normal( vec3 N, vec3 V, vec2 texcoord, vec3 normalColor , float normalPower)
		{	   
			vec3 map = normalColor;
			map =  map * 255./127. - 128./127.;
			map.xy *= normalPower;
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
	}

}