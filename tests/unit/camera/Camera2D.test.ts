import {describe, expect, it} from 'vitest';
import Camera2D from '../../../src/camera/camera/Camera2D';

describe('Camera2D', () => {
    // 기본 위치 원점(0, 0) 및 읽기 전용 z = 0 초기화 검증
    it('initializes at origin with z = 0', () => {
        const cam = new Camera2D();
        expect(cam.x).toBe(0);
        expect(cam.y).toBe(0);
        expect(cam.z).toBe(0);
    });

    // x, y 변경 시 position 및 viewMatrix 평행 이동 성분 반영 검증
    it('updates x, y, position, and viewMatrix translation', () => {
        const cam = new Camera2D();
        cam.x = 100;
        cam.y = 200;
        expect(cam.x).toBe(100);
        expect(cam.y).toBe(200);
        expect(cam.position).toEqual([100, 200]);

        // 열 우선(Column-major) 행렬의 12, 13번 인덱스에 x, y가 저장되는지 확인
        cam.x = 123;
        cam.y = 456;
        const mat = cam.viewMatrix;
        expect(mat[12]).toBe(123);
        expect(mat[13]).toBe(456);
    });

    // setPosition의 개별 좌표 인자 및 배열 인자 지원 검증
    it('supports setPosition with coordinates and tuple array', () => {
        const cam = new Camera2D();
        cam.setPosition(10, 20);
        expect(cam.x).toBe(10);
        expect(cam.y).toBe(20);

        cam.setPosition([30, 40]);
        expect(cam.x).toBe(30);
        expect(cam.y).toBe(40);
        expect(cam.z).toBe(0);
    });
});
