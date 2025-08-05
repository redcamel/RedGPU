import RedGPUContext from "../../../context/RedGPUContext";
import {
	createDebugTitle,
	getDebugFormatValue,
	makeBooleanDebug,
	makeColorDebug,
	updateDebugItemValue
} from "../core/debugFunc";
import DebugRender from "../DebugRender";
import ADebugItem from "./core/ADebugItem";
import ADebugStatisticsDomService from "./core/ADebugStatisticsDomService";

const debugStats = [
	"useMSAA",
	"useFXAA",
	"alphaMode",
	"renderScale",
];

class DebugStatisticsDomService extends ADebugStatisticsDomService {
	constructor() {
		super()
		this.init(`${createDebugTitle(`RedGPUContext`)}`, true)
		this.#generateDebugItemsHtml();
	}

	update(debugRender: DebugRender, redGPUContext: RedGPUContext) {
		debugStats.forEach(stat => this.#updateDebugStat(redGPUContext, stat));
		this.#updateViewportSize(redGPUContext);
	}

	#generateDebugItemsHtml() {
		const rootDom = this.dom.querySelector('.item-container')
		const stats = [
			'<div class="debug-group">',
			...debugStats.map(
				stat => this.#generateDebugItemHtml(stat)
			),
			this.#generateDebugItemHtml('width_height'),
			this.#generateDebugItemHtml('pixelRectArray'),
			this.#generateDebugItemHtml('backgroundColor'),
			'</div>'
		]
		rootDom.innerHTML = stats.join('')
	}

	#generateDebugItemHtml(stat: string) {
		return `
            <div class='debug-item'>
                ${stat}
                <span class='debug-item-title redGPUContext_${stat}'/>
            </div>
        `;
	}

	#updateDebugStat(redGPUContext: RedGPUContext, stat: string) {
		const isAntialiasing = ['useMSAA', 'useFXAA'].includes(stat)
		const value = isAntialiasing ? redGPUContext.antialiasingManager[stat] : redGPUContext[stat];
		updateDebugItemValue(this.dom, `redGPUContext_${stat}`, isAntialiasing ? makeBooleanDebug('useMSAA', value) : getDebugFormatValue(value));
	}

	#updateViewportSize(redGPUContext: RedGPUContext,) {
		const {sizeManager, width, height, backgroundColor} = redGPUContext;
		const {pixelRectArray} = sizeManager
		updateDebugItemValue(this.dom, `redGPUContext_width_height`, `${width}, ${height}`);
		updateDebugItemValue(this.dom, `redGPUContext_pixelRectArray`, pixelRectArray);
		updateDebugItemValue(this.dom, `redGPUContext_backgroundColor`, makeColorDebug('backgroundColor', backgroundColor));
	}
}

class DebugRedGPUContext extends ADebugItem {
	constructor() {
		super();
		this.debugStatisticsDomService = new DebugStatisticsDomService();
	}
}

export default DebugRedGPUContext
