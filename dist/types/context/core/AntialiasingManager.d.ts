import RedGPUContext from "../RedGPUContext";
/**
 * @description `AntialiasingManager` 클래스는 안티앨리어싱 설정을 관리한다.
 * 현재 MSAA, FXAA, TAA 설정을 지원하며, 각 설정의 활성화 여부를 제어할 수 있다.
 */
declare class AntialiasingManager {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get useTAA(): boolean;
    set useTAA(value: boolean);
    get useMSAA(): boolean;
    set useMSAA(value: boolean);
    get useFXAA(): boolean;
    set useFXAA(value: boolean);
    get changedMSAA(): boolean;
    set changedMSAA(value: boolean);
    get msaaID(): string;
}
export default AntialiasingManager;
