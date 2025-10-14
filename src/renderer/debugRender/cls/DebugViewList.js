import formatBytes from "../../../utils/math/formatBytes";
import { createDebugTitle, makeBooleanDebug, makeColorDebug, updateDebugItemValue } from "../core/debugFunc";
import ADebugItem from "./core/ADebugItem";
import ADebugStatisticsDomService from "./core/ADebugStatisticsDomService";
const debugStats = [
    "usedVideoMemory",
    "viewRenderTime",
    "num3DGroups",
    "num3DObjects",
    "numInstances",
    "numDrawCalls",
    "numTriangles",
    "numPoints"
];
const debugStatsUnit = {
    viewRenderTime: 'ms',
};
const debugStatsTitle = {
    // usedVideoMemory: 'view Texture videoMemorySize',
    camera: 'camera.name',
    scene: 'scene.name',
    useBackgroundColor: 'scene.useBackgroundColor',
    backgroundColor: 'scene.backgroundColor',
    x_y: 'x, y',
    width_height: 'width, height',
};
const LINE = '<div class="div-line"></div>';
class DebugStatisticsDomService extends ADebugStatisticsDomService {
    #viewNum = 0;
    constructor() {
        super();
        this.init(`${createDebugTitle(`ViewList`)}`, true);
    }
    update(debugRender, redGPUContext) {
        const { viewList, numViews } = redGPUContext;
        if (this.#viewNum !== numViews) {
            this.#generateDebugSubItemsHtml(viewList);
            this.#viewNum = numViews;
        }
        viewList.forEach((view, index) => {
            debugStats.forEach(stat => this.#updateDebugStat(view, index, stat, debugRender));
            this.#updateViewportSize(view, index);
        });
    }
    #generateDebugItemHtml(index, stat) {
        const title = debugStatsTitle[stat] || stat;
        return `
            <div class='debug-item'>
                ${title}
                <span class='debug-item-title view${index}_${stat}'/>
            </div>
        `;
    }
    #generateDebugSubItemsHtml(viewList) {
        const rootDom = this.dom.querySelector('.item-container');
        const t0 = viewList.map((view, index) => {
            const { name } = view;
            const stats = debugStats.map(stat => this.#generateDebugItemHtml(index, stat));
            stats.push('<div class="debug-sub-group">', this.#generateDebugItemHtml(index, 'x_y'), this.#generateDebugItemHtml(index, 'width_height'), this.#generateDebugItemHtml(index, 'pixelRectArray'), this.#generateDebugItemHtml(index, 'camera'), this.#generateDebugItemHtml(index, 'scene'), this.#generateDebugItemHtml(index, 'useBackgroundColor'), this.#generateDebugItemHtml(index, 'backgroundColor'), '</div>');
            return `${createDebugTitle(`<div class="debug-sub-group-title">${name}</div>`)}${stats.join('')}`;
        });
        return rootDom.innerHTML = `
       <div class="debug-group">
            ${t0.join(LINE)}
        </div>
        `;
    }
    #updateDebugStat(view, index, stat, debugRender) {
        const { renderViewStateData } = view;
        const totalKey = `total${stat.charAt(0).toUpperCase()}${stat.substring(1)}`;
        const value = renderViewStateData[stat];
        const formatValue = stat === 'usedVideoMemory' ? `<b>${formatBytes(value)}</b>` : value;
        const unit = debugStatsUnit[stat];
        debugRender[totalKey] += value;
        updateDebugItemValue(this.dom, `view${index}_${stat}`, formatValue, false, unit);
    }
    #updateViewportSize(view, index) {
        const { renderViewStateData, rawCamera, scene } = view;
        const { backgroundColor, useBackgroundColor } = scene;
        const { viewportSize } = renderViewStateData;
        const { pixelRectArray, x, y, width, height } = viewportSize;
        updateDebugItemValue(this.dom, `view${index}_x_y`, `${formatNumber(x)}, ${formatNumber(y)}`);
        updateDebugItemValue(this.dom, `view${index}_width_height`, `${width}, ${height}`);
        updateDebugItemValue(this.dom, `view${index}_pixelRectArray`, pixelRectArray);
        updateDebugItemValue(this.dom, `view${index}_useBackgroundColor`, makeBooleanDebug('useBackgroundColor', useBackgroundColor));
        updateDebugItemValue(this.dom, `view${index}_backgroundColor`, makeColorDebug('backgroundColor', backgroundColor));
        updateDebugItemValue(this.dom, `view${index}_camera`, rawCamera.name);
        updateDebugItemValue(this.dom, `view${index}_scene`, scene.name);
    }
}
class DebugViewList extends ADebugItem {
    constructor() {
        super();
        this.debugStatisticsDomService = new DebugStatisticsDomService();
    }
}
const formatNumber = (val) => {
    const str = String(val);
    if (str.includes('%')) {
        const num = parseFloat(str);
        return isNaN(num) ? str : `${num.toFixed(2)}%`;
    }
    if (str.includes('px')) {
        const num = parseFloat(str);
        return isNaN(num) ? str : `${num.toFixed(2)}px`;
    }
    const num = parseFloat(str);
    return isNaN(num) ? str : num.toFixed(2);
};
export default DebugViewList;
