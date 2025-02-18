import RedGPUContext from "../../../context/RedGPUContext";
import ResourceStateBitmapTexture from "../../../resources/resourceManager/resourceState/ResourceStateBitmapTexture";
import ResourceStateCubeTexture from "../../../resources/resourceManager/resourceState/ResourceStateCubeTexture";
import formatBytes from "../../../utils/math/formatBytes";
import {createDebugTitle, updateDebugItemValue} from "../core/debugFunc";
import DebugRender from "../DebugRender";
import ADebugItem from "./core/ADebugItem";
import ADebugStatisticsDomService from "./core/ADebugStatisticsDomService";

class DebugStatisticsDomService extends ADebugStatisticsDomService {
    readonly #debugCubeTextureMode: boolean

    constructor(debugCubeTextureMode: boolean) {
        super()
        this.#debugCubeTextureMode = debugCubeTextureMode
        this.init(`${createDebugTitle(`${debugCubeTextureMode ? 'CubeTexture' : 'BitmapTexture'} Num : <span class="totalCount"></span> (<b class="targetVideoMemorySize"></b>)`)}`)
    }

    update(debugRender: DebugRender, redGPUContext: RedGPUContext) {
        const {resourceManager} = redGPUContext
        const {managedBitmapTextureState, managedCubeTextureState} = resourceManager
        const {
            table,
            videoMemory,
            length
        } = this.#debugCubeTextureMode ? managedCubeTextureState : managedBitmapTextureState
        debugRender.totalUsedVideoMemory += videoMemory
        const tList = Object.values(table)
        updateDebugItemValue(this.dom, 'totalCount', length)
        updateDebugItemValue(this.dom, 'targetVideoMemorySize', formatBytes(videoMemory))
        this.#generateDebugItemsHtml(tList);
    }

    getTargetSrc(tInfo: ResourceStateBitmapTexture | ResourceStateCubeTexture) {
        if (tInfo instanceof ResourceStateBitmapTexture) {
            const {src} = tInfo;
            return src ? src.startsWith('data:') ? 'base64 texture' : src : 'null'
        } else {
            const {srcList} = tInfo;
            return `${srcList[0]}...`
        }
    }

    getUpdatedTdom(tDom, rootDom, domUuid, index, targetSrc, uuid) {
        if (!tDom) {
            tDom = document.createElement('div');
            tDom.className = `debug-group ${domUuid}`
            tDom.innerHTML = `
        <div class='debug-item'>
            <div>
                <div class='debug-item-title'>${index} <span class="targetSrc">${targetSrc}</span></div> 
                <div class='debug-item-cache-key'>cacheKey : <span class="cacheKey">Place holder for cacheKey</span></div>
                <div>mipLevelCount : <span class="mipLevelCount"></span> / useMipmap : <span class="useMipmap"></span></div>
                <div>width : <span class="width"></span> / height : <span class="height"></span></div>
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;gap:4px;width: 50px">
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

    updateDebugItems(tDom, mipLevelCount, useMipmap, width, height, useNum, cacheKey, targetSrc, videoMemorySize) {
        updateDebugItemValue(tDom, 'mipLevelCount', mipLevelCount);
        updateDebugItemValue(tDom, 'useMipmap', useMipmap);
        updateDebugItemValue(tDom, 'width', width);
        updateDebugItemValue(tDom, 'height', height);
        updateDebugItemValue(tDom, 'useNum', useNum, true);
        updateDebugItemValue(tDom, 'cacheKey', cacheKey);
        updateDebugItemValue(tDom, 'targetSrc', targetSrc);
        updateDebugItemValue(tDom, 'videoMemorySize', formatBytes(videoMemorySize));
    }

    #generateDebugItemsHtml(tList: any[]) {
        const rootDom = this.dom.querySelector('.item-container')
        const initialUUIDs: Set<string> = new Set();
        const prefix = this.#debugCubeTextureMode ? 'cube_texture' : 'bitmap_texture'
        rootDom.querySelectorAll('.debug-group').forEach((dom) => {
            const uuid: string = dom.className.split(' ')[1].replace(`${prefix}_`, '');
            initialUUIDs.add(uuid);
        })
        tList.map((tInfo: ResourceStateBitmapTexture | ResourceStateCubeTexture, index: number) => {
            const {useNum, cacheKey, texture} = tInfo;
            let targetSrc = this.getTargetSrc(tInfo);
            const {mipLevelCount, useMipmap, gpuTexture, uuid, videoMemorySize} = texture;
            const {width, height} = gpuTexture || {};
            const domUuid = `${prefix}_${texture.uuid}`;
            let tDom = rootDom.querySelector(`.${domUuid}`);
            tDom = this.getUpdatedTdom(tDom, rootDom, domUuid, index, targetSrc, uuid);
            initialUUIDs.delete(texture.uuid);
            this.updateDebugItems(tDom, mipLevelCount, useMipmap, width, height, useNum, cacheKey, targetSrc, videoMemorySize);
        })
        for (let uuid of initialUUIDs) {
            rootDom.querySelector(`.${prefix}_${uuid}`).remove();
        }
    }
}

class DebugTextureList extends ADebugItem {
    constructor(debugCubeTextureMode: boolean = false) {
        super()
        this.debugStatisticsDomService = new DebugStatisticsDomService(debugCubeTextureMode);
    }
}

export default DebugTextureList
