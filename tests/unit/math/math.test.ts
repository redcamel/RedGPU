import {describe, expect, it} from 'vitest';
import {mat4} from 'gl-matrix';
import {AABB} from '../../../src/bound/AABB';
import Ray from '../../../src/math/Ray';
import localToWorld from '../../../src/math/coordinates/localToWorld';
import worldToLocal from '../../../src/math/coordinates/worldToLocal';
import getScreenPoint from '../../../src/math/coordinates/getScreenPoint';
import matToEuler from '../../../src/math/mat4ToEuler';
import quaternionToRotationMat4 from '../../../src/math/quaternionToRotationMat4';
import computeFrustumPlanes, {computeFrustumPlanesFlat} from '../../../src/math/computeFrustumPlanes';

describe('Math.Ray', () => {
    // 기본값 및 사용자 지정 원점/방향 초기화 검증
    it('initializes with default and custom origin/direction', () => {
        const defaultRay = new Ray();
        expect(Array.from(defaultRay.origin)).toEqual([0, 0, 0]);
        expect(Array.from(defaultRay.direction)).toEqual([0, 0, -1]);

        const customRay = new Ray([1, 2, 3], [0, 1, 0]);
        expect(Array.from(customRay.origin)).toEqual([1, 2, 3]);
        expect(Array.from(customRay.direction)).toEqual([0, 1, 0]);
    });

    // Ray 복제(clone) 및 4x4 행렬 변환(applyMatrix4) 검증
    it('clones and applies mat4 transform', () => {
        const ray = new Ray([1, 2, 3], [0, 1, 0]);
        const cloned = ray.clone();
        expect(cloned).not.toBe(ray);
        expect(cloned.origin[0]).toBe(1);
        expect(cloned.direction[1]).toBe(1);

        // X축 +10 평행 이동 행렬 적용 시 원점만 이동하고 방향 벡터는 유지
        const transformRay = new Ray([0, 0, 0], [1, 0, 0]);
        const mtx = mat4.create();
        mat4.translate(mtx, mtx, [10, 0, 0]);
        transformRay.applyMatrix4(mtx);
        expect(transformRay.origin[0]).toBe(10);
        expect(transformRay.direction[0]).toBe(1);
    });

    // AABB 박스 및 삼각형 교차 판정(무게중심 좌표 포함) 검증
    it('intersects AABB and triangles accurately', () => {
        const box = new AABB(-1, 1, -1, 1, -1, 1);
        const hitRay = new Ray([0, 0, 5], [0, 0, -1]);
        const missRay = new Ray([0, 5, 5], [0, 0, -1]);

        expect(hitRay.intersectBox(box)).toBe(true);
        expect(missRay.intersectBox(box)).toBe(false);

        // Z = 0 평면 위 삼각형과의 교점 및 무게중심(Barycentric) 좌표 검증
        const v0: [number, number, number] = [-1, -1, 0];
        const v1: [number, number, number] = [1, -1, 0];
        const v2: [number, number, number] = [0, 1, 0];

        const pt = hitRay.intersectTriangle(v0, v1, v2);
        expect(pt).not.toBeNull();
        expect(pt?.[0]).toBeCloseTo(0, 5);
        expect(pt?.[1]).toBeCloseTo(0, 5);
        expect(pt?.[2]).toBeCloseTo(0, 5);

        const bary = hitRay.intersectTriangleBarycentric(v0, v1, v2);
        expect(bary).not.toBeNull();
        expect(bary?.point[2]).toBeCloseTo(0, 5);
        expect(typeof bary?.u).toBe('number');
    });
});

describe('Math.Coordinates', () => {
    // localToWorld 및 worldToLocal 상호 역변환 정밀도 검증
    it('converts localToWorld and worldToLocal accurately', () => {
        const mtx = mat4.create();
        mat4.translate(mtx, mtx, [10, 0, 0]);

        const world = localToWorld(mtx, 5, 0, 0);
        expect(world).toEqual([15, 0, 0]);

        // 월드 좌표를 다시 로컬 좌표로 역변환했을 때 원값 복원 검증
        const local = worldToLocal(mtx, 15, 0, 0);
        expect(local[0]).toBeCloseTo(5, 4);
        expect(local[1]).toBe(0);
        expect(local[2]).toBe(0);
    });

    // NaN 좌표 또는 잘못된 View3D 인스턴스 입력 시 예외 발생 검증
    it('throws on NaN coordinates or invalid view in getScreenPoint', () => {
        const mtx = mat4.create();
        expect(() => localToWorld(mtx, NaN, 0, 0)).toThrow();
        expect(() => worldToLocal(mtx, NaN, 0, 0)).toThrow();
        expect(() => getScreenPoint({} as never, mat4.create())).toThrow();
    });
});

describe('Math.Utilities', () => {
    // 오일러 각 추출, 쿼터니언 회전 행렬 변환 및 프러스텀 평면 추출 검증
    it('extracts Euler angles, converts quaternions, and computes frustum planes', () => {
        // X축 90도 회전 행렬에서 오일러 각 추출 검증
        const mtx = mat4.create();
        mat4.rotateX(mtx, mtx, Math.PI / 2);
        const euler = matToEuler(mtx, [0, 0, 0], 'XYZ');
        expect(euler[0]).toBeCloseTo(Math.PI / 2, 4);

        // 항등 쿼터니언은 항등 회전 행렬로 변환
        const rotMtx = mat4.create();
        quaternionToRotationMat4([0, 0, 0, 1], rotMtx);
        expect([rotMtx[0], rotMtx[5], rotMtx[10], rotMtx[15]]).toEqual([1, 1, 1, 1]);

        // 프러스텀 6개 평면(각 4성분) 및 Flat Float32Array(24요소) 추출 검증
        const planes = computeFrustumPlanes(mat4.create(), mat4.create());
        expect(planes.length).toBe(6);
        expect(planes[0].length).toBe(4);

        const planesFlat = computeFrustumPlanesFlat(mat4.create(), mat4.create());
        expect(planesFlat).toBeInstanceOf(Float32Array);
        expect(planesFlat.length).toBe(24);
    });
});
