import Mesh from "../../../../display/mesh/Mesh";
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
 * @category GLTF
 */
export declare class GLTFParsedSingleClip {
    #private;
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
    /**
     * [KO] 대상 메쉬와 키 타입에 일치하는 첫 번째 애니메이션 트랙을 `O(1)` 캐시 맵에서 조회합니다.
     * [EN] Looks up the first animation track matching the target mesh and key type via an `O(1)` cached map.
     *
     * @param mesh -
     * [KO] 애니메이션 대상 메쉬
     * [EN] Target mesh
     * @param keyType -
     * [KO] 정수 인코딩된 애니메이션 키 타입
     * [EN] Integer-encoded animation key type
     * @returns
     * [KO] 일치하는 `AniTrack_GLTF` 또는 `undefined`
     * [EN] Matching `AniTrack_GLTF` or `undefined`
     */
    findTrack(mesh: Mesh, keyType: number): AniTrack_GLTF | undefined;
}
