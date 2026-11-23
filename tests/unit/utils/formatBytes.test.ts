import {describe, expect, it} from 'vitest';
import formatBytes from '../../../src/utils/formatBytes';

describe('Util.formatBytes', () => {
    // 바이트 수치를 단위(Bytes, KB, MB, GB) 및 소수점 옵션에 맞게 포맷팅 검증
    it('formats byte values across units and decimal precision', () => {
        expect(formatBytes(0)).toBe('0 Bytes');
        expect(formatBytes(1024)).toBe('1 KB');
        expect(formatBytes(1048576)).toBe('1 MB');
        expect(formatBytes(1073741824)).toBe('1 GB');
        // 소수점 자릿수 0 및 음수 지정 시 0으로 처리되는지 검증
        expect(formatBytes(1500, 0)).toBe('1 KB');
        expect(formatBytes(1500, -2)).toBe('1 KB');
    });

    // 음수, 소수, NaN 및 비숫자 입력 시 예외 발생 검증
    it('throws on negative, float, NaN, and non-numeric byte inputs', () => {
        const invalidValues: unknown[] = [
            null,
            undefined,
            NaN,
            '1024',
            {},
            [],
            true,
            false,
            -1,
            10.5
        ];

        for (const val of invalidValues) {
            expect(() => formatBytes(val as number)).toThrow();
        }
    });
});
