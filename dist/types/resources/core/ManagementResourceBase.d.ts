import RedGPUContext from "../../context/RedGPUContext";
import ResourceBase from "./ResourceBase";
import ResourceStatusInfo from "./resourceManager/resourceState/ResourceStatusInfo";
/**
 * The ResourceBase class manages the RedGPUContext instance.
 *
 * @class
 */
declare class ManagementResourceBase extends ResourceBase {
    #private;
    constructor(redGPUContext: RedGPUContext, resourceManagerKey: string);
    get targetResourceManagedState(): ResourceStatusInfo;
}
export default ManagementResourceBase;
