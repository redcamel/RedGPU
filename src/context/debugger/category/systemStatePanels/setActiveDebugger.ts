import gui_setItemBooleanNameSize from "../../funcs/gui_setItemBooleanNameSize";
import RedGPUContextDebugger from "../../RedGPUContextDebugger";

const setActiveDebugger = (gui, targetDebugger: RedGPUContextDebugger) => {
    const activeDebuggerFolder = gui.addFolder('Active Debugger');
    gui_setItemBooleanNameSize(activeDebuggerFolder.add(targetDebugger, 'activeViewDebugger'))
    gui_setItemBooleanNameSize(activeDebuggerFolder.add(targetDebugger, 'activeResourceDebugger'));
    activeDebuggerFolder.open()
}

export default setActiveDebugger