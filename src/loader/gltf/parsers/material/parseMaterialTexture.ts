import GPU_ADDRESS_MODE from "../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import {GLTF, GlTfId, MaterialNormalTextureInfo, MaterialOcclusionTextureInfo, TextureInfo} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import parse_KHR_texture_transform from "./extensions/parse_KHR_texture_transform";

const parseMaterialTexture = (
	gltfLoader: GLTFLoader,
	tMaterial: PBRMaterial,
	textureInfo: TextureInfo | MaterialNormalTextureInfo | MaterialOcclusionTextureInfo,
	targetTextureKey: string,
	format?: string,
) => {
	const {redGPUContext, gltfData} = gltfLoader
	const {textureRawList} = gltfLoader.parsingResult
	const targetTextureInfoGlTfId = textureInfo.index;
	const targetTextureInfo = gltfData.textures[targetTextureInfoGlTfId];
	const targetSourceGlTfId = targetTextureInfo.extensions?.EXT_texture_webp?.source || targetTextureInfo.source;
	const tURL = getURL(gltfLoader, gltfData, targetSourceGlTfId);
	if (tURL) {
		const samplerGlTfId = targetTextureInfo.sampler;
		const option = getSamplerInfo(gltfLoader, gltfData, samplerGlTfId);
		const {parsedURI, cacheKey} = tURL
		const key = `${targetTextureKey}SourceGlTfId_${targetSourceGlTfId}`
		if (!textureRawList[key]) {
			textureRawList[key] = ({
				src: parsedURI,
				cacheKey,
				targetTextureKey: targetTextureKey,
				targetSamplerKey: `${targetTextureKey}Sampler`,
				materialList: [tMaterial],
				samplerList: [new Sampler(redGPUContext, option)],
				format: format || navigator.gpu.getPreferredCanvasFormat()
			});
		} else {
			textureRawList[key].materialList.push(tMaterial)
			textureRawList[key].samplerList.push(new Sampler(redGPUContext, option))
		}
		tMaterial[`${targetTextureKey}_texCoord_index`] = textureInfo.texCoord || 0;
		if ('extensions' in textureInfo) {
			const {extensions} = textureInfo
			const {KHR_texture_transform} = extensions
			if (KHR_texture_transform) {
				parse_KHR_texture_transform(tMaterial, targetTextureKey, KHR_texture_transform)
			}
		}
	}
}
export default parseMaterialTexture
const getURL = function (gltfLoader: GLTFLoader, scenesData: GLTF, sourceGlTfId: GlTfId) {
	if (!scenesData.images[sourceGlTfId]) {
		console.log('없어', scenesData.images, sourceGlTfId)
		return null
	}
	const {uri} = scenesData.images[sourceGlTfId]
	let parsedURI
	const cacheKey = `${gltfLoader.url}_${sourceGlTfId}`
	if (uri.indexOf('blob:http') > -1) {
		parsedURI = uri;
	} else {
		parsedURI = (uri.indexOf(';base64,') > -1 ? '' : gltfLoader.filePath) + uri;
	}
	return {
		parsedURI,
		cacheKey
	}
};
const getSamplerInfo = function (gltfLoader: GLTFLoader, scenesData: GLTF, samplerGlTfId: GlTfId): GPUSamplerDescriptor {
	const result: GPUSamplerDescriptor = {
		magFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
		minFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
		mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
		addressModeU: GPU_ADDRESS_MODE.REPEAT,
		addressModeV: GPU_ADDRESS_MODE.REPEAT,
		addressModeW: GPU_ADDRESS_MODE.REPEAT
	};
	const wrapTable = {
		33071: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
		33648: GPU_ADDRESS_MODE.MIRRORED_REPEAT,
		10497: GPU_ADDRESS_MODE.REPEAT
	};
	const magFilterTable = {
		9728: GPU_MIPMAP_FILTER_MODE.NEAREST,
		9729: GPU_MIPMAP_FILTER_MODE.LINEAR
	};
	const minFilterTable = {
		9728: GPU_MIPMAP_FILTER_MODE.NEAREST,
		9729: GPU_MIPMAP_FILTER_MODE.LINEAR
	};
	if (scenesData.samplers) {
		let t0 = scenesData.samplers[samplerGlTfId];
		if (t0) {
			if ('magFilter' in t0) result.magFilter = magFilterTable[t0.magFilter] || GPU_MIPMAP_FILTER_MODE.LINEAR;
			if ('minFilter' in t0) result.minFilter = minFilterTable[t0.minFilter] || GPU_MIPMAP_FILTER_MODE.LINEAR;
			if ('wrapS' in t0) result.addressModeU = wrapTable[t0.wrapS];
			if ('wrapT' in t0) result.addressModeV = wrapTable[t0.wrapT];
		}
	} else {
	}
	result['string'] = JSON.stringify(result);
	return result;
};
