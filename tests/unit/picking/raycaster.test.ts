import {mat4, vec3} from 'gl-matrix';
import {describe, expect, it, vi} from 'vitest';
import AABB from '../../../src/bound/AABB';
import Raycaster3D from '../../../src/picking/Raycaster3D';

vi.mock('wgsl_reflect', () => ({
    WgslReflect: class {
    }
}));

const createTriangleMesh = (zOffset: number, name: string) => {
    // stride = 8 floats (pos: 0..2, normal: 3..5, uv: 6..7)
    const data = new Float32Array([
        -1, -1, 0, 0, 0, 1, 0, 0,
        1, -1, 0, 0, 0, 1, 1, 0,
        0, 1, 0, 0, 0, 1, 0.5, 1,
    ]);
    const modelMatrix = mat4.fromTranslation(mat4.create(), [0, 0, zOffset]);
    return {
        name,
        modelMatrix,
        boundingAABB: new AABB(-1, 1, -1, 1, zOffset - 0.1, zOffset + 0.1),
        geometry: {
            vertexBuffer: {
                data,
                vertexCount: 3,
                interleavedStruct: {arrayStride: 8 * 4},
            },
            indexBuffer: {
                data: new Uint32Array([0, 1, 2]),
            },
        },
        children: [],
    } as any;
};

describe('Raycaster3D', () => {
    it('intersects meshes along ray, computes hit point/UV, and sorts results nearest-first', () => {
        const raycaster = new Raycaster3D();
        vec3.set(raycaster.ray.origin, 0, 0, 10);
        vec3.set(raycaster.ray.direction, 0, 0, -1);

        const farMesh = createTriangleMesh(-5, 'far');
        const nearMesh = createTriangleMesh(2, 'near');
        const missedMesh = createTriangleMesh(0, 'miss');
        mat4.fromTranslation(missedMesh.modelMatrix, [50, 0, 0]);
        missedMesh.boundingAABB = new AABB(49, 51, -1, 1, -0.1, 0.1);

        const hits = raycaster.intersectObjects([farMesh, missedMesh, nearMesh]);
        expect(hits.length).toBe(2);
        expect(hits[0].object).toBe(nearMesh);
        expect(hits[0].distance).toBeCloseTo(8, 5);
        expect(hits[0].point[2]).toBeCloseTo(2, 5);
        expect(hits[0].uv[0]).toBeCloseTo(0.5, 4);
        expect(hits[1].object).toBe(farMesh);
        expect(hits[1].distance).toBeCloseTo(15, 5);
    });

    it('respects near/far clipping range and recursive child traversal flag', () => {
        const raycaster = new Raycaster3D();
        vec3.set(raycaster.ray.origin, 0, 0, 10);
        vec3.set(raycaster.ray.direction, 0, 0, -1);
        raycaster.near = 1;
        raycaster.far = 10;

        const childMesh = createTriangleMesh(5, 'child');
        const outOfRangeMesh = createTriangleMesh(-20, 'tooFar');
        const parent = {
            geometry: null,
            modelMatrix: mat4.create(),
            children: [childMesh, outOfRangeMesh],
        } as any;

        expect(raycaster.intersectObject(parent, false).length).toBe(0);
        const recursiveHits = raycaster.intersectObject(parent, true);
        expect(recursiveHits.length).toBe(1);
        expect(recursiveHits[0].object).toBe(childMesh);
        expect(recursiveHits[0].distance).toBeCloseTo(5, 5);
    });
});
