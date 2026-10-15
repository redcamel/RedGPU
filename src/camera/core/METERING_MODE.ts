/**
 * [KO] 자동 노출(AutoExposure) 휘도 산출 시 사용되는 측광 모드 열거형입니다.
 * [EN] Metering mode enum used when calculating luminance for auto exposure.
 *
 * @category Core
 */
enum METERING_MODE {
    /**
     * [KO] 화면 전체 픽셀의 휘도를 균등하게 반영하는 평균 측광 모드입니다.
     * [EN] Average metering mode that weights all screen pixels equally.
     */
    AVERAGE = 0,
    /**
     * [KO] 화면 중앙부 픽셀에 높은 가중치를 부여하는 중앙 중점 측광 모드입니다.
     * [EN] Center-weighted metering mode that assigns higher weight to the central screen area.
     */
    CENTER_WEIGHTED = 1,
    /**
     * [KO] 화면 정중앙의 좁은 영역 휘도만 측정하는 스팟 측광 모드입니다.
     * [EN] Spot metering mode that measures luminance only within a narrow area at the screen center.
     */
    SPOT = 2
}

Object.freeze(METERING_MODE);
export default METERING_MODE;
