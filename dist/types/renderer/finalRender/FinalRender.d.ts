import RedGPUContext from "../../context/RedGPUContext";
/**
 * Class representing the final rendering process.
 * @class
 */
declare class FinalRender {
    #private;
    constructor();
    /**
     * Renders the given list of render passes to the specified canvas.
     *
     * @param {RedGPUContext} redGPUContext - The RedGPUContext object.
     * @param {GPURenderPassDescriptor[]} viewList_renderPassDescriptorList - The list of render passes to be rendered.
     */
    render(redGPUContext: RedGPUContext, viewList_renderPassDescriptorList: GPURenderPassDescriptor[]): void;
}
export default FinalRender;
