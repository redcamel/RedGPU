import keepLog from "../../../../utils/keepLog";
import getAbsoluteURL from "../../../../utils/file/getAbsoluteURL";
import getArrayBufferFromSrc from "../../core/getArrayBufferFromSrc";
import {GLTF} from "../../GLTF";
import GLTFLoader, {GLTFLoadingProgressInfo} from "../../GLTFLoader";
import parseGLTF from "../parseGLTF";

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
/**
 * [KO] GLB 파일을 로드 및 파싱하고 완료 시 콜백 함수를 호출합니다.
 * [EN] Loads and parses a GLB file and invokes the callback function upon completion.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param callBack -
 * [KO] 파싱 완료 후 호출될 콜백 함수
 * [EN] Callback function invoked after parsing is complete
 * @param onProgress -
 * [KO] 로딩 진행 상태를 전달받는 콜백 함수
 * [EN] Optional callback function receiving loading progress information
 * @returns
 * [KO] 파싱이 완료되면 해결되는 `Promise<void>`
 * [EN] `Promise<void>` that resolves when parsing is complete
 * @category Loader
 */
const parseFileGLB = async (gltfLoader: GLTFLoader, callBack, onProgress?: (info: GLTFLoadingProgressInfo) => void) => {
    console.log('GLB Model parsing has start.');
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
        keepLog('GLB Model parsing has cache', loadFilePath);
        progress()
        await parseArrayBuffer(gltfLoader, cache.get(loadFilePath), callBack, onProgress);
        return;
    }
    if (pending.has(loadFilePath)) {
        await pending.get(loadFilePath);
        progress()
        await parseArrayBuffer(gltfLoader, cache.get(loadFilePath), callBack, onProgress);
        return;
    }
    const promise = new Promise<ArrayBuffer>((resolve, reject) => {

        getArrayBufferFromSrc(
            loadFilePath,
            (buffer) => {
                cache.set(loadFilePath, buffer);
                keepLog('GLB Model parsing set cache', loadFilePath);
                pending.delete(loadFilePath);
                resolve(buffer);
            },
            (error) => {
                keepLog('GLB Model parsing error', error);
                pending.delete(loadFilePath);
                reject(error);
            },
            (info) => {
                gltfLoader.loadingProgressInfo.model = info
                onProgress?.(gltfLoader.loadingProgressInfo);
            }
        );
    });
    pending.set(loadFilePath, promise);

    try {
        const buffer = await promise;
        await parseArrayBuffer(gltfLoader, buffer, callBack, onProgress);
    } catch (error) {
        console.log(error);
    }
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
const parseArrayBuffer = async (gltfLoader: GLTFLoader, buffer: ArrayBuffer, callBack, onProgress) => {
    const {content, binaryChunk} = parseBuffer(buffer);
    if (content === null) {
        throw new Error('JSON content not found');
    }
    const gltfData: GLTF = JSON.parse(content);
    processImagesIfExist(gltfData, binaryChunk);
    gltfData.buffers[0].uri = binaryChunk;
    gltfLoader.gltfData = gltfData
    parseGLTF(gltfLoader, gltfData, callBack, onProgress)
}
/**
 * [KO] GLB 버퍼를 분석하여 JSON 문자열과 바이너리 청크를 추출합니다.
 * [EN] Parses the GLB buffer to extract the JSON string and binary chunk.
 *
 * @param buffer -
 * [KO] 파싱할 `ArrayBuffer`
 * [EN] `ArrayBuffer` to parse
 * @returns
 * [KO] 파싱된 JSON 문자열(`content`)과 바이너리 청크(`binaryChunk`)를 담은 객체
 * [EN] Object containing the parsed JSON string (`content`) and binary chunk (`binaryChunk`)
 */
const parseBuffer = (buffer: ArrayBuffer): { content: string, binaryChunk: any } => {
    let content = null;
    let body = null;
    const chunkView = new DataView(buffer, BINPACKER_HEADER_LENGTH);
    const byteLength = chunkView.byteLength;
    let num = 0
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
                content = convertUint8ArrayToString(contentArray);
                num++
                break;
            case BINPACKER_CHUNK_TYPE_BINARY:
                const byteOffset = BINPACKER_HEADER_LENGTH + chunkIndex;
                body = buffer.slice(byteOffset, byteOffset + chunkLength);
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
 * [KO] 추출된 바이너리 청크 데이터
 * [EN] Extracted binary chunk data
 * @returns
 * [KO] 버퍼 키와 생성된 Object URL의 매핑(`Map<string, string>`)
 * [EN] Mapping of buffer keys to created Object URLs (`Map<string, string>`)
 */
const processImagesIfExist = (gltfData: GLTF, binaryChunk: any) => {
    const {images, bufferViews} = gltfData;
    const supportedFormats = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    const bufferHashMap = new Map<string, string>();
    if (images) {
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const {mimeType, bufferView: bufferViewGlTfId} = image;
            if (supportedFormats.includes(mimeType) && bufferViewGlTfId !== undefined) {
                const sliceStartIndex = bufferViews[bufferViewGlTfId].byteOffset || 0;
                const byteLength = bufferViews[bufferViewGlTfId].byteLength;
                const bufferKey = `${sliceStartIndex}_${byteLength}_${mimeType}`;
                if (bufferHashMap.has(bufferKey)) {
                    image.uri = bufferHashMap.get(bufferKey);
                } else {
                    const slicedChunk = binaryChunk.slice(sliceStartIndex, sliceStartIndex + byteLength);
                    const blob = new Blob([new Uint8Array(slicedChunk)], {type: mimeType});
                    const objectURL = URL.createObjectURL(blob);
                    bufferHashMap.set(bufferKey, objectURL);
                    image.uri = objectURL;
                }
            }
        }
    }
    return bufferHashMap;
};
export default parseFileGLB
/**
 * [KO] `Uint8Array` 데이터를 문자열로 변환합니다.
 * [EN] Converts `Uint8Array` data to a string.
 *
 * @param array -
 * [KO] 변환할 `Uint8Array` 객체
 * [EN] `Uint8Array` object to convert
 * @returns
 * [KO] 변환된 문자열
 * [EN] Converted string
 */
const convertUint8ArrayToString = (array: Uint8Array): string => {
    let str = '';
    for (let item of array) {
        str += String.fromCharCode(item);
    }
    return str;
};

