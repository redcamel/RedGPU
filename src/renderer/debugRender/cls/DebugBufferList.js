import ResourceStateIndexBuffer from "../../../resources/core/resourceManager/resourceState/ResourceStateIndexBuffer";
import ResourceStateStorageBuffer from "../../../resources/core/resourceManager/resourceState/ResourceStateStorageBuffer";
import ResourceStateUniformBuffer from "../../../resources/core/resourceManager/resourceState/ResourceStateUniformBuffer";
import ResourceStateVertexBuffer from "../../../resources/core/resourceManager/resourceState/ResourceStateVertexBuffer";
import formatBytes from "../../../utils/math/formatBytes";
import { createDebugTitle, updateDebugItemValue } from "../core/debugFunc";
class DebugStatisticsDomService {
    dom;
    #bufferType;
    #openYn = false;
    constructor(bufferType) {
        this.#bufferType = bufferType;
        this.dom = document.createElement('div');
        this.dom.innerHTML = `
			<div class="debug-folder">	
				<div class="debug-folder-small-title" style="display: flex;align-items: center;justify-content: space-between;cursor: pointer;">
					${createDebugTitle(`${bufferType} Num : <span class="totalCount"></span> (<b class="targetVideoMemorySize"></b>)`)}
					<div class="onoff">${this.#openYn ? 'close' : 'open'}</div>
				</div>
				<div class="item-container" style="display: none"></div>
			</div>
`;
        const itemContainerOnOff = this.dom.querySelector(`.debug-folder`);
        const itemContainer = this.dom.querySelector(`.item-container`);
        itemContainerOnOff.addEventListener('click', () => {
            this.openYn = !this.openYn;
            itemContainer.style.display = this.#openYn ? '' : 'none';
        });
    }
    get openYn() {
        return this.#openYn;
    }
    set openYn(value) {
        this.#openYn = value;
        this.dom.querySelector('.onoff').innerHTML = this.openYn ? 'close' : 'open';
    }
    update(debugRender, redGPUContext) {
        const { resourceManager } = redGPUContext;
        if (this.#bufferType === 'Buffer') {
            const targetState = resourceManager.resources.get('GPUBuffer');
            const { videoMemory } = targetState;
            debugRender.totalUsedVideoMemory += videoMemory;
            updateDebugItemValue(this.dom, 'totalCount', targetState.size);
            updateDebugItemValue(this.dom, 'targetVideoMemorySize', formatBytes(videoMemory));
            this.#generateDebugItemsHtmlForBuffer(targetState);
        }
        else {
            const targetBufferState = resourceManager[`managed${this.#bufferType}State`];
            const { table, videoMemory } = targetBufferState;
            debugRender.totalUsedVideoMemory += videoMemory;
            updateDebugItemValue(this.dom, 'totalCount', table.size);
            updateDebugItemValue(this.dom, 'targetVideoMemorySize', formatBytes(videoMemory));
            // console.log(this.#bufferType)
            let targetState;
            switch (this.#bufferType) {
                case 'VertexBuffer':
                    targetState = ResourceStateVertexBuffer;
                    break;
                case 'IndexBuffer':
                    targetState = ResourceStateIndexBuffer;
                    break;
                case 'UniformBuffer':
                    targetState = ResourceStateUniformBuffer;
                    break;
                case 'StorageBuffer':
                    targetState = ResourceStateStorageBuffer;
                    break;
            }
            if (targetState) {
                this.#generateDebugItemsHtml(table);
            }
        }
    }
    #formatCacheKeyForDisplay(cacheKey) {
        // Vertex_ 또는 Index_ 접두사 제거
        let processedKey = cacheKey;
        if (cacheKey.startsWith('Vertex_') || cacheKey.startsWith('Index_')) {
            processedKey = cacheKey.substring(cacheKey.indexOf('_') + 1);
        }
        try {
            const url = new URL(processedKey);
            const filename = url.pathname.split('/').pop() || processedKey;
            return {
                host: url.host,
                filename: filename
            };
        }
        catch {
            // URL이 아닌 경우
            return {
                host: null,
                filename: processedKey
            };
        }
    }
    #generateDebugItemsHtmlForBuffer(bufferMap) {
        const rootDom = this.dom.querySelector('.item-container');
        const initialUUIDs = new Set();
        const prefix = this.#bufferType;
        const existingElements = new Map();
        rootDom.querySelectorAll('.debug-group').forEach((dom) => {
            const uuid = dom.className.split(' ')[1].replace(`${prefix}_`, '');
            initialUUIDs.add(uuid);
            existingElements.set(uuid, dom);
        });
        let index = 0;
        bufferMap.forEach((gpuBuffer, key) => {
            const uuid = key;
            const size = gpuBuffer.size || 0;
            const domUuid = `${prefix}_${uuid}`;
            let tDom = existingElements.get(uuid);
            if (!tDom) {
                tDom = document.createElement('div');
                tDom.className = `debug-group ${domUuid}`;
                tDom.innerHTML = `
				<div class='debug-item'>
					<div>
						<div class='debug-item-title'><span style="white-space: nowrap">
						<span class="host"></span>
						<div class="name"></div>
						</span></div>
						<div style="font-size: 10px">${uuid}</div>
					</div>
					<div style="display: flex;flex-direction: column;align-items: center;gap:4px;width: 50px">
						<span style="white-space: nowrap"><b class="videoMemorySize"></b></span>
					</div>
				</div>
			`;
                rootDom.appendChild(tDom);
            }
            else {
                initialUUIDs.delete(uuid);
            }
            // GPUBuffer는 이름이 key 값이므로 직접 사용
            const { host, filename } = this.#formatCacheKeyForDisplay(key);
            if (host) {
                updateDebugItemValue(tDom, 'host', `${index} ${host}`);
                updateDebugItemValue(tDom, 'name', filename);
            }
            else {
                updateDebugItemValue(tDom, 'host', `${index} ${key}`);
            }
            updateDebugItemValue(tDom, 'videoMemorySize', formatBytes(size));
            index++;
        });
        // 더 이상 존재하지 않는 요소들 제거
        for (let uuid of initialUUIDs) {
            existingElements.get(uuid).remove();
        }
    }
    #generateDebugItemsHtml(tList) {
        const rootDom = this.dom.querySelector('.item-container');
        const initialUUIDs = new Set();
        const prefix = this.#bufferType;
        const existingElements = new Map();
        rootDom.querySelectorAll('.debug-group').forEach((dom) => {
            const uuid = dom.className.split(' ')[1].replace(`${prefix}_`, '');
            initialUUIDs.add(uuid);
            existingElements.set(uuid, dom);
        });
        let index = 0;
        const isHideBuffer = this.#bufferType === 'UniformBuffer' || this.#bufferType === 'StorageBuffer';
        tList.forEach((tInfo) => {
            const { useNum, buffer } = tInfo;
            const { uuid, size, name, gpuBuffer } = buffer;
            const { label } = gpuBuffer;
            const domUuid = `${prefix}_${uuid}`;
            let tDom = existingElements.get(uuid);
            if (!tDom) {
                tDom = document.createElement('div');
                tDom.className = `debug-group ${domUuid}`;
                tDom.innerHTML = `
            <div class='debug-item'>
                <div style="display: flex;flex-direction: column;width: 100%">
                    <div class='debug-item-title'><span style="white-space: nowrap">
                    <span class="host"></span>
                    <div class="name"></div>
                    </span></div>
                    <div style="font-size: 10px">${uuid}</div>
                </div>
                <div style="display: flex;flex-direction: column;align-items: center;gap:4px;width: 50px;min-width: 50px">
                   <span class='useNum' style="display:${isHideBuffer ? 'none' : 'block'};padding:2px 4px;border-radius: 4px;width: 100%;text-align: center"></span>
                    <span style="white-space: nowrap"><b class="videoMemorySize"></b></span>
                </div>
            </div>
            `;
                rootDom.appendChild(tDom);
            }
            else {
                initialUUIDs.delete(uuid);
            }
            const { host, filename } = this.#formatCacheKeyForDisplay(name);
            // 호스트가 있을 때만 호스트 정보 표시
            if (host) {
                updateDebugItemValue(tDom, 'host', `${index} ${host}`);
                updateDebugItemValue(tDom, 'name', filename);
            }
            else {
                updateDebugItemValue(tDom, 'host', `${index} ${label}`);
                // updateDebugItemValue(tDom, 'name', name);
            }
            if (!isHideBuffer) {
                updateDebugItemValue(tDom, 'useNum', useNum, true);
            }
            updateDebugItemValue(tDom, 'videoMemorySize', formatBytes(size));
            index++;
        });
        for (let uuid of initialUUIDs) {
            existingElements.get(uuid).remove();
        }
    }
}
class DebugBufferList {
    debugStatisticsDomService;
    constructor(bufferType) {
        this.debugStatisticsDomService = new DebugStatisticsDomService(bufferType);
    }
    get dom() {
        return this.debugStatisticsDomService.dom;
    }
    update(debugRender, redGPUContext) {
        this.debugStatisticsDomService.update(debugRender, redGPUContext);
    }
}
export default DebugBufferList;
