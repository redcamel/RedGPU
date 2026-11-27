import {describe, expect, it} from 'vitest';
import convertHexToRgb from '../../../src/color/convertHexToRgb';

describe('convertHexToRgb', () => {
    // # 접두사 3자리/6자리 HEX 문자열을 RGB 객체로 변환 검증
    it('converts # prefixed hex strings', () => {
        expect(convertHexToRgb('#fff')).toEqual({r: 255, g: 255, b: 255});
        expect(convertHexToRgb('#ffffff')).toEqual({r: 255, g: 255, b: 255});
    });

    // 16진수 숫자 입력을 RGB 객체로 변환 검증
    it('converts numeric hex values', () => {
        expect(convertHexToRgb(0xfff)).toEqual({r: 0, g: 15, b: 255});
        expect(convertHexToRgb(0xffffff)).toEqual({r: 255, g: 255, b: 255});
        expect(convertHexToRgb(0x00ff00)).toEqual({r: 0, g: 255, b: 0});
    });

    // 잘못된 HEX 문자열, NaN, null, undefined 입력 시 예외 발생 검증
    it('throws on invalid hex strings, NaN, null, and undefined', () => {
        // # 없는 문자열이나 0x 문자열 등 허용되지 않는 형식 포함
        const invalidInputs: unknown[] = ['0xfff', '0xffffff', 'ffffff', NaN, null, undefined];
        for (const input of invalidInputs) {
            expect(() => convertHexToRgb(input as string)).toThrow();
        }
    });
});
