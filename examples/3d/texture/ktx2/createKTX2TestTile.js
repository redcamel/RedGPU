import * as RedGPU from '../../../../dist/index.js?t=1785971869723';

/**
 * [KO] 현재 GPU 디바이스 지원 압축 포맷 피처 및 트랜스코드 타겟 현황을 exampleHelper 디자인 테마에 완벽히 맞추어 표시합니다.
 */
export function createKTX2DeviceInfoHUD(redGPUContext) {
    if (document.getElementById('ktx2-device-info-hud')) return;

    const device = redGPUContext.gpuDevice;
    const hasBC = device.features.has('texture-compression-bc');
    const hasASTC = device.features.has('texture-compression-astc');
    const hasETC2 = device.features.has('texture-compression-etc2');

    let activeTranscodeTarget = 'RGBA8 Uncompressed';
    if (hasASTC) activeTranscodeTarget = 'ASTC (4x4 LDR / HDR)';
    else if (hasBC) activeTranscodeTarget = 'BC1 / BC3 / BC7 / BC6H';
    else if (hasETC2) activeTranscodeTarget = 'ETC2 / EAC';

    // exampleHelper 모바일/isNarrow 반응형 미디어 쿼리 스타일 주입
    if (!document.getElementById('ktx2-hud-responsive-style')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'ktx2-hud-responsive-style';
        styleEl.textContent = `
            @media (max-width: 768px) {
                #ktx2-device-info-hud {
                    top: auto !important;
                    bottom: 160px !important;
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: fit-content !important;
                    max-width: calc(100vw - 20px) !important;
                    padding: 5px 9px !important;
                    font-size: 10px !important;
                }
                #ktx2-device-info-hud .badge-item {
                    font-size: 9px !important;
                    padding: 1px 5px !important;
                }
            }
        `;
        document.head.appendChild(styleEl);
    }

    const container = document.createElement('div');
    container.id = 'ktx2-device-info-hud';
    container.style.cssText = `
        position: fixed;
        bottom: 58px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 20000;
        background-color: rgba(248, 250, 252, 0.96);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(0, 0, 0, 0.16);
        border-radius: 5px;
        padding: 5px 12px;
        color: #0f172a;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 10.5px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22);
        width: fit-content;
        max-width: calc(100vw - 20px);
        box-sizing: border-box;
        pointer-events: auto;
        user-select: none;
        white-space: nowrap;
    `;

    const badge = (label, active, color, bgColor) => `
        <span class="badge-item" style="
            display: inline-flex;
            align-items: center;
            gap: 2px;
            padding: 1.5px 6px;
            border-radius: 3px;
            font-size: 9.5px;
            font-weight: 700;
            background: ${active ? bgColor : 'rgba(0,0,0,0.04)'};
            color: ${active ? color : '#94a3b8'};
            border: 1px solid ${active ? color + '66' : 'rgba(0,0,0,0.08)'};
            white-space: nowrap;
        ">
            ${active ? '✓' : '✗'} ${label}
        </span>
    `;

    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: nowrap; white-space: nowrap; width: 100%;">
            <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                ${badge('BC', hasBC, '#15803d', 'rgba(22, 163, 74, 0.12)')}
                ${badge('ASTC', hasASTC, '#7e22ce', 'rgba(168, 85, 247, 0.12)')}
                ${badge('ETC2', hasETC2, '#c2410c', 'rgba(234, 88, 12, 0.12)')}
            </div>
            <div style="width: 1px; height: 13px; background: rgba(0,0,0,0.15); flex-shrink: 0;"></div>
            <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                <span style="font-size: 9.5px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;">Target:</span>
                <span style="font-size: 10.5px; font-weight: 800; color: #0369a1; white-space: nowrap;">${activeTranscodeTarget}</span>
            </div>
        </div>
    `;

    document.body.appendChild(container);
}


/**
 * [KO] KTX2 테스트 텍스처 타일 및 라벨 생성 공용 헬퍼 함수
 */
export function createKTX2TestTile(redGPUContext, scene, geometry, linearSampler, item, posX, posY) {
    createKTX2DeviceInfoHUD(redGPUContext);

    const fileName = item.path.split('/').pop();

    const labelField = new RedGPU.Display.TextField3D(redGPUContext);
    labelField.useBillboard = true;
    labelField.worldSize = 2.2;
    labelField.fontSize = 64;
    labelField.color = '#ffffff';
    labelField.padding = 28;
    labelField.background = 'rgba(0,0,0,0.88)';
    labelField.border = '3px solid rgba(255,255,255,0.3)';
    labelField.borderRadius = 16;
    labelField.setPosition(posX, posY - 3.1, 0.1);
    labelField.text = `<div style="text-align:center; padding: 6px 12px; line-height: 1.35;"><b style="font-size:46px; color:#ffffff;">${fileName}</b><br/><span style="color:#ffc107; font-size:38px; display:inline-block; margin-top:8px;">⏳ Loading...</span></div>`;
    scene.addChild(labelField);

    let mesh;

    const handleSuccess = (tex) => {
        const gpuTex = tex ? tex.gpuTexture : null;
        const fmt = gpuTex ? gpuTex.format : 'unknown';
        const w = gpuTex ? gpuTex.width : 0;
        const h = gpuTex ? gpuTex.height : 0;
        const isFallback = gpuTex && gpuTex.label && gpuTex.label.includes('fallback');
        const vkFormat = gpuTex && gpuTex.ktxInfo ? gpuTex.ktxInfo.vkFormat : 'N/A';

        const isLegacy1stGen = !!(gpuTex && gpuTex.ktxInfo && gpuTex.ktxInfo.isLegacy);
        const legacyReason = (gpuTex && gpuTex.ktxInfo && gpuTex.ktxInfo.legacyReason) ? gpuTex.ktxInfo.legacyReason : '';

        if (w > 0 && h > 0 && mesh) {
            mesh.scaleX = w / h;
            mesh.scaleY = 1.0;
        }

        if (isFallback) {
            labelField.background = 'rgba(24,12,0,0.94)';
            labelField.border = '3px solid rgba(255,152,0,0.85)';
            labelField.text = `<div style="text-align:center; padding: 6px 10px; line-height: 1.35;">
                <b style="font-size:44px; color:#ffffff; display:block; margin-bottom:8px;">${fileName}</b>
                <div style="margin-top:6px; margin-bottom:4px;">
                    <span style="color:#ffeb3b; font-size:40px; font-weight:900; background:rgba(255,152,0,0.3); padding:4px 12px; border-radius:8px; border:1px solid rgba(255,235,59,0.4);">vkFormat: ${vkFormat}</span>
                    <span style="color:#ff9800; font-size:40px; font-weight:bold; margin-left:6px;">⚠️ ${fmt} (Fallback)</span>
                </div>
            </div>`;
        } else {
            labelField.background = 'rgba(0,24,10,0.94)';
            labelField.border = '3px solid rgba(76,175,80,0.85)';
            labelField.text = `<div style="text-align:center; padding: 6px 10px; line-height: 1.35;">
                <b style="font-size:44px; color:#ffffff; display:block; margin-bottom:8px;">${fileName}</b>
                <div style="margin-top:6px; margin-bottom:4px;">
                    <span style="color:#ffeb3b; font-size:40px; font-weight:900; background:rgba(76,175,80,0.3); padding:4px 12px; border-radius:8px; border:1px solid rgba(255,235,59,0.4);">vkFormat: ${vkFormat}</span>
                    <span style="color:#69f0ae; font-size:40px; font-weight:bold; margin-left:6px;"> ${fmt}</span>
                </div>
            </div>`;
        }

        if (isLegacy1stGen && legacyReason) {
            const legacyReasonField = new RedGPU.Display.TextField3D(redGPUContext);
            legacyReasonField.useBillboard = true;
            legacyReasonField.worldSize = 1.2;
            legacyReasonField.fontSize = 48;
            legacyReasonField.color = '#ffab91';
            legacyReasonField.padding = 16;
            legacyReasonField.background = 'rgba(40, 10, 5, 0.92)';
            legacyReasonField.border = '2px solid rgba(255,87,34,0.7)';
            legacyReasonField.borderRadius = 12;
            legacyReasonField.setPosition(posX, posY - 5.3, 0.15);
            legacyReasonField.text = `<div style="text-align:center; padding: 4px 8px; line-height: 1.4;">
                <span style="color:#ffd54f; font-size:34px; line-height: 1.5;">${legacyReason}</span>
            </div>`;
            scene.addChild(legacyReasonField);
        }
    };

    const handleError = (err) => {
        console.error(`[KTX2 Test] Load failed for ${fileName}:`, err);
        labelField.background = 'rgba(35,0,0,0.94)';
        labelField.border = '3px solid rgba(244,67,54,0.85)';
        labelField.text = `<div style="text-align:center; padding: 6px 10px; line-height: 1.35;">
            <b style="font-size:46px; color:#ffffff; display:block; margin-bottom:6px;">${fileName}</b>
            <div style="color:#ff5252; font-size:40px; font-weight:bold; margin-top:8px;">❌ LOAD FAILED</div>
            <div style="color:#ff8a80; font-size:28px; margin-top:4px;">${err?.message || 'Error'}</div>
        </div>`;
    };

    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, item.path, true, handleSuccess, handleError);
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture, linearSampler);

    mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    mesh.setPosition(posX, posY, 0);
    mesh.primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE;
    scene.addChild(mesh);
}
