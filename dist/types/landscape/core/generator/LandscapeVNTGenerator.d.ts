import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
/**
 * [KO] 가상 하이트 텍스처(VHT) 아틀라스의 고도 구배로부터 지형 표면 법선 및 경사도를 계산하여 가상 노멀 텍스처(VNT) 아틀라스에 베이킹하는 생성기 클래스입니다.
 * [EN] Generator class that computes terrain surface normals and slope from Virtual Height Texture (VHT) atlas gradients and bakes them into the Virtual Normal Texture (VNT) atlas.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class LandscapeVNTGenerator extends ALandscapeAtlasGenerator {
    #private;
    /**
     * [KO] `LandscapeVNTGenerator` 인스턴스를 초기화합니다.
     * [EN] Initializes a `LandscapeVNTGenerator` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] VHT 아틀라스의 지정된 타일 영역으로부터 법선 데이터를 계산하여 VNT 아틀라스에 베이킹합니다.
     * [EN] Computes normal data from the specified tile region of the VHT atlas and bakes it into the VNT atlas.
     *
     * @param vhtAtlas -
     * [KO] 원본 가상 하이트 텍스처(VHT) 아틀라스
     * [EN] Source Virtual Height Texture (VHT) atlas
     * @param vntAtlas -
     * [KO] 대상 가상 노멀 텍스처(VNT) 아틀라스
     * [EN] Target Virtual Normal Texture (VNT) atlas
     * @param pixelX -
     * [KO] 타일 영역의 시작 X 픽셀 오프셋
     * [EN] Starting X pixel offset of the tile region
     * @param pixelZ -
     * [KO] 타일 영역의 시작 Z(Y) 픽셀 오프셋
     * [EN] Starting Z(Y) pixel offset of the tile region
     * @param pixelW -
     * [KO] 타일 영역의 가로 픽셀 크기
     * [EN] Width of the tile region in pixels
     * @param pixelH -
     * [KO] 타일 영역의 세로 픽셀 크기
     * [EN] Height of the tile region in pixels
     * @param heightScale -
     * [KO] 지형 최대 높이 스케일 (월드 단위)
     * [EN] Maximum terrain height scale in world units
     * @param worldSizeX -
     * [KO] 지형 전체의 X축 월드 크기
     * [EN] Total world size of the terrain along the X-axis
     * @param componentCountX -
     * [KO] X축 방향 타일(컴포넌트) 개수
     * [EN] Number of tiles (components) along the X-axis
     * @param sampleStep -
     * [KO] 법선 기울기 샘플링 아틀라스 텍셀 간격 (기본값: `1`)
     * [EN] Atlas texel stride for normal gradient sampling (default: `1`)
     */
    bakeTileRegion(vhtAtlas: DirectTexture, vntAtlas: DirectTexture, pixelX: number, pixelZ: number, pixelW: number, pixelH: number, heightScale: number, worldSizeX: number, componentCountX: number, sampleStep?: number): void;
}
export default LandscapeVNTGenerator;
