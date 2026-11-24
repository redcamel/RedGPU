// KHR_materials_variants 바리에이션 이름 추출 및 이름/인덱스/null 해석 단위 테스트
import {describe, expect, it} from 'vitest';
import {
    extractMaterialVariantNames,
    resolveMaterialVariantIndex
} from '../../../../src/loader/gltf/core/materialVariantsHelper';
import type {GLTF} from '../../../../src/loader/gltf/GLTF';

describe('KHR_materials_variants — extractMaterialVariantNames', () => {
    it('extracts ordered variant names from root KHR_materials_variants extension', () => {
        // 루트 KHR_materials_variants.variants에서 순서대로 이름 추출 검증
        const gltf = {
            asset: {version: '2.0'},
            extensions: {
                KHR_materials_variants: {
                    variants: [{name: 'Midnight'}, {name: 'Beach'}, {name: 'Street'}]
                }
            }
        } as unknown as GLTF;
        expect(extractMaterialVariantNames(gltf)).toEqual(['Midnight', 'Beach', 'Street']);
    });

    it('falls back to Variant_{index} when name is missing and returns empty array if extension is absent', () => {
        // 이름이 누락된 항목 폴백 및 확장 미정의 시 빈 배열 반환 검증
        const gltfWithUnnamed = {
            asset: {version: '2.0'},
            extensions: {
                KHR_materials_variants: {
                    variants: [{name: 'Lamp On'}, {}]
                }
            }
        } as unknown as GLTF;
        expect(extractMaterialVariantNames(gltfWithUnnamed)).toEqual(['Lamp On', 'Variant_1']);
        expect(extractMaterialVariantNames({asset: {version: '2.0'}} as GLTF)).toEqual([]);
        expect(extractMaterialVariantNames(undefined)).toEqual([]);
    });
});

describe('KHR_materials_variants — resolveMaterialVariantIndex', () => {
    const names = ['Midnight', 'Beach', 'Street'];

    it('resolves valid variant names, numeric indices, and null for default restoration', () => {
        // 유효한 이름, 정수 인덱스(0 포함), null 기본 복원 해석 검증
        expect(resolveMaterialVariantIndex(names, 'Midnight')).toBe(0);
        expect(resolveMaterialVariantIndex(names, 'Street')).toBe(2);
        expect(resolveMaterialVariantIndex(names, 0)).toBe(0);
        expect(resolveMaterialVariantIndex(names, 1)).toBe(1);
        expect(resolveMaterialVariantIndex(names, null)).toBeNull();
    });

    it('returns undefined for unknown names, out-of-range indices, NaN, and floats', () => {
        // 알 수 없는 이름, 범위 초과/음수 인덱스, NaN, 소수 입력 거부 검증
        expect(resolveMaterialVariantIndex(names, 'Unknown')).toBeUndefined();
        expect(resolveMaterialVariantIndex(names, -1)).toBeUndefined();
        expect(resolveMaterialVariantIndex(names, 3)).toBeUndefined();
        expect(resolveMaterialVariantIndex(names, NaN)).toBeUndefined();
        expect(resolveMaterialVariantIndex(names, 1.5)).toBeUndefined();
    });
});
