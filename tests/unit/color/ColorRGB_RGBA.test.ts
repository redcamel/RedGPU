import {describe, expect, it} from 'vitest';
import ColorRGB from '../../../src/color/ColorRGB';
import ColorRGBA from '../../../src/color/ColorRGBA';

describe('ColorRGB', () => {
    // 기본값 (255, 255, 255) 초기화 검증
    it('initializes with default values (255, 255, 255)', () => {
        const color = new ColorRGB();
        expect(color.r).toBe(255);
        expect(color.g).toBe(255);
        expect(color.b).toBe(255);
    });

    // 사용자 지정 RGB 값 초기화 검증
    it('initializes with custom RGB values', () => {
        const color = new ColorRGB(100, 150, 200);
        expect(color.r).toBe(100);
        expect(color.g).toBe(150);
        expect(color.b).toBe(200);
    });

    // 채널 값 변경 시 onChange 콜백 호출 검증
    it('invokes onChange callback on mutation', () => {
        let changed = false;
        const color = new ColorRGB(100, 150, 200, () => {
            changed = true;
        });
        color.r = 50;
        expect(changed).toBe(true);
    });

    // r, g, b 개별 채널 Setter/Getter 동작 검증
    it.each(['r', 'g', 'b'] as const)('updates %s channel via setter', (prop) => {
        const color = new ColorRGB();
        color[prop] = 128;
        expect(color[prop]).toBe(128);
    });

    // rgb, rgbNormal, rgbNormalLinear, hex Getter 반환 정밀도 검증
    it('returns rgb, rgbNormal, rgbNormalLinear, and hex getters accurately', () => {
        const color = new ColorRGB(10, 20, 30);
        expect(color.rgb).toEqual([10, 20, 30]);

        // 0~255 범위를 0~1 정규화 값으로 변환
        const normalColor = new ColorRGB(255, 128, 0);
        expect(normalColor.rgbNormal[0]).toBeCloseTo(1, 3);
        expect(normalColor.rgbNormal[1]).toBeCloseTo(128 / 255, 3);
        expect(normalColor.rgbNormal[2]).toBe(0);

        // sRGB -> Linear 색공간 변환 정밀도 검증 (IEC 61966-2-1)
        const linearColor = new ColorRGB(255, 128, 10);
        const linear = linearColor.rgbNormalLinear;
        expect(linear[0]).toBeCloseTo(1, 5);
        expect(linear[1]).toBeCloseTo(0.2158605, 5);
        expect(linear[2]).toBeCloseTo(0.0030353, 5);

        expect(new ColorRGB(255, 0, 0).hex).toBe('#FF0000');
    });

    // setColorByRGB, setColorByHEX, setColorByRGBString 메서드 동작 검증
    it('supports setColorByRGB, setColorByHEX, and setColorByRGBString', () => {
        const color = new ColorRGB();
        color.setColorByRGB(10, 20, 30);
        expect([color.r, color.g, color.b]).toEqual([10, 20, 30]);

        color.setColorByHEX('#FF0000');
        expect([color.r, color.g, color.b]).toEqual([255, 0, 0]);

        color.setColorByHEX(0x00ff00);
        expect([color.r, color.g, color.b]).toEqual([0, 255, 0]);

        color.setColorByRGBString('rgb(10, 20, 30)');
        expect([color.r, color.g, color.b]).toEqual([10, 20, 30]);
    });

    // 0~255 정수를 벗어나는 비정상 입력 목록 (NaN, 음수, 범위 초과, 잘못된 타입 포함)
    const invalidValues: unknown[] = [null, undefined, NaN, -1, 256, 300, '255', {}, [], true, false];

    // r, g, b Setter에 비정상 값 입력 시 예외 발생 검증
    it.each(['r', 'g', 'b'] as const)('rejects invalid values on %s setter', (prop) => {
        const color = new ColorRGB();
        for (const val of invalidValues) {
            expect(() => {
                (color as unknown as Record<string, unknown>)[prop] = val;
            }).toThrow();
        }
    });

    // setColorByRGB, setColorByHEX, setColorByRGBString 잘못된 입력 차단 검증
    it('rejects invalid inputs on setColorByRGB, setColorByHEX, and setColorByRGBString', () => {
        const color = new ColorRGB();
        for (const val of invalidValues) {
            expect(() => color.setColorByRGB(val as number, 0, 0)).toThrow();
        }
        expect(() => color.setColorByHEX('invalid_hex')).toThrow();
        expect(() => color.setColorByRGBString('rgb(255, 0)')).toThrow();
    });
});

describe('ColorRGBA', () => {
    // 기본값 (255, 255, 255, 1) 초기화 검증
    it('initializes with default values (255, 255, 255, 1)', () => {
        const color = new ColorRGBA();
        expect([color.r, color.g, color.b, color.a]).toEqual([255, 255, 255, 1]);
    });

    // 사용자 지정 RGBA 초기화 및 알파 변경 시 onChange 콜백 호출 검증
    it('initializes with custom RGBA values and triggers onChange', () => {
        let changed = false;
        const color = new ColorRGBA(100, 150, 200, 0.5, () => {
            changed = true;
        });
        expect([color.r, color.g, color.b, color.a]).toEqual([100, 150, 200, 0.5]);
        color.a = 0.75;
        expect(color.a).toBe(0.75);
        expect(changed).toBe(true);
    });

    // rgba, rgbaNormal, rgbaNormalLinear Getter 반환 정밀도 검증
    it('returns rgba, rgbaNormal, and rgbaNormalLinear getters accurately', () => {
        const color = new ColorRGBA(10, 20, 30, 0.4);
        expect(color.rgba).toEqual([10, 20, 30, 0.4]);

        const normal = new ColorRGBA(255, 128, 0, 0.5).rgbaNormal;
        expect(normal[0]).toBeCloseTo(1, 3);
        expect(normal[1]).toBeCloseTo(128 / 255, 3);
        expect(normal[2]).toBe(0);
        expect(normal[3]).toBe(0.5);

        // 알파 채널은 선형 변환 없이 원값 유지
        const linear = new ColorRGBA(255, 128, 10, 0.5).rgbaNormalLinear;
        expect(linear[0]).toBeCloseTo(1, 5);
        expect(linear[1]).toBeCloseTo(0.2158605, 5);
        expect(linear[2]).toBeCloseTo(0.0030353, 5);
        expect(linear[3]).toBe(0.5);
    });

    // setColorByRGBA 및 setColorByRGBAString 메서드 동작 검증
    it('supports setColorByRGBA and setColorByRGBAString', () => {
        const color = new ColorRGBA();
        color.setColorByRGBA(10, 20, 30, 0.5);
        expect([color.r, color.g, color.b, color.a]).toEqual([10, 20, 30, 0.5]);

        color.setColorByRGBAString('rgba(15, 25, 35, 0.25)');
        expect([color.r, color.g, color.b, color.a]).toEqual([15, 25, 35, 0.25]);
    });

    // 알파 허용 범위([0, 1]) 초과·NaN 및 잘못된 RGBA 문자열 차단 검증
    it('rejects invalid alpha and string inputs', () => {
        const color = new ColorRGBA();
        const invalidAlphaValues: unknown[] = [null, undefined, NaN, -0.1, 1.1, 2, '0.5', {}, [], true, false];
        for (const val of invalidAlphaValues) {
            expect(() => {
                color.a = val as number;
            }).toThrow();
            expect(() => color.setColorByRGBA(255, 0, 0, val as number)).toThrow();
        }
        expect(() => color.setColorByRGBAString('rgba(255, 0)')).toThrow();
    });
});
