import RedGPUContext from "../../../../context/RedGPUContext";
import DebugRender from "../../DebugRender";

class ADebugStatisticsDomService {
    dom: HTMLElement;
    #openYn: boolean = false

    constructor() {
    }

    get openYn(): boolean {
        return this.#openYn;
    }

    set openYn(value: boolean) {
        this.#openYn = value;
        this.dom.querySelector('.onoff').innerHTML = this.openYn ? 'close' : 'open'
    }

    init(title: string, openYn: boolean = false) {
        this.#openYn = openYn
        this.dom = document.createElement('div');
        this.dom.innerHTML = `
			<div class="debug-folder">	
				<div class="debug-folder-title">
						${title}
						<div class="onoff">${this.openYn ? 'close' : 'open'}</div>
				</div>
				<div class="item-container" style="display: ${openYn ? '' : 'none'}"></div>
			</div>
`
        const itemContainerOnOff: HTMLDivElement = this.dom.querySelector(`.debug-folder-title`)
        const itemContainer: HTMLDivElement = this.dom.querySelector(`.item-container`)
        itemContainerOnOff.addEventListener('click', e => {
            this.openYn = !this.openYn
            itemContainer.style.display = this.openYn ? '' : 'none'
        })
    }

    update(debugRender: DebugRender, redGPUContext: RedGPUContext) {
    }
}

export default ADebugStatisticsDomService
