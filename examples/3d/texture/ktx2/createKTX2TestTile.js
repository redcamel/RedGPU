import * as RedGPU from '../../../../dist/index.js?t=1783327399999';

/**
 * [KO] KTX2 테스트 텍스처 타일 및 라벨 생성 공용 헬퍼 함수
 */
export function createKTX2TestTile(redGPUContext, scene, geometry, linearSampler, item, posX, posY) {
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
        const legacyReasonBox = (isLegacy1stGen && legacyReason)
            ? `<div style="margin-top:18px; margin-bottom:6px;"><span style="color:#ffab91;line-height: 1.6; font-size:62px; font-weight:bold; display:inline-block; background:rgba(255,87,34,0.22); padding:6px 16px; border-radius:8px; border:1px solid rgba(255,87,34,0.5);">💡 ${legacyReason}</span></div>`
            : '';

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
                ${legacyReasonBox}
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
                ${legacyReasonBox}
            </div>`;
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
