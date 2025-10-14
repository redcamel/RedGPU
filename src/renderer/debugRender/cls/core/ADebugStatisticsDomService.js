class ADebugStatisticsDomService {
    dom;
    #openYn = false;
    constructor() {
    }
    get openYn() {
        return this.#openYn;
    }
    set openYn(value) {
        this.#openYn = value;
        this.dom.querySelector('.onoff').innerHTML = this.openYn ? 'close' : 'open';
    }
    init(title, openYn = false, useSmallTitle = false) {
        this.#openYn = openYn;
        this.dom = document.createElement('div');
        this.dom.innerHTML = `
			<div class="debug-folder">	
				<div class="${useSmallTitle ? 'debug-folder-small-title' : 'debug-folder-title'}">
						${title}
						<div class="onoff">${this.openYn ? 'close' : 'open'}</div>
				</div>
				<div class="item-container" style="display: ${openYn ? '' : 'none'}"></div>
			</div>
`;
        const itemContainerOnOff = this.dom.querySelector(`.onoff`).parentNode;
        const itemContainer = this.dom.querySelector(`.item-container`);
        itemContainerOnOff.addEventListener('click', e => {
            this.openYn = !this.openYn;
            itemContainer.style.display = this.openYn ? '' : 'none';
        });
    }
    update(debugRender, redGPUContext) {
    }
}
export default ADebugStatisticsDomService;
