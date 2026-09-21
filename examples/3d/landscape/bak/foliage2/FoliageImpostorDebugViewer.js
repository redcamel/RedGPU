/**
 * [KO] FoliageImpostorDebugViewer
 * WebGPU에서 베이킹된 2048x2048 옥타헤드럴 임포스터 아틀라스(BaseColor, Normal, ORM)를
 * 브라우저 화면에서 실시간으로 탭별/채널별로 검사하고 PNG로 다운로드할 수 있는 디버그 뷰어입니다.
 */

class FoliageImpostorDebugViewer {
    static #instance = null;
    #container = null;
    #canvas = null;
    #ctx = null;
    #redGPUContext = null;
    #foliageManager = null;

    #currentFoliageName = 'FrangipaniTree';
    #currentTab = 'baseColor'; // 'baseColor' | 'alpha' | 'normal' | 'orm'
    #showGrid = true;
    #showCheckerboard = true;
    #scale = 0.32;
    #panX = 0;
    #panY = 0;
    #isDragging = false;
    #dragStartX = 0;
    #dragStartY = 0;
    #pollTimer = null;

    #cachedCanvases = new Map();
    #activeSourceCanvas = null;

    constructor(redGPUContext, foliageManager) {
        if (FoliageImpostorDebugViewer.#instance) {
            return FoliageImpostorDebugViewer.#instance;
        }
        this.#redGPUContext = redGPUContext;
        this.#foliageManager = foliageManager;
        this.#createUI();
        FoliageImpostorDebugViewer.#instance = this;
    }

    static open(redGPUContext, foliageManager, foliageName = 'FrangipaniTree') {
        let viewer = FoliageImpostorDebugViewer.#instance;
        if (!viewer) {
            viewer = new FoliageImpostorDebugViewer(redGPUContext, foliageManager);
        }
        viewer.show(foliageName);
        return viewer;
    }

    show(foliageName) {
        if (foliageName) this.#currentFoliageName = foliageName;
        this.#container.style.display = 'flex';
        this.#updateFoliageSelector();
        this.#loadAndRenderCurrent();

        if (this.#pollTimer) clearInterval(this.#pollTimer);
        this.#pollTimer = setInterval(() => {
            this.#updateFoliageSelector();
            if (!this.#activeSourceCanvas) {
                this.#loadAndRenderCurrent();
            }
        }, 1000);
    }

    hide() {
        this.#container.style.display = 'none';
        if (this.#pollTimer) {
            clearInterval(this.#pollTimer);
            this.#pollTimer = null;
        }
    }

    toggle(foliageName) {
        if (this.#container.style.display === 'none' || !this.#container.style.display) {
            this.show(foliageName);
        } else {
            this.hide();
        }
    }

    #createUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 340px;
            width: 780px;
            height: 820px;
            background: rgba(18, 22, 28, 0.96);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.7);
            z-index: 999999;
            display: none;

            flex-direction: column;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #eee;
            user-select: none;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 16px;
            background: rgba(255, 255, 255, 0.08);
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
            cursor: move;
        `;
        header.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; font-weight:600; font-size:14px;">
                <span>🌲 Foliage Impostor Atlas Inspector (2048 x 2048)</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
                <button id="btn-refresh" style="background:#4a5568; border:none; color:#fff; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;">🔄 Refresh</button>
                <button id="btn-dl-png" style="background:#2b6cb0; border:none; color:#fff; padding:4px 10px; border-radius:4px; font-size:12px; cursor:pointer;">💾 Download PNG</button>
                <button id="btn-close-viewer" style="background:transparent; border:none; color:#aaa; font-size:18px; cursor:pointer; padding:0 6px;">✕</button>
            </div>
        `;

        const toolbar = document.createElement('div');
        toolbar.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 16px;
            background: rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 13px;
        `;

        toolbar.innerHTML = `
            <div style="display:flex; align-items:center; gap:12px;">
                <label style="display:flex; align-items:center; gap:6px;">
                    <span style="color:#aaa;">Type:</span>
                    <select id="sel-foliage-type" style="background:#2d3748; color:#fff; border:1px solid #4a5568; border-radius:4px; padding:3px 8px; font-size:12px; outline:none;"></select>
                </label>
                <div style="display:flex; background:#2d3748; border-radius:4px; overflow:hidden; border:1px solid #4a5568;">
                    <button class="tab-btn" data-tab="baseColor" style="padding:4px 10px; background:#3182ce; color:#fff; border:none; cursor:pointer; font-size:12px;">BaseColor</button>
                    <button class="tab-btn" data-tab="alpha" style="padding:4px 10px; background:transparent; color:#ccc; border:none; cursor:pointer; font-size:12px;">Alpha Mask</button>
                    <button class="tab-btn" data-tab="normal" style="padding:4px 10px; background:transparent; color:#ccc; border:none; cursor:pointer; font-size:12px;">Normal+Depth</button>
                    <button class="tab-btn" data-tab="orm" style="padding:4px 10px; background:transparent; color:#ccc; border:none; cursor:pointer; font-size:12px;">ORM</button>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
                <label style="display:flex; align-items:center; gap:4px; font-size:12px; cursor:pointer;">
                    <input type="checkbox" id="chk-grid" checked style="cursor:pointer;"> 8x8 Grid
                </label>
                <label style="display:flex; align-items:center; gap:4px; font-size:12px; cursor:pointer;">
                    <input type="checkbox" id="chk-checker" checked style="cursor:pointer;"> Checkerboard
                </label>
                <button id="btn-reset-zoom" style="background:#4a5568; border:none; color:#eee; padding:3px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Reset View</button>
            </div>
        `;

        const viewport = document.createElement('div');
        viewport.style.cssText = `
            flex: 1;
            position: relative;
            overflow: hidden;
            background: #14161a;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: grab;
        `;

        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 2048;
        canvas.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -1024px;
            margin-top: -1024px;
            width: 2048px;
            height: 2048px;
            transform-origin: 1024px 1024px;
            box-shadow: 0 0 30px rgba(0,0,0,0.9);
            image-rendering: pixelated;
        `;
        viewport.appendChild(canvas);

        const footer = document.createElement('div');
        footer.style.cssText = `
            padding: 6px 16px;
            font-size: 11px;
            color: #aaa;
            background: rgba(0, 0, 0, 0.5);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            justify-content: space-between;
        `;
        footer.innerHTML = `
            <span id="txt-status">Ready</span>
            <span>Wheel: Zoom | Drag: Pan | Grid: 64 Tiles (256x256 each)</span>
        `;

        container.appendChild(header);
        container.appendChild(toolbar);
        container.appendChild(viewport);
        container.appendChild(footer);
        document.body.appendChild(container);

        this.#container = container;
        this.#canvas = canvas;
        this.#ctx = canvas.getContext('2d');

        this.#initEvents(header, toolbar, viewport, footer);
    }

    #initEvents(header, toolbar, viewport, footer) {
        let isMovingWin = false;
        let winOffsetX = 0;
        let winOffsetY = 0;
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isMovingWin = true;
            winOffsetX = e.clientX - this.#container.offsetLeft;
            winOffsetY = e.clientY - this.#container.offsetTop;
        });
        window.addEventListener('mousemove', (e) => {
            if (isMovingWin) {
                this.#container.style.left = `${Math.max(10, e.clientX - winOffsetX)}px`;
                this.#container.style.top = `${Math.max(10, e.clientY - winOffsetY)}px`;
                this.#container.style.right = 'auto';
            }
            if (this.#isDragging) {
                this.#panX += e.clientX - this.#dragStartX;
                this.#panY += e.clientY - this.#dragStartY;
                this.#dragStartX = e.clientX;
                this.#dragStartY = e.clientY;
                this.#updateCanvasTransform();
            }
        });
        window.addEventListener('mouseup', () => {
            isMovingWin = false;
            if (this.#isDragging) {
                this.#isDragging = false;
                viewport.style.cursor = 'grab';
            }
        });

        viewport.addEventListener('mousedown', (e) => {
            this.#isDragging = true;
            this.#dragStartX = e.clientX;
            this.#dragStartY = e.clientY;
            viewport.style.cursor = 'grabbing';
        });

        viewport.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY < 0 ? 1.15 : 0.85;
            this.#scale = Math.min(Math.max(0.1, this.#scale * zoomDelta), 3.0);
            this.#updateCanvasTransform();
        }, {passive: false});

        header.querySelector('#btn-close-viewer').addEventListener('click', () => this.hide());
        header.querySelector('#btn-refresh').addEventListener('click', () => {
            this.#cachedCanvases.clear();
            this.#loadAndRenderCurrent();
        });

        header.querySelector('#btn-dl-png').addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = `Impostor_${this.#currentFoliageName}_${this.#currentTab}_2048.png`;
            link.href = this.#canvas.toDataURL('image/png');
            link.click();
        });

        const tabBtns = toolbar.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => {
                    b.style.background = 'transparent';
                    b.style.color = '#ccc';
                });
                btn.style.background = '#3182ce';
                btn.style.color = '#fff';
                this.#currentTab = btn.dataset.tab;
                this.#loadAndRenderCurrent();
            });
        });

        const chkGrid = toolbar.querySelector('#chk-grid');
        chkGrid.addEventListener('change', () => {
            this.#showGrid = chkGrid.checked;
            this.#renderCanvas();
        });

        const chkChecker = toolbar.querySelector('#chk-checker');
        chkChecker.addEventListener('change', () => {
            this.#showCheckerboard = chkChecker.checked;
            this.#renderCanvas();
        });

        toolbar.querySelector('#btn-reset-zoom').addEventListener('click', () => {
            this.#scale = 0.32;
            this.#panX = 0;
            this.#panY = 0;
            this.#updateCanvasTransform();
        });

        const selFoliage = toolbar.querySelector('#sel-foliage-type');
        selFoliage.addEventListener('change', () => {
            this.#currentFoliageName = selFoliage.value;
            this.#loadAndRenderCurrent();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'i' || e.key === 'I') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    this.toggle();
                }
            }
        });
    }

    #updateFoliageSelector() {
        const sel = this.#container.querySelector('#sel-foliage-type');
        if (!sel || !this.#foliageManager) return;
        const currentVal = this.#currentFoliageName;

        const typeList = this.#foliageManager.typeList || (this.#foliageManager.foliageTypes ? Array.from(this.#foliageManager.foliageTypes.values()) : []);
        if (typeList && typeList.length > 0) {
            const availableNames = typeList.map(ft => ft.name || ft.options?.name).filter(Boolean);
            if (sel.options.length !== availableNames.length || !availableNames.includes(sel.value)) {
                sel.innerHTML = '';
                availableNames.forEach(name => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name;
                    if (name === currentVal) opt.selected = true;
                    sel.appendChild(opt);
                });
                if (!availableNames.includes(this.#currentFoliageName)) {
                    this.#currentFoliageName = availableNames[0];
                    if (sel.options[0]) sel.options[0].selected = true;
                    this.#loadAndRenderCurrent();
                }
            }
        }
    }

    #updateCanvasTransform() {
        this.#canvas.style.transform = `translate(${this.#panX}px, ${this.#panY}px) scale(${this.#scale})`;
    }

    async #loadAndRenderCurrent() {
        const statusTxt = this.#container.querySelector('#txt-status');
        if (statusTxt) statusTxt.textContent = `Reading GPU texture for ${this.#currentFoliageName} (${this.#currentTab})...`;

        const targetFoliage = this.#foliageManager?.getFoliageType(this.#currentFoliageName);
        if (!targetFoliage) {
            if (statusTxt) statusTxt.textContent = `Waiting for '${this.#currentFoliageName}' to finish loading...`;
            return;
        }

        const impostorSubMesh = targetFoliage.subMeshes?.find(s => s.isImpostor);
        const mat = impostorSubMesh?.material;
        if (!mat) {
            if (statusTxt) statusTxt.textContent = `'${this.#currentFoliageName}' has no Impostor (3D LOD only or Impostor disabled).`;
            return;
        }

        let targetGpuTexture = null;
        if (this.#currentTab === 'baseColor' || this.#currentTab === 'alpha') {
            targetGpuTexture = mat.baseColorTexture?.gpuTexture || mat.baseColorTexture;
        } else if (this.#currentTab === 'normal') {
            targetGpuTexture = mat.normalTexture?.gpuTexture || mat.normalTexture;
        } else if (this.#currentTab === 'orm') {
            targetGpuTexture = mat.packedORMTexture?.gpuTexture || mat.packedORMTexture;
        }


        if (!targetGpuTexture) {
            if (statusTxt) statusTxt.textContent = `Texture for '${this.#currentTab}' not available yet.`;
            return;
        }

        const cacheKey = `${this.#currentFoliageName}_${this.#currentTab}_${targetGpuTexture.label || 'tex'}`;
        let readCanvas = this.#cachedCanvases.get(cacheKey);

        if (!readCanvas) {
            readCanvas = await this.#readTextureToCanvas(targetGpuTexture, 2048, 2048);
            this.#cachedCanvases.set(cacheKey, readCanvas);
        }

        this.#activeSourceCanvas = readCanvas;
        this.#renderCanvas();

        if (statusTxt) {
            statusTxt.textContent = `Loaded '${this.#currentFoliageName}' [${this.#currentTab.toUpperCase()}] 2048x2048 Atlas (Press 'I' to toggle)`;
        }
    }

    #renderCanvas() {
        if (!this.#activeSourceCanvas || !this.#ctx) return;

        const ctx = this.#ctx;
        ctx.clearRect(0, 0, 2048, 2048);

        // 1. High-contrast Checkerboard background (for transparency)
        if (this.#showCheckerboard && (this.#currentTab === 'baseColor' || this.#currentTab === 'alpha')) {
            const checkSize = 32;
            for (let y = 0; y < 2048; y += checkSize) {
                for (let x = 0; x < 2048; x += checkSize) {
                    ctx.fillStyle = ((x / checkSize + y / checkSize) % 2 === 0) ? '#484848' : '#2c2c2c';
                    ctx.fillRect(x, y, checkSize, checkSize);
                }
            }
        } else {
            ctx.fillStyle = '#181a1f';
            ctx.fillRect(0, 0, 2048, 2048);
        }

        // 2. Draw Texture
        if (this.#currentTab === 'alpha') {
            const srcCtx = this.#activeSourceCanvas.getContext('2d');
            const imgData = srcCtx.getImageData(0, 0, 2048, 2048);
            const alphaImgData = ctx.createImageData(2048, 2048);
            const src = imgData.data;
            const dst = alphaImgData.data;
            for (let i = 0; i < src.length; i += 4) {
                const a = src[i + 3];
                dst[i] = a;
                dst[i + 1] = a;
                dst[i + 2] = a;
                dst[i + 3] = 255;
            }
            ctx.putImageData(alphaImgData, 0, 0);
        } else {
            ctx.drawImage(this.#activeSourceCanvas, 0, 0);
        }

        // 3. 8x8 Grid Overlay with Tile Numbers
        if (this.#showGrid) {
            const gridSize = 8;
            const tileSize = 256;

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 16px monospace';

            for (let gy = 0; gy < gridSize; gy++) {
                for (let gx = 0; gx < gridSize; gx++) {
                    const x = gx * tileSize;
                    const y = gy * tileSize;
                    const idx = gy * gridSize + gx;

                    ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    ctx.fillRect(x + 4, y + 4, 80, 22);
                    ctx.fillStyle = '#00ffff';
                    ctx.fillText(`[${gx},${gy}] #${idx}`, x + 8, y + 20);
                }
            }
        }

        this.#updateCanvasTransform();
    }

    async #readTextureToCanvas(gpuTexture, width, height) {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const bytesPerRow = Math.ceil((width * 4) / 256) * 256;
        const bufferSize = bytesPerRow * height;

        const readBuffer = gpuDevice.createBuffer({
            label: 'ImpostorDebug_ReadBuffer',
            size: bufferSize,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
        });

        const commandEncoder = gpuDevice.createCommandEncoder();
        commandEncoder.copyTextureToBuffer(
            {texture: gpuTexture, mipLevel: 0},
            {buffer: readBuffer, bytesPerRow: bytesPerRow, rowsPerImage: height},
            {width, height, depthOrArrayLayers: 1}
        );
        gpuDevice.queue.submit([commandEncoder.finish()]);

        await readBuffer.mapAsync(GPUMapMode.READ);
        const mappedArray = new Uint8Array(readBuffer.getMappedRange());

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(width, height);
        const dst = imageData.data;

        for (let y = 0; y < height; y++) {
            const srcRow = y * bytesPerRow;
            const dstRow = y * width * 4;
            for (let x = 0; x < width * 4; x++) {
                dst[dstRow + x] = mappedArray[srcRow + x];
            }
        }

        ctx.putImageData(imageData, 0, 0);

        readBuffer.unmap();
        readBuffer.destroy();

        return canvas;
    }
}

export default FoliageImpostorDebugViewer;
