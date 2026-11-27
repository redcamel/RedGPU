import {describe, expect, it} from 'vitest';
import PerspectiveCamera from '../../../src/camera/camera/PerspectiveCamera';

describe('PerspectiveCamera', () => {
    // 기본 변환(위치·회전) 및 원근 투영 프로퍼티 초기화 검증
    it('initializes with default transform and projection properties', () => {
        const cam = new PerspectiveCamera();
        expect(cam.x).toBe(0);
        expect(cam.y).toBe(0);
        expect(cam.z).toBe(0);
        expect(cam.rotationX).toBe(0);
        expect(cam.rotationY).toBe(0);
        expect(cam.rotationZ).toBe(0);
        expect(cam.fieldOfView).toBe(60);
        expect(cam.nearClipping).toBe(0.1);
        expect(cam.farClipping).toBe(50000);
    });

    // 위치, 회전, FOV 및 클리핑 평면 Setter/Getter 동작 검증
    it('updates position, rotation, and projection getters/setters', () => {
        const cam = new PerspectiveCamera();
        cam.x = 1;
        cam.y = 2;
        cam.z = 3;
        expect([cam.x, cam.y, cam.z]).toEqual([1, 2, 3]);

        cam.rotationX = 0.5;
        cam.rotationY = 1.0;
        cam.rotationZ = 1.5;
        expect([cam.rotationX, cam.rotationY, cam.rotationZ]).toEqual([0.5, 1.0, 1.5]);

        cam.fieldOfView = 75;
        cam.nearClipping = 0.1;
        cam.farClipping = 5000;
        expect(cam.fieldOfView).toBe(75);
        expect(cam.nearClipping).toBe(0.1);
        expect(cam.farClipping).toBe(5000);
    });

    // fieldOfView에 NaN 입력 시 예외 발생 검증
    it('rejects NaN on fieldOfView', () => {
        const cam = new PerspectiveCamera();
        expect(() => {
            cam.fieldOfView = NaN;
        }).toThrow();
    });

    // setPosition, lookAt 실행 및 16요소 Float32Array viewMatrix 반환 검증
    it('updates position via setPosition, executes lookAt, and exposes Float32Array viewMatrix', () => {
        const cam = new PerspectiveCamera();
        cam.setPosition(10, 20, 30);
        expect(Array.from(cam.position)).toEqual([10, 20, 30]);

        // 원점을 바라보도록 뷰 행렬 갱신 검증
        cam.setPosition(0, 0, 10);
        expect(() => cam.lookAt(0, 0, 0)).not.toThrow();
        expect(cam.viewMatrix).toBeInstanceOf(Float32Array);
        expect(cam.viewMatrix.length).toBe(16);
    });
});
