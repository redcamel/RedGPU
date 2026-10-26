import GPU_ADDRESS_MODE from "../../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import Sampler from "../../../../resources/sampler/Sampler";
import {GLTF, GlTfId, MaterialNormalTextureInfo, MaterialOcclusionTextureInfo, TextureInfo} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import parse_KHR_texture_transform from "./extensions/parse_KHR_texture_transform";

/**
 * [KO] GLTF 재질의 텍스처 정보 및 샘플러 옵션을 파싱하여 로더의 텍스처 로드 목록에 등록합니다.
 * [EN] Parses texture information and sampler options of a GLTF material and registers them in the loader's texture load list.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param tMaterial -
 * [KO] 텍스처가 적용될 대상 `PBRMaterial` 인스턴스
 * [EN] Target `PBRMaterial` instance to which the texture will be applied
 * @param textureInfo -
 * [KO] 파싱할 GLTF 텍스처 정보 객체
 * [EN] GLTF texture info object to parse
 * @param targetTextureKey -
 * [KO] 대상 재질의 텍스처 프로퍼티 키 이름
 * [EN] Texture property key name on the target material
 * @param format -
 * [KO] 적용할 텍스처 포맷 문자열
 * [EN] Optional texture format string to apply
 * @param useMipmap -
 * [KO] 밉맵 사용 여부 (기본값: `true`)
 * [EN] Whether to use mipmaps (default: `true`)
 * @category Loader
 */
const parseMaterialTexture = (
    gltfLoader: GLTFLoader,
    tMaterial: PBRMaterial,
    textureInfo: TextureInfo | MaterialNormalTextureInfo | MaterialOcclusionTextureInfo,
    targetTextureKey: string,
    format?: string,
    useMipmap: boolean = true
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
                format: format || navigator.gpu.getPreferredCanvasFormat(),
                useMipmap
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
/**
 * [KO] GLTF 이미지 소스 ID로부터 실제 로드할 URI와 캐시 키를 추출합니다.
 * [EN] Extracts the actual load URI and cache key from a GLTF image source ID.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param scenesData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param sourceGlTfId -
 * [KO] 대상 이미지 소스의 GLTF ID
 * [EN] GLTF ID of the target image source
 * @returns
 * [KO] 파싱된 URI(`parsedURI`)와 캐시 키(`cacheKey`)를 담은 객체 또는 `null`
 * [EN] Object containing the parsed URI (`parsedURI`) and cache key (`cacheKey`), or `null`
 */
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
/**
 * [KO] GLTF 샘플러 ID로부터 WebGPU 샘플러 디스크립터(`GPUSamplerDescriptor`)를 생성합니다.
 * [EN] Creates a WebGPU sampler descriptor (`GPUSamplerDescriptor`) from a GLTF sampler ID.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param scenesData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param samplerGlTfId -
 * [KO] 대상 샘플러의 GLTF ID
 * [EN] GLTF ID of the target sampler
 * @returns
 * [KO] 변환된 `GPUSamplerDescriptor` 객체
 * [EN] Converted `GPUSamplerDescriptor` object
 */
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
