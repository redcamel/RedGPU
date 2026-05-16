import React, {useEffect} from 'react';
import {hdrImages} from "../../data/hdrList";
import {resolveExamplePath} from "../../utils/guiUtils";
import {ExampleHelperState, useExampleHelperStore} from "../../store";

/**
 * [KO] IBL 및 조명 설정을 위한 Tweakpane GUI 헬퍼 컴포넌트입니다.
 * [EN] Tweakpane GUI helper component for IBL and Lighting settings.
 */
interface GuiIBLHelperProps {
    gui: any;
    view: any;
}

const GuiIBLHelper: React.FC<GuiIBLHelperProps> = ({gui, view}) => {
    const RedGPU = useExampleHelperStore((state: ExampleHelperState) => state.RedGPU);

    useEffect(() => {
        if (!view) return;

        const lightingFolder = gui.addFolder({title: 'Lighting', expanded: true});

        const settings = {
            texture: hdrImages[0].name,
            useLight: view.scene.lightManager.directionalLights.length > 0,
            lux: view.scene.lightManager.directionalLights[0]?.lux || 100000,
            useIBL: true,
            intensityMultiplier: view.ibl?.intensityMultiplier || 1.0,
        };

        const pathInfo = {finalPath: ''};
        let sourceBinding: any;

        const updatePathInfo = (src: string | string[]) => {
            const getFileName = (path: string) => path.split('/').pop() || path;
            pathInfo.finalPath = Array.isArray(src) ? src.map(getFileName).join('\n') : getFileName(src);
            if (sourceBinding) sourceBinding.refresh();
        };

        const updateIBL = (name: string) => {
            if (!settings.useIBL) return;

            const imageInfo = hdrImages.find(item => item.name === name);
            if (!imageInfo) return;
            const src = imageInfo.path;

            updatePathInfo(src);

            const relativePath = resolveExamplePath(src);
            const luminance = imageInfo.nit || 20000;

            // [KO] IBL 객체 생성 및 할당
            // [EN] Create and assign IBL object
            if (RedGPU) {
                const ibl = new RedGPU.Resource.IBL(view.redGPUContext, relativePath, luminance);
                ibl.intensityMultiplier = settings.intensityMultiplier;
                view.ibl = ibl;
            }

            gui.refresh();
        };

        const syncLight = (enabled: boolean) => {
            if (enabled) {
                if (view.scene.lightManager.directionalLights.length === 0) {
                    if (RedGPU) {
                        const directionalLight = new RedGPU.Light.DirectionalLight();
                        directionalLight.lux = settings.lux;
                        view.scene.lightManager.addDirectionalLight(directionalLight);
                    }
                }
            } else {
                view.scene.lightManager.removeAllLight();
            }
            gui.refresh();
        };

        // 1. Lighting Controls
        lightingFolder.addBinding(settings, 'useLight').on('change', (ev: any) => syncLight(ev.value));
        lightingFolder.addBinding(settings, 'lux', {min: 0, max: 100000, step: 1})
            .on('change', (ev: any) => {
                const lights = view.scene.lightManager.directionalLights;
                if (lights.length > 0) lights[0].lux = ev.value;
            });

        lightingFolder.addBinding(settings, 'useIBL').on('change', (ev: any) => {
            if (ev.value) {
                updateIBL(settings.texture);
                iblFolder.disabled = false;
            } else {
                view.ibl = null;
                iblFolder.disabled = true;
            }
        });

        // 2. IBL Controls
        const iblFolder = lightingFolder.addFolder({title: 'IBL Settings', expanded: true});

        iblFolder.addBinding(settings, 'texture', {
            options: hdrImages.reduce((acc, item) => ({...acc, [item.name]: item.name}), {}),
        }).on('change', (ev: any) => updateIBL(ev.value));

        // [KO] intensityMultiplier 제어 [EN] Control intensityMultiplier
        iblFolder.addBinding(settings, 'intensityMultiplier', {min: 0, max: 5, step: 0.1})
            .on('change', (ev: any) => {
                if (view.ibl) view.ibl.intensityMultiplier = ev.value;
            });

        // [KO] luminance 제어 [EN] Control luminance
        iblFolder.addBinding({
            get luminance() {
                return view.ibl ? view.ibl.luminance : 0;
            },
            set luminance(v) {
                if (view.ibl) view.ibl.luminance = v;
            },
        }, 'luminance', {min: 0, max: 100000, step: 100});

        // Source path display (Readonly)
        sourceBinding = iblFolder.addBinding(pathInfo, 'finalPath', {
            readonly: true,
            label: 'source',
            multiline: true,
            rows: 2
        });

        // Initial setup
        syncLight(settings.useLight);
        if (settings.useIBL) updateIBL(settings.texture);
        else iblFolder.disabled = true;

        return () => {
            lightingFolder.dispose();
        };
    }, [gui, view, RedGPU]);

    return null;
};

export default GuiIBLHelper;
