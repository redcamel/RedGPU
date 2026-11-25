import keepLog from "../../../utils/keepLog";
import {Buffer, BufferView, GLTF} from "../GLTF";

const MESHOPT_DECODER_CDN_URL = 'https://cdn.jsdelivr.net/npm/meshoptimizer/meshopt_decoder.module.js';

export type MeshoptCompressionMode = 'ATTRIBUTES' | 'TRIANGLES' | 'INDICES';
export type MeshoptCompressionFilter = 'NONE' | 'OCTAHEDRAL' | 'QUATERNION' | 'EXPONENTIAL' | 'COLOR';

export interface MeshoptBufferViewExtension {
    buffer: number;
    byteOffset?: number;
    byteLength: number;
    byteStride: number;
    count: number;
    mode: MeshoptCompressionMode;
    filter?: MeshoptCompressionFilter;
}

export interface MeshoptDecoderLike {
    ready: Promise<void>;
    decodeGltfBuffer: (
        target: Uint8Array,
        count: number,
        size: number,
        source: Uint8Array,
        mode: MeshoptCompressionMode,
        filter?: MeshoptCompressionFilter
    ) => void;
}

let meshoptDecoderInstance: MeshoptDecoderLike | null = null;
let meshoptDecoderPromise: Promise<MeshoptDecoderLike> | null = null;

/**
 * [KO] glTF 데이터에서 `KHR_meshopt_compression` 또는 `EXT_meshopt_compression` 확장 사용 여부를 확인합니다.
 * [EN] Checks whether the glTF data uses `KHR_meshopt_compression` or `EXT_meshopt_compression`.
 */
export const hasMeshoptCompression = (gltfData: GLTF): boolean => {
    const used = gltfData.extensionsUsed;
    if (used && (used.includes('KHR_meshopt_compression') || used.includes('EXT_meshopt_compression'))) {
        return true;
    }
    const bufferViews = gltfData.bufferViews;
    if (!bufferViews) return false;
    for (let i = 0; i < bufferViews.length; i++) {
        if (getMeshoptExtension(bufferViews[i])) return true;
    }
    return false;
};

/**
 * [KO] 버퍼가 Meshopt 압축용 `fallback: true` 더미 버퍼인지 확인합니다.
 * [EN] Checks whether a buffer is a `fallback: true` placeholder buffer for Meshopt compression.
 */
export const isMeshoptFallbackBuffer = (buffer: Buffer): boolean => {
    const ext = buffer.extensions;
    if (!ext) return false;
    return Boolean(ext.KHR_meshopt_compression?.fallback || ext.EXT_meshopt_compression?.fallback);
};

/**
 * [KO] `bufferView`에서 `KHR_meshopt_compression` 또는 `EXT_meshopt_compression` 확장 객체를 추출합니다.
 * [EN] Extracts the `KHR_meshopt_compression` or `EXT_meshopt_compression` extension from a `bufferView`.
 */
export const getMeshoptExtension = (bufferView: BufferView): MeshoptBufferViewExtension | null => {
    const ext = bufferView?.extensions;
    if (!ext) return null;
    const meshoptExt = ext.KHR_meshopt_compression || ext.EXT_meshopt_compression;
    return meshoptExt ? (meshoptExt as MeshoptBufferViewExtension) : null;
};

/**
 * [KO] 공식 `meshoptimizer` CDN에서 `MeshoptDecoder` WASM 모듈을 온디맨드 싱글톤으로 로드·초기화합니다.
 * [EN] Lazily loads and initializes the `MeshoptDecoder` WASM singleton from the official `meshoptimizer` CDN.
 */
const initMeshoptDecoder = async (): Promise<MeshoptDecoderLike> => {
    if (meshoptDecoderInstance) return meshoptDecoderInstance;
    if (!meshoptDecoderPromise) {
        meshoptDecoderPromise = (async () => {
            const url = MESHOPT_DECODER_CDN_URL;
            let imported: any;
            try {
                imported = await import(/* @vite-ignore */ url);
            } catch (err) {
                throw new Error(
                    `[RedGPU Meshopt] Failed to load MeshoptDecoder module (meshoptimizer): ${url} (${err instanceof Error ? err.message : String(err)})`
                );
            }
            const decoder: MeshoptDecoderLike | undefined = imported?.MeshoptDecoder;
            if (!decoder || typeof decoder.decodeGltfBuffer !== 'function') {
                throw new Error('[RedGPU Meshopt] MeshoptDecoder export was not found in loaded module.');
            }
            await decoder.ready;
            keepLog(`[RedGPU Meshopt] MeshoptDecoder initialized (meshoptimizer WASM: ${url})`);
            meshoptDecoderInstance = decoder;
            return decoder;
        })().catch((err) => {
            meshoptDecoderPromise = null;
            throw err;
        });
    }
    return meshoptDecoderPromise;
};

/**
 * [KO] 전달받은 `MeshoptDecoder` 인스턴스를 사용해 압축된 모든 `bufferView`를 복원하고 `bufferDataViews`에 매핑합니다.
 * [EN] Decodes all compressed `bufferView` entries using the provided `MeshoptDecoder` instance and maps them into `bufferDataViews`.
 */
export const applyDecodedMeshoptBufferViews = (
    gltfData: GLTF,
    bufferDataViews: DataView[],
    decoder: MeshoptDecoderLike
): number => {
    const bufferViews = gltfData.bufferViews;
    if (!bufferViews || bufferViews.length === 0) return 0;
    if (!gltfData.buffers) gltfData.buffers = [];

    let decodedCount = 0;

    for (let i = 0; i < bufferViews.length; i++) {
        const bufferView = bufferViews[i];
        const ext = getMeshoptExtension(bufferView);
        if (!ext) continue;

        const sourceDataView = bufferDataViews[ext.buffer];
        if (!sourceDataView) {
            throw new Error(
                `[RedGPU Meshopt] Source buffer[${ext.buffer}] not found for bufferView[${i}].`
            );
        }

        const sourceByteOffset = sourceDataView.byteOffset + (ext.byteOffset ?? 0);
        const source = new Uint8Array(sourceDataView.buffer, sourceByteOffset, ext.byteLength);
        const target = new Uint8Array(ext.count * ext.byteStride);
        const filter: MeshoptCompressionFilter = ext.filter ?? 'NONE';

        decoder.decodeGltfBuffer(target, ext.count, ext.byteStride, source, ext.mode, filter);

        const newBufferIndex = Math.max(bufferDataViews.length, gltfData.buffers.length);
        bufferDataViews[newBufferIndex] = new DataView(target.buffer, target.byteOffset, target.byteLength);
        gltfData.buffers[newBufferIndex] = {byteLength: target.byteLength};

        bufferView.buffer = newBufferIndex;
        bufferView.byteOffset = 0;
        bufferView.byteLength = target.byteLength;
        decodedCount++;
    }

    return decodedCount;
};

/**
 * [KO] `KHR_meshopt_compression` / `EXT_meshopt_compression`이 사용된 glTF의 `bufferView`를 온디맨드 WASM으로 일괄 복원합니다.
 * [EN] Decodes `KHR_meshopt_compression` / `EXT_meshopt_compression` `bufferView` entries on demand using WASM.
 *
 * @param gltfData -
 * [KO] 파싱된 glTF 데이터 객체
 * [EN] Parsed glTF data object
 * @param bufferDataViews -
 * [KO] 로드된 버퍼 `DataView` 배열
 * [EN] Loaded buffer `DataView` array
 * @returns
 * [KO] 복원된 `bufferView` 개수
 * [EN] Number of decoded `bufferView` entries
 * @category GLTF
 */
const decodeMeshoptBufferViews = async (gltfData: GLTF, bufferDataViews: DataView[]): Promise<number> => {
    if (!hasMeshoptCompression(gltfData)) return 0;
    const decoder = await initMeshoptDecoder();
    return applyDecodedMeshoptBufferViews(gltfData, bufferDataViews, decoder);
};

export default decodeMeshoptBufferViews;
