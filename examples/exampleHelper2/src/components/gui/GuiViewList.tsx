import React, {useEffect} from 'react';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import {parseSize} from "../../utils/guiUtils";
import {addSceneControls} from "./GuiScene";

/**
 * [KO] RedGPUContext의 viewList 설정을 tweakpane에 추가하는 컴포넌트입니다.
 * [EN] A component that adds RedGPUContext's viewList settings to tweakpane.
 */
interface GuiViewListProps {
    gui: any;
    redGPUContext: RedGPUContext;
}

const GuiViewList: React.FC<GuiViewListProps> = ({gui, redGPUContext}) => {
    useEffect(() => {
        const views = redGPUContext.viewList;
        if (views.length === 0) return;

        const title = views.length === 1
            ? (views[0].name?.replace(/Instance/g, '') || 'View 0')
            : 'ViewList';
        const rootFolder = gui.addFolder({title});

        const addViewControls = (view: any, container: any) => {
            // View Properties
            container.addBinding(view, 'useFrustumCulling');
            container.addBinding(view, 'useDistanceCulling');
            container.addBinding(view, 'distanceCulling', {min: 0, max: 1000, step: 1});

            container.addBlade({view: 'separator'});

            // Grid & Axis
            const debugFolder = container.addFolder({title: 'Debug Helpers'});
            const debugProxy = {
                get grid() {
                    return !!view.grid;
                },
                set grid(v: boolean) {
                    view.grid = v;
                },
                get axis() {
                    return !!view.axis;
                },
                set axis(v: boolean) {
                    view.axis = v;
                }
            };
            debugFolder.addBinding(debugProxy, 'grid', {label: 'Show Grid'});
            debugFolder.addBinding(debugProxy, 'axis', {label: 'Show Axis'});

            container.addBlade({view: 'separator'});

            // Size & Position
            const SIZE_DATA = {
                width: parseSize(view.width).value,
                widthUnit: parseSize(view.width).unit,
                height: parseSize(view.height).value,
                heightUnit: parseSize(view.height).unit,
                x: parseSize(view.x).value,
                xUnit: parseSize(view.x).unit,
                y: parseSize(view.y).value,
                yUnit: parseSize(view.y).unit,
            };

            const sizeFolder = container.addFolder({title: 'Size & Position'});

            const updateDim = (key: 'width' | 'height' | 'x' | 'y') => {
                const unitKey = `${key}Unit` as keyof typeof SIZE_DATA;
                const value = SIZE_DATA[key];
                const unit = SIZE_DATA[unitKey];
                (view as any)[key] = unit === 'number' ? value : `${value}${unit}`;
            };

            (['width', 'height', 'x', 'y'] as const).forEach((key) => {
                const k = key;
                const unitKey = `${k}Unit` as keyof typeof SIZE_DATA;
                sizeFolder.addBinding(SIZE_DATA, k, {
                    min: 0,
                    max: SIZE_DATA[unitKey] === '%' ? 200 : 4096,
                    step: 0.01
                }).on('change', () => updateDim(k));

                sizeFolder.addBinding(SIZE_DATA, unitKey, {
                    label: `${k} Unit`,
                    options: {'%': '%', 'px': 'px', 'number': 'number'}
                }).on('change', () => updateDim(k));
            });

            // [KO] View에 소속된 Scene 설정 추가 (가장 마지막에 위치)
            if (view.scene) {
                container.addBlade({view: 'separator'});
                const sceneFolder = container.addFolder({
                    title: view.scene.name || 'Scene',
                    expanded: true
                });
                addSceneControls(view.scene, sceneFolder);
            }
        };

        if (views.length === 1) {
            addViewControls(views[0], rootFolder);
        } else {
            // Use Tab for multiple views
            const tab = (rootFolder as any).addTab({
                pages: views.map((view: any, index: number) => ({
                    title: view.name?.replace(/Instance/g, '') || `View ${index}`
                }))
            });

            views.forEach((view: any, index: number) => {
                addViewControls(view, tab.pages[index]);
            });
        }

        return () => {
            rootFolder.dispose();
        };
    }, [gui, redGPUContext]);

    return null;
};

export default GuiViewList;
