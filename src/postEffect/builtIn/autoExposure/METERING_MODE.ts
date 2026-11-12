/**
 * [KO] 자동 노출(`AutoExposure`) 휘도 산출 시 사용되는 측광 모드 상수입니다.
 * [EN] Metering mode constants used when calculating luminance for auto-exposure.
 *
 * @category PostEffect
 */
const METERING_MODE = {
    /**
     * [KO] 화면 전체 픽셀의 히스토그램 휘도를 균등하게 반영하는 백분위 평균 측광 모드입니다.
     * [EN] Percentile-trimmed histogram metering mode that weights all screen pixels equally.
     */
    AVERAGE: 0,
    /**
     * [KO] 화면 중앙부 픽셀에 높은 가중치를 부여하는 백분위 중앙 중점 측광 모드입니다.
     * [EN] Percentile-trimmed center-weighted histogram metering mode that assigns higher weight to the central screen area.
     */
    CENTER_WEIGHTED: 1,
    /**
     * [KO] 화면 정중앙의 지정 반경(`spotRadius`) 영역 휘도만 측정하는 백분위 스팟 측광 모드입니다.
     * [EN] Percentile-trimmed spot histogram metering mode that measures luminance only within `spotRadius` around the screen center.
     */
    SPOT: 2,
    /**
     * [KO] 백분위 절삭 없이 전체 유효 빈의 가중 로그 휘도 평균을 즉시 산출하는 고속 기본 측광 모드입니다.
     * [EN] Fast basic log-average metering mode that computes the weighted log-luminance average across all bins without percentile trimming.
     */
    BASIC: 3
} as const;

/**
 * [KO] `METERING_MODE`의 유니온 타입 정의입니다.
 * [EN] Union type definition of `METERING_MODE`.
 *
 * @category PostEffect
 */
type METERING_MODE = typeof METERING_MODE[keyof typeof METERING_MODE];
Object.freeze(METERING_MODE);
export default METERING_MODE;
