import Mesh from "../../../../display/mesh/Mesh";
import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import {GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";

/**
 * [KO] `KHR_animation_pointer` 트랙의 런타임 Zero-GC 프로퍼티 적용 바인딩 타입입니다.
 * [EN] Runtime Zero-GC property binding type for a `KHR_animation_pointer` animation track.
 *
 * @category GLTF
 */
export type PointerTargetBinding = {
    componentCount: 1 | 2 | 3 | 4;
    apply: (v0: number, v1: number, v2: number, v3: number) => void;
};

/**
 * [KO] JSON Pointer 문자열의 구조적 파싱 결과 타입입니다.
 * [EN] Structurally parsed result type of a JSON Pointer string.
 *
 * @category GLTF
 */
export type ParsedPointerDescriptor =
    | {
    domain: 'node_standard';
    nodeIndex: number;
    path: 'translation' | 'rotation' | 'scale' | 'weights';
}
    | {
    domain: 'node_visibility';
    nodeIndex: number;
}
    | {
    domain: 'material_property';
    materialIndex: number;
    propertyKey: string;
    componentCount: 1 | 3 | 4;
}
    | {
    domain: 'material_texture_transform';
    materialIndex: number;
    textureKey: string;
    transformProp: 'offset' | 'scale' | 'rotation';
    componentCount: 1 | 2;
};

const TEXTURE_POINTER_TO_MATERIAL_KEY: Record<string, string> = Object.freeze({
    'pbrMetallicRoughness/baseColorTexture': 'baseColorTexture',
    'pbrMetallicRoughness/metallicRoughnessTexture': 'metallicRoughnessTexture',
    'normalTexture': 'normalTexture',
    'emissiveTexture': 'emissiveTexture',
    'occlusionTexture': 'occlusionTexture',
    'extensions/KHR_materials_anisotropy/anisotropyTexture': 'KHR_anisotropyTexture',
    'extensions/KHR_materials_clearcoat/clearcoatTexture': 'KHR_clearcoatTexture',
    'extensions/KHR_materials_clearcoat/clearcoatRoughnessTexture': 'KHR_clearcoatRoughnessTexture',
    'extensions/KHR_materials_clearcoat/clearcoatNormalTexture': 'KHR_clearcoatNormalTexture',
    'extensions/KHR_materials_diffuse_transmission/diffuseTransmissionTexture': 'KHR_diffuseTransmissionTexture',
    'extensions/KHR_materials_diffuse_transmission/diffuseTransmissionColorTexture': 'KHR_diffuseTransmissionColorTexture',
    'extensions/KHR_materials_iridescence/iridescenceTexture': 'KHR_iridescenceTexture',
    'extensions/KHR_materials_iridescence/iridescenceThicknessTexture': 'KHR_iridescenceThicknessTexture',
    'extensions/KHR_materials_sheen/sheenColorTexture': 'KHR_sheenColorTexture',
    'extensions/KHR_materials_sheen/sheenRoughnessTexture': 'KHR_sheenRoughnessTexture',
    'extensions/KHR_materials_specular/specularTexture': 'KHR_specularTexture',
    'extensions/KHR_materials_specular/specularColorTexture': 'KHR_specularColorTexture',
    'extensions/KHR_materials_transmission/transmissionTexture': 'KHR_transmissionTexture',
    'extensions/KHR_materials_volume/thicknessTexture': 'KHR_thicknessTexture',
});

const MATERIAL_PROPERTY_MAP: Record<string, { key: string; count: 1 | 3 | 4 }> = Object.freeze({
    'pbrMetallicRoughness/baseColorFactor': {key: 'baseColorFactor', count: 4},
    'pbrMetallicRoughness/metallicFactor': {key: 'metallicFactor', count: 1},
    'pbrMetallicRoughness/roughnessFactor': {key: 'roughnessFactor', count: 1},
    'emissiveFactor': {key: 'emissiveFactor', count: 3},
    'alphaCutoff': {key: 'cutOff', count: 1},
    'normalTexture/scale': {key: 'normalScale', count: 1},
    'occlusionTexture/strength': {key: 'occlusionStrength', count: 1},
    'extensions/KHR_materials_emissive_strength/emissiveStrength': {key: 'emissiveStrength', count: 1},
    'extensions/KHR_materials_ior/ior': {key: 'KHR_ior', count: 1},
    'extensions/KHR_materials_transmission/transmissionFactor': {key: 'KHR_transmissionFactor', count: 1},
    'extensions/KHR_materials_volume/thicknessFactor': {key: 'KHR_thicknessFactor', count: 1},
    'extensions/KHR_materials_volume/attenuationDistance': {key: 'KHR_attenuationDistance', count: 1},
    'extensions/KHR_materials_volume/attenuationColor': {key: 'KHR_attenuationColor', count: 3},
    'extensions/KHR_materials_clearcoat/clearcoatFactor': {key: 'KHR_clearcoatFactor', count: 1},
    'extensions/KHR_materials_clearcoat/clearcoatRoughnessFactor': {key: 'KHR_clearcoatRoughnessFactor', count: 1},
    'extensions/KHR_materials_sheen/sheenColorFactor': {key: 'KHR_sheenColorFactor', count: 3},
    'extensions/KHR_materials_sheen/sheenRoughnessFactor': {key: 'KHR_sheenRoughnessFactor', count: 1},
    'extensions/KHR_materials_specular/specularFactor': {key: 'KHR_specularFactor', count: 1},
    'extensions/KHR_materials_specular/specularColorFactor': {key: 'KHR_specularColorFactor', count: 3},
    'extensions/KHR_materials_iridescence/iridescenceFactor': {key: 'KHR_iridescenceFactor', count: 1},
    'extensions/KHR_materials_iridescence/iridescenceIor': {key: 'KHR_iridescenceIor', count: 1},
    'extensions/KHR_materials_iridescence/iridescenceThicknessMinimum': {
        key: 'KHR_iridescenceThicknessMinimum',
        count: 1
    },
    'extensions/KHR_materials_iridescence/iridescenceThicknessMaximum': {
        key: 'KHR_iridescenceThicknessMaximum',
        count: 1
    },
    'extensions/KHR_materials_anisotropy/anisotropyStrength': {key: 'KHR_anisotropyStrength', count: 1},
    'extensions/KHR_materials_anisotropy/anisotropyRotation': {key: 'KHR_anisotropyRotation', count: 1},
    'extensions/KHR_materials_diffuse_transmission/diffuseTransmissionFactor': {
        key: 'KHR_diffuseTransmissionFactor',
        count: 1
    },
    'extensions/KHR_materials_diffuse_transmission/diffuseTransmissionColorFactor': {
        key: 'KHR_diffuseTransmissionColorFactor',
        count: 3
    },
});

/**
 * [KO] `KHR_animation_pointer` JSON Pointer 문자열을 해석하여 구조화된 타겟 디스크립터를 반환합니다.
 * [EN] Parses a `KHR_animation_pointer` JSON Pointer string into a structured target descriptor.
 *
 * @param pointer -
 * [KO] JSON Pointer 경로 문자열 (예: `/materials/0/pbrMetallicRoughness/baseColorFactor`)
 * [EN] JSON Pointer path string (e.g., `/materials/0/pbrMetallicRoughness/baseColorFactor`)
 * @returns
 * [KO] 해석된 디스크립터 또는 미지원/유효하지 않은 경로인 경우 `null`
 * [EN] Parsed descriptor, or `null` if unsupported or invalid
 * @category GLTF
 */
export const parseAnimationPointerPath = (pointer?: string): ParsedPointerDescriptor | null => {
    if (typeof pointer !== 'string' || !pointer.startsWith('/')) return null;
    const segments = pointer.slice(1).split('/');
    if (segments.length < 3) return null;

    const root = segments[0];
    const index = Number(segments[1]);
    if (!Number.isInteger(index) || index < 0) return null;

    const subPath = segments.slice(2).join('/');

    if (root === 'nodes') {
        if (subPath === 'translation' || subPath === 'rotation' || subPath === 'scale' || subPath === 'weights') {
            return {domain: 'node_standard', nodeIndex: index, path: subPath};
        }
        if (subPath === 'extensions/KHR_node_visibility/visible') {
            return {domain: 'node_visibility', nodeIndex: index};
        }
        return null;
    }

    if (root === 'materials') {
        const texTransformMarker = '/extensions/KHR_texture_transform/';
        const markerIdx = subPath.indexOf(texTransformMarker);
        if (markerIdx !== -1) {
            const texPrefix = subPath.slice(0, markerIdx);
            const transformProp = subPath.slice(markerIdx + texTransformMarker.length);
            const textureKey = TEXTURE_POINTER_TO_MATERIAL_KEY[texPrefix];
            if (!textureKey) return null;
            if (transformProp === 'offset' || transformProp === 'scale') {
                return {
                    domain: 'material_texture_transform',
                    materialIndex: index,
                    textureKey,
                    transformProp,
                    componentCount: 2,
                };
            }
            if (transformProp === 'rotation') {
                return {
                    domain: 'material_texture_transform',
                    materialIndex: index,
                    textureKey,
                    transformProp: 'rotation',
                    componentCount: 1,
                };
            }
            return null;
        }

        const propInfo = MATERIAL_PROPERTY_MAP[subPath];
        if (propInfo) {
            return {
                domain: 'material_property',
                materialIndex: index,
                propertyKey: propInfo.key,
                componentCount: propInfo.count,
            };
        }
        return null;
    }

    return null;
};

/**
 * [KO] 해석된 `KHR_animation_pointer` 디스크립터를 실제 RedGPU 노드/머티리얼 인스턴스에 Zero-GC 바인딩합니다.
 * [EN] Binds a parsed `KHR_animation_pointer` descriptor to live RedGPU node/material instances with Zero-GC application.
 *
 * @param gltfLoader -
 * [KO] 대상 `GLTFLoader` 인스턴스
 * [EN] Target `GLTFLoader` instance
 * @param gltfData -
 * [KO] 파싱된 `GLTF` 데이터 객체
 * [EN] Parsed `GLTF` data object
 * @param descriptor -
 * [KO] `parseAnimationPointerPath`로 해석된 디스크립터
 * [EN] Descriptor parsed by `parseAnimationPointerPath`
 * @returns
 * [KO] 런타임 적용 바인딩 또는 대상이 없을 경우 `null`
 * [EN] Runtime binding object, or `null` if the target does not exist
 * @category GLTF
 */
export const createPointerTargetBinding = (
    gltfLoader: GLTFLoader,
    gltfData: GLTF,
    descriptor: ParsedPointerDescriptor
): PointerTargetBinding | null => {
    if (descriptor.domain === 'node_visibility') {
        const nodeInfo = gltfData.nodes?.[descriptor.nodeIndex];
        if (!nodeInfo) return null;
        const targetMeshes: Mesh[] = [];
        if (Array.isArray(nodeInfo['Meshes']) && nodeInfo['Meshes'].length > 0) {
            for (let i = 0; i < nodeInfo['Meshes'].length; i++) {
                targetMeshes.push(nodeInfo['Meshes'][i]);
            }
        } else if (nodeInfo['Mesh']) {
            targetMeshes.push(nodeInfo['Mesh']);
        } else if (gltfLoader.parsingResult.groups[descriptor.nodeIndex]) {
            targetMeshes.push(gltfLoader.parsingResult.groups[descriptor.nodeIndex]);
        }
        if (targetMeshes.length === 0) return null;
        const count = targetMeshes.length;
        return {
            componentCount: 1,
            apply: (v0: number) => {
                const isVis = v0 >= 0.5;
                for (let i = 0; i < count; i++) {
                    targetMeshes[i].visible = isVis;
                }
            }
        };
    }

    if (descriptor.domain === 'material_property') {
        const materials: PBRMaterial[] = gltfLoader.parsingResult.materialsById.get(descriptor.materialIndex);
        if (!materials || materials.length === 0) return null;
        const propKey = descriptor.propertyKey;
        const count = materials.length;

        if (descriptor.componentCount === 1) {
            return {
                componentCount: 1,
                apply: (v0: number) => {
                    for (let i = 0; i < count; i++) {
                        (materials[i] as any)[propKey] = v0;
                    }
                }
            };
        }
        if (descriptor.componentCount === 3) {
            const buf3: [number, number, number] = [0, 0, 0];
            return {
                componentCount: 3,
                apply: (v0: number, v1: number, v2: number) => {
                    buf3[0] = v0;
                    buf3[1] = v1;
                    buf3[2] = v2;
                    for (let i = 0; i < count; i++) {
                        (materials[i] as any)[propKey] = buf3;
                    }
                }
            };
        }
        const buf4: [number, number, number, number] = [0, 0, 0, 1];
        return {
            componentCount: 4,
            apply: (v0: number, v1: number, v2: number, v3: number) => {
                buf4[0] = v0;
                buf4[1] = v1;
                buf4[2] = v2;
                buf4[3] = v3;
                for (let i = 0; i < count; i++) {
                    (materials[i] as any)[propKey] = buf4;
                }
            }
        };
    }

    if (descriptor.domain === 'material_texture_transform') {
        const materials: PBRMaterial[] = gltfLoader.parsingResult.materialsById.get(descriptor.materialIndex);
        if (!materials || materials.length === 0) return null;
        const count = materials.length;
        const useKey = `use_${descriptor.textureKey}_KHR_texture_transform`;
        const targetKey = `${descriptor.textureKey}_KHR_texture_transform_${descriptor.transformProp}`;
        for (let i = 0; i < count; i++) {
            (materials[i] as any)[useKey] = true;
        }

        if (descriptor.componentCount === 1) {
            return {
                componentCount: 1,
                apply: (v0: number) => {
                    for (let i = 0; i < count; i++) {
                        (materials[i] as any)[targetKey] = v0;
                    }
                }
            };
        }
        const buf2: [number, number] = [0, 0];
        return {
            componentCount: 2,
            apply: (v0: number, v1: number) => {
                buf2[0] = v0;
                buf2[1] = v1;
                for (let i = 0; i < count; i++) {
                    (materials[i] as any)[targetKey] = buf2;
                }
            }
        };
    }

    return null;
};
