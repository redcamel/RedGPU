import RedGPUContext from "../RedGPUContext";
declare class AntialiasingManager {
    #private;
    constructor(redGPUContext: RedGPUContext);
    get useTAA(): boolean;
    set useTAA(value: boolean);
    get useMSAA(): boolean;
    set useMSAA(value: boolean);
    get msaaID(): string;
    get useFXAA(): boolean;
    set useFXAA(value: boolean);
    get changedMSAA(): boolean;
    set changedMSAA(value: boolean);
}
export default AntialiasingManager;
