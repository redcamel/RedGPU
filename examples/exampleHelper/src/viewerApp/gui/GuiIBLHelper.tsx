import React, {useEffect} from 'react';
import {hdrImages} from "../../data/hdrList";
import {resolveExamplePath} from "../../utils/guiUtils";
import {ExampleHelperState, useExampleHelperStore} from '../../store';

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
            elevation: view.scene.lightManager.directionalLights[0]?.elevation ?? 45,
            azimuth: view.scene.lightManager.directionalLights[0]?.azimuth ?? 45,
            color: view.scene.lightManager.directionalLights[0]?.color.hex || '#ffffff',
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
            const luminance = imageInfo.luminance || 20000;

            // [KO] IBL 객체 생성 및 할당
            // [EN] Create and assign IBL object
            if (RedGPU) {
                const ibl = new RedGPU.Resource.IBL(view.redGPUContext, relativePath, luminance);
                ibl.intensityMultiplier = settings.intensityMultiplier;
                view.ibl = ibl;

                // [KO] IBL 루미넌스 및 태양광 비율에 맞춰 직사광의 lux 동기화
                // [EN] Synchronize directional light lux with the IBL luminance and sunLux ratio
                const targetLux = (imageInfo as any).sunLux || (luminance * 4);
                settings.lux = targetLux;
                const lights = view.scene.lightManager.directionalLights;
                if (lights.length > 0) {
                    lights[0].lux = targetLux;
                }
            }

            gui.refresh();
        };

        const lightBindings: any[] = [];

        const syncLight = (enabled: boolean) => {
            if (enabled) {
                // [KO] 현재 선택된 텍스처의 태양 설정값(sunLux) 동기화
                // [EN] Synchronize sun settings (sunLux) of the currently selected texture
                const imageInfo = hdrImages.find(item => item.name === settings.texture);
                const luminance = imageInfo?.luminance || 20000;
                const targetLux = (imageInfo as any)?.sunLux || (luminance * 4);
                settings.lux = targetLux;

                if (view.scene.lightManager.directionalLights.length === 0) {
                    if (RedGPU) {
                        const directionalLight = new RedGPU.Light.DirectionalLight();
                        directionalLight.lux = targetLux;
                        directionalLight.elevation = settings.elevation;
                        directionalLight.azimuth = settings.azimuth;
                        directionalLight.color.setColorByHEX(settings.color);
                        view.scene.lightManager.addDirectionalLight(directionalLight);
                    }
                } else {
                    view.scene.lightManager.directionalLights[0].lux = targetLux;
                }
            } else {
                view.scene.lightManager.removeAllLight();
            }
            lightBindings.forEach(binding => binding.hidden = !enabled);
            gui.refresh();
        };

        // 1. Lighting Controls
        lightingFolder.addBinding(settings, 'useLight').on('change', (ev: any) => syncLight(ev.value));
        lightBindings.push(
            lightingFolder.addBinding(settings, 'lux', {min: 0, max: 150000, step: 100})
                .on('change', (ev: any) => {
                    const lights = view.scene.lightManager.directionalLights;
                    if (lights.length > 0) lights[0].lux = ev.value;
                })
        );
        lightBindings.push(
            lightingFolder.addBinding(settings, 'elevation', {min: -90, max: 90, step: 0.1})
                .on('change', (ev: any) => {
                    const lights = view.scene.lightManager.directionalLights;
                    if (lights.length > 0) lights[0].elevation = ev.value;
                })
        );
        lightBindings.push(
            lightingFolder.addBinding(settings, 'azimuth', {min: -360, max: 360, step: 0.1})
                .on('change', (ev: any) => {
                    const lights = view.scene.lightManager.directionalLights;
                    if (lights.length > 0) lights[0].azimuth = ev.value;
                })
        );
        lightBindings.push(
            lightingFolder.addBinding(settings, 'color')
                .on('change', (ev: any) => {
                    const lights = view.scene.lightManager.directionalLights;
                    if (lights.length > 0) lights[0].color.setColorByHEX(ev.value);
                })
        );

        // 초기 가시성 설정
        lightBindings.forEach(binding => binding.hidden = !settings.useLight);

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
                if (view.ibl) {
                    view.ibl.luminance = v;
                }
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
