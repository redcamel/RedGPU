import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateBitmapTexture
	from "../../../resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture";
import ResourceStateCubeTexture
	from "../../../resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture";
import ResourceStateHDRTexture from "../../../resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture";
import PackedTexture from "../../../resources/texture/packedTexture/PackedTexture";
import formatBytes from "../../../utils/math/formatBytes";
import {createDebugTitle, updateDebugItemValue} from "../core/debugFunc";
import DebugRender from "../DebugRender";
import ADebugItem from "./core/ADebugItem";
import ADebugStatisticsDomService from "./core/ADebugStatisticsDomService";

class DebugStatisticsDomService extends ADebugStatisticsDomService {
	readonly #debugCubeTextureMode: 'Bitmap' | 'Cube' | 'HDR' | 'Packed'

	constructor(debugCubeTextureMode: 'Bitmap' | 'Cube' | 'HDR' | 'Packed') {
		super()
		this.#debugCubeTextureMode = debugCubeTextureMode
		this.init(`${createDebugTitle(`${debugCubeTextureMode}Texture Num : <span class="totalCount"></span> (<b class="targetVideoMemorySize"></b>)`)}`, false, true)
	}

	update(debugRender: DebugRender, redGPUContext: RedGPUContext) {
		if (this.#debugCubeTextureMode === 'Packed') {
			// PackedTexture 전용 처리
			this.#updatePackedTexture(debugRender, redGPUContext);
		} else {
			// 기존 텍스처들 처리
			const {resourceManager} = redGPUContext
			const {managedBitmapTextureState, managedCubeTextureState, managedHDRTextureState} = resourceManager
			const {
				table,
				videoMemory,
			} = this.#debugCubeTextureMode === 'Bitmap' ? managedBitmapTextureState : this.#debugCubeTextureMode === 'Cube' ? managedCubeTextureState : managedHDRTextureState
			debugRender.totalUsedVideoMemory += videoMemory
			updateDebugItemValue(this.dom, 'totalCount', table.size)
			updateDebugItemValue(this.dom, 'targetVideoMemorySize', formatBytes(videoMemory))
			this.#generateDebugItemsHtml(table);
		}
	}

	getTargetSrc(tInfo: ResourceStateBitmapTexture | ResourceStateCubeTexture | ResourceStateHDRTexture | any) {
		// PackedTexture의 경우 별도 처리
		if (this.#debugCubeTextureMode === 'Packed') {
			return tInfo.src || 'packed texture';
		}
		if (tInfo instanceof ResourceStateCubeTexture) {
			const {cacheKey} = tInfo;
			return `${cacheKey}...`
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
                <div class='debug-item-title'>${index} <span class="targetSrc" style="white-space: nowrap">${targetSrc || ''}</span></div> 
                <div class='debug-item-cache-key'><span class="host">Place holder for host</span></div>
                <div class='debug-item-cache-key'><span class="fileName">Place holder for fileName</span></div>
                <div>mipLevelCount : <span class="mipLevelCount"></span> / useMipmap : <span class="useMipmap"></span></div>
                <div>width : <span class="width"></span> / height : <span class="height"></span></div>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;gap:4px;width: 50px;min-width: 50px">
                <span class='useNum' style="display:${this.#debugCubeTextureMode === 'HDR' ? 'none' : 'block'}padding:2px 4px;border-radius: 4px;width: 100%;text-align: center"></span>
                <span><b class="videoMemorySize"></b></span>
            </div>
        </div>
        <div style="font-size: 10px">${uuid}</div>
        `;
			rootDom.appendChild(tDom);
		}
		return tDom;
	}

	updateDebugItems(tDom, mipLevelCount, useMipmap, width, height, useNum, cacheKey, targetSrc, videoMemorySize) {
		updateDebugItemValue(tDom, 'mipLevelCount', mipLevelCount);
		updateDebugItemValue(tDom, 'useMipmap', useMipmap);
		updateDebugItemValue(tDom, 'width', width);
		updateDebugItemValue(tDom, 'height', height);
		if (this.#debugCubeTextureMode !== 'HDR') updateDebugItemValue(tDom, 'useNum', useNum, true);
		const {host, filename} = this.#formatCacheKeyForDisplay(cacheKey);
		// 호스트가 있을 때만 호스트 정보 표시
		if (host) {
			updateDebugItemValue(tDom, 'host', host);
			updateDebugItemValue(tDom, 'fileName', filename);
		} else {
			updateDebugItemValue(tDom, 'fileName', cacheKey);
		}
		updateDebugItemValue(tDom, 'targetSrc', targetSrc === 'null' ? '' : targetSrc);
		updateDebugItemValue(tDom, 'videoMemorySize', formatBytes(videoMemorySize));
	}

	#updatePackedTexture(debugRender: DebugRender, redGPUContext: RedGPUContext) {
		// PackedTexture 캐시 정보 가져오기
		const cacheMap = PackedTexture.getCacheMap();
		// PackedTexture 데이터를 기존 시스템과 호환되는 형태로 변환
		const convertedTable = this.#convertPackedTextureData(cacheMap);
		// 총 비디오 메모리 계산
		let totalVideoMemory = 0;
		convertedTable.forEach((mockResourceState) => {
			totalVideoMemory += mockResourceState.texture.videoMemorySize;
		});
		debugRender.totalUsedVideoMemory += totalVideoMemory;
		updateDebugItemValue(this.dom, 'totalCount', convertedTable.size);
		updateDebugItemValue(this.dom, 'targetVideoMemorySize', formatBytes(totalVideoMemory));
		// 기존 렌더링 시스템 사용
		this.#generateDebugItemsHtml(convertedTable);
	}

	#convertPackedTextureData(cacheMap: Map<string, {
		gpuTexture: GPUTexture,
		useNum: number,
		mappingKey: string,
		uuid: string
	}>) {
		const convertedTable = new Map();
		cacheMap.forEach((entry, mappingKey) => {
			// 기존 ResourceState와 유사한 구조로 변환
			const mockTexture = {
				gpuTexture: entry.gpuTexture,
				uuid: entry.uuid, // 고유 ID 생성
				mipLevelCount: entry.gpuTexture.mipLevelCount || 1,
				useMipmap: (entry.gpuTexture.mipLevelCount || 1) > 1,
				videoMemorySize: this.#estimateTextureMemorySize(entry.gpuTexture)
			};
			const mockResourceState = {
				useNum: entry.useNum,
				cacheKey: mappingKey,
				texture: mockTexture,
				// PackedTexture는 src가 없으므로 mappingKey를 사용
				src: `packed:${mappingKey.substring(0, 50)}${mappingKey.length > 50 ? '...' : ''}`,
				// PackedTexture 특화 정보
				mappingKey: entry.mappingKey
			};
			convertedTable.set(mappingKey, mockResourceState);
		});
		return convertedTable;
	}

	#estimateTextureMemorySize(texture: GPUTexture): number {
		// GPUTexture의 실제 크기 정보를 얻기 어려우므로 추정값 사용
		// texture.label에서 크기 정보를 추출할 수 있다면 더 정확한 계산 가능
		const labelMatch = texture.label?.match(/(\d+)x(\d+)/);
		if (labelMatch) {
			const width = parseInt(labelMatch[1]);
			const height = parseInt(labelMatch[2]);
			const mipLevels = texture.mipLevelCount || 1;
			// RGBA8 기준으로 계산, mip level도 고려
			let totalSize = 0;
			for (let i = 0; i < mipLevels; i++) {
				const mipWidth = Math.max(1, width >> i);
				const mipHeight = Math.max(1, height >> i);
				totalSize += mipWidth * mipHeight * 4;
			}
			return totalSize;
		}
		// 기본적으로 1024x1024 RGBA8 텍스처로 추정 (4MB)
		return 1024 * 1024 * 4;
	}

	#formatCacheKeyForDisplay(cacheKey: string): { host: string | null, filename: string } {
		// PackedTexture의 경우 특별 처리
		if (this.#debugCubeTextureMode === 'Packed') {
			try {
				// mappingKey는 JSON + textureKey 형태
				// 예: {"r":"r","g":"g","b":"b","a":"a"}_texture1_texture2_texture3_
				const parts = cacheKey.split('}_');
				if (parts.length >= 2) {
					const mapping = parts[0] + '}';
					const textureKeys = parts[1];
					return {
						host: 'packed',
						filename: `${mapping.substring(0, 20)}...`
					};
				}
			} catch {
				// JSON 파싱 실패 시 기본 처리
			}
			// 기본 PackedTexture 처리
			const shortKey = cacheKey.length > 30 ? cacheKey.substring(0, 30) + '...' : cacheKey;
			return {
				host: 'packed',
				filename: shortKey
			};
		}
		// 기존 처리 로직
		try {
			const url = new URL(cacheKey);
			const filename = url.pathname.split('/').pop() || cacheKey;
			return {
				host: url.host,
				filename: filename
			};
		} catch {
			const splits = cacheKey.split('_')
			const host = splits[0];
			const filename = splits.pop() || cacheKey;
			return {
				host,
				filename
			};
		}
	}

	#generateDebugItemsHtml(tList: Map<string, ResourceStateBitmapTexture | ResourceStateCubeTexture | any>) {
		const rootDom = this.dom.querySelector('.item-container')
		const initialUUIDs: Set<string> = new Set();
		const prefix = this.#debugCubeTextureMode === 'Bitmap' ? 'cube_texture' :
			this.#debugCubeTextureMode === 'Cube' ? 'bitmap_texture' :
				this.#debugCubeTextureMode === 'HDR' ? 'hdr_texture' : 'packed_texture';
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
			rootDom.querySelector(`.${prefix}_${uuid}`)?.remove();
		}
	}
}

class DebugTextureList extends ADebugItem {
	constructor(type: 'Bitmap' | 'Cube' | 'HDR' | 'Packed' = 'Bitmap') {
		super()
		this.debugStatisticsDomService = new DebugStatisticsDomService(type);
	}
}

export default DebugTextureList
