/**
 * [KO] 식생 및 지형 스캐터링 인스턴스의 카테고리 분류 상수 객체
 * [EN] Classification constant object for foliage and terrain scatter instances
 * @category Landscape
 */
const FOLIAGE_TYPE = {
    /**
     * [KO] 일반 수목/나무 (임포스터 지원, 잎 투사광 SSS 활성화, 뎁스 프리패스 적용)
     * [EN] Trees and large foliage (supports impostors, subsurface scattering translucency, depth prepass)
     */
    FOLIAGE: 'foliage',

    /**
     * [KO] 잔디/풀/꽃 (근거리 밀집형, 바람 흔들림, 임포스터 생략, 초근경 섀도우)
     * [EN] Grass, groundcover, flowers (dense near-range, wind interaction, no impostors, near shadows)
     */
    GRASS: 'grass',

    /**
     * [KO] 바위/돌/통나무/프랍 (완전 불투명 Opaque, 투사광 없음, 뎁스 프리패스 생략, 일반 PBR)
     * [EN] Rocks, stones, debris, props (opaque solid, no translucency, skips depth prepass, standard PBR)
     */
    BASIC: 'basic',
} as const;

type FOLIAGE_TYPE = typeof FOLIAGE_TYPE[keyof typeof FOLIAGE_TYPE];
Object.freeze(FOLIAGE_TYPE);

export default FOLIAGE_TYPE;
