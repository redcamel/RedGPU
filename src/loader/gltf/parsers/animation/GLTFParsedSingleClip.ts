import AniTrack_GLTF from "../../cls/anitrack/AniTrack_GLTF";

/**
 * [KO] GLTF 단일 애니메이션 클립의 원시 파싱 데이터를 담는 클래스입니다.
 * [EN] Class holding the raw parsed data of a single GLTF animation clip.
 */
export class GLTFParsedSingleClip {
    /** [KO] 클립 내 최소 시간 (초 단위) [EN] Minimum time in the clip (seconds) */
    minTime: number = 10000000;
    /** [KO] 클립 내 최대 시간 (초 단위) [EN] Maximum time in the clip (seconds) */
    maxTime: number = -1;
    /** [KO] GLTF 파일 내 애니메이션 이름 [EN] Animation name in the GLTF file */
    name: string;
    /** [KO] 파싱된 애니메이션 트랙 목록 [EN] List of parsed animation tracks */
    tracks: AniTrack_GLTF[] = [];

    constructor(name: string) {
        this.name = name;
    }
}
