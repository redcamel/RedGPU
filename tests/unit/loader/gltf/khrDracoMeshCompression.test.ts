import {describe, expect, it} from 'vitest';
import {
    applyDecodedDracoPrimitives,
    getDracoExtension,
    hasDracoCompression,
} from '../../../../src/loader/gltf/core/decodeDracoPrimitives';
import {GLTF} from '../../../../src/loader/gltf/GLTF';

const createMockDraco = (options?: { decodeFail?: boolean }) => {
    const heapBuffer = new ArrayBuffer(1024);
    const heapU8 = new Uint8Array(heapBuffer);
    let nextPtr = 16;
    const allocs: number[] = [];
    const frees: number[] = [];
    const destroyed: string[] = [];

    class MockDecoderBuffer {
        kind = 'DecoderBuffer';

        Init() {
        }
    }

    class MockMesh {
        kind = 'Mesh';
        ptr = 1;

        num_points() {
            return 3;
        }

        num_faces() {
            return 1;
        }
    }

    class MockPointCloud {
        kind = 'PointCloud';
        ptr = 2;

        num_points() {
            return 3;
        }
    }

    class MockDecoder {
        kind = 'Decoder';

        GetEncodedGeometryType() {
            return 1;
        }

        DecodeBufferToMesh() {
            return {
                ok: () => !options?.decodeFail,
                error_msg: () => 'mock decode error',
            };
        }

        GetTrianglesUInt16Array(_geom: any, _byteLength: number, ptr: number) {
            const view = new Uint16Array(heapBuffer, ptr, 3);
            view.set([0, 1, 2]);
        }

        GetTrianglesUInt32Array(_geom: any, _byteLength: number, ptr: number) {
            const view = new Uint32Array(heapBuffer, ptr, 3);
            view.set([0, 1, 2]);
        }

        GetAttributeByUniqueId(_geom: any, uniqueId: number) {
            return {ptr: 100 + uniqueId, uniqueId, num_components: () => (uniqueId === 0 ? 3 : 4)};
        }

        GetAttributeDataArrayForAllPoints(_geom: any, attr: any, dataType: number, _byteLength: number, ptr: number) {
            if (dataType === 9) {
                // DT_FLOAT32 (POSITION: 3 points * 3 floats)
                const f32 = new Float32Array(heapBuffer, ptr, 9);
                f32.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                return true;
            }
            if (dataType === 2) {
                // DT_UINT8 (JOINTS_0: 3 points * 4 bytes)
                const u8 = new Uint8Array(heapBuffer, ptr, 12);
                u8.set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
                return true;
            }
            return attr.uniqueId >= 0;
        }
    }

    return {
        TRIANGULAR_MESH: 1,
        POINT_CLOUD: 2,
        DT_INT8: 1,
        DT_UINT8: 2,
        DT_INT16: 3,
        DT_UINT16: 4,
        DT_UINT32: 6,
        DT_FLOAT32: 9,
        HEAPU8: heapU8,
        Decoder: MockDecoder,
        DecoderBuffer: MockDecoderBuffer,
        Mesh: MockMesh,
        PointCloud: MockPointCloud,
        _malloc(size: number) {
            const ptr = nextPtr;
            nextPtr += Math.ceil(size / 8) * 8;
            allocs.push(ptr);
            return ptr;
        },
        _free(ptr: number) {
            frees.push(ptr);
        },
        destroy(obj: any) {
            destroyed.push(obj.kind);
        },
        _stats: {allocs, frees, destroyed},
    };
};

describe('KHR_draco_mesh_compression', () => {
    it('detects Draco usage via extensionsUsed or mesh primitives', () => {
        expect(hasDracoCompression({asset: {version: '2.0'}} as GLTF)).toBe(false);
        expect(
            hasDracoCompression({
                asset: {version: '2.0'},
                extensionsUsed: ['KHR_draco_mesh_compression'],
            } as GLTF)
        ).toBe(true);
        expect(
            hasDracoCompression({
                asset: {version: '2.0'},
                meshes: [
                    {
                        primitives: [
                            {
                                attributes: {POSITION: 0},
                                extensions: {
                                    KHR_draco_mesh_compression: {
                                        bufferView: 0,
                                        attributes: {POSITION: 0},
                                    },
                                },
                            },
                        ],
                    },
                ],
            } as GLTF)
        ).toBe(true);
    });

    it('decodes triangular mesh indices and attributes, binds bufferViews, and frees all WASM memory', () => {
        const compressed = new Uint8Array([1, 2, 3, 4]);
        const bufferDataViews: DataView[] = [new DataView(compressed.buffer)];
        const gltfData: GLTF = {
            asset: {version: '2.0'},
            extensionsUsed: ['KHR_draco_mesh_compression'],
            buffers: [{uri: 'mesh.bin', byteLength: 4}],
            bufferViews: [{buffer: 0, byteOffset: 0, byteLength: 4}],
            accessors: [
                {componentType: 5123, count: 3, type: 'SCALAR'},
                {componentType: 5126, count: 3, type: 'VEC3'},
                {componentType: 5121, count: 3, type: 'VEC4'},
            ],
            meshes: [
                {
                    primitives: [
                        {
                            indices: 0,
                            attributes: {POSITION: 1, JOINTS_0: 2},
                            extensions: {
                                KHR_draco_mesh_compression: {
                                    bufferView: 0,
                                    attributes: {POSITION: 0, JOINTS_0: 1},
                                },
                            },
                        },
                    ],
                },
            ],
        };

        const mockDraco = createMockDraco();
        const decoded = applyDecodedDracoPrimitives(gltfData, bufferDataViews, mockDraco);
        expect(decoded).toBe(1);

        // Indices bound cleanly
        const idxAcc = gltfData.accessors![0];
        expect(idxAcc.bufferView).toBeDefined();
        const idxView = gltfData.bufferViews![idxAcc.bufferView!];
        const idxData = bufferDataViews[idxView.buffer];
        expect(idxData.getUint16(0, true)).toBe(0);
        expect(idxData.getUint16(2, true)).toBe(1);
        expect(idxData.getUint16(4, true)).toBe(2);

        // POSITION bound cleanly
        const posAcc = gltfData.accessors![1];
        const posView = gltfData.bufferViews![posAcc.bufferView!];
        const posData = bufferDataViews[posView.buffer];
        expect(posData.getFloat32(0, true)).toBe(1);
        expect(posData.getFloat32(32, true)).toBe(9);

        // JOINTS_0 (UINT8) bound cleanly
        const jntAcc = gltfData.accessors![2];
        const jntView = gltfData.bufferViews![jntAcc.bufferView!];
        const jntData = bufferDataViews[jntView.buffer];
        expect(jntData.getUint8(0)).toBe(0);
        expect(jntData.getUint8(11)).toBe(11);

        // Zero WASM memory leaks
        expect(mockDraco._stats.allocs.length).toBe(3);
        expect(mockDraco._stats.frees).toEqual(mockDraco._stats.allocs);
        expect(mockDraco._stats.destroyed).toEqual(['Mesh', 'DecoderBuffer', 'Decoder']);
    });

    it('always destroys WASM decoder objects when decoding fails and throws clear error', () => {
        const compressed = new Uint8Array([9, 9, 9, 9]);
        const bufferDataViews: DataView[] = [new DataView(compressed.buffer)];
        const gltfData: GLTF = {
            asset: {version: '2.0'},
            buffers: [{uri: 'mesh.bin', byteLength: 4}],
            bufferViews: [{buffer: 0, byteOffset: 0, byteLength: 4}],
            accessors: [{componentType: 5126, count: 3, type: 'VEC3'}],
            meshes: [
                {
                    primitives: [
                        {
                            attributes: {POSITION: 0},
                            extensions: {
                                KHR_draco_mesh_compression: {
                                    bufferView: 0,
                                    attributes: {POSITION: 0},
                                },
                            },
                        },
                    ],
                },
            ],
        };

        expect(getDracoExtension(gltfData.meshes![0].primitives[0])?.bufferView).toBe(0);
        const mockDraco = createMockDraco({decodeFail: true});
        expect(() => applyDecodedDracoPrimitives(gltfData, bufferDataViews, mockDraco)).toThrow(
            '[RedGPU Draco] Failed to decode Draco geometry: mock decode error'
        );
        expect(mockDraco._stats.destroyed).toEqual(['Mesh', 'DecoderBuffer', 'Decoder']);
    });
});
