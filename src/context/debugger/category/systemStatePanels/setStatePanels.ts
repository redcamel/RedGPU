import RedGPUContextDebugger from "../../RedGPUContextDebugger";
import RedGPUContext from "../../../RedGPUContext";
import setAdapterInfo from "./setAdapterInfo";
import setLightClusterInfo from "./setLightClusterInfo";
import setRedGPUContext from "./setRedGPUContext";
import setViewList from "./setViewList";

const setStatePanels = (gui, redGPUContext: RedGPUContext, targetDebugger: RedGPUContextDebugger, openYn: boolean = true) => {
    const tFolder = gui.addFolder('System State Panel')
    if (openYn) tFolder.open()
    setAdapterInfo(tFolder, targetDebugger)
    setRedGPUContext(tFolder, redGPUContext)
    setViewList(tFolder, redGPUContext, targetDebugger)
    setLightClusterInfo(tFolder)
}

export default setStatePanels