import getArrayBufferFromSrc from "../../core/getArrayBufferFromSrc";
import {GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";
import parseGLTF from "../parseGLTF";

/**
 * Length of the header for the binpacker data format.
 * @type {number}
 */
const BINPACKER_HEADER_LENGTH = 12;
/**
 * The chunk type for JSON data in the binpacker.
 *
 * @constant {number}
 * @name BINPACKER_CHUNK_TYPE_JSON
 * @description This constant represents the chunk type for JSON data in the binpacker.
 *              It has a hexadecimal value of 0x4e4f534a.
 */
const BINPACKER_CHUNK_TYPE_JSON = 0x4e4f534a;
/**
 * The chunk type constant for binary chunks in BINPACKER.
 *
 * @constant {number}
 */
const BINPACKER_CHUNK_TYPE_BINARY = 0x004e4942;
/**
 * Parses a GLB file using the provided GLTFLoader and invokes the callback with the parsed data.
 *
 * @param {GLTFLoader} gltfLoader - The GLTFLoader used to load the GLB file.
 * @param {function} callBack - The callback function to be invoked with the parsed GLTF data.
 *
 * @returns {Promise<void>} - A promise that resolves when the GLB file has been parsed.
 */
const parseFileGLB = async (gltfLoader: GLTFLoader, callBack) => {
    console.log('GLB Model parsing has start.');
    const loadFilePath = gltfLoader.filePath + gltfLoader.fileName;
    await getArrayBufferFromSrc(
        loadFilePath,
        async (buffer) => {
            const {content, binaryChunk} = parseBuffer(buffer);
            if (content === null) {
                throw new Error('JSON content not found');
            }
            const gltfData: GLTF = JSON.parse(content);
            processImagesIfExist(gltfData, binaryChunk);
            gltfData.buffers[0].uri = binaryChunk;
            gltfLoader.gltfData = gltfData
            parseGLTF(gltfLoader, gltfData, callBack)
        },
        (error) => {
            console.log(error);
        }
    );
}
/**
 * Parses the given buffer and extracts content and binary chunks.
 *
 * @param {ArrayBuffer} buffer - The buffer to parse.
 * @returns {Object} - An object containing the parsed content and binary chunk.
 * - content: The parsed content as a string.
 * - binaryChunk: The extracted binary chunk.
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
 * Process images if they exist in the GLTF data and convert them to object URLs.
 *
 * @param {object} gltfData - The GLTF data object.
 * @param {object} binaryChunk - The binary chunk data.
 * @returns {void}
 */
const processImagesIfExist = (gltfData: GLTF, binaryChunk: any) => {
    const {images, bufferViews} = gltfData
    const supportedFormats = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (images) {
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const {mimeType, bufferView: bufferViewGlTfId} = image
            if (supportedFormats.includes(mimeType)) {
                const sliceStartIndex = bufferViews[bufferViewGlTfId].byteOffset || 0;
                const slicedChunk = binaryChunk.slice(sliceStartIndex, sliceStartIndex + bufferViews[bufferViewGlTfId].byteLength);
                const blob = new Blob([new Uint8Array(slicedChunk)], {type: mimeType});
                image.uri = URL.createObjectURL(blob);
            }
        }
    }
}
export default parseFileGLB
/**
 * Convert a Uint8Array to a string.
 *
 * @param {Uint8Array} array - The Uint8Array to convert.
 * @returns {string} - The converted string.
 */
const convertUint8ArrayToString = (array: Uint8Array): string => {
    let str = '';
    for (let item of array) {
        str += String.fromCharCode(item);
    }
    return str;
};
