import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import Landscape from "../../core/Landscape";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import {formatLODColorHex, LANDSCAPE_DEFAULT_LOD_HEX_STRINGS} from "../../core/LANDSCAPE_DEFAULT_LOD_COLORS";

export class LandscapeHUDDebugger extends ALandscapeDebugger {
    #containerEl: HTMLDivElement | null = null;
    #titleEl: HTMLDivElement | null = null;
    #statsContentEl: HTMLDivElement | null = null;
    #titleText: string;

    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        let finalOptions: ALandscapeDebuggerOptions = {};
        if (cameraOrOptions && typeof cameraOrOptions === 'object' && !('camera' in cameraOrOptions) && !('matrix' in cameraOrOptions)) {
            finalOptions = cameraOrOptions;
        } else if (options) {
            finalOptions = options;
        }

        super(landscape, cameraOrOptions, finalOptions);

        this.#titleText = '⛰️ Landscape Engine Monitor';
        this.#initHUDContainer();
        this.updatePositionAndSize();
    }

    override get visible(): boolean {
        return super.visible;
    }

    override set visible(val: boolean) {
        super.visible = val;
        if (this.#containerEl) {
            this.#containerEl.style.setProperty('display', val ? 'block' : 'none', 'important');
        }
    }

    override setPosition(left: number, bottom: number): void {
        super.setPosition(left, bottom);
        this.updatePositionAndSize();
    }

    override setSize(width: number, height: number): void {
        super.setSize(width, height);
        this.updatePositionAndSize();
    }

    updatePositionAndSize(): void {
        if (!this.#containerEl) return;
        this.#containerEl.style.setProperty('left', `${this.left}px`, 'important');
        this.#containerEl.style.setProperty('bottom', `${this.bottom}px`, 'important');
        this.#containerEl.style.setProperty('width', `${this.width}px`, 'important');
    }

    update(renderViewStateData?: RenderViewStateData): void {
        if (!this.#statsContentEl || !this.landscape) return;

        const landscape = this.landscape;
        const camera = this.camera;

        const wsX = landscape.worldSize[0];
        const wsZ = landscape.worldSize[1];
        const tcX = landscape.componentCount[0];
        const tcZ = landscape.componentCount[1];
        const tsX = landscape.tileSize[0];
        const tsZ = landscape.tileSize[1];
        const gs = landscape.componentSizeQuads;

        const totalCompCount = tcX * tcZ;
        const frustumActive = landscape.frustumCullingActive;

        let lodListHTML = '';
        const maxLODLevel = landscape.maxLODLevel ?? 4;
        const lodColors = landscape.lodColors ?? [];

        for (let i = 0; i < maxLODLevel; i++) {
            const step = Math.pow(2, i);
            const segX = Math.max(1, Math.floor(gs / step));
            const trisPerTile = segX * segX * 2;
            const vertsPerTile = Math.pow(segX + 1, 2);

            const hexColor = (lodColors[i]) ? formatLODColorHex(lodColors[i]) : (LANDSCAPE_DEFAULT_LOD_HEX_STRINGS[i % LANDSCAPE_DEFAULT_LOD_HEX_STRINGS.length] ?? '#3b82f6');

            lodListHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:11px;">
                    <div style="display:flex; align-items:center; gap:6px; min-width:65px;">
                        <span style="display:inline-block; width:8px; height:8px; background:${hexColor}; border-radius:2px;"></span>
                        <span style="color:#94a3b8; font-weight:600;">LOD ${i}</span>
                    </div>
                    <div style="text-align:right; white-space:nowrap;">
                        <span style="color:#f8fafc; font-family:monospace;">${segX}x${segX} Grid</span>
                        <span style="color:#94a3b8; font-size:10px; margin-left:4px;">(${trisPerTile.toLocaleString()} Tris / ${vertsPerTile.toLocaleString()} Verts)</span>
                    </div>
                </div>
            `;
        }

        const loadedTiles = landscape.tileStreamer ? landscape.tileStreamer.loadedTileCount : 0;
        const pendingQueue = landscape.tileStreamer ? landscape.tileStreamer.pendingQueueSize : 0;

        const camX = Math.round(camera?.x ?? 0);
        const camY = Math.round(camera?.y ?? 0);
        const camZ = Math.round(camera?.z ?? 0);

        this.#statsContentEl.innerHTML = `
            <!-- 1. Terrain Specs Sub-card -->
            <div style="background:rgba(30, 41, 59, 0.5); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px 10px; margin-bottom:8px; font-size:11px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                    <span style="color:#94a3b8;">worldSize</span>
                    <b style="color:#f8fafc; font-family:monospace;">[${wsX}, ${wsZ}]m</b>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                    <span style="color:#94a3b8;">componentCount</span>
                    <b style="color:#f8fafc; font-family:monospace;">[${tcX}, ${tcZ}] <span style="color:#64748b; font-weight:normal;">(${totalCompCount} total)</span></b>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                    <span style="color:#94a3b8;">tileSize</span>
                    <b style="color:#f8fafc; font-family:monospace;">[${Math.round(tsX)}, ${Math.round(tsZ)}]m</b>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">componentQuads</span>
                    <b style="color:#f8fafc; font-family:monospace;">${gs} Quads</b>
                </div>
            </div>

            <!-- 2. Frustum Culling Sub-card -->
            <div style="background:rgba(30, 41, 59, 0.5); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px 10px; margin-bottom:8px; font-size:11px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:4px;">
                    <span style="color:#cbd5e1; font-weight:700;">🎯 GPU Spatial Culling</span>
                    <span style="font-size:10px; font-weight:bold; color:${frustumActive ? '#4ade80' : '#f43f5e'}; background:${frustumActive ? 'rgba(74, 222, 128, 0.12)' : 'rgba(244, 63, 94, 0.12)'}; padding:2px 6px; border-radius:4px;">● ${frustumActive ? 'Active (GPU-Driven)' : 'Disabled'}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                    <span style="color:#94a3b8;">Execution Pipeline</span>
                    <b style="color:#38bdf8; font-family:monospace;">Compute Indirect Draw</b>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">Total Components</span>
                    <b style="color:#4ade80; font-family:monospace;">${totalCompCount} Tiles</b>
                </div>
            </div>

            <!-- 3. LOD Level Specs Sub-card -->
            <div style="background:rgba(30, 41, 59, 0.5); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px 10px; margin-bottom:8px;">
                <div style="color:#cbd5e1; font-weight:700; font-size:11px; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:4px;">
                    📊 LOD Geometry Specs
                </div>
                ${lodListHTML}
            </div>

            <!-- 4. Landscape Pipeline & Streaming Sub-card -->
            <div style="background:rgba(30, 41, 59, 0.5); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px 10px; margin-bottom:8px; font-size:11px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                    <span style="color:#94a3b8;">🚀 Render Pipeline</span>
                    <b style="color:#38bdf8; font-family:monospace;">GPU Multi-Draw Indirect</b>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                    <span style="color:#94a3b8;">🔢 Max LOD Levels</span>
                    <b style="color:#facc15; font-family:monospace;">${maxLODLevel} Levels</b>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">🛰️ Host Streamed Tiles</span>
                    <b style="color:#4ade80; font-family:monospace;">${loadedTiles} <span style="color:#64748b; font-weight:normal;">(Queue: ${pendingQueue})</span></b>
                </div>
            </div>

            <!-- 5. Camera Info -->
            <div style="display:flex; justify-content:space-between; font-size:10px; color:#64748b; padding:2px 4px;">
                <span>Cam Position:</span>
                <b style="color:#94a3b8; font-family:monospace;">[X: ${camX}, Y: ${camY}, Z: ${camZ}]</b>
            </div>
        `;
    }

    destroy(): void {
        if (this.#containerEl && this.#containerEl.parentNode) {
            this.#containerEl.parentNode.removeChild(this.#containerEl);
        }
        this.#containerEl = null;
        this.#titleEl = null;
        this.#statsContentEl = null;
    }

    #initHUDContainer(): void {
        const container = document.createElement('div');
        container.className = 'redgpu-landscape-hud';

        const title = document.createElement('div');
        title.className = 'redgpu-landscape-hud-title';
        title.innerText = this.#titleText;

        const statsContent = document.createElement('div');

        container.appendChild(title);
        container.appendChild(statsContent);
        document.body.appendChild(container);

        this.#containerEl = container;
        this.#titleEl = title;
        this.#statsContentEl = statsContent;
    }
}

export default LandscapeHUDDebugger;
