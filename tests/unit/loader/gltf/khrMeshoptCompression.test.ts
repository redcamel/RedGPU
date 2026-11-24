import {describe, expect, it} from 'vitest';
import {
    applyDecodedMeshoptBufferViews,
    getMeshoptExtension,
    hasMeshoptCompression,
    isMeshoptFallbackBuffer,
    MeshoptDecoderLike,
} from '../../../../src/loader/gltf/core/decodeMeshoptBufferViews';
import {GLTF} from '../../../../src/loader/gltf/GLTF';

describe('KHR_meshopt_compression / EXT_meshopt_compression', () => {
    it('detects Meshopt usage via extensionsUsed or bufferView extensions', () => {
        expect(hasMeshoptCompression({asset: {version: '2.0'}} as GLTF)).toBe(false);
        expect(
            hasMeshoptCompression({
                asset: {version: '2.0'},
                extensionsUsed: ['KHR_meshopt_compression'],
            } as GLTF)
        ).toBe(true);
        expect(
            hasMeshoptCompression({
                asset: {version: '2.0'},
                extensionsUsed: ['EXT_meshopt_compression'],
            } as GLTF)
        ).toBe(true);
        expect(
            hasMeshoptCompression({
                asset: {version: '2.0'},
                bufferViews: [
                    {
                        buffer: 1,
                        byteLength: 16,
                        extensions: {
                            KHR_meshopt_compression: {
                                buffer: 0,
                                byteLength: 8,
                                byteStride: 4,
                                count: 4,
                                mode: 'ATTRIBUTES',
                            },
                        },
                    },
                ],
            } as GLTF)
        ).toBe(true);
    });

    it('identifies KHR and EXT fallback placeholder buffers', () => {
        expect(
            isMeshoptFallbackBuffer({
                byteLength: 100,
                extensions: {KHR_meshopt_compression: {fallback: true}},
            })
        ).toBe(true);
        expect(
            isMeshoptFallbackBuffer({
                byteLength: 100,
                extensions: {EXT_meshopt_compression: {fallback: true}},
            })
        ).toBe(true);
        expect(isMeshoptFallbackBuffer({uri: 'model.bin', byteLength: 100})).toBe(false);
    });

    it('decodes KHR and EXT bufferViews and remaps buffer/byteOffset cleanly', () => {
        const rawSource = new Uint8Array([10, 20, 30, 40, 50, 60, 70, 80]);
        const bufferDataViews: DataView[] = [new DataView(rawSource.buffer)];

        const gltfData: GLTF = {
            asset: {version: '2.0'},
            extensionsUsed: ['KHR_meshopt_compression', 'EXT_meshopt_compression'],
            buffers: [
                {uri: 'compressed.bin', byteLength: 8},
                {byteLength: 32, extensions: {KHR_meshopt_compression: {fallback: true}}},
            ],
            bufferViews: [
                {
                    buffer: 0,
                    byteOffset: 0,
                    byteLength: 4,
                },
                {
                    buffer: 1,
                    byteOffset: 0,
                    byteLength: 12,
                    extensions: {
                        KHR_meshopt_compression: {
                            buffer: 0,
                            byteOffset: 0,
                            byteLength: 4,
                            byteStride: 4,
                            count: 3,
                            mode: 'ATTRIBUTES',
                        },
                    },
                },
                {
                    buffer: 1,
                    byteOffset: 12,
                    byteLength: 8,
                    extensions: {
                        EXT_meshopt_compression: {
                            buffer: 0,
                            byteOffset: 4,
                            byteLength: 4,
                            byteStride: 4,
                            count: 2,
                            mode: 'ATTRIBUTES',
                            filter: 'OCTAHEDRAL',
                        },
                    },
                },
            ],
        };

        const calls: Array<{count: number; size: number; source: number[]; mode: string; filter?: string}> = [];
        const mockDecoder: MeshoptDecoderLike = {
            ready: Promise.resolve(),
            decodeGltfBuffer: (target, count, size, source, mode, filter) => {
                calls.push({count, size, source: Array.from(source), mode, filter});
                for (let i = 0; i < target.length; i++) {
                    target[i] = source[i % source.length] + 1;
                }
            },
        };

        const decodedCount = applyDecodedMeshoptBufferViews(gltfData, bufferDataViews, mockDecoder);
        expect(decodedCount).toBe(2);
        expect(calls).toEqual([
            {count: 3, size: 4, source: [10, 20, 30, 40], mode: 'ATTRIBUTES', filter: 'NONE'},
            {count: 2, size: 4, source: [50, 60, 70, 80], mode: 'ATTRIBUTES', filter: 'OCTAHEDRAL'},
        ]);

        // Uncompressed bufferView[0] untouched
        expect(gltfData.bufferViews![0].buffer).toBe(0);
        expect(gltfData.bufferViews![0].byteOffset).toBe(0);

        // Decoded bufferView[1] (KHR)
        const bv1 = gltfData.bufferViews![1];
        expect(bv1.buffer).toBe(2);
        expect(bv1.byteOffset).toBe(0);
        expect(bv1.byteLength).toBe(12);
        expect(bufferDataViews[2].getUint8(0)).toBe(11);
        expect(bufferDataViews[2].getUint8(3)).toBe(41);

        // Decoded bufferView[2] (EXT)
        const bv2 = gltfData.bufferViews![2];
        expect(bv2.buffer).toBe(3);
        expect(bv2.byteOffset).toBe(0);
        expect(bv2.byteLength).toBe(8);
        expect(bufferDataViews[3].getUint8(0)).toBe(51);
        expect(bufferDataViews[3].getUint8(3)).toBe(81);
    });

    it('throws a clear error when source buffer is missing', () => {
        const gltfData: GLTF = {
            asset: {version: '2.0'},
            buffers: [],
            bufferViews: [
                {
                    buffer: 1,
                    byteLength: 8,
                    extensions: {
                        KHR_meshopt_compression: {
                            buffer: 99,
                            byteLength: 4,
                            byteStride: 4,
                            count: 2,
                            mode: 'ATTRIBUTES',
                        },
                    },
                },
            ],
        };

        expect(getMeshoptExtension(gltfData.bufferViews![0])?.buffer).toBe(99);
        const mockDecoder: MeshoptDecoderLike = {
            ready: Promise.resolve(),
            decodeGltfBuffer: () => {},
        };
        expect(() => applyDecodedMeshoptBufferViews(gltfData, [], mockDecoder)).toThrow(
            '[RedGPU Meshopt] Source buffer[99] not found for bufferView[0].'
        );
    });
});
