import {describe, expect, it} from 'vitest';
import BaseObject from '../../../src/base/BaseObject';

// 추상 성격의 BaseObject 인스턴스 생성·네이밍 검증용 서브클래스
class TestBaseObject extends BaseObject {
    constructor() {
        super();
    }
}

describe('BaseObject', () => {
    // 생성 시 UUID 및 기본 인스턴스 이름 자동 부여 검증
    it('generates uuid and default instance name', () => {
        const obj = new TestBaseObject();
        expect(typeof obj.uuid).toBe('string');
        expect(obj.uuid.length).toBeGreaterThan(0);
        expect(obj.name).toContain('TestBaseObject Instance');
    });

    // 사용자 지정 이름 설정 및 빈 문자열 입력 시 기본 이름 폴백 검증
    it('allows custom name and falls back to default name when empty string is set', () => {
        const obj = new TestBaseObject();
        obj.name = 'Custom Name';
        expect(obj.name).toBe('Custom Name');

        // 빈 문자열 설정 시 기본 생성 이름 반환 검증
        obj.name = '';
        expect(obj.name).toContain('TestBaseObject Instance');
    });

    // 인스턴스 생성마다 순차적 ID 1씩 증가 검증
    it('increments instance IDs sequentially', () => {
        const obj1 = new TestBaseObject();
        const obj2 = new TestBaseObject();
        const id1 = parseInt(obj1.name.split('Instance ')[1], 10);
        const id2 = parseInt(obj2.name.split('Instance ')[1], 10);
        expect(id2 - id1).toBe(1);
    });
});
