import {mat4} from 'gl-matrix';
import {describe, expect, it, vi} from 'vitest';
import AABB from '../../../src/bound/AABB';
import calculateGeometryAABB from '../../../src/bound/math/calculateGeometryAABB';
import calculateMeshAABB from '../../../src/bound/math/calculateMeshAABB';
import calculateMeshCombinedAABB from '../../../src/bound/math/calculateMeshCombinedAABB';
import calculateMeshOBB from '../../../src/bound/math/calculateMeshOBB';

vi.mock('wgsl_reflect', () => ({
    WgslReflect: class {
    }
}));

describe('Bound math utilities (Geometry/Mesh/Combined AABB & Mesh OBB)', () => {
    it('calculateGeometryAABB computes min/max across unrolled 4-vertex loops and tail vertices', () => {
        // 5 vertices with stride 8 (x,y,z + 5 padding floats)
        const data = new Float32Array([
            -2, 1, 0, 0, 0, 0, 0, 0,
            3, -4, 5, 0, 0, 0, 0, 0,
            0, 2, -6, 0, 0, 0, 0, 0,
            1, 1, 1, 0, 0, 0, 0, 0,
            7, 8, -1, 0, 0, 0, 0, 0,
        ]);
        const vb = {data, stride: 8, vertexCount: 5} as any;
        const aabb = calculateGeometryAABB(vb);

        expect(aabb.minX).toBe(-2);
        expect(aabb.maxX).toBe(7);
        expect(aabb.minY).toBe(-4);
        expect(aabb.maxY).toBe(8);
        expect(aabb.minZ).toBe(-6);
        expect(aabb.maxZ).toBe(5);

        const empty = calculateGeometryAABB({data: new Float32Array(0), stride: 8, vertexCount: 0} as any);
        expect(empty.xSize).toBe(0);
        expect(empty.ySize).toBe(0);
        expect(empty.zSize).toBe(0);
    });

    it('calculateMeshAABB transforms geometry volume with modelMatrix and supports in-place targetAABB', () => {
        const modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [10, 20, 30]);
        mat4.scale(modelMatrix, modelMatrix, [2, 3, 4]);

        const mesh = {
            _geometry: {volume: new AABB(-1, 1, -1, 1, -1, 1)},
            modelMatrix,
        } as any;

        const target = new AABB(0, 0, 0, 0, 0, 0);
        const result = calculateMeshAABB(mesh, target);
        expect(result).toBe(target);
        expect(result.minX).toBeCloseTo(8, 5);
        expect(result.maxX).toBeCloseTo(12, 5);
        expect(result.minY).toBeCloseTo(17, 5);
        expect(result.maxY).toBeCloseTo(23, 5);
        expect(result.minZ).toBeCloseTo(26, 5);
        expect(result.maxZ).toBeCloseTo(34, 5);

        // 지오메트리 없는 빈 노드는 modelMatrix 위치의 점 AABB 반환
        const emptyMesh = {
            _geometry: null,
            modelMatrix: mat4.fromTranslation(mat4.create(), [4, 5, 6]),
        } as any;
        const emptyAABB = calculateMeshAABB(emptyMesh);
        expect(emptyAABB.centerX).toBeCloseTo(4, 5);
        expect(emptyAABB.centerY).toBeCloseTo(5, 5);
        expect(emptyAABB.centerZ).toBeCloseTo(6, 5);
    });

    it('calculateMeshCombinedAABB merges visible children and excludes visible=false subtrees', () => {
        const visibleChild = {
            visible: true,
            isInstanceofMesh: true,
            _geometry: {},
            boundingAABB: new AABB(0, 2, 0, 2, 0, 2),
            children: [],
        };
        const hiddenChild = {
            visible: false,
            isInstanceofMesh: true,
            _geometry: {},
            boundingAABB: new AABB(100, 200, 100, 200, 100, 200),
            children: [],
        };
        const secondVisibleChild = {
            visible: true,
            isInstanceofMesh: true,
            _geometry: {},
            boundingAABB: new AABB(-5, -1, 1, 6, -3, 0),
            children: [],
        };
        const root = {
            visible: true,
            isInstanceofMesh: true,
            _geometry: null,
            children: [visibleChild, hiddenChild, secondVisibleChild],
        } as any;

        const combined = calculateMeshCombinedAABB(root);
        expect(combined.minX).toBe(-5);
        expect(combined.maxX).toBe(2);
        expect(combined.minY).toBe(0);
        expect(combined.maxY).toBe(6);
        expect(combined.minZ).toBe(-3);
        expect(combined.maxZ).toBe(2);

        // 모든 자식이 숨겨졌으면 (0..0) 반환
        visibleChild.visible = false;
        secondVisibleChild.visible = false;
        const allHidden = calculateMeshCombinedAABB(root);
        expect(allHidden.xSize).toBe(0);
        expect(allHidden.ySize).toBe(0);
    });

    it('calculateMeshOBB computes rotated and scaled world-space OBB center and half-extents', () => {
        const modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, [5, 0, 0]);
        mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 2);
        mat4.scale(modelMatrix, modelMatrix, [2, 4, 6]);

        const mesh = {
            _geometry: {volume: new AABB(-1, 1, -1, 1, -1, 1)},
            modelMatrix,
        } as any;

        const obb = calculateMeshOBB(mesh);
        expect(obb.center[0]).toBeCloseTo(5, 5);
        expect(obb.center[1]).toBeCloseTo(0, 5);
        expect(obb.center[2]).toBeCloseTo(0, 5);
        expect(obb.halfExtents[0]).toBeCloseTo(2, 5);
        expect(obb.halfExtents[1]).toBeCloseTo(4, 5);
        expect(obb.halfExtents[2]).toBeCloseTo(6, 5);
    });
});
