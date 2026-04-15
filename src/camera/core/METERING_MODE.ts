/**
 * [KO] 자동 노출을 위한 측광 모드 열거형입니다.
 * [EN] Metering mode enum for auto-exposure.
 */
enum METERING_MODE {
    /**
     * [KO] 평균 측광: 화면 전체의 밝기를 균등하게 반영합니다.
     * [EN] Average: Reflects the brightness of the entire screen equally.
     */
    AVERAGE = 0,
    /**
     * [KO] 중앙 중점 측광: 화면 중앙 영역에 더 높은 가중치를 부여합니다.
     * [EN] Center-weighted: Gives higher weight to the center area of the screen.
     */
    CENTER_WEIGHTED = 1,
    /**
     * [KO] 스포트 측광: 화면 중앙의 아주 좁은 영역만 반영합니다.
     * [EN] Spot: Reflects only a very narrow area in the center of the screen.
     */
    SPOT = 2
}

export default METERING_MODE;
