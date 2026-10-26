import AniTrack_GLTF from "../../cls/anitrack/AniTrack_GLTF";
/**
 * [KO] GLTF 단일 애니메이션 클립의 원시 파싱 데이터를 담는 클래스입니다.
 * [EN] Class holding the raw parsed data of a single GLTF animation clip.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Loader
 */
export declare class GLTFParsedSingleClip {
    /**
     * [KO] 클립 내 최소 시간 (초 단위)
     * [EN] Minimum time in the clip (in seconds)
     */
    minTime: number;
    /**
     * [KO] 클립 내 최대 시간 (초 단위)
     * [EN] Maximum time in the clip (in seconds)
     */
    maxTime: number;
    /**
     * [KO] GLTF 파일 내 애니메이션 이름
     * [EN] Animation name in the GLTF file
     */
    name: string;
    /**
     * [KO] 파싱된 애니메이션 트랙 목록
     * [EN] List of parsed animation tracks
     */
    tracks: AniTrack_GLTF[];
    /**
     * [KO] GLTFParsedSingleClip 인스턴스를 생성합니다.
     * [EN] Creates a GLTFParsedSingleClip instance.
     *
     * @param name -
     * [KO] 애니메이션 클립 이름
     * [EN] Animation clip name
     */
    constructor(name: string);
}
