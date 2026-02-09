import RedGPUContext from "../../../context/RedGPUContext";
import DebugRender from "../DebugRender";
declare class DebugStatisticsDomService {
    #private;
    dom: HTMLElement;
    constructor(bufferType: string);
    get openYn(): boolean;
    set openYn(value: boolean);
    update(debugRender: DebugRender, redGPUContext: RedGPUContext): void;
}
declare class DebugBufferList {
    debugStatisticsDomService: DebugStatisticsDomService;
    constructor(bufferType: 'IndexBuffer' | 'VertexBuffer' | 'UniformBuffer' | 'StorageBuffer' | 'Buffer');
    get dom(): HTMLElement;
    update(debugRender: DebugRender, redGPUContext: RedGPUContext): void;
}
export default DebugBufferList;
