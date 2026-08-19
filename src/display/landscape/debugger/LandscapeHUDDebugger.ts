import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "./ALandscapeDebugger";
import Landscape from "../core/Landscape";
import RenderViewStateData from "../../view/core/RenderViewStateData";

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
            this.#containerEl.style.display = val ? 'block' : 'none';
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
        this.#containerEl.style.left = `${this.left}px`;
        this.#containerEl.style.bottom = `${this.bottom}px`;
        this.#containerEl.style.width = `${this.width}px`;
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
        const visCompCount = landscape.visibleComponentCount ?? totalCompCount;
        const culledCompCount = landscape.culledComponentCount ?? 0;
        const culledPercent = totalCompCount > 0 ? ((culledCompCount / totalCompCount) * 100).toFixed(1) : '0.0';
        const visPercent = totalCompCount > 0 ? ((visCompCount / totalCompCount) * 100).toFixed(1) : '100.0';
        const frustumActive = landscape.frustumCullingActive;

        let lodListHTML = '';
        let activeDrawCalls = 0;
        let activeTotalVerts = 0;
        let activeTotalTris = 0;

        const lodCounts = landscape.lodCountsBuffer ?? [];
        const sharedGeo = landscape.sharedGeometry;
        const maxLODLevel = landscape.maxLODLevel ?? 4;
        const lodColors = landscape.lodColors ?? [];

        for (let i = 0; i <= maxLODLevel; i++) {
            const count = lodCounts[i] ?? 0;
            if (count > 0) activeDrawCalls++;

            const range = sharedGeo?.getLODRange ? sharedGeo.getLODRange(i) : null;
            const indexCount = range?.indexCount ?? 0;
            const trisPerTile = Math.floor(indexCount / 3);
            const vertsPerTile = Math.pow(Math.floor(gs / Math.pow(2, i)) + 1, 2);

            activeTotalTris += count * trisPerTile;
            activeTotalVerts += count * vertsPerTile;

            const colorTuple = lodColors[i] ?? [0.5, 0.5, 0.5, 1];
            const hexColor = `#${Math.floor(colorTuple[0] * 255).toString(16).padStart(2, '0')}${Math.floor(colorTuple[1] * 255).toString(16).padStart(2, '0')}${Math.floor(colorTuple[2] * 255).toString(16).padStart(2, '0')}`;

            const percentOfActive = visCompCount > 0 ? Math.min(100, Math.round((count / visCompCount) * 100)) : 0;

            lodListHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:11px;">
                    <div style="display:flex; align-items:center; gap:6px; min-width:65px;">
                        <span style="display:inline-block; width:8px; height:8px; background:${hexColor}; border-radius:2px;"></span>
                        <span style="color:#94a3b8; font-weight:600;">LOD ${i}</span>
                    </div>
                    <div style="flex:1; margin:0 8px; background:rgba(255,255,255,0.08); height:4px; border-radius:2px; overflow:hidden;">
                        <div style="width:${percentOfActive}%; height:100%; background:${hexColor}; border-radius:2px;"></div>
                    </div>
                    <div style="text-align:right; white-space:nowrap;">
                        <b style="color:#f8fafc;">${count}</b> <span style="color:#64748b; font-size:10px;">Tiles</span>
                        <span style="color:#94a3b8; font-size:10px; margin-left:4px;">(${(count * trisPerTile).toLocaleString()} Tris)</span>
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
                    <b style="color:#f8fafc; font-family:monospace;">[${tcX}, ${tcZ}] <span style="color:#64748b; font-weight:normal;">(${totalCompCount})</span></b>
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
                    <span style="color:#cbd5e1; font-weight:700;">🎯 Spatial Culling</span>
                    <span style="font-size:10px; font-weight:bold; color:${frustumActive ? '#4ade80' : '#f43f5e'}; background:${frustumActive ? 'rgba(74, 222, 128, 0.12)' : 'rgba(244, 63, 94, 0.12)'}; padding:2px 6px; border-radius:4px;">● ${frustumActive ? 'Active' : 'Disabled'}</span>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                    <span style="color:#94a3b8;">👁️ Visible Components</span>
                    <b style="color:#38bdf8; font-family:monospace;">${visCompCount} / ${totalCompCount} <span style="color:#7dd3fc; font-weight:normal;">(${visPercent}%)</span></b>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">🚫 Culled Components</span>
                    <b style="color:#4ade80; font-family:monospace;">${culledCompCount} <span style="color:#86efac; font-weight:normal;">(${culledPercent}% saved)</span></b>
                </div>
            </div>

            <!-- 3. Active LOD Distribution Sub-card -->
            <div style="background:rgba(30, 41, 59, 0.5); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px 10px; margin-bottom:8px;">
                <div style="color:#cbd5e1; font-weight:700; font-size:11px; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:4px;">
                    📊 Active LOD Distribution
                </div>
                ${lodListHTML}
            </div>

            <!-- 4. Landscape Pipeline & Streaming Sub-card -->
            <div style="background:rgba(30, 41, 59, 0.5); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:8px 10px; margin-bottom:8px; font-size:11px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                    <span style="color:#94a3b8;">🚀 Landscape Draw Calls</span>
                    <b style="color:#f43f5e; font-family:monospace;">${activeDrawCalls} Calls <span style="font-size:10px; color:#64748b; font-weight:normal;">(LOD Batch)</span></b>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                    <span style="color:#94a3b8;">📐 Landscape Vertices</span>
                    <b style="color:#facc15; font-family:monospace;">${activeTotalVerts.toLocaleString()}</b>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
                    <span style="color:#94a3b8;">🔺 Landscape Triangles</span>
                    <b style="color:#facc15; font-family:monospace;">${activeTotalTris.toLocaleString()}</b>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#94a3b8;">🛰️ Host Streamed Tiles</span>
                    <b style="color:#38bdf8; font-family:monospace;">${loadedTiles} <span style="color:#64748b; font-weight:normal;">(Queue: ${pendingQueue})</span></b>
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
        container.style.position = 'fixed';
        container.style.zIndex = '999999';
        container.style.padding = '12px 14px';
        container.style.backgroundColor = 'rgba(15, 23, 42, 0.92)';
        container.style.backdropFilter = 'blur(12px)';
        container.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        container.style.borderRadius = '8px';
        container.style.color = '#e2e8f0';
        container.style.fontFamily = 'monospace, sans-serif';
        container.style.fontSize = '12px';
        container.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.5)';

        const title = document.createElement('div');
        title.style.fontWeight = '700';
        title.style.fontSize = '13px';
        title.style.letterSpacing = '0.5px';
        title.style.marginBottom = '8px';
        title.style.color = '#38bdf8';
        title.style.borderBottom = '1px solid rgba(56, 189, 248, 0.25)';
        title.style.paddingBottom = '6px';
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
