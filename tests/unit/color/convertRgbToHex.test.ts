import {describe, expect, it} from 'vitest';
import convertRgbToHex from '../../../src/color/convertRgbToHex';

describe('convertRgbToHex', () => {
    // 유효한 RGB(0~255) 값을 대문자 HEX 문자열로 변환 검증
    it('converts valid RGB values to uppercase HEX string', () => {
        expect(convertRgbToHex(255, 0, 0)).toBe('#FF0000');
        expect(convertRgbToHex(0, 255, 0)).toBe('#00FF00');
        expect(convertRgbToHex(0, 0, 255)).toBe('#0000FF');
        expect(convertRgbToHex(255, 255, 255)).toBe('#FFFFFF');
        expect(convertRgbToHex(0, 0, 0)).toBe('#000000');
        expect(convertRgbToHex(128, 128, 128)).toBe('#808080');
    });

    // R, G, B 채널에 NaN 또는 범위 초과 값 입력 시 예외 발생 검증
    it('throws on invalid R, G, or B values including NaN and out-of-range', () => {
        const invalidValues: unknown[] = [null, undefined, NaN, {}, [], true, false, '255', -1, 256, 300];
        for (const val of invalidValues) {
            // R, G, B 각 채널별로 개별 유효성 검증
            expect(() => convertRgbToHex(val as number, 0, 0)).toThrow();
            expect(() => convertRgbToHex(0, val as number, 0)).toThrow();
            expect(() => convertRgbToHex(0, 0, val as number)).toThrow();
        }
    });
});
