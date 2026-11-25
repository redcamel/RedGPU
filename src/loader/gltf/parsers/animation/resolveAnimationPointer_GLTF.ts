import Mesh from "../../../../display/mesh/Mesh";
import PBRMaterial from "../../../../material/pbrMaterial/PBRMaterial";
import GLTFParseContext from "../../core/GLTFParseContext";
import {GLTF} from "../../GLTF";
import GLTFLoader from "../../GLTFLoader";

const RAD_TO_DEG = 180 / Math.PI;

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
    domain: 'camera_perspective';
    cameraIndex: number;
    property: 'yfov' | 'znear' | 'zfar';
}
    | {
    domain: 'material_property';
    materialIndex: number;
    propertyKey: string;
}
    | {
    domain: 'material_texture_transform';
    materialIndex: number;
    textureKey: string;
    transformProp: 'offset' | 'scale' | 'rotation';
};

const BLOCKED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * [KO] RedGPU `PBRMaterial` 표준 규칙(`KHR_<prop>`, `<prop>`)에서 벗어나는 소수 예외 경로 매핑입니다.
 * [EN] Minimal exception map for glTF material paths that deviate from RedGPU `PBRMaterial` naming rules.
 */
const MATERIAL_PROPERTY_EXCEPTIONS: Record<string, string> = Object.freeze({
    'alphaCutoff': 'cutOff',
    'normalTexture/scale': 'normalScale',
    'occlusionTexture/strength': 'occlusionStrength',
    'extensions/KHR_materials_emissive_strength/emissiveStrength': 'emissiveStrength',
});

const isSafeIdentifier = (name: string): boolean => (
    name.length > 0 && !BLOCKED_KEYS.has(name) && /^[A-Za-z0-9_]+$/.test(name)
);

const resolveMaterialTextureKey = (texPrefix: string): string | null => {
    const parts = texPrefix.split('/');
    const last = parts[parts.length - 1];
    if (!isSafeIdentifier(last) || !last.endsWith('Texture')) return null;

    // extensions/KHR_materials_*/<texName> -> KHR_<texName>
    if (parts.length === 3 && parts[0] === 'extensions' && parts[1].startsWith('KHR_materials_')) {
        return `KHR_${last}`;
    }
    // pbrMetallicRoughness/<texName> or <texName> -> <texName>
    if ((parts.length === 2 && parts[0] === 'pbrMetallicRoughness') || parts.length === 1) {
        return last;
    }
    return null;
};

const resolveMaterialPropertyKey = (subPath: string): string | null => {
    if (Object.prototype.hasOwnProperty.call(MATERIAL_PROPERTY_EXCEPTIONS, subPath)) {
        return MATERIAL_PROPERTY_EXCEPTIONS[subPath];
    }
    const parts = subPath.split('/');
    const last = parts[parts.length - 1];
    if (!isSafeIdentifier(last)) return null;

    if (parts.length === 3 && parts[0] === 'extensions' && parts[1].startsWith('KHR_materials_')) {
        return `KHR_${last}`;
    }
    if ((parts.length === 2 && parts[0] === 'pbrMetallicRoughness') || parts.length === 1) {
        return last;
    }
    return null;
};

/**
 * [KO] `KHR_animation_pointer` JSON Pointer 문자열을 규칙 기반으로 해석하여 구조화된 타겟 디스크립터를 반환합니다.
 * [EN] Parses a `KHR_animation_pointer` JSON Pointer string using rule-based resolution into a structured target descriptor.
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

    if (root === 'cameras') {
        if (subPath === 'perspective/yfov') return {domain: 'camera_perspective', cameraIndex: index, property: 'yfov'};
        if (subPath === 'perspective/znear') return {
            domain: 'camera_perspective',
            cameraIndex: index,
            property: 'znear'
        };
        if (subPath === 'perspective/zfar') return {domain: 'camera_perspective', cameraIndex: index, property: 'zfar'};
        return null;
    }

    if (root === 'materials') {
        const texTransformMarker = '/extensions/KHR_texture_transform/';
        const markerIdx = subPath.indexOf(texTransformMarker);
        if (markerIdx !== -1) {
            const texPrefix = subPath.slice(0, markerIdx);
            const transformProp = subPath.slice(markerIdx + texTransformMarker.length);
            const textureKey = resolveMaterialTextureKey(texPrefix);
            if (!textureKey) return null;
            if (transformProp === 'offset' || transformProp === 'scale' || transformProp === 'rotation') {
                return {
                    domain: 'material_texture_transform',
                    materialIndex: index,
                    textureKey,
                    transformProp,
                };
            }
            return null;
        }

        const propertyKey = resolveMaterialPropertyKey(subPath);
        if (propertyKey) {
            return {
                domain: 'material_property',
                materialIndex: index,
                propertyKey,
            };
        }
        return null;
    }

    return null;
};

/**
 * [KO] 해석된 `KHR_animation_pointer` 디스크립터를 실제 RedGPU 노드·카메라·머티리얼 인스턴스에 Zero-GC 바인딩합니다.
 * [EN] Binds a parsed `KHR_animation_pointer` descriptor to live RedGPU node, camera, or material instances with Zero-GC application.
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
 * @param componentCount -
 * [KO] 애니메이션 output accessor의 컴포넌트 개수 (`1`~`4`)
 * [EN] Component count (`1`~`4`) derived from the animation output accessor type
 * @returns
 * [KO] 런타임 적용 바인딩 또는 대상이 없을 경우 `null`
 * [EN] Runtime binding object, or `null` if the target does not exist
 * @category GLTF
 */
export const createPointerTargetBinding = (
    gltfLoader: GLTFLoader,
    gltfData: GLTF,
    descriptor: ParsedPointerDescriptor,
    componentCount: 1 | 2 | 3 | 4,
    parseContext?: GLTFParseContext
): PointerTargetBinding | null => {
    if (descriptor.domain === 'node_visibility') {
        const nodeInfo = gltfData.nodes?.[descriptor.nodeIndex];
        if (!nodeInfo) return null;
        const targetMeshes: Mesh[] = [];
        const contextMeshes = parseContext?.nodeMeshesMap.get(descriptor.nodeIndex);
        const contextObj = parseContext?.nodeObjectMap.get(descriptor.nodeIndex);
        if (contextMeshes && contextMeshes.length > 0) {
            for (let i = 0; i < contextMeshes.length; i++) {
                targetMeshes.push(contextMeshes[i]);
            }
        } else if (contextObj) {
            targetMeshes.push(contextObj);
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

    if (descriptor.domain === 'camera_perspective') {
        const camera = gltfLoader.parsingResult.cameras?.[descriptor.cameraIndex];
        if (!camera) return null;
        if (descriptor.property === 'yfov') {
            return {
                componentCount: 1,
                apply: (v0: number) => {
                    camera.fieldOfView = v0 * RAD_TO_DEG;
                }
            };
        }
        if (descriptor.property === 'znear') {
            return {
                componentCount: 1,
                apply: (v0: number) => {
                    camera.nearClipping = v0;
                }
            };
        }
        return {
            componentCount: 1,
            apply: (v0: number) => {
                camera.farClipping = v0;
            }
        };
    }

    if (descriptor.domain === 'material_property') {
        const materials: PBRMaterial[] = gltfLoader.parsingResult.materialsById.get(descriptor.materialIndex);
        if (!materials || materials.length === 0) return null;
        const propKey = descriptor.propertyKey;
        if (!(propKey in materials[0])) return null;
        const count = materials.length;

        if (componentCount === 1) {
            return {
                componentCount: 1,
                apply: (v0: number) => {
                    for (let i = 0; i < count; i++) {
                        (materials[i] as any)[propKey] = v0;
                    }
                }
            };
        }
        if (componentCount === 2) {
            const buf2: [number, number] = [0, 0];
            return {
                componentCount: 2,
                apply: (v0: number, v1: number) => {
                    buf2[0] = v0;
                    buf2[1] = v1;
                    for (let i = 0; i < count; i++) {
                        (materials[i] as any)[propKey] = buf2;
                    }
                }
            };
        }
        if (componentCount === 3) {
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
        const useKey = `use_${descriptor.textureKey}_KHR_texture_transform`;
        const targetKey = `${descriptor.textureKey}_KHR_texture_transform_${descriptor.transformProp}`;
        if (!(useKey in materials[0]) || !(targetKey in materials[0])) return null;
        const count = materials.length;
        for (let i = 0; i < count; i++) {
            (materials[i] as any)[useKey] = true;
        }

        if (descriptor.transformProp === 'rotation') {
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
