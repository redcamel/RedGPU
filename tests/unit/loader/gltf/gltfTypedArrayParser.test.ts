import {describe, expect, it} from 'vitest';
import AccessorInfo_GLTF from '../../../../src/loader/gltf/cls/AccessorInfo_GLTF';
import parseAttributeInfo_GLTF from '../../../../src/loader/gltf/parsers/parseAttributeInfo_GLTF';
import parseIndicesInfo_GLTF from '../../../../src/loader/gltf/parsers/parseIndicesInfo_GLTF';
import parseInterleaveData_GLTF, {
    packSkinJoints_GLTF,
    packSkinWeights_GLTF
} from '../../../../src/loader/gltf/parsers/parseInterleaveData_GLTF';
import calculateNormals from '../../../../src/math/calculateNormals';

function createAccessorInfo(
    buffer: ArrayBuffer,
    accessor: {
        type: string;
        componentType: number;
        count: number;
        byteOffset?: number;
        normalized?: boolean;
    },
    bufferView: {
        byteOffset?: number;
        byteStride?: number;
        byteLength?: number;
    } = {}
): AccessorInfo_GLTF {
    const gltfData: any = {
        buffers: [{byteLength: buffer.byteLength}],
        bufferViews: [{
            buffer: 0,
            byteOffset: bufferView.byteOffset ?? 0,
            byteLength: bufferView.byteLength ?? buffer.byteLength,
            byteStride: bufferView.byteStride,
        }],
        accessors: [{
            bufferView: 0,
            byteOffset: accessor.byteOffset ?? 0,
            componentType: accessor.componentType,
            count: accessor.count,
            type: accessor.type,
            normalized: accessor.normalized,
        }],
    };
    const mockLoader: any = {
        parsingResult: {
            uris: {
                buffers: [new DataView(buffer)],
            },
        },
    };
    return new AccessorInfo_GLTF(mockLoader, gltfData, 0);
}

describe('GLTF TypedArray Zero-Copy Parsers', () => {
    it('parseIndicesInfo_GLTF parses UINT8, UINT16, UINT32 and unaligned offsets into Uint32Array', () => {
        // UINT16 fast-path
        const u16 = new Uint16Array([0, 1, 2, 2, 3, 0]);
        const u16Info = createAccessorInfo(u16.buffer, {type: 'SCALAR', componentType: 5123, count: 6});
        const u16Result = parseIndicesInfo_GLTF(u16Info);
        expect(u16Result).toBeInstanceOf(Uint32Array);
        expect(Array.from(u16Result)).toEqual([0, 1, 2, 2, 3, 0]);

        // UINT32 fast-path
        const u32 = new Uint32Array([100000, 100001, 100002]);
        const u32Info = createAccessorInfo(u32.buffer, {type: 'SCALAR', componentType: 5125, count: 3});
        const u32Result = parseIndicesInfo_GLTF(u32Info);
        expect(u32Result).toBeInstanceOf(Uint32Array);
        expect(Array.from(u32Result)).toEqual([100000, 100001, 100002]);

        // UINT8 fast-path
        const u8 = new Uint8Array([3, 4, 5]);
        const u8Info = createAccessorInfo(u8.buffer, {type: 'SCALAR', componentType: 5121, count: 3});
        expect(Array.from(parseIndicesInfo_GLTF(u8Info))).toEqual([3, 4, 5]);

        // Unaligned UINT16 DataView fallback (byteOffset = 1)
        const unalignedBuf = new ArrayBuffer(7);
        const dv = new DataView(unalignedBuf);
        dv.setUint16(1, 10, true);
        dv.setUint16(3, 20, true);
        dv.setUint16(5, 30, true);
        const unalignedInfo = createAccessorInfo(unalignedBuf, {
            type: 'SCALAR',
            componentType: 5123,
            count: 3,
            byteOffset: 1
        });
        expect(Array.from(parseIndicesInfo_GLTF(unalignedInfo))).toEqual([10, 20, 30]);
    });

    it('parseAttributeInfo_GLTF parses tightly-packed Float32 POSITION via fast-path', () => {
        const pos = new Float32Array([1, 2, 3, 4, 5, 6]);
        const info = createAccessorInfo(pos.buffer, {type: 'VEC3', componentType: 5126, count: 2});
        const result = parseAttributeInfo_GLTF('POSITION', info);
        expect(result).toBeInstanceOf(Float32Array);
        expect(Array.from(result!)).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('parseAttributeInfo_GLTF handles interleaved byteStride, normalized INT16, and VEC3 COLOR_0 RGBA expansion', () => {
        // Interleaved buffer: 2 vertices, stride = 20 bytes (VEC3 float pos @0 + VEC2 float uv @12)
        const buf = new ArrayBuffer(40);
        const dv = new DataView(buf);
        // v0
        dv.setFloat32(0, 1, true);
        dv.setFloat32(4, 2, true);
        dv.setFloat32(8, 3, true);
        dv.setFloat32(12, 0.25, true);
        dv.setFloat32(16, 0.75, true);
        // v1
        dv.setFloat32(20, 4, true);
        dv.setFloat32(24, 5, true);
        dv.setFloat32(28, 6, true);
        dv.setFloat32(32, 0.5, true);
        dv.setFloat32(36, 1.0, true);

        const posInfo = createAccessorInfo(buf, {type: 'VEC3', componentType: 5126, count: 2}, {byteStride: 20});
        const uvInfo = createAccessorInfo(buf, {
            type: 'VEC2',
            componentType: 5126,
            count: 2,
            byteOffset: 12
        }, {byteStride: 20});
        expect(Array.from(parseAttributeInfo_GLTF('POSITION', posInfo)!)).toEqual([1, 2, 3, 4, 5, 6]);
        expect(Array.from(parseAttributeInfo_GLTF('TEXCOORD_0', uvInfo)!)).toEqual([0.25, 0.75, 0.5, 1.0]);

        // Normalized UINT8 VEC3 COLOR_0 -> expands to RGBA with alpha = 1
        const colorBuf = new Uint8Array([255, 0, 255, 0, 255, 0]);
        const colorInfo = createAccessorInfo(colorBuf.buffer, {
            type: 'VEC3',
            componentType: 5121,
            count: 2,
            normalized: true,
        });
        const colorResult = parseAttributeInfo_GLTF('COLOR_0', colorInfo)!;
        expect(colorResult).toBeInstanceOf(Float32Array);
        expect(Array.from(colorResult)).toEqual([1, 0, 1, 1, 0, 1, 0, 1]);

        // Unused TEXCOORD_2 returns null
        const uv2Info = createAccessorInfo(buf, {type: 'VEC2', componentType: 5126, count: 2}, {byteStride: 20});
        expect(parseAttributeInfo_GLTF('TEXCOORD_2', uv2Info)).toBeNull();
    });

    it('parseInterleaveData_GLTF produces exact 18-float stride layout without NaN', () => {
        const vertices = new Float32Array([1, 2, 3, 4, 5, 6]);
        const normals = new Float32Array([0, 1, 0, 0, 0, 1]);
        const uvs = new Float32Array([0.1, 0.2, 0.3, 0.4]);
        const empty = new Float32Array(0);
        const tangents = new Float32Array([1, 0, 0, 1, 0, 1, 0, -1]);

        const interleaved = parseInterleaveData_GLTF(vertices, empty, normals, uvs, empty, tangents);
        expect(interleaved).toBeInstanceOf(Float32Array);
        expect(interleaved.length).toBe(2 * 18);

        // Vertex 0: pos(3) normal(3) uv0(2) uv1(=uv0, 2) color(4 zeros) tangent(4)
        expect(interleaved[0]).toBeCloseTo(1);
        expect(interleaved[1]).toBeCloseTo(2);
        expect(interleaved[2]).toBeCloseTo(3);
        expect(interleaved[3]).toBeCloseTo(0);
        expect(interleaved[4]).toBeCloseTo(1);
        expect(interleaved[5]).toBeCloseTo(0);
        expect(interleaved[6]).toBeCloseTo(0.1);
        expect(interleaved[7]).toBeCloseTo(0.2);
        expect(interleaved[8]).toBeCloseTo(0.1);
        expect(interleaved[9]).toBeCloseTo(0.2);
        expect(interleaved[10]).toBe(0);
        expect(interleaved[13]).toBe(0);
        expect(interleaved[14]).toBeCloseTo(1);
        expect(interleaved[17]).toBeCloseTo(1);

        // Missing UVs should stay 0 (never NaN)
        const noUvInterleaved = parseInterleaveData_GLTF(vertices, empty, normals, empty, empty, empty);
        for (let i = 0; i < noUvInterleaved.length; i++) {
            expect(Number.isNaN(noUvInterleaved[i])).toBe(false);
        }
    });

    it('packSkinWeights_GLTF and packSkinJoints_GLTF handle skinned and non-skinned meshes', () => {
        // Non-skinned (empty) -> zero-initialized TypedArrays
        const zeroW = packSkinWeights_GLTF(3, null);
        const zeroJ = packSkinJoints_GLTF(3, null);
        expect(zeroW).toBeInstanceOf(Float32Array);
        expect(zeroW.length).toBe(12);
        expect(zeroJ).toBeInstanceOf(Uint32Array);
        expect(zeroJ.length).toBe(12);
        expect(zeroW.every(v => v === 0)).toBe(true);
        expect(zeroJ.every(v => v === 0)).toBe(true);

        // Skinned Float32Array exact match -> Zero-Copy reference reuse
        const weights = new Float32Array([1, 0, 0, 0, 0.5, 0.5, 0, 0]);
        const packedW = packSkinWeights_GLTF(2, weights);
        expect(packedW).toBe(weights);

        // Skinned joints -> Uint32Array conversion
        const joints = new Float32Array([1, 2, 0, 0, 3, 4, 5, 6]);
        const packedJ = packSkinJoints_GLTF(2, joints);
        expect(packedJ).toBeInstanceOf(Uint32Array);
        expect(Array.from(packedJ)).toEqual([1, 2, 0, 0, 3, 4, 5, 6]);
    });

    it('calculateNormals accepts Float32Array and Uint32Array (including empty indices)', () => {
        const vertices = new Float32Array([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
        ]);
        const indices = new Uint32Array([0, 1, 2]);
        const normals = calculateNormals(vertices, indices);
        expect(normals).toBeInstanceOf(Float32Array);
        expect(normals.length).toBe(9);
        expect(Math.abs(normals[2])).toBeCloseTo(1);

        // Empty Uint32Array indices (non-indexed geometry)
        const normalsNoIdx = calculateNormals(vertices, new Uint32Array(0));
        expect(normalsNoIdx).toBeInstanceOf(Float32Array);
        expect(Math.abs(normalsNoIdx[2])).toBeCloseTo(1);
    });
});
