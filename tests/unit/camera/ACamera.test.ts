import {describe, expect, it} from 'vitest';
import ACamera from '../../../src/camera/core/ACamera';

// 추상 클래스 ACamera의 기본 노출·상태 동작 검증용 테스트 서브클래스
class TestCamera extends ACamera {
    constructor() {
        super();
    }
}

describe('ACamera', () => {
    // 기본 물리 노출 프로퍼티(aperture, shutterSpeed, iso, useAutoExposure) 초기화 검증
    it('initializes with default exposure properties', () => {
        const cam = new TestCamera();
        expect(cam.aperture).toBe(16.0);
        expect(cam.shutterSpeed).toBe(1 / 125);
        expect(cam.iso).toBe(100);
        expect(cam.useAutoExposure).toBe(true);
    });

    // aperture, shutterSpeed, iso Setter/Getter 동작 검증
    it('gets and sets aperture, shutterSpeed, and iso', () => {
        const cam = new TestCamera();
        cam.aperture = 2.8;
        cam.shutterSpeed = 1 / 250;
        cam.iso = 800;

        expect(cam.aperture).toBe(2.8);
        expect(cam.shutterSpeed).toBe(1 / 250);
        expect(cam.iso).toBe(800);
    });

    // aperture에 NaN 입력 시 예외 발생 검증
    it('rejects NaN on aperture', () => {
        const cam = new TestCamera();
        expect(() => {
            cam.aperture = NaN;
        }).toThrow();
    });

    // useAutoExposure 비활성화 시 물리 공식 기반 EV100 계산 정밀도 검증
    it('calculates ev100 accurately when useAutoExposure is disabled', () => {
        const cam = new TestCamera();
        cam.useAutoExposure = false;
        cam.aperture = 16.0;
        cam.shutterSpeed = 1 / 125;
        cam.iso = 100;

        // EV100 = log2((N^2 / t) * (100 / ISO))
        const expected = Math.log2((16 * 16) / (1 / 125));
        expect(cam.ev100).toBeCloseTo(expected, 4);
    });

    // useAutoExposure 토글 및 updateExposure() 안전 실행 검증
    it('toggles useAutoExposure and executes updateExposure safely', () => {
        const cam = new TestCamera();
        cam.useAutoExposure = false;
        expect(cam.useAutoExposure).toBe(false);
        expect(cam.iso).toBe(100);

        cam.useAutoExposure = true;
        expect(cam.useAutoExposure).toBe(true);
        expect(() => cam.updateExposure()).not.toThrow();
    });
});
