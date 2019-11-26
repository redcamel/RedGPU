"use strict";
export default class RedShareGLSL {
	static GLSL_SystemUniforms_vertex = {
		systemUniforms: `
		layout(set=0,binding = 0) uniform SystemUniforms {
	        mat4 perspectiveMTX;
	        mat4 cameraMTX;
	    } systemUniforms;
	    `
	};
	static GLSL_SystemUniforms_fragment = {
		systemUniformsWithLight: `
		const int MAX_DIRECTIONAL_LIGHT = 3;
		struct DirectionalLight {
	        vec4 directionalLightColor;
	        vec3 directionalLightPosition;
	        float directionalLightIntensity;
		};
		layout(set=1,binding = 0) uniform SystemUniforms {
	        float directionalLightCount;
	        DirectionalLight directionalLight[MAX_DIRECTIONAL_LIGHT];
        } systemUniforms;
        
        vec4 calcDirectionalLight(
            vec4 diffuseColor,
            vec3 N,
			vec4 ld, 
			vec4 ls,
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
			    L = normalize(-lightInfo.directionalLightPosition);	
			    lightColor = lightInfo.directionalLightColor;
			    lambertTerm = dot(N,-L);
			    intensity = lightInfo.directionalLightIntensity;
			    if(lambertTerm > 0.0){
					ld += lightColor * diffuseColor * lambertTerm * intensity;
					specular = pow( max(dot(reflect(L, N), -L), 0.0), shininess) * specularPower;
					ls +=  specularColor * specular * intensity;
			    }
		    }
			return ld + ls;
		}
		`
	}

}