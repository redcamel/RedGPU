import getAbsoluteURL from "../../../../utils/file/getAbsoluteURL";
import getArrayBufferFromSrc from "../../core/getArrayBufferFromSrc";
import {throwIfAborted} from "../../core/gltfAsyncUtils";
import {GLTF} from "../../GLTF";
import GLTFLoader, {GLTFLoadingProgressInfo} from "../../GLTFLoader";
import parseGLTF, {GLTFOnParsedCallback} from "../parseGLTF";

/**
 * [KO] GLB 바이너리 헤더의 바이트 길이입니다.
 * [EN] Byte length of the GLB binary header.
 */
const BINPACKER_HEADER_LENGTH = 12;
/**
 * [KO] GLB 포맷의 JSON 청크 타입 상수입니다.
 * [EN] JSON chunk type constant in GLB format.
 */
const BINPACKER_CHUNK_TYPE_JSON = 0x4e4f534a;
/**
 * [KO] GLB 포맷의 바이너리(BIN) 청크 타입 상수입니다.
 * [EN] Binary (BIN) chunk type constant in GLB format.
 */
const BINPACKER_CHUNK_TYPE_BINARY = 0x004e4942;
const UTF8_TEXT_DECODER = new TextDecoder('utf-8');
const SUPPORTED_IMAGE_FORMATS = Object.freeze(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/ktx2']);
/**
 * [KO] GLB 파일을 로드·파싱하고 완료 시 콜백을 호출합니다.
 * [EN] Loads and parses a GLB file and invokes the completion callback.
 *
 * @param gltfLoader -
 * [KO] `GLTFLoader` 인스턴스
 * [EN] `GLTFLoader` instance
 * @param callBack -
 * [KO] 파싱 완료 콜백 (선택)
 * [EN] Callback invoked after parsing completes (optional)
 * @param onProgress -
 * [KO] 로딩 진행 콜백 (선택)
 * [EN] Loading progress callback (optional)
 * @param signal -
 * [KO] 로딩 취소용 `AbortSignal` (선택)
 * [EN] `AbortSignal` to cancel loading (optional)
 * @param onParsed -
 * [KO] 파싱 완료 메타데이터 전달 콜백 (선택)
 * [EN] Callback receiving parsed metadata upon completion (optional)
 * @returns
 * [KO] 파싱 완료 시 해결되는 `Promise<void>`
 * [EN] `Promise<void>` resolving when parsing completes
 * @category GLTF
 */
const parseFileGLB = async (
    gltfLoader: GLTFLoader,
    callBack?: () => void,
    onProgress?: (info: GLTFLoadingProgressInfo) => void,
    signal?: AbortSignal,
    onParsed?: GLTFOnParsedCallback
): Promise<void> => {
    throwIfAborted(signal);

    const loadFilePath = getAbsoluteURL(window.location.href, gltfLoader.filePath + gltfLoader.fileName)
    const {cache, pending} = gltfLoader.redGPUContext.resourceManager.gltfCacheManager.glbCache;

    const progress = () => {
        if (onProgress) {
            const buffer = cache.get(loadFilePath);
            gltfLoader.loadingProgressInfo.model = {
                loaded: buffer.byteLength,
                total: buffer.byteLength,
                lengthComputable: true,
                percent: 100,
                transferred: 'Cached',
                totalSize: 'Cached'
            }
            onProgress(gltfLoader.loadingProgressInfo);
        }
    }
    if (cache.has(loadFilePath)) {
        progress()
        await parseArrayBuffer(gltfLoader, cache.get(loadFilePath), callBack, onProgress, signal, onParsed);
        return;
    }
    if (pending.has(loadFilePath)) {
        await pending.get(loadFilePath);
        throwIfAborted(signal);
        progress()
        await parseArrayBuffer(gltfLoader, cache.get(loadFilePath), callBack, onProgress, signal, onParsed);
        return;
    }
    const promise = new Promise<ArrayBuffer>((resolve, reject) => {

        getArrayBufferFromSrc(
            loadFilePath,
            (buffer) => {
                cache.set(loadFilePath, buffer);

                pending.delete(loadFilePath);
                resolve(buffer);
            },
            (error) => {
                pending.delete(loadFilePath);
                reject(error);
            },
            (info) => {
                if (signal?.aborted) return;
                gltfLoader.loadingProgressInfo.model = info
                onProgress?.(gltfLoader.loadingProgressInfo);
            }
        );
    });
    pending.set(loadFilePath, promise);

    const buffer = await promise;
    throwIfAborted(signal);
    await parseArrayBuffer(gltfLoader, buffer, callBack, onProgress, signal, onParsed);
}
/**
 * [KO] GLB ArrayBuffer에서 JSON 데이터와 바이너리 청크를 추출하여 GLTF 파싱을 수행합니다.
 * [EN] Extracts JSON data and binary chunks from a GLB ArrayBuffer and performs GLTF parsing.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param buffer -
 * [KO] GLB 파일의 `ArrayBuffer` 데이터
 * [EN] `ArrayBuffer` data of the GLB file
 * @param callBack -
 * [KO] 파싱 완료 후 호출될 콜백 함수
 * [EN] Callback function invoked after parsing is complete
 * @param onProgress -
 * [KO] 로딩 진행 상태를 전달받는 콜백 함수
 * [EN] Callback function receiving loading progress information
 */
const parseArrayBuffer = async (
    gltfLoader: GLTFLoader,
    buffer: ArrayBuffer,
    callBack?: () => void,
    onProgress?: (info: GLTFLoadingProgressInfo) => void,
    signal?: AbortSignal,
    onParsed?: GLTFOnParsedCallback
): Promise<void> => {
    throwIfAborted(signal);
    const {content, binaryChunk} = parseBuffer(buffer);
    if (content === null) {
        throw new Error('JSON content not found');
    }
    const gltfData: GLTF = JSON.parse(content);
    processImagesIfExist(gltfData, binaryChunk);
    if (gltfData.buffers?.length > 0 && binaryChunk) {
        gltfData.buffers[0].uri = binaryChunk;
    }
    await parseGLTF(gltfLoader, gltfData, callBack, onProgress, signal, onParsed);
}
/**
 * [KO] GLB 버퍼를 분석하여 JSON 문자열과 바이너리 청크를 추출합니다.
 * [EN] Parses the GLB buffer to extract the JSON string and binary chunk.
 *
 * @param buffer -
 * [KO] 파싱할 `ArrayBuffer`
 * [EN] `ArrayBuffer` to parse
 * @returns
 * [KO] 파싱된 JSON 문자열(`content`)과 Zero-Copy 바이너리 청크 뷰(`binaryChunk`)를 담은 객체
 * [EN] Object containing the parsed JSON string (`content`) and Zero-Copy binary chunk view (`binaryChunk`)
 */
const parseBuffer = (buffer: ArrayBuffer): { content: string | null, binaryChunk: Uint8Array<ArrayBuffer> | null } => {
    let content: string | null = null;
    let body: Uint8Array<ArrayBuffer> | null = null;
    const chunkView = new DataView(buffer, BINPACKER_HEADER_LENGTH);
    const byteLength = chunkView.byteLength;
    for (let chunkIndex = 0; chunkIndex < byteLength;) {
        const chunkLength = chunkView.getUint32(chunkIndex, true);
        chunkIndex += 4;
        const chunkType = chunkView.getUint32(chunkIndex, true);
        chunkIndex += 4;
        switch (chunkType) {
            case BINPACKER_CHUNK_TYPE_JSON:
                const contentArray = new Uint8Array(
                    buffer,
                    BINPACKER_HEADER_LENGTH + chunkIndex,
                    chunkLength
                );
                content = UTF8_TEXT_DECODER.decode(contentArray);
                break;
            case BINPACKER_CHUNK_TYPE_BINARY:
                const byteOffset = BINPACKER_HEADER_LENGTH + chunkIndex;
                body = new Uint8Array(buffer, byteOffset, chunkLength);
                break;
        }
        chunkIndex += chunkLength;
    }
    return {content, binaryChunk: body};
}
/**
 * [KO] GLTF 이미지 데이터를 처리하여 Object URL을 생성하고 동일한 버퍼에 대해 재사용합니다.
 * [EN] Processes GLTF image data to create Object URLs and reuses them for identical buffers.
 *
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param binaryChunk -
 * [KO] 추출된 바이너리 청크 뷰 또는 버퍼
 * [EN] Extracted binary chunk view or buffer
 */
const processImagesIfExist = (gltfData: GLTF, binaryChunk: Uint8Array<ArrayBuffer> | ArrayBuffer | null): void => {
    const {images, bufferViews} = gltfData;
    const bufferHashMap = new Map<string, string>();
    if (images && binaryChunk) {
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const {mimeType, bufferView: bufferViewGlTfId} = image;
            if (SUPPORTED_IMAGE_FORMATS.includes(mimeType) && bufferViewGlTfId !== undefined) {
                const sliceStartIndex = bufferViews[bufferViewGlTfId].byteOffset || 0;
                const byteLength = bufferViews[bufferViewGlTfId].byteLength;
                const bufferKey = `${sliceStartIndex}_${byteLength}_${mimeType}`;
                if (bufferHashMap.has(bufferKey)) {
                    image.uri = bufferHashMap.get(bufferKey);
                } else {
                    const imageBytes = binaryChunk instanceof Uint8Array
                        ? binaryChunk.subarray(sliceStartIndex, sliceStartIndex + byteLength)
                        : new Uint8Array(binaryChunk, sliceStartIndex, byteLength);
                    const blob = new Blob([imageBytes], {type: mimeType});
                    const objectURL = URL.createObjectURL(blob);
                    bufferHashMap.set(bufferKey, objectURL);
                    image.uri = objectURL;
                }
            }
        }
    }
};
export default parseFileGLB

