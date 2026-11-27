import {describe, expect, it} from 'vitest';
import {AABB} from '../../../src/bound/AABB';

describe('Bound.AABB', () => {
    // 기본 생성자 및 사용자 지정 경계값에 따른 중심·크기·외접 반지름 계산 검증
    it('computes center, size, and geometryRadius from bounds', () => {
        const zero = new AABB();
        expect([zero.minX, zero.maxX, zero.minY, zero.maxY, zero.minZ, zero.maxZ]).toEqual([0, 0, 0, 0, 0, 0]);
        expect(zero.geometryRadius).toBe(0);

        const box = new AABB(-2, 4, -1, 3, 0, 6);
        expect([box.centerX, box.centerY, box.centerZ]).toEqual([1, 1, 3]);
        expect([box.xSize, box.ySize, box.zSize]).toEqual([6, 4, 6]);
        // 반치수 (3, 2, 3) -> sqrt(9 + 4 + 9) = sqrt(22)
        expect(box.geometryRadius).toBeCloseTo(Math.sqrt(22), 5);
    });

    // set, copy, clone 메서드의 제자리 갱신 및 독립 복제 동작 검증
    it('updates in-place with set/copy and creates an independent copy with clone', () => {
        const a = new AABB(-1, 1, -1, 1, -1, 1);
        const b = new AABB();
        b.copy(a);
        expect([b.minX, b.maxX, b.ySize, b.zSize]).toEqual([-1, 1, 2, 2]);

        const c = a.clone();
        expect(c).not.toBe(a);
        a.set(10, 20, 10, 20, 10, 20);
        expect(a.centerX).toBe(15);
        // 원본 변경 후에도 clone 인스턴스는 기존 값을 유지해야 함
        expect(c.centerX).toBe(0);
    });

    // AABB 간 교차(intersects) 판정 및 비정상 인자 차단 검증
    it('tests intersection accurately and throws on non-AABB argument', () => {
        const a = new AABB(-1, 1, -1, 1, -1, 1);
        const overlapping = new AABB(0, 2, 0, 2, 0, 2);
        const touching = new AABB(1, 3, -1, 1, -1, 1);
        const separated = new AABB(2, 4, -1, 1, -1, 1);

        expect(a.intersects(overlapping)).toBe(true);
        // 경계면 접촉도 교차로 판정 (<= / >=)
        expect(a.intersects(touching)).toBe(true);
        expect(a.intersects(separated)).toBe(false);

        expect(() => a.intersects({} as unknown as AABB)).toThrow();
        expect(() => a.intersects(null as unknown as AABB)).toThrow();
    });

    // 좌표 인자 및 튜플 배열 형태의 점 포함(contains) 판정 검증
    it('checks point containment with both coordinate arguments and tuple array', () => {
        const box = new AABB(-1, 1, -2, 2, -3, 3);

        expect(box.contains(0, 0, 0)).toBe(true);
        expect(box.contains(-1, 2, 3)).toBe(true);
        expect(box.contains(1.01, 0, 0)).toBe(false);

        expect(box.contains([0, -2, 3])).toBe(true);
        expect(box.contains([0, 0, -3.1])).toBe(false);
        // NaN 좌표는 내부에 포함되지 않아야 함
        expect(box.contains(NaN, 0, 0)).toBe(false);
    });
});
