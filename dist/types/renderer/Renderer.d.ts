import RedGPUContext from "../context/RedGPUContext";
import View3D from "../display/view/View3D";
declare class Renderer {
    #private;
    constructor();
    start(redGPUContext: RedGPUContext, render: Function): void;
    stop(redGPUContext: RedGPUContext): void;
    renderFrame(redGPUContext: RedGPUContext, time: number): void;
    renderView(view: View3D, time: number): GPURenderPassDescriptor;
}
export default Renderer;
