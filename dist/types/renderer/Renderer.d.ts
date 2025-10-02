import RedGPUContext from "../context/RedGPUContext";
import View3D from "../display/view/View3D";
declare class Renderer {
    #private;
    constructor();
    renderFrame(redGPUContext: RedGPUContext, time: number): void;
    start(redGPUContext: RedGPUContext, render: Function): void;
    stop(redGPUContext: RedGPUContext): void;
    renderView(view: View3D, time: number): GPURenderPassDescriptor;
}
export default Renderer;
