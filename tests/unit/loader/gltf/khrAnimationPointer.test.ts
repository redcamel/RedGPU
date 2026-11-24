// KHR_animation_pointer JSON Pointer 경로 파싱 및 경계/미지원 경로 방어 단위 테스트
import {describe, expect, it} from 'vitest';
import {parseAnimationPointerPath} from '../../../../src/loader/gltf/parsers/animation/resolveAnimationPointer_GLTF';

describe('KHR_animation_pointer — parseAnimationPointerPath', () => {
    it('parses standard material PBR and KHR extension scalar/vector pointers', () => {
        // 기본 PBR 및 확장 머티리얼 스칼라/벡터 경로 해석 검증
        expect(parseAnimationPointerPath('/materials/0/pbrMetallicRoughness/baseColorFactor')).toEqual({
            domain: 'material_property',
            materialIndex: 0,
            propertyKey: 'baseColorFactor',
            componentCount: 4,
        });
        expect(parseAnimationPointerPath('/materials/2/alphaCutoff')).toEqual({
            domain: 'material_property',
            materialIndex: 2,
            propertyKey: 'cutOff',
            componentCount: 1,
        });
        expect(parseAnimationPointerPath('/materials/3/emissiveFactor')).toEqual({
            domain: 'material_property',
            materialIndex: 3,
            propertyKey: 'emissiveFactor',
            componentCount: 3,
        });
        expect(parseAnimationPointerPath('/materials/1/extensions/KHR_materials_emissive_strength/emissiveStrength')).toEqual({
            domain: 'material_property',
            materialIndex: 1,
            propertyKey: 'emissiveStrength',
            componentCount: 1,
        });
    });

    it('parses KHR_texture_transform offset, scale, and rotation pointers across core and extension textures', () => {
        // 기본 텍스처 및 확장 텍스처의 KHR_texture_transform (offset/scale/rotation) 경로 해석 검증
        expect(parseAnimationPointerPath('/materials/10/pbrMetallicRoughness/baseColorTexture/extensions/KHR_texture_transform/offset')).toEqual({
            domain: 'material_texture_transform',
            materialIndex: 10,
            textureKey: 'baseColorTexture',
            transformProp: 'offset',
            componentCount: 2,
        });
        expect(parseAnimationPointerPath('/materials/2/normalTexture/extensions/KHR_texture_transform/rotation')).toEqual({
            domain: 'material_texture_transform',
            materialIndex: 2,
            textureKey: 'normalTexture',
            transformProp: 'rotation',
            componentCount: 1,
        });
        expect(parseAnimationPointerPath('/materials/70/extensions/KHR_materials_volume/thicknessTexture/extensions/KHR_texture_transform/scale')).toEqual({
            domain: 'material_texture_transform',
            materialIndex: 70,
            textureKey: 'KHR_thicknessTexture',
            transformProp: 'scale',
            componentCount: 2,
        });
    });

    it('parses node visibility and standard node TRS/weights pointers', () => {
        // KHR_node_visibility 및 표준 노드(translation/rotation/scale/weights) 포인터 해석 검증
        expect(parseAnimationPointerPath('/nodes/5/extensions/KHR_node_visibility/visible')).toEqual({
            domain: 'node_visibility',
            nodeIndex: 5,
        });
        expect(parseAnimationPointerPath('/nodes/0/translation')).toEqual({
            domain: 'node_standard',
            nodeIndex: 0,
            path: 'translation',
        });
        expect(parseAnimationPointerPath('/nodes/1/weights')).toEqual({
            domain: 'node_standard',
            nodeIndex: 1,
            path: 'weights',
        });
    });

    it('returns null safely for invalid, malformed, negative-index, or unsupported pointer paths', () => {
        // 빈 문자열, 슬래시 누락, 음수/비정수 인덱스, 미지원 경로 안전 무시(null) 검증
        expect(parseAnimationPointerPath(undefined)).toBeNull();
        expect(parseAnimationPointerPath('')).toBeNull();
        expect(parseAnimationPointerPath('materials/0/alphaCutoff')).toBeNull();
        expect(parseAnimationPointerPath('/materials/-1/alphaCutoff')).toBeNull();
        expect(parseAnimationPointerPath('/materials/1.5/alphaCutoff')).toBeNull();
        expect(parseAnimationPointerPath('/materials/0/unsupportedProp')).toBeNull();
        expect(parseAnimationPointerPath('/materials/0/unknownTex/extensions/KHR_texture_transform/offset')).toBeNull();
        expect(parseAnimationPointerPath('/cameras/0/perspective/yfov')).toBeNull();
    });
});
