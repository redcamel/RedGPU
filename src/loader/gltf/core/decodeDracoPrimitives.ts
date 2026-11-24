import keepLog from "../../../utils/keepLog";
import {Accessor, GLTF, MeshPrimitive} from "../GLTF";

const DRACO_CDN_BASE = 'https://www.gstatic.com/draco/versioned/decoders/1.5.9/';

const DRACO_JS_CDN_URL = `${DRACO_CDN_BASE}draco_wasm_wrapper.js`;
const DRACO_WASM_CDN_URL = `${DRACO_CDN_BASE}draco_decoder.wasm`;

export interface DracoPrimitiveExtension {
    bufferView: number;
    attributes: Record<string, number>;
}

const COMPONENT_TYPE_META: Record<number, {
    dracoKey: string;
    bytesPerElement: number;
}> = Object.freeze({
    5120: {dracoKey: 'DT_INT8', bytesPerElement: 1},
    5121: {dracoKey: 'DT_UINT8', bytesPerElement: 1},
    5122: {dracoKey: 'DT_INT16', bytesPerElement: 2},
    5123: {dracoKey: 'DT_UINT16', bytesPerElement: 2},
    5125: {dracoKey: 'DT_UINT32', bytesPerElement: 4},
    5126: {dracoKey: 'DT_FLOAT32', bytesPerElement: 4},
});

const ACCESSOR_TYPE_NUM_COMPONENTS: Record<string, number> = Object.freeze({
    SCALAR: 1,
    VEC2: 2,
    VEC3: 3,
    VEC4: 4,
    MAT2: 4,
    MAT3: 9,
    MAT4: 16,
});

let dracoModuleInstance: any = null;
let dracoModulePromise: Promise<any> | null = null;

/**
 * [KO] glTF 데이터에서 `KHR_draco_mesh_compression` 확장 사용 여부를 확인합니다.
 * [EN] Checks whether the glTF data uses `KHR_draco_mesh_compression`.
 */
export const hasDracoCompression = (gltfData: GLTF): boolean => {
    const used = gltfData.extensionsUsed;
    if (used && used.includes('KHR_draco_mesh_compression')) {
        return true;
    }
    const meshes = gltfData.meshes;
    if (!meshes) return false;
    for (let i = 0; i < meshes.length; i++) {
        const primitives = meshes[i].primitives;
        if (!primitives) continue;
        for (let j = 0; j < primitives.length; j++) {
            if (getDracoExtension(primitives[j])) return true;
        }
    }
    return false;
};

/**
 * [KO] `primitive`에서 `KHR_draco_mesh_compression` 확장 객체를 추출합니다.
 * [EN] Extracts the `KHR_draco_mesh_compression` extension from a mesh primitive.
 */
export const getDracoExtension = (primitive: MeshPrimitive): DracoPrimitiveExtension | null => {
    const ext = primitive?.extensions?.KHR_draco_mesh_compression;
    return ext ? (ext as DracoPrimitiveExtension) : null;
};

/**
 * [KO] Google Draco 공식 CDN(`1.5.7`)에서 `DracoDecoderModule` WASM을 온디맨드 싱글톤으로 로드·초기화합니다.
 * [EN] Lazily loads and initializes the `DracoDecoderModule` WASM singleton from the official Google Draco CDN (`1.5.7`).
 */
export const initDracoDecoder = async (): Promise<any> => {
    if (dracoModuleInstance) return dracoModuleInstance;
    if (!dracoModulePromise) {
        dracoModulePromise = (async () => {
            let DracoDecoderModule = (window as any).DracoDecoderModule;

            if (typeof DracoDecoderModule !== 'function') {
                await new Promise<void>((resolve, reject) => {
                    const existingScript = document.querySelector(`script[src="${DRACO_JS_CDN_URL}"]`);
                    if (existingScript) {
                        existingScript.addEventListener('load', () => resolve());
                        existingScript.addEventListener('error', () =>
                            reject(new Error(`[RedGPU Draco] Failed to load Draco decoder script (Google Draco): ${DRACO_JS_CDN_URL}`))
                        );
                        return;
                    }

                    const script = document.createElement('script');
                    script.src = DRACO_JS_CDN_URL;
                    script.async = true;
                    script.onload = () => resolve();
                    script.onerror = () => {
                        script.remove();
                        reject(new Error(`[RedGPU Draco] Failed to load Draco decoder script (Google Draco): ${DRACO_JS_CDN_URL}`));
                    };
                    document.head.appendChild(script);
                });

                DracoDecoderModule = (window as any).DracoDecoderModule;
            }

            if (typeof DracoDecoderModule !== 'function') {
                throw new Error('[RedGPU Draco] DracoDecoderModule was not found after loading.');
            }

            const dracoModule = await DracoDecoderModule({
                locateFile: (path: string) => {
                    if (path.endsWith('.wasm')) {
                        return DRACO_WASM_CDN_URL;
                    }
                    return path;
                }
            });

            keepLog(`[RedGPU Draco] DracoDecoder initialized (Google Draco WASM: ${DRACO_WASM_CDN_URL})`);
            dracoModuleInstance = dracoModule;
            return dracoModule;
        })().catch((err) => {
            dracoModulePromise = null;
            throw err;
        });
    }
    return dracoModulePromise;
};

/**
 * [KO] 복원된 바이트 배열을 `bufferDataViews`, `gltfData.buffers`, `gltfData.bufferViews`에 등록하고 새 `bufferView` 인덱스를 반환합니다.
 * [EN] Registers a decoded byte array into `bufferDataViews`, `gltfData.buffers`, and `gltfData.bufferViews`, returning the new `bufferView` index.
 */
const registerDecodedBufferView = (
    gltfData: GLTF,
    bufferDataViews: DataView[],
    bytes: Uint8Array
): number => {
    if (!gltfData.buffers) gltfData.buffers = [];
    if (!gltfData.bufferViews) gltfData.bufferViews = [];

    const newBufferIndex = Math.max(bufferDataViews.length, gltfData.buffers.length);
    bufferDataViews[newBufferIndex] = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    gltfData.buffers[newBufferIndex] = {byteLength: bytes.byteLength};

    const newBufferViewIndex = gltfData.bufferViews.length;
    gltfData.bufferViews.push({
        buffer: newBufferIndex,
        byteOffset: 0,
        byteLength: bytes.byteLength,
    });
    return newBufferViewIndex;
};

/**
 * [KO] 전달받은 `DracoDecoderModule` 인스턴스를 사용해 모든 Draco 압축 `primitive`를 디코딩하고 표준 `bufferView`/`accessor`로 주입합니다.
 * [EN] Decodes all Draco-compressed primitives using the provided `DracoDecoderModule` and binds decoded data into standard `bufferView`/`accessor` entries.
 */
export const applyDecodedDracoPrimitives = (
    gltfData: GLTF,
    bufferDataViews: DataView[],
    draco: any
): number => {
    const meshes = gltfData.meshes;
    if (!meshes || meshes.length === 0) return 0;
    if (!gltfData.accessors) gltfData.accessors = [];
    if (!gltfData.bufferViews) gltfData.bufferViews = [];

    let decodedPrimitives = 0;
    const claimedAccessors = new Set<number>();

    const bindAccessorBuffer = (
        accessorIndex: number,
        bytes: Uint8Array,
        count: number,
        componentType?: number
    ): number => {
        const bufferViewIndex = registerDecodedBufferView(gltfData, bufferDataViews, bytes);
        let targetIndex = accessorIndex;
        let accessor: Accessor = gltfData.accessors![targetIndex];

        if (claimedAccessors.has(targetIndex)) {
            accessor = {...accessor};
            targetIndex = gltfData.accessors!.length;
            gltfData.accessors!.push(accessor);
        }

        accessor.bufferView = bufferViewIndex;
        accessor.byteOffset = 0;
        accessor.count = count;
        if (componentType !== undefined) {
            accessor.componentType = componentType;
        }
        claimedAccessors.add(targetIndex);
        return targetIndex;
    };

    for (let m = 0; m < meshes.length; m++) {
        const primitives = meshes[m].primitives;
        if (!primitives) continue;

        for (let p = 0; p < primitives.length; p++) {
            const primitive = primitives[p];
            const dracoExt = getDracoExtension(primitive);
            if (!dracoExt) continue;

            const compressedView = gltfData.bufferViews[dracoExt.bufferView];
            if (!compressedView) {
                throw new Error(`[RedGPU Draco] Compressed bufferView[${dracoExt.bufferView}] not found.`);
            }
            const sourceDataView = bufferDataViews[compressedView.buffer];
            if (!sourceDataView) {
                throw new Error(`[RedGPU Draco] Source buffer[${compressedView.buffer}] not found for bufferView[${dracoExt.bufferView}].`);
            }

            const byteOffset = sourceDataView.byteOffset + (compressedView.byteOffset ?? 0);
            const compressedBytes = new Int8Array(sourceDataView.buffer, byteOffset, compressedView.byteLength);

            const decoder = new draco.Decoder();
            const decoderBuffer = new draco.DecoderBuffer();
            let dracoGeometry: any = null;

            try {
                decoderBuffer.Init(compressedBytes, compressedBytes.byteLength);
                const geometryType = decoder.GetEncodedGeometryType(decoderBuffer);

                let status: any;
                if (geometryType === draco.TRIANGULAR_MESH) {
                    dracoGeometry = new draco.Mesh();
                    status = decoder.DecodeBufferToMesh(decoderBuffer, dracoGeometry);
                } else if (geometryType === draco.POINT_CLOUD) {
                    dracoGeometry = new draco.PointCloud();
                    status = decoder.DecodeBufferToPointCloud(decoderBuffer, dracoGeometry);
                } else {
                    throw new Error(`[RedGPU Draco] Unsupported Draco geometry type: ${geometryType}`);
                }

                if (!status.ok() || dracoGeometry.ptr === 0) {
                    throw new Error(`[RedGPU Draco] Failed to decode Draco geometry: ${status.error_msg()}`);
                }

                const numPoints: number = dracoGeometry.num_points();

                // Decode triangle indices for triangular meshes
                if (geometryType === draco.TRIANGULAR_MESH) {
                    const numFaces: number = dracoGeometry.num_faces();
                    const numIndices = numFaces * 3;
                    const useUint32 = numPoints > 65535;
                    const indexByteLength = numIndices * (useUint32 ? 4 : 2);
                    const indexPtr = draco._malloc(indexByteLength);
                    try {
                        if (useUint32) {
                            decoder.GetTrianglesUInt32Array(dracoGeometry, indexByteLength, indexPtr);
                        } else {
                            decoder.GetTrianglesUInt16Array(dracoGeometry, indexByteLength, indexPtr);
                        }
                        const indexBytes = new Uint8Array(draco.HEAPU8.buffer, indexPtr, indexByteLength).slice();
                        const indexComponentType = useUint32 ? 5125 : 5123;

                        if (primitive.indices !== undefined) {
                            primitive.indices = bindAccessorBuffer(
                                primitive.indices,
                                indexBytes,
                                numIndices,
                                indexComponentType
                            );
                        } else {
                            const newBufferViewIndex = registerDecodedBufferView(gltfData, bufferDataViews, indexBytes);
                            const newAccessorIndex = gltfData.accessors.length;
                            gltfData.accessors.push({
                                bufferView: newBufferViewIndex,
                                byteOffset: 0,
                                componentType: indexComponentType,
                                count: numIndices,
                                type: 'SCALAR',
                            });
                            primitive.indices = newAccessorIndex;
                        }
                    } finally {
                        draco._free(indexPtr);
                    }
                }

                // Decode each compressed vertex attribute
                const dracoAttributes = dracoExt.attributes;
                for (const attrName in dracoAttributes) {
                    const uniqueId = dracoAttributes[attrName];
                    const accessorIndex = primitive.attributes?.[attrName];
                    if (accessorIndex === undefined) continue;

                    const accessor = gltfData.accessors[accessorIndex];
                    if (!accessor) continue;

                    const dracoAttr = decoder.GetAttributeByUniqueId(dracoGeometry, uniqueId);
                    if (!dracoAttr || dracoAttr.ptr === 0) continue;

                    const numComponents =
                        ACCESSOR_TYPE_NUM_COMPONENTS[accessor.type] ?? dracoAttr.num_components();
                    const meta = COMPONENT_TYPE_META[accessor.componentType] ?? COMPONENT_TYPE_META[5126];
                    const dracoDataType = draco[meta.dracoKey];
                    const byteLength = numPoints * numComponents * meta.bytesPerElement;

                    const attrPtr = draco._malloc(byteLength);
                    try {
                        const ok = decoder.GetAttributeDataArrayForAllPoints(
                            dracoGeometry,
                            dracoAttr,
                            dracoDataType,
                            byteLength,
                            attrPtr
                        );
                        if (!ok) {
                            throw new Error(`[RedGPU Draco] Failed to extract attribute '${attrName}' (uniqueId=${uniqueId}).`);
                        }
                        const attrBytes = new Uint8Array(draco.HEAPU8.buffer, attrPtr, byteLength).slice();
                        primitive.attributes[attrName] = bindAccessorBuffer(
                            accessorIndex,
                            attrBytes,
                            numPoints
                        );
                    } finally {
                        draco._free(attrPtr);
                    }
                }

                decodedPrimitives++;
            } finally {
                if (dracoGeometry) draco.destroy(dracoGeometry);
                draco.destroy(decoderBuffer);
                draco.destroy(decoder);
            }
        }
    }

    return decodedPrimitives;
};

/**
 * [KO] `KHR_draco_mesh_compression`이 사용된 glTF의 모든 압축 프리미티브를 온디맨드 WASM으로 일괄 복원합니다.
 * [EN] Decodes all `KHR_draco_mesh_compression` primitives on demand using WASM.
 */
const decodeDracoPrimitives = async (gltfData: GLTF, bufferDataViews: DataView[]): Promise<number> => {
    if (!hasDracoCompression(gltfData)) return 0;
    const draco = await initDracoDecoder();
    return applyDecodedDracoPrimitives(gltfData, bufferDataViews, draco);
};

export default decodeDracoPrimitives;
