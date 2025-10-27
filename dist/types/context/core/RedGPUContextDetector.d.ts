import RedGPUContext from "../RedGPUContext";
/**
 * @description `RedGPUContextDetector` 클래스는 주어진 `RedGPUContext`
 * 객체로부터 GPUAdapter를 분석해 아래와 같은 정보를 제공한다.
 *
 * - Adapter 정보(`adapterInfo`) 및 현재 사용중인 `limits`,
 * - fallback 여부(`isFallbackAdapter`) 판단,
 * - 제한값을 그룹화한(`groupedLimits`) 자료구조 제공,
 * - 사용자 에이전(UA) 정보를 반환하고, 모바일 디바이스 여부를 판정한다.
 */
declare class RedGPUContextDetector {
    #private;
    /**
     * @description 생성자. 전달받은 `RedGPUContext` 인스턴스에서 GPUAdapter 를 추출해
     * 내부 프로퍼티를 초기화한다.
     *
     * @param {RedGPUContext} redGPUContext - 컨텍스트 객체(구현적으로 `gpuAdapter` 속성 포함). */
    constructor(redGPUContext: RedGPUContext);
    /**
     * @returns {GPUAdapterInfo} 현재 사용중인 GPUAdapter 의 정보를 반환한다. */
    get adapterInfo(): GPUAdapterInfo;
    /**
     * @returns {GPUSupportedLimits} 현재 사용 중인 GPU의 한계값을 반환한다. */
    get limits(): GPUSupportedLimits;
    /**
     * @returns {boolean} 현재 adapter 가 fallback인지 여부를 반환한다 (`true` 은 Fallback Adapter임). */
    get isFallbackAdapter(): boolean;
    /**
     * @returns {any} 그룹화된 한계값. 내부적으로 `groupedLimits` 프로퍼티에 저장된다. */
    get groupedLimits(): any;
    /**
     * @returns {string} 브라우저가 가진 User‑Agent 문자열을 반환한다. */
    get userAgent(): string;
    /**
     * @description 모바일 디바이스인지 여부를 판단한다.
     *
     * @returns {boolean} `true` 라면 모바일 기기(안드로이드, iOS 등) 를 사용 중임. */
    get isMobile(): boolean;
}
export default RedGPUContextDetector;
