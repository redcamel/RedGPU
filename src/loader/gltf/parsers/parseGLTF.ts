import TextureLoader, {TextureLoaderData} from "../../TextureLoader";
import getGLTFBuffersResources from "../core/getGLTFBuffersResources";
import {GLTF} from "../GLTF";
import GLTFLoader, {GLTFLoadingProgressInfo} from "../GLTFLoader";
import parseAnimation_GLTF from "./animation/parseAnimations";
import parseAssetVersion from "./parseAssetVersion";
import parseCameras_GLTF from "./parseCameras_GLTF";
import parseScene_GLTF from "./parseScene_GLTF";


/**
 * [KO] glTF 데이터를 프레임 단위로 분산 파싱하여 버퍼, 씬, 카메라, 텍스처, 애니메이션 리소스를 순차적으로 구성합니다.
 * [EN] Parses glTF data across multiple frames to sequentially construct buffers, scenes, cameras, textures, and animation resources.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 파싱할 원본 `GLTF` 데이터 객체
 * [EN] Source `GLTF` data object to parse
 * @param callBack -
 * [KO] 전체 파싱 및 리소스 로딩 완료 시 호출할 콜백 함수
 * [EN] Callback function invoked when all parsing and resource loading complete
 * @param onProgress -
 * [KO] 로딩 진행 상태를 전달받는 콜백 함수 (선택)
 * [EN] Callback function receiving loading progress information (optional)
 * @category GLTF
 */
const parseGLTF = (gltfLoader: GLTFLoader, gltfData: GLTF, callBack, onProgress?: (info: GLTFLoadingProgressInfo) => void) => {
    if (gltfData.extensionsUsed?.includes("KHR_draco_mesh_compression")) {
        alert('RedGPU GLTFLoader does not support the KHR_draco_mesh_compression extension. Models using this extension may not load properly.');
    }
    requestAnimationFrame(() => {
        parseAssetVersion(gltfData);
        requestAnimationFrame(() => {
            getGLTFBuffersResources(gltfLoader, gltfData, () => {
                requestAnimationFrame(() => {
                    parseScene_GLTF(gltfLoader, gltfData, () => {
                        requestAnimationFrame(() => {
                            parseCameras_GLTF(gltfLoader, gltfData);
                            new TextureLoader(
                                gltfLoader.redGPUContext,
                                Object.values(gltfLoader.parsingResult.textureRawList),
                                result => {
                                    result.textures.forEach((textureLoaderData: TextureLoaderData) => {
                                        const {
                                            targetTextureKey,
                                            targetSamplerKey,
                                            samplerList
                                        } = textureLoaderData.srcInfo
                                        textureLoaderData.srcInfo.materialList.forEach((material: TextureLoaderData, index: number) => {
                                            material[targetTextureKey] = textureLoaderData.texture;
                                            if (samplerList[index]) {
                                                material[targetSamplerKey] = samplerList[index];
                                            }
                                        })
                                    });
                                    Object.values(gltfLoader.parsingResult.textureRawList).forEach((item: any) => {
                                        if (typeof item.src === 'string' && item.src.startsWith('blob:')) {
                                            URL.revokeObjectURL(item.src);
                                        }
                                    });
                                    parseAnimation_GLTF(gltfLoader, gltfData).then(_ => {
                                        if (callBack) callBack();
                                    });
                                },
                                (e) => {
                                    gltfLoader.loadingProgressInfo.textures = e
                                    onProgress?.(gltfLoader.loadingProgressInfo)
                                }
                            );
                        });
                    });
                });
            }, onProgress);
        });
    });
}
export default parseGLTF
