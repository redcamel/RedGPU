import {hdrImages} from './index.js?t=1770713934910';
import createSkyBoxHelper from './createSkyBoxHelper.js?t=1770713934910';

/**
 * [KO] IBL 및 조명 예제 도우미 패널을 생성합니다.
 * [EN] Creates a helper panel for IBL and Lighting examples.
 */
const createIblHelper = (pane, view, RedGPU, option = {}) => {
    // 1. 초기 경로 계산
    const pathSegments = window.location.pathname.split('/');
    const examplesIndex = pathSegments.indexOf('examples');
    const relativePrefix = '../'.repeat(Math.max(0, pathSegments.length - examplesIndex - 2));

    const settings = {
        texture: hdrImages[0].path,
        useLight: false,
        lux: 100000,
        useIBL: true,
        intensity: 1.0,
        nit: 20000,
        ...option
    };

    const pathInfo = { finalPath: '' };
    let sourceBinding, iblFolder, lightIntensityBinding;

    // 2. IBL 생성 및 업데이트 함수
    const updateIBL = (src) => {
        if (!settings.useIBL) return;

        // 소스 정보 텍스트 업데이트
        pathInfo.finalPath = Array.isArray(src) ? src.join('\n') : src;
        if (sourceBinding) sourceBinding.dispose();
        const rows = Math.max(1, Math.min(pathInfo.finalPath.split('\n').length, 10));
        if (iblFolder) {
            sourceBinding = iblFolder.addBinding(pathInfo, 'finalPath', {
                readonly: true,
                label: 'source',
                multiline: rows > 1,
                rows: rows
            });
        }

        // 실제 리소스 생성
        const resolve = (p) => relativePrefix + p;
        const finalSrc = Array.isArray(src) ? src.map(resolve) : resolve(src);
        
        const ibl = new RedGPU.Resource.IBL(view.redGPUContext, finalSrc);
        ibl.intensity = settings.intensity;
        ibl.nit = settings.nit;
        view.ibl = ibl;
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
    };

    // 4. UI 구성
    const lightingFolder = pane.addFolder({title: 'Lighting', expanded: true});

    // 라이트 토글 및 조도 조절
    lightingFolder.addBinding(settings, 'useLight').on('change', (ev) => syncLight(ev.value));
    lightIntensityBinding = lightingFolder.addBinding(settings, 'lux', { min: 0, max: 100000, step: 1 })
        .on('change', (ev) => {
            const lights = view.scene.lightManager.directionalLights;
            if (lights.length > 0) lights[0].lux = ev.value;
        });

    // IBL 토글
    lightingFolder.addBinding(settings, 'useIBL').on('change', (ev) => {
        if (ev.value) {
            updateIBL(settings.texture);
            iblFolder.disabled = false;
        } else {
            view.ibl = null;
            iblFolder.disabled = true;
        }
    });

    // IBL 상세 설정
    iblFolder = lightingFolder.addFolder({title: 'IBL Settings', expanded: true});
    
    iblFolder.addBinding(settings, 'texture', {
        options: hdrImages.reduce((acc, item) => ({ ...acc, [item.name]: item.path }), {}),
    }).on('change', (ev) => updateIBL(ev.value));

    iblFolder.addBinding(settings, 'intensity', { min: 0, max: 5, step: 0.1 })
        .on('change', (ev) => { if (view.ibl) view.ibl.intensity = ev.value; });

    iblFolder.addBinding(settings, 'nit', { min: 0, max: 100000, step: 10 })
        .on('change', (ev) => { if (view.ibl) view.ibl.nit = ev.value; });

    iblFolder.addBinding({
        get inherentLum() { return view.ibl ? view.ibl.inherentLuminance : 0; }
    }, 'inherentLum', { readonly: true, interval: 500 });

    // 5. 초기화 실행
    syncLight(settings.useLight);
    if (settings.useIBL) updateIBL(settings.texture);
    else iblFolder.disabled = true;

    createSkyBoxHelper(pane, view, RedGPU);
};

export default createIblHelper;