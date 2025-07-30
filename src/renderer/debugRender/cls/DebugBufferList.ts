import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateIndexBuffer from "../../../resources/resourceManager/resourceState/ResourceStateIndexBuffer";
import ResourceStateStorageBuffer from "../../../resources/resourceManager/resourceState/ResourceStateStorageBuffer";
import ResourceStateUniformBuffer from "../../../resources/resourceManager/resourceState/ResourceStateUniformBuffer";
import ResourceStateVertexBuffer from "../../../resources/resourceManager/resourceState/ResourceStateVertexBuffer";
import formatBytes from "../../../utils/math/formatBytes";
import {createDebugTitle, updateDebugItemValue} from "../core/debugFunc";
import DebugRender from "../DebugRender";

class DebugStatisticsDomService {
	dom: HTMLElement;
	readonly #bufferType: string
	#openYn: boolean = false

	constructor(bufferType: string) {
		this.#bufferType = bufferType
		this.dom = document.createElement('div');
		this.dom.innerHTML = `
			<div class="debug-folder">	
				<div class="debug-folder-title" style="display: flex;align-items: center;justify-content: space-between;cursor: pointer;">
					${createDebugTitle(`${bufferType} Num : <span class="totalCount"></span> (<b class="targetVideoMemorySize"></b>)`)}
					<div class="onoff">${this.#openYn ? 'close' : 'open'}</div>
				</div>
				<div class="item-container" style="display: none"></div>
			</div>
`
		const itemContainerOnOff: HTMLDivElement = this.dom.querySelector(`.debug-folder`)
		const itemContainer: HTMLDivElement = this.dom.querySelector(`.item-container`)
		itemContainerOnOff.addEventListener('click', () => {
			this.openYn = !this.openYn
			itemContainer.style.display = this.#openYn ? '' : 'none'
		})
	}

	get openYn(): boolean {
		return this.#openYn;
	}

	set openYn(value: boolean) {
		this.#openYn = value;
		this.dom.querySelector('.onoff').innerHTML = this.openYn ? 'close' : 'open'
	}

	update(debugRender: DebugRender, redGPUContext: RedGPUContext) {
		const {resourceManager} = redGPUContext
		const targetBufferState: any = resourceManager[`managed${this.#bufferType}State`]
		const {table, videoMemory} = targetBufferState
		debugRender.totalUsedVideoMemory += videoMemory
		updateDebugItemValue(this.dom, 'totalCount', table.size)
		updateDebugItemValue(this.dom, 'targetVideoMemorySize', formatBytes(videoMemory))
		// console.log(this.#bufferType)
		let targetState
		switch (this.#bufferType) {
			case 'VertexBuffer' :
				targetState = ResourceStateVertexBuffer

				break
			case 'IndexBuffer' :
				targetState = ResourceStateIndexBuffer
				break
			case 'UniformBuffer' :
				targetState = ResourceStateUniformBuffer
				break
			case 'StorageBuffer' :
				targetState = ResourceStateStorageBuffer
				break
		}
		if (targetState) {
			this.#generateDebugItemsHtml(table);
		}
	}

	#generateDebugItemsHtml(tList: Map<string,ResourceStateVertexBuffer | ResourceStateIndexBuffer | ResourceStateUniformBuffer | ResourceStateStorageBuffer>) {
		const rootDom = this.dom.querySelector('.item-container');
		const initialUUIDs: Set<string> = new Set();
		const prefix = this.#bufferType;
		const existingElements = new Map();
		rootDom.querySelectorAll('.debug-group').forEach((dom) => {
			const uuid: string = dom.className.split(' ')[1].replace(`${prefix}_`, '');
			initialUUIDs.add(uuid);
			existingElements.set(uuid, dom);
		});

		let index = 0;
		tList.forEach((tInfo: ResourceStateVertexBuffer | ResourceStateIndexBuffer | ResourceStateUniformBuffer | ResourceStateStorageBuffer) => {
			const {useNum, buffer} = tInfo;
			const {uuid, size, name} = buffer;
			const domUuid = `${prefix}_${uuid}`;
			let tDom = existingElements.get(uuid);
			if (!tDom) {
				tDom = document.createElement('div');
				tDom.className = `debug-group ${domUuid}`;
				tDom.innerHTML = `
            <div class='debug-item'>
                <div>
                    <div class='debug-item-title'><span style="white-space: nowrap">${index} <span class="name"></span></span></div>
                    <div style="font-size: 10px">${uuid}</div>
                </div>
                <div style="display: flex;flex-direction: column;align-items: center;gap:4px;width: 50px">
                    <span class='useNum' style="padding:2px 4px;border-radius: 4px;width: 100%;text-align: center"></span>
                    <span style="white-space: nowrap"><b class="videoMemorySize"></b></span>
                </div>
            </div>
            `;
				rootDom.appendChild(tDom);
			} else {
				initialUUIDs.delete(uuid);
			}
			updateDebugItemValue(tDom, 'name', name);
			updateDebugItemValue(tDom, 'useNum', useNum, true);
			updateDebugItemValue(tDom, 'videoMemorySize', formatBytes(size));
			index++;
		});

		for (let uuid of initialUUIDs) {
			existingElements.get(uuid).remove();
		}
	}
}

class DebugBufferList {
	debugStatisticsDomService: DebugStatisticsDomService;

	constructor(bufferType: 'IndexBuffer' | 'VertexBuffer' | 'UniformBuffer' | 'StorageBuffer') {
		this.debugStatisticsDomService = new DebugStatisticsDomService(bufferType);
	}

	get dom() {
		return this.debugStatisticsDomService.dom;
	}

	update(debugRender: DebugRender, redGPUContext: RedGPUContext,) {
		this.debugStatisticsDomService.update(debugRender, redGPUContext);
	}
}

export default DebugBufferList
