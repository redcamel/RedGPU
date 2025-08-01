import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateBitmapTexture
	from "../../../resources/resourceManager/resourceState/texture/ResourceStateBitmapTexture";
import ResourceStateCubeTexture
	from "../../../resources/resourceManager/resourceState/texture/ResourceStateCubeTexture";
import ResourceStateHDRTexture from "../../../resources/resourceManager/resourceState/texture/ResourceStateHDRTexture";
import formatBytes from "../../../utils/math/formatBytes";
import {createDebugTitle, updateDebugItemValue} from "../core/debugFunc";
import DebugRender from "../DebugRender";
import ADebugItem from "./core/ADebugItem";
import ADebugStatisticsDomService from "./core/ADebugStatisticsDomService";

class DebugStatisticsDomService extends ADebugStatisticsDomService {
	readonly #debugCubeTextureMode:  'Bitmap' | 'Cube' | 'HDR'

	constructor(debugCubeTextureMode:  'Bitmap' | 'Cube' | 'HDR') {
		super()
		this.#debugCubeTextureMode = debugCubeTextureMode
		this.init(`${createDebugTitle(`${debugCubeTextureMode}Texture Num : <span class="totalCount"></span> (<b class="targetVideoMemorySize"></b>)`)}`)
	}

	update(debugRender: DebugRender, redGPUContext: RedGPUContext) {
		const {resourceManager} = redGPUContext
		const {managedBitmapTextureState, managedCubeTextureState,managedHDRTextureState} = resourceManager
		const {
			table,
			videoMemory,
		} = this.#debugCubeTextureMode === 'Bitmap' ? managedBitmapTextureState : this.#debugCubeTextureMode === 'Cube' ? managedCubeTextureState : managedHDRTextureState
		debugRender.totalUsedVideoMemory += videoMemory

		updateDebugItemValue(this.dom, 'totalCount', table.size)
		updateDebugItemValue(this.dom, 'targetVideoMemorySize', formatBytes(videoMemory))
		this.#generateDebugItemsHtml(table);
	}

	getTargetSrc(tInfo: ResourceStateBitmapTexture | ResourceStateCubeTexture | ResourceStateHDRTexture) {
		if (tInfo instanceof ResourceStateCubeTexture) {
			const {cacheKey} = tInfo;
			return `${cacheKey}...`
			// const {srcList} = tInfo;
			// return `${srcList[0]}...`
		} else {
			const {src} = tInfo;
			return src ? src.startsWith('data:') ? 'base64 texture' : src : 'null'
		}
	}

	getUpdatedTdom(tDom, rootDom, domUuid, index, targetSrc, uuid) {
		if (!tDom) {
			tDom = document.createElement('div');
			tDom.className = `debug-group ${domUuid}`
			tDom.innerHTML = `
        <div class='debug-item'>
          	<div style="display: flex;flex-direction: column;width: 100%">
                <div class='debug-item-title'>${index} <span class="targetSrc" style="white-space: nowrap">${targetSrc}</span></div> 
                <div class='debug-item-cache-key'>host : <span class="host">Place holder for host</span></div>
                <div class='debug-item-cache-key'>fileName : <span class="fileName">Place holder for fileName</span></div>
                <div>mipLevelCount : <span class="mipLevelCount"></span> / useMipmap : <span class="useMipmap"></span></div>
                <div>width : <span class="width"></span> / height : <span class="height"></span></div>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;gap:4px;width: 50px;min-width: 50px">
                <span class='useNum' style="padding:2px 4px;border-radius: 4px;width: 100%;text-align: center"></span>
                <span><b class="videoMemorySize"></b></span>
            </div>
        </div>
        <div style="font-size: 10px">${uuid}</div>
        `;
			rootDom.appendChild(tDom);
		}
		return tDom;
	}
	#formatCacheKeyForDisplay(cacheKey: string): { host: string | null, filename: string } {
		try {
			const url = new URL(cacheKey);
			const filename = url.pathname.split('/').pop() || cacheKey;
			return {
				host: url.host,
				filename: filename
			};
		} catch {
			// URL이 아닌 경우
			return {
				host: null,
				filename: cacheKey
			};
	}
	}


	updateDebugItems(tDom, mipLevelCount, useMipmap, width, height, useNum, cacheKey, targetSrc, videoMemorySize) {
		updateDebugItemValue(tDom, 'mipLevelCount', mipLevelCount);
		updateDebugItemValue(tDom, 'useMipmap', useMipmap);
		updateDebugItemValue(tDom, 'width', width);
		updateDebugItemValue(tDom, 'height', height);
		updateDebugItemValue(tDom, 'useNum', useNum, true);
		const { host, filename } = this.#formatCacheKeyForDisplay(cacheKey);
		// 호스트가 있을 때만 호스트 정보 표시
		if (host) {
			updateDebugItemValue(tDom, 'host', host);
			updateDebugItemValue(tDom, 'fileName', filename);
		} else {
			updateDebugItemValue(tDom, 'fileName', cacheKey);
		}

		// updateDebugItemValue(tDom, 'targetSrc', targetSrc);
		updateDebugItemValue(tDom, 'videoMemorySize', formatBytes(videoMemorySize));
	}

	#generateDebugItemsHtml(tList: Map<string, ResourceStateBitmapTexture | ResourceStateCubeTexture>) {
		const rootDom = this.dom.querySelector('.item-container')
		const initialUUIDs: Set<string> = new Set();
		const prefix = this.#debugCubeTextureMode === 'Bitmap' ? 'cube_texture' : this.#debugCubeTextureMode === 'Cube' ? 'bitmap_texture' :  'hdr_texture'
		rootDom.querySelectorAll('.debug-group').forEach((dom) => {
			const uuid: string = dom.className.split(' ')[1].replace(`${prefix}_`, '');
			initialUUIDs.add(uuid);
		})
		let index = 0;
		for (const tInfo of tList.values()) {
			const {useNum, cacheKey, texture} = tInfo;
			let targetSrc = this.getTargetSrc(tInfo);
			const {mipLevelCount, useMipmap, gpuTexture, uuid, videoMemorySize} = texture;
			const {width, height} = gpuTexture || {};
			const domUuid = `${prefix}_${texture.uuid}`;
			let tDom = rootDom.querySelector(`.${domUuid}`);
			tDom = this.getUpdatedTdom(tDom, rootDom, domUuid, index, targetSrc, uuid);
			initialUUIDs.delete(texture.uuid);
			this.updateDebugItems(tDom, mipLevelCount, useMipmap, width, height, useNum, cacheKey, targetSrc, videoMemorySize);
			index++;
		}
		for (let uuid of initialUUIDs) {
			rootDom.querySelector(`.${prefix}_${uuid}`).remove();
		}
	}
}

class DebugTextureList extends ADebugItem {
	constructor(type: 'Bitmap' | 'Cube' | 'HDR' = 'Bitmap') {
		super()
		this.debugStatisticsDomService = new DebugStatisticsDomService(type);
	}
}

export default DebugTextureList
