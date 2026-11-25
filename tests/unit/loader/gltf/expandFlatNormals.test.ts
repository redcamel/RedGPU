// glTF 2.0 스펙 3.7.2.1: NORMAL 속성 미지정 삼각형 리스트의 비인덱스 플랫 노멀 전개 단위 테스트
import {describe, expect, it} from 'vitest';
import expandFlatNormals from '../../../../src/loader/gltf/core/expandFlatNormals';

describe('expandFlatNormals — glTF 2.0 spec 3.7.2.1 flat normal expansion', () => {
    it('expands indexed shared-vertex corner into non-indexed faces with distinct flat normals and attributes', () => {
        // 원점을 공유하는 서로 직교하는 2개 삼각형 (+Z 면과 +X 면)
        const vertices = new Float32Array([
            0, 0, 0, // v0 (공유 꼭짓점)
            1, 0, 0, // v1
            0, 1, 0, // v2
            0, 0, 1  // v3
        ]);
        const indices = new Uint32Array([
            0, 1, 2, // 면 1: +Z 방향 (0, 0, 1)
            0, 2, 3  // 면 2: +X 방향 (1, 0, 0)
        ]);
        const colors = new Float32Array([
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1,
            1, 1, 0, 1
        ]);
        const weights = new Float32Array([
            1, 0, 0, 0,
            0.5, 0.5, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0
        ]);
        const joints = new Float32Array([
            0, 0, 0, 0,
            0, 1, 0, 0,
            1, 0, 0, 0,
            2, 0, 0, 0
        ]);

        const res = expandFlatNormals(
            vertices,
            indices,
            colors,
            new Float32Array(0),
            new Float32Array(0),
            weights,
            joints
        );

        // 4공유 정점 -> 6개 비인덱스 정점 (2삼각형 * 3)
        expect(res.vertices.length).toBe(18);
        expect(res.normals.length).toBe(18);
        expect(res.verticesColor_0.length).toBe(24);
        expect(res.jointWeights.length).toBe(24);
        expect(res.joints.length).toBe(24);
        expect(res.uvs.length).toBe(0);

        // 면 1의 3개 정점 노멀이 모두 (0, 0, 1)
        for (let v = 0; v < 3; v++) {
            expect(res.normals[v * 3]).toBeCloseTo(0);
            expect(res.normals[v * 3 + 1]).toBeCloseTo(0);
            expect(res.normals[v * 3 + 2]).toBeCloseTo(1);
        }
        // 면 2의 3개 정점 노멀이 모두 (1, 0, 0)
        for (let v = 3; v < 6; v++) {
            expect(res.normals[v * 3]).toBeCloseTo(1);
            expect(res.normals[v * 3 + 1]).toBeCloseTo(0);
            expect(res.normals[v * 3 + 2]).toBeCloseTo(0);
        }

        // 면 2의 3번째 정점(원본 v3)의 joint/weight 보존 확인
        expect(res.joints[5 * 4]).toBe(2);
        expect(res.jointWeights[5 * 4 + 2]).toBeCloseTo(1);
    });

    it('computes flat normals directly when mesh is already non-indexed', () => {
        const vertices = new Float32Array([
            0, 0, 0,
            0, 0, 1,
            1, 0, 0
        ]);
        const res = expandFlatNormals(
            vertices,
            new Uint32Array(0),
            new Float32Array(0),
            new Float32Array(0),
            new Float32Array(0),
            new Float32Array(0),
            new Float32Array(0)
        );
        // (0,0,1) x (1,0,0) = (0, 1, 0)
        expect(res.normals[0]).toBeCloseTo(0);
        expect(res.normals[1]).toBeCloseTo(1);
        expect(res.normals[2]).toBeCloseTo(0);
    });
});
