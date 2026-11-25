import TextureLoader, {TextureLoaderData} from "../../TextureLoader";
import decodeDracoPrimitives, {hasDracoCompression} from "../core/decodeDracoPrimitives";
import getGLTFBuffersResources from "../core/getGLTFBuffersResources";
import {createAbortError, nextFrame, throwIfAborted} from "../core/gltfAsyncUtils";
import GLTFParseContext from "../core/GLTFParseContext";
import {extractMaterialVariantNames} from "../core/materialVariantsHelper";
import {GLTF} from "../GLTF";
import GLTFLoader, {GLTFLoadingProgressInfo} from "../GLTFLoader";
import parseAnimation_GLTF from "./animation/parseAnimations";
import parseAssetVersion from "./parseAssetVersion";
import parseCameras_GLTF from "./parseCameras_GLTF";
import parseScene_GLTF from "./parseScene_GLTF";

const loadBuffersAsync = (
    gltfLoader: GLTFLoader,
    gltfData: GLTF,
    onProgress?: (info: GLTFLoadingProgressInfo) => void,
    signal?: AbortSignal
): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        getGLTFBuffersResources(gltfLoader, gltfData, resolve, onProgress, reject, signal);
    });
};

const loadTexturesAsync = (
    gltfLoader: GLTFLoader,
    onProgress?: (info: GLTFLoadingProgressInfo) => void,
    signal?: AbortSignal
): Promise<any> => {
    if (signal?.aborted) {
        return Promise.reject(createAbortError());
    }
    const rawList = Array.from(gltfLoader.parsingResult.textureRawList.values());
    if (rawList.length === 0) {
        return Promise.resolve({textures: []});
    }
    return new Promise((resolve, reject) => {
        let settled = false;
        const onAbort = () => {
            if (settled) return;
            settled = true;
            reject(createAbortError());
        };
        if (signal) {
            signal.addEventListener('abort', onAbort, {once: true});
        }
        new TextureLoader(
            gltfLoader.redGPUContext,
            rawList,
            (result) => {
                if (signal) signal.removeEventListener('abort', onAbort);
                if (settled) return;
                settled = true;
                if (signal?.aborted) {
                    reject(createAbortError());
                } else {
                    resolve(result);
                }
            },
            (e) => {
                if (settled || signal?.aborted) return;
                gltfLoader.loadingProgressInfo.textures = e;
                onProgress?.(gltfLoader.loadingProgressInfo);
            }
        );
    });
};

const revokeTextureBlobURLs = (gltfLoader: GLTFLoader): void => {
    const rawList = gltfLoader.parsingResult?.textureRawList;
    if (!rawList) return;
    rawList.forEach((item) => {
        if (typeof item?.src === 'string' && item.src.startsWith('blob:')) {
            URL.revokeObjectURL(item.src);
        }
    });
};

const releaseTemporaryBuffers = (gltfLoader: GLTFLoader, gltfData: GLTF): void => {
    const parsingResult = gltfLoader.parsingResult;
    if (parsingResult?.uris?.buffers) {
        parsingResult.uris.buffers.length = 0;
    }
    parsingResult?.textureRawList?.clear();
    if (Array.isArray(gltfData?.buffers)) {
        for (let i = 0, len = gltfData.buffers.length; i < len; i++) {
            const buffer = gltfData.buffers[i];
            if (buffer && typeof buffer.uri !== 'string') {
                delete buffer.uri;
            }
        }
    }
};

/**
 * [KO] glTF 데이터를 프레임 단위로 분산 파싱하여 버퍼, 씬, 카메라, 텍스처, 애니메이션 리소스를 순차적으로 구성합니다.
 * [EN] Parses glTF data across frames via a flat async/await pipeline to sequentially construct buffers, scenes, cameras, textures, and animation resources.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 파싱할 원본 `GLTF` 데이터 객체
 * [EN] Source `GLTF` data object to parse
 * @param callBack -
 * [KO] 전체 파싱 및 리소스 로딩 완료 시 호출할 콜백 함수 (선택)
 * [EN] Callback function invoked when all parsing and resource loading complete (optional)
 * @param onProgress -
 * [KO] 로딩 진행 상태를 전달받는 콜백 함수 (선택)
 * [EN] Callback function receiving loading progress information (optional)
 * @param signal -
 * [KO] 로딩 취소를 제어할 `AbortSignal` (선택)
 * [EN] Optional `AbortSignal` to cancel loading
 * @category GLTF
 */
const parseGLTF = async (
    gltfLoader: GLTFLoader,
    gltfData: GLTF,
    callBack?: () => void,
    onProgress?: (info: GLTFLoadingProgressInfo) => void,
    signal?: AbortSignal
): Promise<void> => {
    const parseContext = new GLTFParseContext();
    try {
        throwIfAborted(signal);
        const variantNames = extractMaterialVariantNames(gltfData);
        gltfLoader.materialVariants.length = 0;
        for (let i = 0, len = variantNames.length; i < len; i++) {
            gltfLoader.materialVariants.push(variantNames[i]);
        }

        await nextFrame(signal);
        parseAssetVersion(gltfData);

        await nextFrame(signal);
        await loadBuffersAsync(gltfLoader, gltfData, onProgress, signal);

        if (hasDracoCompression(gltfData)) {
            await decodeDracoPrimitives(gltfData, gltfLoader.parsingResult.uris.buffers);
            throwIfAborted(signal);
        }

        await nextFrame(signal);
        parseScene_GLTF(gltfLoader, gltfData, parseContext);

        await nextFrame(signal);
        parseCameras_GLTF(gltfLoader, gltfData);

        try {
            const result = await loadTexturesAsync(gltfLoader, onProgress, signal);
            throwIfAborted(signal);
            result.textures.forEach((textureLoaderData: TextureLoaderData) => {
                const {
                    targetTextureKey,
                    targetSamplerKey,
                    samplerList
                } = textureLoaderData.srcInfo;
                textureLoaderData.srcInfo.materialList.forEach((material: TextureLoaderData, index: number) => {
                    material[targetTextureKey] = textureLoaderData.texture;
                    if (samplerList[index]) {
                        material[targetSamplerKey] = samplerList[index];
                    }
                });
            });
        } finally {
            revokeTextureBlobURLs(gltfLoader);
        }

        throwIfAborted(signal);
        await parseAnimation_GLTF(gltfLoader, gltfData, parseContext);

        throwIfAborted(signal);
    } finally {
        parseContext.clear();
        releaseTemporaryBuffers(gltfLoader, gltfData);
    }

    callBack?.();
};

export default parseGLTF;
