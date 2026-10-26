import "../../../../core/shader/library/LandscapeShaderLibrary";
import RedGPUContext from "../../../../../context/RedGPUContext";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import type FoliageRenderUnit from "../../FoliageRenderUnit";
/**
 * [KO] 식생 메시를 팔면체 임포스터(Octahedral Impostor)로 베이킹한 결과 데이터 인터페이스입니다.
 * [EN] Result data interface for baking foliage into an octahedral impostor.
 * @category Landscape
 */
export interface FoliageBakeResult {
    /**
     * [KO] 베이킹된 베이스 컬러(Base Color) 아틀라스 텍스처
     * [EN] Baked base color atlas texture
     */
    baseColorTexture: DirectTexture;
    /**
     * [KO] 베이킹된 월드 공간 노멀(Normal) 아틀라스 텍스처
     * [EN] Baked world-space normal atlas texture
     */
    normalTexture: DirectTexture;
    /**
     * [KO] 베이킹된 패킹 ORM(Occlusion/Roughness/Metallic) 아틀라스 텍스처
     * [EN] Baked packed ORM (Occlusion/Roughness/Metallic) atlas texture
     */
    packedORMTexture: DirectTexture;
    /**
     * [KO] 바운딩 박스 가로 폭 (월드 단위)
     * [EN] Bounding box width (in world units)
     */
    width: number;
    /**
     * [KO] 바운딩 박스 높이 (월드 단위)
     * [EN] Bounding box height (in world units)
     */
    height: number;
    /**
     * [KO] 바운딩 박스 깊이 (월드 단위)
     * [EN] Bounding box depth (in world units)
     */
    depth: number;
    /**
     * [KO] 모델 바닥면의 Y축 오프셋
     * [EN] Bottom Y-axis offset of the model
     */
    bottomOffset: number;
}
/**
 * [KO] 지정된 렌더 유닛 목록을 반구형 팔면체(Hemi-Octahedral) 격자 시점에서 렌더링하여 원거리 임포스터용 아틀라스 텍스처(BaseColor, Normal, ORM)를 베이킹합니다.
 * [EN] Renders the specified render units from hemi-octahedral grid viewpoints to bake atlas textures (BaseColor, Normal, ORM) for far-distance impostors.
 *
 * @param redGPUContext -
 * [KO] `RedGPUContext` 인스턴스
 * [EN] `RedGPUContext` instance
 * @param renderUnits -
 * [KO] 베이킹 대상 원본 렌더 유닛 배열
 * [EN] Array of source render units to bake
 * @param bakeName -
 * [KO] 생성될 GPU 리소스 라벨 접두사 (기본값: `'Foliage'`)
 * [EN] Label prefix for created GPU resources (default: `'Foliage'`)
 * @returns
 * [KO] 베이킹된 아틀라스 텍스처들과 바운딩 치수 정보(`FoliageBakeResult`)
 * [EN] Baked atlas textures and bounding dimension information (`FoliageBakeResult`)
 * @category Landscape
 */
declare function bakeFoliageImpostor(redGPUContext: RedGPUContext, renderUnits: FoliageRenderUnit[], bakeName?: string): FoliageBakeResult;
export default bakeFoliageImpostor;
