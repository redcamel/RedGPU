import * as RedGPU from '../../../../dist/index.js?t=1783327300000';

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
    labelField.padding = 20;
    labelField.background = 'rgba(0,0,0,0.85)';
    labelField.border = '3px solid rgba(255,255,255,0.3)';
    labelField.borderRadius = 12;
    labelField.setPosition(posX, posY - 2.8, 0.1);
    labelField.text = `<div style="text-align:center;"><b style="font-size:48px; color:#ffffff;">${fileName}</b><br/><span style="color:#ffc107; font-size:40px;">⏳ Loading...</span></div>`;
    scene.addChild(labelField);

    let mesh;

    const isLegacy1stGen = !!item.isLegacy;
    const legacyBadge = isLegacy1stGen ? `<br/><span style="color:#ff7043; font-size:32px; font-weight:bold; background:rgba(255,87,34,0.25); padding:2px 8px; border-radius:4px;">[1세대 구형]</span>` : '';

    const handleSuccess = (tex) => {
        const gpuTex = tex ? tex.gpuTexture : null;
        const fmt = gpuTex ? gpuTex.format : 'unknown';
        const w = gpuTex ? gpuTex.width : 0;
        const h = gpuTex ? gpuTex.height : 0;
        const isFallback = gpuTex && gpuTex.label && gpuTex.label.includes('fallback');
        const vkFormat = gpuTex && gpuTex.ktxInfo ? gpuTex.ktxInfo.vkFormat : 'N/A';

        if (w > 0 && h > 0 && mesh) {
            mesh.scaleX = w / h;
            mesh.scaleY = 1.0;
        }

        if (isFallback) {
            labelField.background = 'rgba(20,10,0,0.92)';
            labelField.border = '3px solid rgba(255,152,0,0.8)';
            labelField.text = `<div style="text-align:center;"><b style="font-size:44px; color:#ffffff;">${fileName}</b>${legacyBadge}<br/><span style="color:#ffeb3b; font-size:56px; font-weight:900; background:rgba(255,152,0,0.3); padding:4px 12px; border-radius:6px;">vkFormat: ${vkFormat}</span><br/><span style="color:#ff9800; font-size:38px; font-weight:bold;">⚠️ Fallback</span><br/><span style="color:#b9f6ca; font-size:32px;">${fmt} (${w}x${h})</span></div>`;
        } else {
            labelField.background = 'rgba(0,20,8,0.92)';
            labelField.border = '3px solid rgba(76,175,80,0.8)';
            labelField.text = `<div style="text-align:center;"><b style="font-size:44px; color:#ffffff;">${fileName}</b>${legacyBadge}<br/><span style="color:#ffeb3b; font-size:56px; font-weight:900; background:rgba(76,175,80,0.25); padding:4px 12px; border-radius:6px;">vkFormat: ${vkFormat}</span><br/><span style="color:#69f0ae; font-size:38px; font-weight:bold;">✅ ${fmt}</span><br/><span style="color:#aaaaaa; font-size:30px;">${w}x${h}</span></div>`;
        }
    };

    const handleError = (err) => {
        console.error(`[KTX2 Test] Load failed for ${fileName}:`, err);
        labelField.background = 'rgba(30,0,0,0.92)';
        labelField.border = '2px solid rgba(244,67,54,0.7)';
        labelField.text = `<div style="text-align:center;"><b style="font-size:48px; color:#ffffff;">${fileName}</b>${legacyBadge}<br/><span style="color:#ff5252; font-size:40px; font-weight:bold;">❌ LOAD FAILED</span><br/><span style="color:#ff8a80; font-size:28px;">${err?.message || 'Error'}</span></div>`;
    };

    const texture = new RedGPU.Resource.BitmapTexture(redGPUContext, item.path, true, handleSuccess, handleError);
    const material = new RedGPU.Material.BitmapMaterial(redGPUContext, texture, linearSampler);

    mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    mesh.setPosition(posX, posY, 0);
    mesh.primitiveState.cullMode = RedGPU.GPU_CULL_MODE.NONE;
    scene.addChild(mesh);
}
