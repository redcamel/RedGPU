/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 21:13:13
 *
 */

"use strict"
import RedGPUContext from "../../../RedGPUContext.js";
import PBRMaterial_System from "../../../material/system/PBRMaterial_System.js";
import Sampler from "../../../resources/Sampler.js";

let parseMaterialInfo_GLTF = (function () {
	let getURL = function (redGLTFLoader, json, sourceIndex) {
		if (json['images'][sourceIndex]['uri'].indexOf('blob:http') > -1) {
			return json['images'][sourceIndex]['uri']
		} else {
			return (json['images'][sourceIndex]['uri'].indexOf(';base64,') > -1 ? '' : redGLTFLoader['path']) + json['images'][sourceIndex]['uri']
		}
	};
	let getSamplerInfo = function (redGLTFLoader, json, samplerIndex) {
		let result = {
			magFilter: "linear",
			minFilter: "linear",
			mipmapFilter: "linear",
			addressModeU: "repeat",
			addressModeV: "repeat",
			addressModeW: "repeat"
		};
		let wrapTable = {
			33071: 'clamp-to-edge', //CLAMP_TO_EDGE,
			33648: 'mirror-repeat', //MIRRORED_REPEAT
			10497: 'repeat' //REPEAT
		};
		let magFilterTable = {
			9728: 'nearest', //NEAREST,
			9729: 'linear' //LINEAR
		};
		let minFilterTable = {
			9728: 'nearest', //NEAREST
			9729: 'linear' //LINEAR
		};
		if (json['samplers']) {
			let t0 = json['samplers'][samplerIndex];
			if ('magFilter' in t0) result['magFilter'] = magFilterTable[t0['magFilter']] || 'linear';
			if ('minFilter' in t0) result['minFilter'] = minFilterTable[t0['minFilter']] || 'linear';
			if ('wrapS' in t0) result['addressModeU'] = wrapTable[t0['wrapS']];
			if ('wrapT' in t0) result['addressModeV'] = wrapTable[t0['wrapT']]
		} else {
			console.log('샘플러가 존재하지않음', samplerIndex)
		}
		result['string'] = JSON.stringify(result);
		if (RedGPUContext.useDebugConsole) console.log('result', result);
		return result
	};
	return function (redGLTFLoader, json, v) {
		let tMaterial;
		let doubleSide = false;
		let alphaMode;
		let alphaCutoff = 0.5;

		if ('material' in v) {
			let env = redGLTFLoader['environmentTexture'];
			tMaterial = new PBRMaterial_System(redGLTFLoader['redGPUContext'], null, env, null, null, null, null);
			let tIndex = v['material'];
			let tMaterialInfo = json['materials'][tIndex];
			if ('doubleSided' in tMaterialInfo) doubleSide = tMaterialInfo['doubleSided'] ? true : false;
			if ('alphaMode' in tMaterialInfo) alphaMode = tMaterialInfo['alphaMode'];
			if ('alphaCutoff' in tMaterialInfo) alphaCutoff = tMaterialInfo['alphaCutoff'];
			let diffuseTexture, normalTexture, roughnessTexture, emissiveTexture, occlusionTexture;

			if ('baseColorTexture' in tMaterialInfo['pbrMetallicRoughness']) {
				let baseTextureIndex = tMaterialInfo['pbrMetallicRoughness']['baseColorTexture']['index'];
				let baseTextureInfo = json['textures'][baseTextureIndex];
				let diffuseSourceIndex = baseTextureInfo['source'];
				let tURL = getURL(redGLTFLoader, json, diffuseSourceIndex);
				let samplerIndex = baseTextureInfo['sampler'];
				let option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
				let tKey = tURL;
				redGLTFLoader['parsingResult']['textureRawList'].push({
					src: tURL,
					sampler: new Sampler(redGLTFLoader['redGPUContext'], option),
					targetTexture: 'diffuseTexture',
					targetMaterial: tMaterial
				})
				// diffuseTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new BitmapTexture(redGLTFLoader['redGPUContext'], tURL, new Sampler(redGLTFLoader['redGPUContext'], option))

			}
			if ('metallicRoughnessTexture' in tMaterialInfo['pbrMetallicRoughness']) {
				let roughnessTextureIndex = tMaterialInfo['pbrMetallicRoughness']['metallicRoughnessTexture']['index'];
				let roughnessTextureInfo = json['textures'][roughnessTextureIndex];
				let roughnessSourceIndex = roughnessTextureInfo['source'];
				let tURL = getURL(redGLTFLoader, json, roughnessSourceIndex);
				let samplerIndex = roughnessTextureInfo['sampler'];
				let option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
				let tKey = tURL;
				redGLTFLoader['parsingResult']['textureRawList'].push({
					src: tURL,
					sampler: new Sampler(redGLTFLoader['redGPUContext'], option),
					targetTexture: 'roughnessTexture',
					targetMaterial: tMaterial
				})
				// roughnessTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new BitmapTexture(redGLTFLoader['redGPUContext'], tURL, new Sampler(redGLTFLoader['redGPUContext'], option))

			}
			let normalTextureIndex = tMaterialInfo['normalTexture'];
			if (normalTextureIndex != undefined) {
				normalTextureIndex = normalTextureIndex['index'];
				let normalTextureInfo = json['textures'][normalTextureIndex];
				let normalSourceIndex = normalTextureInfo['source'];
				let tURL = getURL(redGLTFLoader, json, normalSourceIndex);
				let samplerIndex = normalTextureInfo['sampler'];
				let option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
				let tKey = tURL;
				redGLTFLoader['parsingResult']['textureRawList'].push({
					src: tURL,
					sampler: new Sampler(redGLTFLoader['redGPUContext'], option),
					targetTexture: 'normalTexture',
					targetMaterial: tMaterial
				})
				// normalTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new BitmapTexture(redGLTFLoader['redGPUContext'], tURL, new Sampler(redGLTFLoader['redGPUContext'], option))

			}
			let emissiveTextureIndex = tMaterialInfo['emissiveTexture'];
			if (emissiveTextureIndex != undefined) {
				emissiveTextureIndex = emissiveTextureIndex['index'];
				let emissiveTextureInfo = json['textures'][emissiveTextureIndex];
				let emissiveSourceIndex = emissiveTextureInfo['source'];
				let tURL = getURL(redGLTFLoader, json, emissiveSourceIndex);
				let samplerIndex = emissiveTextureInfo['sampler'];
				let option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
				let tKey = tURL;
				redGLTFLoader['parsingResult']['textureRawList'].push({
					src: tURL,
					sampler: new Sampler(redGLTFLoader['redGPUContext'], option),
					targetTexture: 'emissiveTexture',
					targetMaterial: tMaterial
				})
				// emissiveTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new BitmapTexture(redGLTFLoader['redGPUContext'], tURL, new Sampler(redGLTFLoader['redGPUContext'], option))

			}
			let occlusionTextureIndex = tMaterialInfo['occlusionTexture'];
			if (occlusionTextureIndex != undefined) {
				occlusionTextureIndex = occlusionTextureIndex['index'];
				let occlusionTextureInfo = json['textures'][occlusionTextureIndex];
				let occlusionSourceIndex = occlusionTextureInfo['source'];
				let tURL = getURL(redGLTFLoader, json, occlusionSourceIndex);
				let samplerIndex = occlusionTextureInfo['sampler'];
				let option = getSamplerInfo(redGLTFLoader, json, samplerIndex);
				let tKey = tURL;
				redGLTFLoader['parsingResult']['textureRawList'].push({
					src: tURL,
					sampler: new Sampler(redGLTFLoader['redGPUContext'], option),
					targetTexture: 'occlusionTexture',
					targetMaterial: tMaterial
				})
				// occlusionTexture = redGLTFLoader['parsingResult']['textures'][tKey] = new BitmapTexture(redGLTFLoader['redGPUContext'], tURL, new Sampler(redGLTFLoader['redGPUContext'], option))
				// let t0 = document.createElement('img')
				// t0.src = json['images'][occlusionSourceIndex]['uri']
				// t0.style.cssText = 'position:absolute;top:0px;left:0px;width:500px'
				// document.body.appendChild(t0)
			}
			let metallicFactor, roughnessFactor;
			if ('metallicFactor' in tMaterialInfo['pbrMetallicRoughness']) {
				metallicFactor = tMaterialInfo['pbrMetallicRoughness']['metallicFactor']
			}
			if ('roughnessFactor' in tMaterialInfo['pbrMetallicRoughness']) {
				roughnessFactor = tMaterialInfo['pbrMetallicRoughness']['roughnessFactor']
			}
			let tColor;

			// Type	Description	Required
			// baseColorFactor	number [4]	The material's base color factor.	No, default: [1,1,1,1]
			// baseColorTexture	object	The base color texture.	No
			// metallicFactor	number	The metalness of the material.	No, default: 1
			// roughnessFactor	number	The roughness of the material.	No, default: 1
			// metallicRoughnessTexture	object	The metallic-roughness texture.	No


			if (tMaterialInfo['pbrMetallicRoughness'] && tMaterialInfo['pbrMetallicRoughness']['baseColorFactor']) tColor = tMaterialInfo['pbrMetallicRoughness']['baseColorFactor'];
			else tColor = [1.0, 1.0, 1.0, 1.0];
			tMaterial['baseColorFactor'] = tColor;
			if (tMaterialInfo['pbrMetallicRoughness']) {
				tMaterial.metallicFactor = metallicFactor != undefined ? metallicFactor : 1;
				tMaterial.roughnessFactor = roughnessFactor != undefined ? roughnessFactor : 1;
			}
			tMaterial.emissiveFactor = tMaterialInfo.emissiveFactor != undefined ? tMaterialInfo.emissiveFactor : new Float32Array([1, 1, 1]);
			if (tMaterialInfo['pbrMetallicRoughness']) {
				if (tMaterialInfo['pbrMetallicRoughness']['metallicRoughnessTexture']) tMaterial['roughnessTexCoordIndex'] = tMaterialInfo['pbrMetallicRoughness']['metallicRoughnessTexture']['texCoord'] || 0;
				if (tMaterialInfo['pbrMetallicRoughness']['baseColorTexture']) tMaterial['diffuseTexCoordIndex'] = tMaterialInfo['pbrMetallicRoughness']['baseColorTexture']['texCoord'] || 0
			}
			if (tMaterialInfo['occlusionTexture']) {
				tMaterial['occlusionTexCoordIndex'] = tMaterialInfo['occlusionTexture']['texCoord'] || 0;
				tMaterial['occlusionPower'] = tMaterialInfo['occlusionTexture']['strength'] || 1
			}
			if (tMaterialInfo['emissiveTexture']) tMaterial['emissiveTexCoordIndex'] = tMaterialInfo['emissiveTexture']['texCoord'] || 0;
			if (tMaterialInfo['normalTexture']) tMaterial['normalTexCoordIndex'] = tMaterialInfo['normalTexture']['texCoord'] || 0
		} else {
			let tColor = [(Math.random()), (Math.random()), (Math.random()), 1];
			tMaterial = new PBRMaterial_System(redGLTFLoader['redGPUContext']);
			tMaterial.baseColorFactor = tColor;
		}
		return [tMaterial, doubleSide, alphaMode, alphaCutoff]
	}
})();

export default parseMaterialInfo_GLTF