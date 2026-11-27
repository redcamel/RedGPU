import {mat4, vec3} from 'gl-matrix';
import {describe, expect, it} from 'vitest';
import AABB from '../../../src/bound/AABB';
import computeFrustumPlanes, {
    computeFrustumPlanesFlat,
    computeFrustumPlanesFromPVMatrix,
    computeFrustumPlanesFromPVMatrixFlat
} from '../../../src/math/computeFrustumPlanes';
import Ray from '../../../src/math/Ray';
import sortTransparentObjects from '../../../src/math/sortTransparentObjects';

describe('Math Ray, FrustumPlanes, and sortTransparentObjects', () => {
    it('Ray tests AABB and triangle intersections, backface culling, barycentric coords, and applyMatrix4', () => {
        const ray = new Ray(vec3.fromValues(0, 0, 5), vec3.fromValues(0, 0, -1));
        const box = new AABB(-1, 1, -1, 1, -1, 1);
        expect(ray.intersectBox(box)).toBe(true);

        const missRay = new Ray(vec3.fromValues(5, 5, 5), vec3.fromValues(0, 0, -1));
        expect(missRay.intersectBox(box)).toBe(false);

        const v0 = vec3.fromValues(-1, -1, 0);
        const v1 = vec3.fromValues(1, -1, 0);
        const v2 = vec3.fromValues(0, 1, 0);
        const hitPoint = ray.intersectTriangle(v0, v1, v2, true);
        expect(hitPoint).not.toBeNull();
        expect(hitPoint?.[2]).toBeCloseTo(0, 5);

        // 뒤집힌 와인딩은 backfaceCulling=true일 때 미교차, false일 때 교차
        expect(ray.intersectTriangle(v0, v2, v1, true)).toBeNull();
        expect(ray.intersectTriangle(v0, v2, v1, false)).not.toBeNull();

        const bary = ray.intersectTriangleBarycentric(v0, v1, v2, true);
        expect(bary).not.toBeNull();
        expect(bary?.t).toBeCloseTo(5, 5);
        expect(bary ? bary.u + bary.v : 0).toBeLessThanOrEqual(1);

        // clone + applyMatrix4 원본 보존 및 변환 검증
        const m = mat4.fromTranslation(mat4.create(), [10, 0, 0]);
        const transformed = ray.clone().applyMatrix4(m);
        expect(ray.origin[0]).toBe(0);
        expect(transformed.origin[0]).toBeCloseTo(10, 5);
        expect(vec3.length(transformed.direction)).toBeCloseTo(1, 5);
    });

    it('computeFrustumPlanes variants extract 6 normalized planes and classify interior vs exterior points', () => {
        const proj = mat4.create();
        mat4.perspectiveZO(proj, Math.PI / 3, 1, 0.1, 100);
        const view = mat4.create();
        mat4.lookAt(view, [0, 0, 10], [0, 0, 0], [0, 1, 0]);

        const planes = computeFrustumPlanes(proj, view);
        const flat = computeFrustumPlanesFlat(proj, view);
        expect(planes.length).toBe(6);
        expect(flat.length).toBe(24);
        for (let i = 0; i < 6; i++) {
            const p = planes[i];
            expect(Math.hypot(p[0], p[1], p[2])).toBeCloseTo(1, 5);
            expect(flat[i * 4]).toBeCloseTo(p[0], 5);
            expect(flat[i * 4 + 3]).toBeCloseTo(p[3], 5);
        }

        const pv = mat4.multiply(mat4.create(), proj, view);
        const pvPlanes = computeFrustumPlanesFromPVMatrix(pv);
        const pvFlat = computeFrustumPlanesFromPVMatrixFlat(pv);
        expect(pvPlanes.length).toBe(6);
        expect(pvFlat.length).toBe(24);

        // 원점(카메라 정면 10m)은 모든 6개 평면의 내부(dot + D >= 0), 카메라 뒤(z=20)는 외부
        const isInside = (x: number, y: number, z: number) =>
            pvPlanes.every(([a, b, c, d]) => a * x + b * y + c * z + d >= 0);
        expect(isInside(0, 0, 0)).toBe(true);
        expect(isInside(0, 0, 20)).toBe(false);
    });

    it('sortTransparentObjects sorts render bundles back-to-front by squared distance from camera', () => {
        const bundles = [
            {mesh: {uuid: 'near', x: 0, y: 0, z: 2}},
            {mesh: {uuid: 'far', x: 0, y: 0, z: 20}},
            {mesh: {uuid: 'mid', x: 0, y: 0, z: 8}},
        ] as unknown as GPURenderBundle[];

        const sorted = sortTransparentObjects({x: 0, y: 0, z: 0}, bundles) as unknown as Array<{
            mesh: { uuid: string }
        }>;
        expect(sorted.map((b) => b.mesh.uuid)).toEqual(['far', 'mid', 'near']);
    });
});
