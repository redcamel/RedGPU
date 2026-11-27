import {describe, expect, it} from 'vitest';
import OrthographicCamera from '../../../src/camera/camera/OrthographicCamera';

describe('OrthographicCamera', () => {
    // 기본 직교 경계, 줌 및 클리핑 평면 값 초기화 검증
    it('initializes with default boundaries, zoom, and clipping', () => {
        const cam = new OrthographicCamera();
        expect(cam.top).toBe(1);
        expect(cam.bottom).toBe(-1);
        expect(cam.left).toBe(-1);
        expect(cam.right).toBe(1);
        expect(cam.zoom).toBe(1);
        expect(cam.minZoom).toBe(0.1);
        expect(cam.maxZoom).toBe(10);
        expect(cam.nearClipping).toBe(0.01);
        expect(cam.farClipping).toBe(10000);
    });

    // 직교 경계 및 zoom / setZoom 설정 동작 검증
    it('updates boundaries and zoom via setters and setZoom', () => {
        const cam = new OrthographicCamera();
        cam.top = 10;
        cam.bottom = -10;
        cam.left = -20;
        cam.right = 20;
        expect([cam.top, cam.bottom, cam.left, cam.right]).toEqual([10, -10, -20, 20]);

        cam.minZoom = 0.5;
        cam.maxZoom = 5.0;
        cam.zoom = 2.0;
        expect(cam.zoom).toBe(2.0);
        cam.setZoom(3.0);
        expect(cam.zoom).toBe(3.0);
    });

    // NaN 경계값, 허용 범위 초과 zoom, 음수 minZoom 차단 검증
    it('rejects NaN boundary, out-of-range zoom, and negative minZoom', () => {
        const cam = new OrthographicCamera();
        expect(() => {
            cam.top = NaN;
        }).toThrow();

        // minZoom~maxZoom([1, 2]) 범위를 벗어난 zoom(3) 차단 검증
        cam.minZoom = 1;
        cam.maxZoom = 2;
        expect(() => {
            cam.zoom = 3;
        }).toThrow();

        expect(() => {
            cam.minZoom = -1;
        }).toThrow();
    });
});
