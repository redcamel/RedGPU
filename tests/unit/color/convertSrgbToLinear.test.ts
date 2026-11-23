import {describe, expect, it} from 'vitest';
import convertSrgbToLinear from '../../../src/color/convertSrgbToLinear';

describe('convertSrgbToLinear (IEC 61966-2-1)', () => {
    // 양 끝 경계값(0, 255)이 정확히 0과 1로 매핑되는지 검증
    it('maps endpoints 0 and 255 accurately', () => {
        expect(convertSrgbToLinear(0)).toBe(0);
        expect(convertSrgbToLinear(255)).toBeCloseTo(1, 6);
    });

    // 선형 구간(c <= 0.04045) 및 감마 구간 변환 정밀도와 0~255 단조 증가성 검증
    it('matches exact linear segment (c <= 0.04045) and gamma segment', () => {
        // 저휘도 선형 구간: 10 / 255 ≈ 0.039215686 <= 0.04045
        expect(convertSrgbToLinear(10)).toBeCloseTo(10 / 255 / 12.92, 6);
        // 중간톤 감마 구간
        expect(convertSrgbToLinear(128)).toBeCloseTo(0.2158605, 6);
        // 0~255 전체 LUT 항목의 단조 증가성 검증
        for (let i = 1; i < 256; i++) {
            expect(convertSrgbToLinear(i)).toBeGreaterThan(convertSrgbToLinear(i - 1));
        }
    });
});
