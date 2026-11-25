import {describe, expect, it} from 'vitest';
import GPU_PRIMITIVE_TOPOLOGY from '../../../../src/gpuConst/GPU_PRIMITIVE_TOPOLOGY';
import {
    normalizePrimitiveTopology,
    resolveWebGPUTopology
} from '../../../../src/loader/gltf/core/normalizePrimitiveTopology';

const EMPTY = new Uint32Array(0);

describe('normalizePrimitiveTopology', () => {
    it('converts LINE_LOOP (mode 2) into closed LINE_LIST segments for both indexed and non-indexed inputs', () => {
        const nonIndexed = normalizePrimitiveTopology(2, EMPTY, 4);
        expect(nonIndexed.topology).toBe(GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
        expect(Array.from(nonIndexed.indices)).toEqual([0, 1, 1, 2, 2, 3, 3, 0]);

        const indexed = normalizePrimitiveTopology(2, new Uint32Array([10, 20, 30]), 40);
        expect(indexed.topology).toBe(GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
        expect(Array.from(indexed.indices)).toEqual([10, 20, 20, 30, 30, 10]);
    });

    it('keeps non-indexed LINE_STRIP (mode 3) native and converts indexed LINE_STRIP to LINE_LIST', () => {
        const nonIndexed = normalizePrimitiveTopology(3, EMPTY, 4);
        expect(nonIndexed.topology).toBe(GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP);
        expect(nonIndexed.indices.length).toBe(0);

        const indexed = normalizePrimitiveTopology(3, new Uint32Array([5, 6, 7, 8]), 10);
        expect(indexed.topology).toBe(GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
        expect(Array.from(indexed.indices)).toEqual([5, 6, 6, 7, 7, 8]);
    });

    it('converts TRIANGLE_STRIP (mode 5) into TRIANGLE_LIST with alternating winding order', () => {
        const nonIndexed = normalizePrimitiveTopology(5, EMPTY, 4);
        expect(nonIndexed.topology).toBe(GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST);
        expect(Array.from(nonIndexed.indices)).toEqual([0, 1, 2, 2, 1, 3]);

        const indexed = normalizePrimitiveTopology(5, new Uint32Array([10, 11, 12, 13, 14]), 20);
        expect(indexed.topology).toBe(GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST);
        expect(Array.from(indexed.indices)).toEqual([10, 11, 12, 12, 11, 13, 12, 13, 14]);
    });

    it('converts TRIANGLE_FAN (mode 6) into TRIANGLE_LIST anchored at the first vertex', () => {
        const nonIndexed = normalizePrimitiveTopology(6, EMPTY, 5);
        expect(nonIndexed.topology).toBe(GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST);
        expect(Array.from(nonIndexed.indices)).toEqual([0, 1, 2, 0, 2, 3, 0, 3, 4]);

        const indexed = normalizePrimitiveTopology(6, new Uint32Array([4, 7, 8, 9]), 10);
        expect(indexed.topology).toBe(GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST);
        expect(Array.from(indexed.indices)).toEqual([4, 7, 8, 4, 8, 9]);
    });

    it('preserves POINTS (0), LINES (1), and TRIANGLES (4/undefined) and matches resolveWebGPUTopology', () => {
        expect(resolveWebGPUTopology(0, false)).toBe(GPU_PRIMITIVE_TOPOLOGY.POINT_LIST);
        expect(resolveWebGPUTopology(1, true)).toBe(GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
        expect(resolveWebGPUTopology(2, false)).toBe(GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
        expect(resolveWebGPUTopology(3, false)).toBe(GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP);
        expect(resolveWebGPUTopology(3, true)).toBe(GPU_PRIMITIVE_TOPOLOGY.LINE_LIST);
        expect(resolveWebGPUTopology(4, true)).toBe(GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST);
        expect(resolveWebGPUTopology(5, false)).toBe(GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST);
        expect(resolveWebGPUTopology(6, true)).toBe(GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST);
        expect(resolveWebGPUTopology(undefined, false)).toBe(GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST);
    });
});
