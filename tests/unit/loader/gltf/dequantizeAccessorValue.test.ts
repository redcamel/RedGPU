// KHR_mesh_quantization 및 glTF 2.0 normalized accessor 역정규화 단위 테스트
import {describe, expect, it} from 'vitest';
import dequantizeAccessorValue from '../../../../src/loader/gltf/core/dequantizeAccessorValue';
import parseAttributeInfo_GLTF from '../../../../src/loader/gltf/parsers/parseAttributeInfo_GLTF';
import type AccessorInfo_GLTF from '../../../../src/loader/gltf/cls/AccessorInfo_GLTF';

describe('KHR_mesh_quantization — dequantizeAccessorValue', () => {
    it('dequantizes INT8 (5120) boundary values into [-1, 1] clamping -128 to -1', () => {
        // INT8 경계값(-128, -127, 0, 127) 역정규화 및 -128 클램핑 검증
        expect(dequantizeAccessorValue(-128, 5120, true)).toBe(-1);
        expect(dequantizeAccessorValue(-127, 5120, true)).toBe(-1);
        expect(dequantizeAccessorValue(0, 5120, true)).toBe(0);
        expect(dequantizeAccessorValue(127, 5120, true)).toBe(1);
    });

    it('dequantizes UINT8 (5121) boundary values into [0, 1]', () => {
        // UINT8 경계값(0, 127, 255) 역정규화 검증
        expect(dequantizeAccessorValue(0, 5121, true)).toBe(0);
        expect(dequantizeAccessorValue(127, 5121, true)).toBeCloseTo(127 / 255, 6);
        expect(dequantizeAccessorValue(255, 5121, true)).toBe(1);
    });

    it('dequantizes INT16 (5122) boundary values into [-1, 1] clamping -32768 to -1', () => {
        // INT16 경계값(-32768, -32767, 0, 32767) 역정규화 및 -32768 클램핑 검증
        expect(dequantizeAccessorValue(-32768, 5122, true)).toBe(-1);
        expect(dequantizeAccessorValue(-32767, 5122, true)).toBe(-1);
        expect(dequantizeAccessorValue(0, 5122, true)).toBe(0);
        expect(dequantizeAccessorValue(32767, 5122, true)).toBe(1);
    });

    it('dequantizes UINT16 (5123) boundary values into [0, 1]', () => {
        // UINT16 경계값(0, 32768, 65535) 역정규화 검증
        expect(dequantizeAccessorValue(0, 5123, true)).toBe(0);
        expect(dequantizeAccessorValue(32768, 5123, true)).toBeCloseTo(32768 / 65535, 6);
        expect(dequantizeAccessorValue(65535, 5123, true)).toBe(1);
    });

    it('returns raw value unchanged when normalized is false/undefined or componentType is FLOAT/UINT32', () => {
        // normalized=false/undefined 및 비정수 타입(FLOAT 5126, UINT32 5125) 패스스루 검증
        expect(dequantizeAccessorValue(127, 5120, false)).toBe(127);
        expect(dequantizeAccessorValue(65535, 5123, undefined)).toBe(65535);
        expect(dequantizeAccessorValue(0.75, 5126, true)).toBe(0.75);
        expect(dequantizeAccessorValue(42, 5125, true)).toBe(42);
    });
});

describe('KHR_mesh_quantization — parseAttributeInfo_GLTF integration', () => {
    it('dequantizes strided INT8 normalized NORMAL (byteStride=4) into unit range', () => {
        // 4바이트 정렬 패딩이 포함된 INT8 normalized VEC3 NORMAL 파싱 검증
        const raw = new Int8Array([
            127, 0, -128, 0,   // vertex 0 (+X, 0, -Z, padding)
            0, -127, 127, 0    // vertex 1 (0, -Y, +Z, padding)
        ]);
        const accessorInfo = {
            accessor: {type: 'VEC3', count: 2, componentType: 5120, normalized: true},
            startIndex: 0,
            bufferViewOffset: 0,
            accessorBufferOffset: 0,
            getMethod: 'getInt8',
            bufferViewByteStride: 4,
            bufferURIDataView: new DataView(raw.buffer),
            componentType_BYTES_PER_ELEMENT: 1
        } as unknown as AccessorInfo_GLTF;

        const normals = parseAttributeInfo_GLTF('NORMAL', accessorInfo);
        expect(Array.from(normals!)).toEqual([1, 0, -1, 0, -1, 1]);
    });

    it('preserves unnormalized UINT16 POSITION integers while dequantizing normalized UINT8 COLOR_0', () => {
        // unnormalized UINT16 POSITION 원본 정수 유지 + normalized UINT8 COLOR_0 역정규화 검증
        const posRaw = new Uint16Array([100, 200, 300]);
        const posInfo = {
            accessor: {type: 'VEC3', count: 1, componentType: 5123},
            startIndex: 0,
            bufferViewOffset: 0,
            accessorBufferOffset: 0,
            getMethod: 'getUint16',
            bufferViewByteStride: 0,
            bufferURIDataView: new DataView(posRaw.buffer),
            componentType_BYTES_PER_ELEMENT: 2
        } as unknown as AccessorInfo_GLTF;
        const vertices = parseAttributeInfo_GLTF('POSITION', posInfo);
        expect(Array.from(vertices!)).toEqual([100, 200, 300]);

        const colRaw = new Uint8Array([255, 0, 255, 255]);
        const colInfo = {
            accessor: {type: 'VEC4', count: 1, componentType: 5121, normalized: true},
            startIndex: 0,
            bufferViewOffset: 0,
            accessorBufferOffset: 0,
            getMethod: 'getUint8',
            bufferViewByteStride: 0,
            bufferURIDataView: new DataView(colRaw.buffer),
            componentType_BYTES_PER_ELEMENT: 1
        } as unknown as AccessorInfo_GLTF;
        const colors = parseAttributeInfo_GLTF('COLOR_0', colInfo);
        expect(Array.from(colors!)).toEqual([1, 0, 1, 1]);
    });
});
