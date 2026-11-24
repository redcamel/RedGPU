import {describe, expect, it} from 'vitest';
import AccessorInfo_GLTF from '../../../../src/loader/gltf/cls/AccessorInfo_GLTF';
import parseAttributeInfo_GLTF from '../../../../src/loader/gltf/parsers/parseAttributeInfo_GLTF';
import parseSparse_GLTF from '../../../../src/loader/gltf/parsers/parseSparse_GLTF';

describe('glTF 2.0 Sparse Accessor Spec Compliance (#7-3)', () => {
    it('supports zero-initialized sparse POSITION accessor when bufferView is omitted', () => {
        // 4 vertices initialized to 0, sparse updates indices 1 and 3
        const indicesBuf = new Uint16Array([1, 3]);
        const valuesBuf = new Float32Array([10, 20, 30, 40, 50, 60]);
        const gltfData: any = {
            buffers: [{byteLength: indicesBuf.byteLength}, {byteLength: valuesBuf.byteLength}],
            bufferViews: [
                {buffer: 0, byteOffset: 0, byteLength: indicesBuf.byteLength},
                {buffer: 1, byteOffset: 0, byteLength: valuesBuf.byteLength},
            ],
            accessors: [{
                // bufferView intentionally omitted (glTF 2.0 zero-initialized sparse)
                componentType: 5126,
                count: 4,
                type: 'VEC3',
                sparse: {
                    count: 2,
                    indices: {bufferView: 0, byteOffset: 0, componentType: 5123},
                    values: {bufferView: 1, byteOffset: 0},
                },
            }],
        };
        const mockLoader: any = {
            parsingResult: {
                uris: {
                    buffers: [new DataView(indicesBuf.buffer), new DataView(valuesBuf.buffer)],
                },
            },
        };

        const accessorInfo = new AccessorInfo_GLTF(mockLoader, gltfData, 0);
        const parsed = parseAttributeInfo_GLTF('POSITION', accessorInfo)!;
        expect(parsed).toBeInstanceOf(Float32Array);
        expect(parsed.length).toBe(12);
        parseSparse_GLTF(mockLoader, 'POSITION', accessorInfo.accessor, gltfData, parsed);

        expect(Array.from(parsed)).toEqual([
            0, 0, 0,
            10, 20, 30,
            0, 0, 0,
            40, 50, 60,
        ]);
    });

    it('supports Uint32Array (5125) sparse indices and non-zero sparse.values.byteOffset', () => {
        // Base 3 vertices, targetAccessor.byteOffset = 12 (should NOT be used for sparse values!)
        // sparse.values.byteOffset = 12 (skips first 3 floats of garbage)
        const baseBuf = new Float32Array([99, 99, 99, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const indicesBuf = new Uint32Array([0, 2]);
        const valuesBuf = new Float32Array([-1, -1, -1, 100, 200, 300, 400, 500, 600]);
        const gltfData: any = {
            buffers: [
                {byteLength: baseBuf.byteLength},
                {byteLength: indicesBuf.byteLength},
                {byteLength: valuesBuf.byteLength},
            ],
            bufferViews: [
                {buffer: 0, byteOffset: 0, byteLength: baseBuf.byteLength},
                {buffer: 1, byteOffset: 0, byteLength: indicesBuf.byteLength},
                {buffer: 2, byteOffset: 0, byteLength: valuesBuf.byteLength},
            ],
            accessors: [{
                bufferView: 0,
                byteOffset: 12,
                componentType: 5126,
                count: 3,
                type: 'VEC3',
                sparse: {
                    count: 2,
                    indices: {bufferView: 1, byteOffset: 0, componentType: 5125},
                    values: {bufferView: 2, byteOffset: 12},
                },
            }],
        };
        const mockLoader: any = {
            parsingResult: {
                uris: {
                    buffers: [
                        new DataView(baseBuf.buffer),
                        new DataView(indicesBuf.buffer),
                        new DataView(valuesBuf.buffer),
                    ],
                },
            },
        };

        const accessorInfo = new AccessorInfo_GLTF(mockLoader, gltfData, 0);
        const parsed = parseAttributeInfo_GLTF('POSITION', accessorInfo)!;
        parseSparse_GLTF(mockLoader, 'POSITION', accessorInfo.accessor, gltfData, parsed);

        expect(Array.from(parsed)).toEqual([
            100, 200, 300,
            4, 5, 6,
            400, 500, 600,
        ]);
    });

    it('supports non-POSITION sparse attributes (normalized INT16 NORMAL and VEC3 COLOR_0 RGBA expansion)', () => {
        // Normalized INT16 NORMAL sparse (zero-initialized)
        const idxBuf = new Uint8Array([1]);
        const normValBuf = new Int16Array([32767, 0, -32768]);
        const colorValBuf = new Uint8Array([255, 0, 255]);
        const gltfData: any = {
            buffers: [
                {byteLength: idxBuf.byteLength},
                {byteLength: normValBuf.byteLength},
                {byteLength: colorValBuf.byteLength},
            ],
            bufferViews: [
                {buffer: 0, byteOffset: 0, byteLength: idxBuf.byteLength},
                {buffer: 1, byteOffset: 0, byteLength: normValBuf.byteLength},
                {buffer: 2, byteOffset: 0, byteLength: colorValBuf.byteLength},
            ],
            accessors: [
                {
                    componentType: 5122, // INT16
                    normalized: true,
                    count: 2,
                    type: 'VEC3',
                    sparse: {
                        count: 1,
                        indices: {bufferView: 0, byteOffset: 0, componentType: 5121},
                        values: {bufferView: 1, byteOffset: 0},
                    },
                },
                {
                    componentType: 5121, // UINT8
                    normalized: true,
                    count: 2,
                    type: 'VEC3',
                    sparse: {
                        count: 1,
                        indices: {bufferView: 0, byteOffset: 0, componentType: 5121},
                        values: {bufferView: 2, byteOffset: 0},
                    },
                },
            ],
        };
        const mockLoader: any = {
            parsingResult: {
                uris: {
                    buffers: [
                        new DataView(idxBuf.buffer),
                        new DataView(normValBuf.buffer),
                        new DataView(colorValBuf.buffer),
                    ],
                },
            },
        };

        const normInfo = new AccessorInfo_GLTF(mockLoader, gltfData, 0);
        const normals = parseAttributeInfo_GLTF('NORMAL', normInfo)!;
        parseSparse_GLTF(mockLoader, 'NORMAL', normInfo.accessor, gltfData, normals);
        expect(Array.from(normals)).toEqual([0, 0, 0, 1, 0, -1]);

        const colorInfo = new AccessorInfo_GLTF(mockLoader, gltfData, 1);
        const colors = parseAttributeInfo_GLTF('COLOR_0', colorInfo)!;
        parseSparse_GLTF(mockLoader, 'COLOR_0', colorInfo.accessor, gltfData, colors);
        expect(Array.from(colors)).toEqual([0, 0, 0, 1, 1, 0, 1, 1]);
    });
});
