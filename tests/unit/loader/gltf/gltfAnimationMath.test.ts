// gltfAnimationMath Zero-GC 공통 수학 유틸 단위 테스트 (키프레임 탐색, 보간, 쿼터니언/Vec3 샘플링, SLERP 최단 호, 오일러 변환)
import {describe, expect, it, vi} from 'vitest';
import {
    applyQuatToMeshRotation,
    computeInterpolationParams,
    findKeyframeSegment,
    quatToEulerDeg,
    sampleQuatTrack,
    sampleVec3Track,
    slerpQuat
} from '../../../../src/loader/gltf/animationLooper/gltfAnimationMath';

vi.mock('wgsl_reflect', () => ({
    WgslReflect: class {
    }
}));

describe('gltfAnimationMath — Zero-GC SSOT math utilities', () => {
    it('finds keyframe segments via O(1) hint hit, next-segment hit, boundary wrap, and binary search', () => {
        const times = new Float32Array([0, 0.5, 1.0, 2.0, 3.0]);
        const out = new Int32Array(2);

        // 현재 힌트 구간 히트
        findKeyframeSegment(times, 0.25, 0, out);
        expect([out[0], out[1]]).toEqual([0, 1]);

        // 바로 다음 구간 히트 (O(1))
        findKeyframeSegment(times, 0.75, 0, out);
        expect([out[0], out[1]]).toEqual([1, 2]);

        // 점프 시 이진 탐색
        findKeyframeSegment(times, 2.5, 0, out);
        expect([out[0], out[1]]).toEqual([3, 4]);

        // 경계값 (<= first / >= last)
        findKeyframeSegment(times, 0, 2, out);
        expect([out[0], out[1]]).toEqual([4, 0]);
        findKeyframeSegment(times, 3.5, 2, out);
        expect([out[0], out[1]]).toEqual([4, 0]);
    });

    it('computes STEP, LINEAR, and CUBICSPLINE interpolation parameters accurately', () => {
        const cubic = new Float32Array(4);

        // STEP (0)
        expect(computeInterpolationParams(0.75, 0, 1, 0, cubic)).toBe(0);

        // LINEAR (1)
        expect(computeInterpolationParams(0.25, 0, 1, 1, cubic)).toBeCloseTo(0.25);
        // NaN guard (prevTime === nextTime)
        expect(computeInterpolationParams(1, 1, 1, 1, cubic)).toBe(0);

        // CUBICSPLINE (2) at p = 0.5, dt = 2
        const dt = computeInterpolationParams(1.0, 0, 2, 2, cubic);
        expect(dt).toBeCloseTo(2);
        // p = 0.5 -> s2 = 0.5, s3 = -0.125, s0 = 0.5, s1 = 0.125
        expect(cubic[0]).toBeCloseTo(0.5);
        expect(cubic[1]).toBeCloseTo(0.125);
        expect(cubic[2]).toBeCloseTo(0.5);
        expect(cubic[3]).toBeCloseTo(-0.125);
    });

    it('samples Vec3 tracks for LINEAR, last keyframe, and CUBICSPLINE', () => {
        const out = new Float32Array(3);
        const cubic = new Float32Array(4);

        const linearData = new Float32Array([
            0, 10, 20,
            10, 30, 60
        ]);
        sampleVec3Track(linearData, 0, 1, 2, false, 0.5, cubic, out);
        expect(out[0]).toBeCloseTo(5);
        expect(out[1]).toBeCloseTo(20);
        expect(out[2]).toBeCloseTo(40);

        // 마지막 키프레임
        sampleVec3Track(linearData, 1, 0, 2, false, 0, cubic, out);
        expect(out[0]).toBeCloseTo(10);
        expect(out[1]).toBeCloseTo(30);
        expect(out[2]).toBeCloseTo(60);

        // CUBICSPLINE (2키 × 9 floats: inTangent, value, outTangent)
        const cubicData = new Float32Array([
            0, 0, 0, 1, 2, 3, 0, 0, 0,
            0, 0, 0, 5, 6, 7, 0, 0, 0
        ]);
        const dt = computeInterpolationParams(0.5, 0, 1, 2, cubic);
        sampleVec3Track(cubicData, 0, 1, 2, true, dt, cubic, out);
        expect(out[0]).toBeCloseTo(3);
        expect(out[1]).toBeCloseTo(4);
        expect(out[2]).toBeCloseTo(5);
    });

    it('samples Quaternion tracks with SLERP segment caching and shortest-arc flipping', () => {
        const mockTrack = {
            cacheTable: {},
            lastCachedKey: -1,
            lastCachedItem: null
        } as any;
        const out = new Float32Array(4);
        const cubic = new Float32Array(4);

        // 0도 -> 90도 Y축 회전 (두 번째 쿼터니언을 음수 반구로 뒤집어 최단 호 보정 검증)
        const halfSin = Math.sin(Math.PI / 4);
        const halfCos = Math.cos(Math.PI / 4);
        const quatData = new Float32Array([
            0, 0, 0, 1,
            0, -halfSin, 0, -halfCos
        ]);

        sampleQuatTrack(mockTrack, quatData, 0, 1, 2, false, 0.5, cubic, out);
        // 45도 Y축 회전: sin(pi/8), cos(pi/8)
        expect(out[0]).toBeCloseTo(0, 5);
        expect(out[1]).toBeCloseTo(Math.sin(Math.PI / 8), 5);
        expect(out[2]).toBeCloseTo(0, 5);
        expect(out[3]).toBeCloseTo(Math.cos(Math.PI / 8), 5);
        // 캐시 등록 확인
        expect(mockTrack.lastCachedItem).toBeInstanceOf(Float32Array);
    });

    it('performs shortest-arc slerpQuat and converts quaternion to Euler degrees (including gimbal lock)', () => {
        const qOut = new Float32Array(4);
        const eulerOut = new Float32Array(3);

        // 0도 ~ 90도 Y축 회전 중간값 = 45도
        slerpQuat(0, 0, 0, 1, 0, Math.sin(Math.PI / 4), 0, Math.cos(Math.PI / 4), 0.5, qOut);
        quatToEulerDeg(qOut[0], qOut[1], qOut[2], qOut[3], eulerOut);
        expect(eulerOut[0]).toBeCloseTo(0, 4);
        expect(eulerOut[1]).toBeCloseTo(45, 4);
        expect(eulerOut[2]).toBeCloseTo(0, 4);

        // applyQuatToMeshRotation 결과와 quatToEulerDeg 완전 일치 검증
        const mockMesh = {rotationX: 0, rotationY: 0, rotationZ: 0};
        applyQuatToMeshRotation(mockMesh, qOut[0], qOut[1], qOut[2], qOut[3]);
        expect(mockMesh.rotationX).toBeCloseTo(eulerOut[0], 4);
        expect(mockMesh.rotationY).toBeCloseTo(eulerOut[1], 4);
        expect(mockMesh.rotationZ).toBeCloseTo(eulerOut[2], 4);

        // 짐벌락(Y = +90도) 분기에서 NaN 없이 유한 각도 반환 검증
        quatToEulerDeg(0, Math.sin(Math.PI / 4), 0, Math.cos(Math.PI / 4), eulerOut);
        expect(Number.isFinite(eulerOut[0])).toBe(true);
        expect(eulerOut[1]).toBeCloseTo(90, 3);
        expect(eulerOut[2]).toBe(0);
    });
});
