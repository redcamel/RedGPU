import {describe, expect, it} from 'vitest';
import {mat4} from 'gl-matrix';
import {OBB} from '../../../src/bound/OBB';

describe('Bound.OBB', () => {
    // 중심, 반치수, 방향 행렬 복제 및 외접 구 반지름(geometryRadius) 계산 검증
    it('initializes properties, clones orientation matrix, and computes geometryRadius', () => {
        const orientation = mat4.create();
        const obb = new OBB([1, 2, 3], [2, 3, 6], orientation);

        expect([obb.centerX, obb.centerY, obb.centerZ]).toEqual([1, 2, 3]);
        expect(obb.center).toEqual([1, 2, 3]);
        expect([obb.halfExtentX, obb.halfExtentY, obb.halfExtentZ]).toEqual([2, 3, 6]);
        expect(obb.halfExtents).toEqual([2, 3, 6]);
        // sqrt(4 + 9 + 36) = 7
        expect(obb.geometryRadius).toBeCloseTo(7, 5);
        expect(obb.orientation).not.toBe(orientation);
    });

    // 축 정렬 및 45도 회전된 OBB 간 SAT 교차(intersects) 판정 및 비정상 인자 차단 검증
    it('detects intersection for aligned and rotated OBBs and rejects invalid arguments', () => {
        const identity = mat4.create();
        const rotZ45 = mat4.rotateZ(mat4.create(), mat4.create(), Math.PI / 4);

        const a = new OBB([0, 0, 0], [1, 1, 1], identity);
        const bOverlap = new OBB([1.5, 0, 0], [1, 1, 1], identity);
        const bFar = new OBB([5, 0, 0], [1, 1, 1], identity);
        // 45도 회전 시 대각 반치수가 sqrt(2) ≈ 1.414이므로 중심 거리 2.2에서 교차
        const bRotatedHit = new OBB([2.2, 0, 0], [1, 1, 1], rotZ45);
        const bRotatedMiss = new OBB([3.0, 0, 0], [1, 1, 1], rotZ45);

        expect(a.intersects(bOverlap)).toBe(true);
        expect(a.intersects(bFar)).toBe(false);
        expect(a.intersects(bRotatedHit)).toBe(true);
        expect(a.intersects(bRotatedMiss)).toBe(false);

        expect(() => a.intersects({} as unknown as OBB)).toThrow();
        expect(() => a.intersects(null as unknown as OBB)).toThrow();
    });

    // 회전된 OBB 로컬 축 기준 점 포함(contains) 및 clone 독립성 검증
    it('evaluates rotated point containment and clones independently', () => {
        const rotZ45 = mat4.rotateZ(mat4.create(), mat4.create(), Math.PI / 4);
        const obb = new OBB([0, 0, 0], [2, 1, 1], rotZ45);

        // 로컬 X축 방향(45도 대각)으로 거리 1.5 지점은 반치수 2 이내이므로 포함
        const diag = 1.5 / Math.SQRT2;
        expect(obb.contains(diag, diag, 0)).toBe(true);
        expect(obb.contains([diag, diag, 0])).toBe(true);

        // 로컬 Y축 방향(135도)으로 거리 1.5 지점은 반치수 1 초과이므로 미포함
        expect(obb.contains(-diag, diag, 0)).toBe(false);
        expect(obb.contains(NaN, 0, 0)).toBe(false);

        const cloned = obb.clone();
        expect(cloned).not.toBe(obb);
        expect(cloned.center).toEqual(obb.center);
        expect(cloned.halfExtents).toEqual(obb.halfExtents);
        expect(cloned.orientation).not.toBe(obb.orientation);
    });
});
