import formatBytes from "../../../utils/formatBytes";
import {createDebugTitle, updateDebugItemValue} from "../core/debugFunc";
import DebugRender from "../DebugRender";
import ADebugItem from "./core/ADebugItem";

const debugStats = [
    "totalNum3DGroups",
    "totalNum3DObjects",
    "totalNumInstances",
    "totalNumDrawCalls",
    "totalNumTriangles",
    "totalNumPoints",
    "totalUsedVideoMemory"
];

class DebugStatisticsDomService {
    dom: HTMLElement;

    constructor() {
        this.dom = document.createElement('div');
        this.#initializeStatisticsDisplay();
    }

    update(debugRender: DebugRender) {
        debugStats.forEach(stat => {
            const value = debugRender[stat]
            const formatValue = stat === 'totalUsedVideoMemory' ? `<b>${formatBytes(value)}</b>` : value;
            updateDebugItemValue(this.dom, stat, formatValue)
        });
    }

    #initializeStatisticsDisplay() {
        const debugItemHtml = this.#generateDebugItemsHtml();
        this.dom.innerHTML = `
  		<div class="debug-group">
          ${createDebugTitle('Total State')}
          <div>${debugItemHtml}</div> 
      </div>
    `;
    }

    #generateDebugItemsHtml() {
        return debugStats.map(
            stat => {
                if (stat === 'totalUsedVideoMemory') {
                    return `<div class='debug-item'>${stat}<span class='debug-item-title'/><b class="${stat}"></b></div>`
                } else {
                    return `<div class='debug-item'>${stat}<span class='debug-item-title ${stat}'/></div>`
                }
            }
        ).join('');
    }
}

class DebugTotalState extends ADebugItem {
    constructor() {
        super();
        this.debugStatisticsDomService = new DebugStatisticsDomService();
    }
}

export default DebugTotalState
