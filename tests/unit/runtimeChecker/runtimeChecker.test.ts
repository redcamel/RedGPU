import {describe, expect, it} from 'vitest';
import isHexColor from '../../../src/runtimeChecker/isFunc/isHexColor';
import isUint from '../../../src/runtimeChecker/isFunc/isUint';
import validateNumber from '../../../src/runtimeChecker/validateFunc/validateNumber';
import validateNumberRange from '../../../src/runtimeChecker/validateFunc/validateNumberRange';
import validatePositiveNumberRange from '../../../src/runtimeChecker/validateFunc/validatePositiveNumberRange';
import validateUintRange from '../../../src/runtimeChecker/validateFunc/validateUintRange';
import validateRedGPUContext from '../../../src/runtimeChecker/validateFunc/validateRedGPUContext';

describe('RuntimeChecker', () => {
    // isHexColor 유효 HEX 문자열·숫자 판별 및 비정상 입력 차단 검증
    it('validates isHexColor formats strictly', () => {
        expect(isHexColor('#fff')).toBe(true);
        expect(isHexColor('#ffffff')).toBe(true);
        expect(isHexColor('#ABCDEF')).toBe(true);
        expect(isHexColor(0xfff)).toBe(true);
        expect(isHexColor(0xffffff)).toBe(true);
        expect(isHexColor(0x00ff00)).toBe(true);
        expect(isHexColor(0)).toBe(true);

        // 잘못된 형식, 범위 초과, 부동소수점, NaN, 비문자열 입력 전수 검증
        const invalidHex: unknown[] = [
            '0xfff', '0xffffff', 'ffffff', 'fff',
            '#gggggg', '#12345', '#1234567', '',
            -1, 0xffffff + 1, 127.5, NaN, Infinity,
            null, undefined, {}, []
        ];
        for (const val of invalidHex) {
            expect(isHexColor(val as string)).toBe(false);
        }
    });

    // isUint 부호 없는 32비트 정수 판별 및 음수·소수·NaN 차단 검증
    it('validates isUint strictly', () => {
        expect(isUint(0)).toBe(true);
        expect(isUint(100)).toBe(true);
        expect(isUint(4294967295)).toBe(true);

        // 음수, 소수, NaN, Infinity, 비숫자 입력 차단 검증
        const invalidUints: unknown[] = [-1, 0.5, -0.1, NaN, Infinity, -Infinity, '10', null, undefined, {}];
        for (const val of invalidUints) {
            expect(isUint(val as number)).toBe(false);
        }
    });

    // validateNumber 정상 숫자 통과 및 NaN·비숫자 예외 발생 검증
    it('validates validateNumber and rejects NaN / non-numbers', () => {
        expect(() => validateNumber(123)).not.toThrow();
        expect(() => validateNumber(0)).not.toThrow();
        expect(() => validateNumber(-123)).not.toThrow();

        expect(() => validateNumber(NaN)).toThrow();
        expect(() => validateNumber('123' as unknown as number)).toThrow();
        expect(() => validateNumber(null as unknown as number)).toThrow();
        expect(() => validateNumber(undefined as unknown as number)).toThrow();
    });

    // validateNumberRange 최소/최대 경계값 통과 및 범위 초과·NaN 차단 검증
    it('validates validateNumberRange and boundary values', () => {
        expect(() => validateNumberRange(50, 0, 100)).not.toThrow();
        expect(() => validateNumberRange(0, 0, 100)).not.toThrow();
        expect(() => validateNumberRange(100, 0, 100)).not.toThrow();

        expect(() => validateNumberRange(101, 0, 100)).toThrow();
        expect(() => validateNumberRange(NaN, 0, 100)).toThrow();
        expect(() => validateNumberRange('50' as unknown as number, 0, 100)).toThrow();
    });

    // validatePositiveNumberRange 양수 범위 검증 및 음수·NaN 차단 검증
    it('validates validatePositiveNumberRange', () => {
        expect(() => validatePositiveNumberRange(10, 5, 20)).not.toThrow();
        expect(() => validatePositiveNumberRange(0, 0, 10)).not.toThrow();

        expect(() => validatePositiveNumberRange(-1, 0, 100)).toThrow();
        expect(() => validatePositiveNumberRange(NaN, 0, 100)).toThrow();
    });

    // validateUintRange 정수 범위 검증 및 소수·음수·NaN 차단 검증
    it('validates validateUintRange', () => {
        expect(() => validateUintRange(10, 0, 100)).not.toThrow();
        expect(() => validateUintRange(10.5, 0, 100)).toThrow();
        expect(() => validateUintRange(101, 0, 100)).toThrow();
        expect(() => validateUintRange(-1, 0, 100)).toThrow();
        expect(() => validateUintRange(NaN, 0, 100)).toThrow();
    });

    // validateRedGPUContext 비정상 컨텍스트 입력 차단 검증
    it('rejects non-RedGPUContext values in validateRedGPUContext', () => {
        // 실제 RedGPUContext 정상 통과 케이스는 E2E initialize.spec.ts에서 검증
        expect(() => validateRedGPUContext({} as never)).toThrow();
        expect(() => validateRedGPUContext(null as never)).toThrow();
        expect(() => validateRedGPUContext(undefined as never)).toThrow();
    });
});
