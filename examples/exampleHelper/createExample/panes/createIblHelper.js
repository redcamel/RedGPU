import {hdrImages} from './index.js?t=1770713934910';
import createSkyBoxHelper from './createSkyBoxHelper.js?t=1770713934910';
import {resolveExamplePath} from './pathUtils.js?t=1770713934910';

/**
 * [KO] IBL 및 조명 예제 도우미 패널을 생성합니다.
 * [EN] Creates a helper panel for IBL and Lighting examples.
 */
const createIblHelper = (pane, view, RedGPU, option = {}) => {
    const lightingFolder = pane.addFolder({title: 'Lighting', expanded: true});

    const settings = {
        texture: hdrImages[0].name, // 이름 기반 저장
        useLight: false,
        lux: 100000,
        useIBL: true,
        intensityMultiplier: 1.0,
        ...option
    };

    const pathInfo = { finalPath: '' };
    let sourceBinding, iblFolder, lightIntensityBinding;

    // 1. 경로 정보 및 UI 텍스트 업데이트
    const updatePathInfo = (src) => {
        pathInfo.finalPath = Array.isArray(src) ? src.join('\n') : src;

        if (sourceBinding) sourceBinding.dispose();
        if (iblFolder) {
            const lineCount = pathInfo.finalPath.split('\n').length;
            const rows = Math.max(1, Math.min(lineCount, 10));
            sourceBinding = iblFolder.addBinding(pathInfo, 'finalPath', {
                readonly: true,
                label: 'source',
                multiline: lineCount > 1,
                rows: rows
            });
        }
    };

    // 2. IBL 생성 및 업데이트 함수
    const createIBL = (view, name) => {
        if (!settings.useIBL) return;

        const imageInfo = hdrImages.find(item => item.name === name);
        if (!imageInfo) return;
        const src = imageInfo.path;

        updatePathInfo(src);

        const relativePath = resolveExamplePath(src);
        const luminance = imageInfo.nit || 20000;

        const ibl = new RedGPU.Resource.IBL(view.redGPUContext, relativePath, luminance);
        ibl.intensityMultiplier = settings.intensityMultiplier;
        view.ibl = ibl;

        // 스카이박스 동기화 처리
        if (settings.syncSkyBox) {
            if (view.skybox) {
                view.skybox.texture = ibl.environmentTexture;
                view.skybox.luminance = luminance;
            } else {
                view.skybox = new RedGPU.Display.SkyBox(view.redGPUContext, ibl.environmentTexture);
                view.skybox.luminance = luminance;
            }
        }

        pane.refresh();
    };

    // 3. 라이트 핸들러
    const syncLight = (enabled) => {
        if (enabled) {
            const directionalLight = new RedGPU.Light.DirectionalLight();
            directionalLight.lux = settings.lux;
            view.scene.lightManager.addDirectionalLight(directionalLight);
        } else {
            view.scene.lightManager.removeAllLight();
        }
        if (lightIntensityBinding) lightIntensityBinding.disabled = !enabled;
        pane.refresh();
    };

    // 4. UI 구성
    lightingFolder.addBinding(settings, 'useLight').on('change', (ev) => syncLight(ev.value));
    lightIntensityBinding = lightingFolder.addBinding(settings, 'lux', { min: 0, max: 100000, step: 1 })
        .on('change', (ev) => {
            const lights = view.scene.lightManager.directionalLights;
            if (lights.length > 0) lights[0].lux = ev.value;
        });

    lightingFolder.addBinding(settings, 'useIBL').on('change', (ev) => {
        if (ev.value) {
            createIBL(view, settings.texture);
            iblFolder.disabled = false;
        } else {
            view.ibl = null;
            iblFolder.disabled = true;
        }
    });

    iblFolder = lightingFolder.addFolder({title: 'IBL Settings', expanded: true});

    iblFolder.addBinding(settings, 'texture', {
        options: hdrImages.reduce((acc, item) => ({ ...acc, [item.name]: item.name }), {}),
    }).on('change', (ev) => createIBL(view, ev.value));

    iblFolder.addBinding(settings, 'intensityMultiplier', { min: 0, max: 5, step: 0.1 })
        .on('change', (ev) => { if (view.ibl) view.ibl.intensityMultiplier = ev.value; });

    iblFolder.addBinding({
        get luminance() { return view.ibl ? view.ibl.luminance : 20000; },
        set luminance(v) { if (view.ibl) view.ibl.luminance = v; }
    }, 'luminance', { min: 0, max: 100000, step: 10, interval: 500 });

    iblFolder.addBinding({
        get baseLuminance() { return view.ibl ? view.ibl.baseLuminance : 0; }
    }, 'baseLuminance', { readonly: true, interval: 500 });

    // 5. 초기 실행
    syncLight(settings.useLight);
    if(!settings.syncSkyBox) {
        createSkyBoxHelper(pane, view, RedGPU);
    }

    if (settings.useIBL) createIBL(view, settings.texture);
    else iblFolder.disabled = true;
};

export default createIblHelper;
