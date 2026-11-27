import PBRMaterial from "../../../material/pbrMaterial/PBRMaterial";
import Mesh from "../../../display/mesh/Mesh";
import {GLTF} from "../GLTF";

/**
 * [KO] `KHR_materials_variants` 적용 대상 메쉬와 기본/변형 머티리얼 매핑 엔트리 타입입니다.
 * [EN] Mapping entry type pairing a target mesh with its default and variant materials for `KHR_materials_variants`.
 *
 * @category GLTF
 */
export type MaterialVariantEntry = {
    mesh: Mesh;
    defaultMaterial: PBRMaterial;
    variantMaterials: Map<number, PBRMaterial>;
};

/**
 * [KO] glTF 루트 `extensions.KHR_materials_variants.variants`에서 바리에이션 이름 목록을 추출합니다.
 * [EN] Extracts the list of material variant names from `gltfData.extensions.KHR_materials_variants.variants`.
 *
 * @param gltfData -
 * [KO] 파싱된 glTF 데이터 객체
 * [EN] Parsed glTF data object
 * @returns
 * [KO] 바리에이션 이름 문자열 배열 (미정의 시 빈 배열)
 * [EN] Array of variant name strings (empty array if undefined)
 * @category GLTF
 */
export const extractMaterialVariantNames = (gltfData?: GLTF): string[] => {
    const variants = gltfData?.extensions?.KHR_materials_variants?.variants;
    if (!Array.isArray(variants)) return [];
    return variants.map((v: {
        name?: string
    }, index: number) => (typeof v?.name === 'string' && v.name.length > 0 ? v.name : `Variant_${index}`));
};

/**
 * [KO] 사용자 입력(바리에이션 이름, 인덱스, 또는 `null`)을 유효한 바리에이션 인덱스로 해석합니다.
 * [EN] Resolves user input (variant name, index, or `null`) into a valid variant index.
 *
 * @param variantNames -
 * [KO] 모델이 보유한 바리에이션 이름 목록
 * [EN] List of variant names defined in the model
 * @param variant -
 * [KO] 바리에이션 이름, 인덱스, 또는 기본 복원용 `null`
 * [EN] Variant name, index, or `null` to restore default materials
 * @returns
 * [KO] 유효한 바리에이션 인덱스, 기본 복원 시 `null`, 유효하지 않은 입력 시 `undefined`
 * [EN] Valid variant index, `null` for default restoration, or `undefined` if invalid
 * @category GLTF
 */
export const resolveMaterialVariantIndex = (
    variantNames: string[],
    variant: string | number | null
): number | null | undefined => {
    if (variant === null) return null;
    if (typeof variant === 'number') {
        if (!Number.isInteger(variant) || variant < 0 || variant >= variantNames.length) return undefined;
        return variant;
    }
    if (typeof variant === 'string') {
        const idx = variantNames.indexOf(variant);
        return idx >= 0 ? idx : undefined;
    }
    return undefined;
};
