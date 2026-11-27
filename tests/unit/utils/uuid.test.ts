import {describe, expect, it} from 'vitest';
import {createUUID, InstanceIdGenerator, uuidToUint} from '../../../src/utils/uuid';

describe('Util.uuid', () => {
    // createUUID 고유한 36자리 UUID v4 문자열 생성 검증
    it('generates unique 36-character v4 UUID strings', () => {
        const uuid1 = createUUID();
        const uuid2 = createUUID();
        const regex = /^[0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-4[0-9a-zA-Z]{3}-[89aAbB][0-9a-zA-Z]{3}-[0-9a-zA-Z]{12}$/;

        expect(uuid1).toHaveLength(36);
        expect(regex.test(uuid1)).toBe(true);
        expect(uuid1).not.toBe(uuid2);
    });

    // InstanceIdGenerator 클래스별 독립 순차 ID 발급 검증
    it('generates independent sequential IDs per class in InstanceIdGenerator', () => {
        class TestClassA {
        }

        class TestClassB {
        }

        const idA1 = InstanceIdGenerator.getNextId(TestClassA);
        const idA2 = InstanceIdGenerator.getNextId(TestClassA);
        const idB1 = InstanceIdGenerator.getNextId(TestClassB);

        expect(idA2 - idA1).toBe(1);
        // 신규 클래스는 0부터 독립 카운트 시작
        expect(idB1).toBe(0);
    });

    // uuidToUint 부호 없는 정수 변환 및 비문자열 입력 차단 검증
    it('converts UUID strings to uint32 and rejects non-string inputs', () => {
        expect(uuidToUint('123e4567-e89b-12d3-a456-426614174000')).toBe(parseInt('123e4567', 16));

        const generatedUint = uuidToUint(createUUID());
        expect(Number.isNaN(generatedUint)).toBe(false);
        expect(generatedUint).toBeGreaterThanOrEqual(0);

        const invalidValues: unknown[] = [null, undefined, NaN, 123, {}, []];
        for (const val of invalidValues) {
            expect(() => uuidToUint(val as string)).toThrow();
        }
    });
});
