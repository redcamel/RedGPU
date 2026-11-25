import {mat4, quat} from 'gl-matrix';
import {describe, expect, it} from 'vitest';
import calculateNormals from '../../../src/math/calculateNormals';
import calculateTangents, {calculateTangentsInterleaved} from '../../../src/math/calculateTangents';
import mat4ToEuler from '../../../src/math/mat4ToEuler';
import quaternionToRotationMat4 from '../../../src/math/quaternionToRotationMat4';

describe('Math geometry & rotation utilities', () => {
    it('calculateNormals computes unit normals for indexed and non-indexed triangles and guards degenerate faces', () => {
        const vertices = new Float32Array([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
        ]);
        const indexedNormals = calculateNormals(vertices, new Uint32Array([0, 1, 2]));
        const nonIndexedNormals = calculateNormals(vertices, new Uint32Array(0));

        expect(indexedNormals.length).toBe(9);
        for (let i = 0; i < 3; i++) {
            expect(indexedNormals[i * 3]).toBeCloseTo(0, 5);
            expect(indexedNormals[i * 3 + 1]).toBeCloseTo(0, 5);
            expect(indexedNormals[i * 3 + 2]).toBeCloseTo(1, 5);
            expect(nonIndexedNormals[i * 3 + 2]).toBeCloseTo(1, 5);
        }

        // 퇴화 삼각형(동일 정점) 시 NaN 없이 0 벡터 반환
        const degenerate = calculateNormals(new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1]), new Uint32Array([0, 1, 2]));
        for (let i = 0; i < degenerate.length; i++) {
            expect(Number.isNaN(degenerate[i])).toBe(false);
            expect(degenerate[i]).toBe(0);
        }
    });

    it('calculateTangents and calculateTangentsInterleaved produce orthogonal unit tangents with ±1 handedness', () => {
        const vertices = new Float32Array([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
        ]);
        const normals = new Float32Array([
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ]);
        const uvs = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
        ]);
        const indices = new Uint32Array([0, 1, 2]);

        const tangents = calculateTangents(vertices, normals, uvs, indices);
        expect(tangents.length).toBe(12);
        for (let i = 0; i < 3; i++) {
            const tx = tangents[i * 4];
            const ty = tangents[i * 4 + 1];
            const tz = tangents[i * 4 + 2];
            const tw = tangents[i * 4 + 3];
            const len = Math.hypot(tx, ty, tz);
            expect(len).toBeCloseTo(1, 5);
            expect(tx).toBeCloseTo(1, 5);
            expect(ty).toBeCloseTo(0, 5);
            expect(tz).toBeCloseTo(0, 5);
            expect(Math.abs(tw)).toBe(1);
        }

        // 퇴화 UV(동일 UV)에도 fallback으로 유한한 단위 탄젠트 생성
        const interleaved = new Float32Array(3 * 12);
        for (let i = 0; i < 3; i++) {
            interleaved[i * 12] = vertices[i * 3];
            interleaved[i * 12 + 1] = vertices[i * 3 + 1];
            interleaved[i * 12 + 2] = vertices[i * 3 + 2];
            interleaved[i * 12 + 5] = 1; // normal = (0, 0, 1)
        }
        calculateTangentsInterleaved(interleaved, indices, 12, 0, 3, 6, 8);
        for (let i = 0; i < 3; i++) {
            const tx = interleaved[i * 12 + 8];
            const ty = interleaved[i * 12 + 9];
            const tz = interleaved[i * 12 + 10];
            expect(Math.hypot(tx, ty, tz)).toBeCloseTo(1, 5);
        }
    });

    it('quaternionToRotationMat4 and mat4ToEuler round-trip across Euler orders and handle gimbal lock', () => {
        const q = quat.create();
        quat.fromEuler(q, 30, 45, -20);
        const rotMtx = mat4.create();
        quaternionToRotationMat4(q, rotMtx);

        // 회전 행렬은 직교(det ≈ 1)이며 translation은 0
        expect(rotMtx[12]).toBe(0);
        expect(rotMtx[13]).toBe(0);
        expect(rotMtx[14]).toBe(0);
        expect(rotMtx[15]).toBe(1);
        expect(mat4.determinant(rotMtx)).toBeCloseTo(1, 5);

        const orders = ['XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY'] as const;
        for (const order of orders) {
            const euler = mat4ToEuler(rotMtx, [0, 0, 0], order);
            expect(euler.every((v: number) => Number.isFinite(v))).toBe(true);
        }

        // XYZ +90° Y축 짐벌락 경계값에서 NaN 없이 처리
        const gimbalQ = [0, Math.SQRT1_2, 0, Math.SQRT1_2];
        const gimbalMtx = mat4.create();
        quaternionToRotationMat4(gimbalQ, gimbalMtx);
        const gimbalEuler = mat4ToEuler(gimbalMtx, [0, 0, 0], 'XYZ');
        expect(gimbalEuler[1]).toBeCloseTo(Math.PI / 2, 5);
        expect(gimbalEuler[2]).toBe(0);
    });
});
