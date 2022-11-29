import gui_setItemDisableInput from "../../funcs/gui_setItemDisableInput";
import {PassLightClustersHelper} from "../../../../light/pointLightCluster";

const setLightClusterInfo = (gui) => {
    const tFolder = gui.addFolder('light Cluster Info');
    gui_setItemDisableInput(tFolder.add(PassLightClustersHelper, 'TILE_COUNT_X'));
    gui_setItemDisableInput(tFolder.add(PassLightClustersHelper, 'TILE_COUNT_Y'));
    gui_setItemDisableInput(tFolder.add(PassLightClustersHelper, 'TILE_COUNT_Z'));
    gui_setItemDisableInput(tFolder.add(PassLightClustersHelper, 'WORKGROUP_SIZE_X'));
    gui_setItemDisableInput(tFolder.add(PassLightClustersHelper, 'WORKGROUP_SIZE_Y'));
    gui_setItemDisableInput(tFolder.add(PassLightClustersHelper, 'WORKGROUP_SIZE_Z'));
    gui_setItemDisableInput(tFolder.add(PassLightClustersHelper, 'MAX_POINT_LIGHTS_PER_CLUSTER'));
}

export default setLightClusterInfo