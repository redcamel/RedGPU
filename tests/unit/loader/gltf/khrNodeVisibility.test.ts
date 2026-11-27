// KHR_node_visibility 확장 노드 가시성 해석 단위 테스트
import {describe, expect, it} from 'vitest';
import resolveNodeVisibility from '../../../../src/loader/gltf/core/resolveNodeVisibility';
import type {Node} from '../../../../src/loader/gltf/GLTF';

describe('KHR_node_visibility — resolveNodeVisibility', () => {
    it('returns false only when KHR_node_visibility.visible is explicitly false', () => {
        // KHR_node_visibility.visible 명시적 false/true 및 미지정 기본값(true) 검증
        expect(resolveNodeVisibility({extensions: {KHR_node_visibility: {visible: false}}} as Node)).toBe(false);
        expect(resolveNodeVisibility({extensions: {KHR_node_visibility: {visible: true}}} as Node)).toBe(true);
        expect(resolveNodeVisibility({extensions: {KHR_node_visibility: {}}} as Node)).toBe(true);
        expect(resolveNodeVisibility({} as Node)).toBe(true);
        expect(resolveNodeVisibility(undefined)).toBe(true);
    });

    it('defaults to true when visible has a non-boolean value', () => {
        // 비정상 non-boolean 입력 시 안전하게 true 기본값 유지 검증
        expect(resolveNodeVisibility({extensions: {KHR_node_visibility: {visible: 0}}} as unknown as Node)).toBe(true);
        expect(resolveNodeVisibility({extensions: {KHR_node_visibility: {visible: null}}} as unknown as Node)).toBe(true);
    });
});
