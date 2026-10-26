import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
/**
 * [KO] 타일별 또는 전역 하이트맵 텍스처를 가상 하이트 텍스처(VHT) 아틀라스에 베이킹하는 생성기 클래스입니다.
 * [EN] Generator class that bakes per-tile or global heightmap textures into the Virtual Height Texture (VHT) atlas.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class LandscapeVHTGenerator extends ALandscapeAtlasGenerator {
    #private;
    /**
     * [KO] `LandscapeVHTGenerator` 인스턴스를 초기화합니다.
     * [EN] Initializes a `LandscapeVHTGenerator` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 개별 타일 하이트맵 텍스처를 VHT 아틀라스의 지정된 픽셀 영역에 베이킹합니다.
     * [EN] Bakes an individual tile heightmap texture into the specified pixel region of the VHT atlas.
     *
     * @param srcTileTexture -
     * [KO] 원본 타일 하이트맵 `GPUTexture`
     * [EN] Source tile heightmap `GPUTexture`
     * @param vhtAtlas -
     * [KO] 대상 가상 하이트 텍스처(VHT) 아틀라스
     * [EN] Target Virtual Height Texture (VHT) atlas
     * @param pixelX -
     * [KO] 아틀라스 내 기록할 시작 X 픽셀 오프셋
     * [EN] Starting X pixel offset in the atlas
     * @param pixelZ -
     * [KO] 아틀라스 내 기록할 시작 Z(Y) 픽셀 오프셋
     * [EN] Starting Z(Y) pixel offset in the atlas
     * @param pixelW -
     * [KO] 베이킹할 영역의 가로 픽셀 크기
     * [EN] Width of the baking region in pixels
     * @param pixelH -
     * [KO] 베이킹할 영역의 세로 픽셀 크기
     * [EN] Height of the baking region in pixels
     */
    bakeTileRegion(srcTileTexture: GPUTexture, vhtAtlas: DirectTexture, pixelX: number, pixelZ: number, pixelW: number, pixelH: number): void;
    /**
     * [KO] 전역 하이트맵 텍스처를 전체 VHT 아틀라스 영역에 리샘플링하여 베이킹합니다.
     * [EN] Resamples and bakes a global heightmap texture across the entire VHT atlas region.
     *
     * @param globalTexture -
     * [KO] 전역 하이트맵 `GPUTexture`
     * [EN] Global heightmap `GPUTexture`
     * @param vhtAtlas -
     * [KO] 대상 가상 하이트 텍스처(VHT) 아틀라스
     * [EN] Target Virtual Height Texture (VHT) atlas
     * @param compCountX -
     * [KO] X축 방향 타일(컴포넌트) 개수
     * [EN] Number of tiles (components) along the X-axis
     * @param compCountZ -
     * [KO] Z축 방향 타일(컴포넌트) 개수
     * [EN] Number of tiles (components) along the Z-axis
     */
    bakeGlobalBase(globalTexture: GPUTexture, vhtAtlas: DirectTexture, compCountX: number, compCountZ: number): void;
    /**
     * [KO] VHT 베이킹에 사용된 전역 컴퓨트 파이프라인과 유니폼 버퍼 리소스를 해제합니다.
     * [EN] Releases the global compute pipeline and uniform buffer resources used for VHT baking.
     */
    destroy(): void;
}
export default LandscapeVHTGenerator;
