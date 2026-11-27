// KHR_animation_pointer 규칙 기반 JSON Pointer 경로 파싱 및 보안/경계 방어 단위 테스트
import {describe, expect, it} from 'vitest';
import {parseAnimationPointerPath} from '../../../../src/loader/gltf/parsers/animation/resolveAnimationPointer_GLTF';

describe('KHR_animation_pointer — parseAnimationPointerPath (rule-based)', () => {
    it('resolves core PBR, KHR extensions (including dispersion), and exception material pointers', () => {
        // 코어 PBR, KHR 확장(신규/dispersion 포함), 소수 예외 경로 규칙 해석 검증
        expect(parseAnimationPointerPath('/materials/0/pbrMetallicRoughness/baseColorFactor')).toEqual({
            domain: 'material_property',
            materialIndex: 0,
            propertyKey: 'baseColorFactor',
        });
        expect(parseAnimationPointerPath('/materials/2/alphaCutoff')).toEqual({
            domain: 'material_property',
            materialIndex: 2,
            propertyKey: 'cutOff',
        });
        expect(parseAnimationPointerPath('/materials/1/extensions/KHR_materials_emissive_strength/emissiveStrength')).toEqual({
            domain: 'material_property',
            materialIndex: 1,
            propertyKey: 'emissiveStrength',
        });
        expect(parseAnimationPointerPath('/materials/4/extensions/KHR_materials_dispersion/dispersion')).toEqual({
            domain: 'material_property',
            materialIndex: 4,
            propertyKey: 'KHR_dispersion',
        });
    });

    it('resolves KHR_texture_transform pointers via naming rules for core and extension textures', () => {
        // 코어 및 확장 텍스처의 KHR_texture_transform 규칙 기반 해석 검증
        expect(parseAnimationPointerPath('/materials/10/pbrMetallicRoughness/baseColorTexture/extensions/KHR_texture_transform/offset')).toEqual({
            domain: 'material_texture_transform',
            materialIndex: 10,
            textureKey: 'baseColorTexture',
            transformProp: 'offset',
        });
        expect(parseAnimationPointerPath('/materials/2/normalTexture/extensions/KHR_texture_transform/rotation')).toEqual({
            domain: 'material_texture_transform',
            materialIndex: 2,
            textureKey: 'normalTexture',
            transformProp: 'rotation',
        });
        expect(parseAnimationPointerPath('/materials/70/extensions/KHR_materials_volume/thicknessTexture/extensions/KHR_texture_transform/scale')).toEqual({
            domain: 'material_texture_transform',
            materialIndex: 70,
            textureKey: 'KHR_thicknessTexture',
            transformProp: 'scale',
        });
    });

    it('resolves node visibility, standard node paths, and perspective camera pointers', () => {
        // 노드 가시성, 표준 노드 경로, 원근 카메라(yfov/znear/zfar) 포인터 해석 검증
        expect(parseAnimationPointerPath('/nodes/5/extensions/KHR_node_visibility/visible')).toEqual({
            domain: 'node_visibility',
            nodeIndex: 5,
        });
        expect(parseAnimationPointerPath('/nodes/0/translation')).toEqual({
            domain: 'node_standard',
            nodeIndex: 0,
            path: 'translation',
        });
        expect(parseAnimationPointerPath('/cameras/0/perspective/yfov')).toEqual({
            domain: 'camera_perspective',
            cameraIndex: 0,
            property: 'yfov',
        });
        expect(parseAnimationPointerPath('/cameras/1/perspective/znear')).toEqual({
            domain: 'camera_perspective',
            cameraIndex: 1,
            property: 'znear',
        });
    });

    it('rejects malformed paths, prototype-pollution keys, and unsupported roots safely', () => {
        // 비정상 경로, 프로토타입 오염 키(__proto__/constructor/prototype), 미지원 루트 차단 검증
        expect(parseAnimationPointerPath(undefined)).toBeNull();
        expect(parseAnimationPointerPath('')).toBeNull();
        expect(parseAnimationPointerPath('materials/0/alphaCutoff')).toBeNull();
        expect(parseAnimationPointerPath('/materials/-1/alphaCutoff')).toBeNull();
        expect(parseAnimationPointerPath('/materials/1.5/alphaCutoff')).toBeNull();
        expect(parseAnimationPointerPath('/materials/0/__proto__')).toBeNull();
        expect(parseAnimationPointerPath('/materials/0/constructor')).toBeNull();
        expect(parseAnimationPointerPath('/materials/0/invalidSlot/extensions/KHR_texture_transform/offset')).toBeNull();
        expect(parseAnimationPointerPath('/cameras/0/orthographic/xmag')).toBeNull();
    });
});
