import { KTX2Container } from 'ktx-parse';
/**
 * [KO] KTX2 텍스처 생성을 위한 옵션 인터페이스입니다.
 * [EN] Options interface for creating a `GPUTexture` from KTX2 data.
 *
 * @category Texture
 */
export interface CreateKTX2Options {
    /**
     * [KO] WebGPU 디바이스(`GPUDevice`) 인스턴스
     * [EN] WebGPU device (`GPUDevice`) instance
     */
    device: GPUDevice;
    /**
     * [KO] KTX2 파일 경로(URL), `KTX2Container`, `ArrayBuffer`, 또는 `Uint8Array` 데이터
     * [EN] KTX2 file path (URL), `KTX2Container`, `ArrayBuffer`, or `Uint8Array` data
     */
    container: string | KTX2Container | ArrayBuffer | Uint8Array;
    /**
     * [KO] R 채널과 B 채널 스왑 여부
     * [EN] Whether to swap red and blue channels
     */
    swapRedBlue?: boolean;
    /**
     * [KO] 생성될 `GPUTexture`의 디버그 라벨
     * [EN] Debug label for the created `GPUTexture`
     */
    label?: string;
    /**
     * [KO] `GPUTexture` 사용 플래그(`GPUTextureUsageFlags`)
     * [EN] `GPUTexture` usage flags (`GPUTextureUsageFlags`)
     */
    usage?: GPUTextureUsageFlags;
}
/**
 * [KO] KTX2 컨테이너의 Key-Value 영역에서 추출된 메타데이터 인터페이스입니다.
 * [EN] Interface representing metadata extracted from the Key-Value section of a KTX2 container.
 *
 * @category Texture
 */
export interface KTX2Metadata {
    /**
     * [KO] KTX2 작성 도구 정보 (`KTXwriter`)
     * [EN] KTX2 writer tool information (`KTXwriter`)
     */
    writer?: string;
    /**
     * [KO] 텍스처 방향 정보 (`KTXorientation`)
     * [EN] Texture orientation information (`KTXorientation`)
     */
    orientation?: string;
    /**
     * [KO] 채널 스위즐 정보 (`KTXswizzle`)
     * [EN] Channel swizzle information (`KTXswizzle`)
     */
    swizzle?: string;
    /**
     * [KO] 노출값 메타데이터
     * [EN] Exposure metadata value
     */
    exposure?: number;
    /**
     * [KO] 톤매핑 메타데이터
     * [EN] Tonemapping metadata value
     */
    tonemapping?: number;
    /**
     * [KO] HDR 색상 원색(Primaries) 식별값
     * [EN] HDR color primaries identifier
     */
    hdrColorPrimaries?: number;
    /**
     * [KO] HDR 전송 함수(Transfer Function) 식별값
     * [EN] HDR transfer function identifier
     */
    hdrTransferFunction?: number;
    /**
     * [KO] 원본 Key-Value 맵 데이터 (`Record<string, string | Uint8Array>`)
     * [EN] Raw Key-Value map data (`Record<string, string | Uint8Array>`)
     */
    raw: Record<string, string | Uint8Array>;
}
/**
 * [KO] KTX2 컨테이너 또는 바이너리 데이터를 파싱 및 트랜스코딩하여 WebGPU `GPUTexture`를 생성합니다.
 * [EN] Parses and transcodes a KTX2 container or binary data to create a WebGPU `GPUTexture`.
 *
 * @param options -
 * [KO] KTX2 텍스처 생성 옵션 (`CreateKTX2Options`)
 * [EN] KTX2 texture creation options (`CreateKTX2Options`)
 * @returns
 * [KO] 생성된 `GPUTexture`를 반환하는 `Promise`
 * [EN] `Promise` resolving to the created `GPUTexture`
 * @throws
 * [KO] KTX2 파일 로드 또는 Basis 트랜스코더 초기화에 실패한 경우 `Error`가 발생합니다.
 * [EN] Throws `Error` if KTX2 file loading or Basis transcoder initialization fails.
 * @category Texture
 */
export declare function createGPUTextureFromKTX2({ device, container: inputContainer, swapRedBlue, label, usage }: CreateKTX2Options): Promise<GPUTexture>;
