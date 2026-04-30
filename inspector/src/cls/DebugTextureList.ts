import RedGPUContext from "../../../src/context/RedGPUContext";
import ResourceStateBitmapTexture
    from "../../../src/resources/core/resourceManager/resourceState/texture/ResourceStateBitmapTexture";
import ResourceStateCubeTexture
    from "../../../src/resources/core/resourceManager/resourceState/texture/ResourceStateCubeTexture";
import ResourceStateHDRTexture
    from "../../../src/resources/core/resourceManager/resourceState/texture/ResourceStateHDRTexture";
import PackedTexture from "../../../src/resources/texture/packedTexture/PackedTexture";
import formatBytes from "../../../src/utils/formatBytes";
import {createDebugTitle, updateDebugItemValue} from "../core/debugFunc";
import RedGPUInspector from "../index";
import ADebugItem from "./core/ADebugItem";
import ADebugStatisticsDomService from "./core/ADebugStatisticsDomService";

class DebugStatisticsDomService extends ADebugStatisticsDomService {
    readonly #debugCubeTextureMode: 'Bitmap' | 'Cube' | 'HDR' | 'Packed'

    constructor(debugCubeTextureMode: 'Bitmap' | 'Cube' | 'HDR' | 'Packed') {
        super()
        this.#debugCubeTextureMode = debugCubeTextureMode
        this.init(`${createDebugTitle(`${debugCubeTextureMode}Texture Num : <span class="totalCount"></span> (<b class="targetVideoMemorySize"></b>)`)}`, false, true)
    }

    update(debugRender: RedGPUInspector, redGPUContext: RedGPUContext) {
        if (this.#debugCubeTextureMode === 'Packed') {
            // PackedTexture ?ÑÏö© Ï≤òÎ¶¨
            this.#updatePackedTexture(debugRender, redGPUContext);
        } else {
            // Í∏∞Ï°¥ ?çÏä§Ï≤òÎì§ Ï≤òÎ¶¨
            const {resourceManager} = redGPUContext
            const {managedBitmapTextureState, managedCubeTextureState, managedHDRTextureState} = resourceManager
            const {
                table,
                videoMemory,
            } = this.#debugCubeTextureMode === 'Bitmap' ? managedBitmapTextureState : this.#debugCubeTextureMode === 'Cube' ? managedCubeTextureState : managedHDRTextureState
            debugRender.totalUsedVideoMemory += videoMemory
            updateDebugItemValue(this.dom, 'totalCount', table.size)
            updateDebugItemValue(this.dom, 'targetVideoMemorySize', formatBytes(videoMemory))
            // this.#generateDebugItemsHtml(table);
        }
    }

    getTargetSrc(tInfo: ResourceStateBitmapTexture | ResourceStateCubeTexture | ResourceStateHDRTexture | any) {
        // PackedTexture??Í≤ΩÏö∞ Î≥ÑÎèÑ Ï≤òÎ¶¨
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
        // ?∏Ïä§?∏Í? ?àÏùÑ ?åÎßå ?∏Ïä§???ïÎ≥¥ ?úÏãú
        if (host) {
            updateDebugItemValue(tDom, 'host', host);
            updateDebugItemValue(tDom, 'fileName', filename);
        } else {
            updateDebugItemValue(tDom, 'fileName', cacheKey);
        }
        updateDebugItemValue(tDom, 'targetSrc', targetSrc === 'null' ? '' : targetSrc);
        updateDebugItemValue(tDom, 'videoMemorySize', formatBytes(videoMemorySize));
    }

    #updatePackedTexture(debugRender: RedGPUInspector, redGPUContext: RedGPUContext) {
        // PackedTexture Ï∫êÏãú ?ïÎ≥¥ Í∞Ä?∏Ïò§Í∏?
        const cacheMap = PackedTexture.getCacheMap();
        // PackedTexture ?∞Ïù¥?∞Î? Í∏∞Ï°¥ ?úÏä§?úÍ≥º ?∏Ìôò?òÎäî ?ïÌÉúÎ°?Î≥Ä??
        const convertedTable = this.#convertPackedTextureData(cacheMap);
        // Ï¥?ÎπÑÎîî??Î©îÎ™®Î¶?Í≥ÑÏÇ∞
        let totalVideoMemory = 0;
        convertedTable.forEach((mockResourceState) => {
            totalVideoMemory += mockResourceState.texture.videoMemorySize;
        });
        debugRender.totalUsedVideoMemory += totalVideoMemory;
        updateDebugItemValue(this.dom, 'totalCount', convertedTable.size);
        updateDebugItemValue(this.dom, 'targetVideoMemorySize', formatBytes(totalVideoMemory));
        // Í∏∞Ï°¥ ?åÎçîÎß??úÏä§???¨Ïö©
        // this.#generateDebugItemsHtml(convertedTable);
    }

    #convertPackedTextureData(cacheMap: Map<string, {
        gpuTexture: GPUTexture,
        useNum: number,
        mappingKey: string,
        uuid: string
    }>) {
        const convertedTable = new Map();
        cacheMap.forEach((entry, mappingKey) => {
            // Í∏∞Ï°¥ ResourceState?Ä ?†ÏÇ¨??Íµ¨Ï°∞Î°?Î≥Ä??
            const mockTexture = {
                gpuTexture: entry.gpuTexture,
                uuid: entry.uuid, // Í≥†Ïú† ID ?ùÏÑ±
                mipLevelCount: entry.gpuTexture.mipLevelCount || 1,
                useMipmap: (entry.gpuTexture.mipLevelCount || 1) > 1,
                videoMemorySize: this.#estimateTextureMemorySize(entry.gpuTexture)
            };
            const mockResourceState = {
                useNum: entry.useNum,
                cacheKey: mappingKey,
                texture: mockTexture,
                // PackedTexture??srcÍ∞Ä ?ÜÏúºÎØÄÎ°?mappingKeyÎ•??¨Ïö©
                src: `packed:${mappingKey.substring(0, 50)}${mappingKey.length > 50 ? '...' : ''}`,
                // PackedTexture ?πÌôî ?ïÎ≥¥
                mappingKey: entry.mappingKey
            };
            convertedTable.set(mappingKey, mockResourceState);
        });
        return convertedTable;
    }

    #estimateTextureMemorySize(texture: GPUTexture): number {
        // GPUTexture???§Ï†ú ?¨Í∏∞ ?ïÎ≥¥Î•??ªÍ∏∞ ?¥Î†§?∞Î?Î°?Ï∂îÏ†ïÍ∞??¨Ïö©
        // texture.label?êÏÑú ?¨Í∏∞ ?ïÎ≥¥Î•?Ï∂îÏ∂ú?????àÎã§Î©????ïÌôï??Í≥ÑÏÇ∞ Í∞Ä??
        const labelMatch = texture.label?.match(/(\d+)x(\d+)/);
        if (labelMatch) {
            const width = parseInt(labelMatch[1]);
            const height = parseInt(labelMatch[2]);
            const mipLevels = texture.mipLevelCount || 1;
            // RGBA8 Í∏∞Ï??ºÎ°ú Í≥ÑÏÇ∞, mip level??Í≥†Î†§
            let totalSize = 0;
            for (let i = 0; i < mipLevels; i++) {
                const mipWidth = Math.max(1, width >> i);
                const mipHeight = Math.max(1, height >> i);
                totalSize += mipWidth * mipHeight * 4;
            }
            return totalSize;
        }
        // Í∏∞Î≥∏?ÅÏúºÎ°?1024x1024 RGBA8 ?çÏä§Ï≤òÎ°ú Ï∂îÏ†ï (4MB)
        return 1024 * 1024 * 4;
    }

    #formatCacheKeyForDisplay(cacheKey: string): { host: string | null, filename: string } {
        // PackedTexture??Í≤ΩÏö∞ ?πÎ≥Ñ Ï≤òÎ¶¨
        if (this.#debugCubeTextureMode === 'Packed') {
            try {
                // mappingKey??JSON + textureKey ?ïÌÉú
                // ?? {"r":"r","g":"g","b":"b","a":"a"}_texture1_texture2_texture3_
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
                // JSON ?åÏã± ?§Ìå® ??Í∏∞Î≥∏ Ï≤òÎ¶¨
            }
            // Í∏∞Î≥∏ PackedTexture Ï≤òÎ¶¨
            const shortKey = cacheKey.length > 30 ? cacheKey.substring(0, 30) + '...' : cacheKey;
            return {
                host: 'packed',
                filename: shortKey
            };
        }
        // Í∏∞Ï°¥ Ï≤òÎ¶¨ Î°úÏßÅ
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
