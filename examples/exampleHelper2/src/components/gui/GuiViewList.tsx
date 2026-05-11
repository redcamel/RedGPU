import React, {useEffect} from 'react';
import {Pane} from 'tweakpane';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";

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
        const rootFolder = gui.addFolder({title: 'ViewList'});

        if (views.length === 0) return;

        // Use Tab for multiple views
        const tab = (rootFolder as any).addTab({
            pages: views.map((view: any, index: number) => ({
                title: view.name?.replace(/Instance/g, '') || `View ${index}`
            }))
        });

        views.forEach((view: any, index: number) => {
            const page = tab.pages[index];

            // View Properties
            page.addInput(view, 'useFrustumCulling');
            page.addInput(view, 'useDistanceCulling');
            page.addInput(view, 'distanceCulling', {min: 0, max: 1000, step: 1});

            // Grid & Axis
            const debugFolder = page.addFolder({title: 'Debug Helpers'});
            const debugProxy = {
                get grid() { return !!view.grid; },
                set grid(v) { view.grid = v; },
                get axis() { return !!view.axis; },
                set axis(v) { view.axis = v; }
            };
            debugFolder.addInput(debugProxy, 'grid', {label: 'Show Grid'});
            debugFolder.addInput(debugProxy, 'axis', {label: 'Show Axis'});

            // Size & Position
            const parseSize = (value: string | number) => {
                if (typeof value === 'number') return { value, unit: 'number' };
                const strValue = String(value);
                if (strValue.endsWith('%')) return { value: parseFloat(strValue), unit: '%' };
                if (strValue.endsWith('px')) return { value: parseFloat(strValue), unit: 'px' };
                return { value: parseFloat(strValue), unit: 'px' };
            };

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

            const sizeFolder = page.addFolder({title: 'Size & Position'});
            
            const updateDim = (key: 'width' | 'height' | 'x' | 'y') => {
                const unitKey = `${key}Unit` as keyof typeof SIZE_DATA;
                const value = SIZE_DATA[key];
                const unit = SIZE_DATA[unitKey];
                (view as any)[key] = unit === 'number' ? value : `${value}${unit}`;
            };

            ['width', 'height', 'x', 'y'].forEach((key) => {
                const k = key as 'width' | 'height' | 'x' | 'y';
                const unitKey = `${k}Unit` as keyof typeof SIZE_DATA;
                sizeFolder.addInput(SIZE_DATA, k, {
                    min: 0, 
                    max: SIZE_DATA[unitKey] === '%' ? 200 : 4096, 
                    step: 0.01
                }).on('change', () => updateDim(k));

                sizeFolder.addInput(SIZE_DATA, unitKey, {
                    label: `${k} Unit`,
                    options: { '%': '%', 'px': 'px', 'number': 'number' }
                }).on('change', () => updateDim(k));
            });

            // Scene Folder
            if (view.scene) {
                const scene = view.scene;
                const sceneFolder = page.addFolder({title: `Scene: ${scene.name || 'Untitled'}`});
                
                sceneFolder.addInput(scene, 'useBackgroundColor');
                
                if (scene.backgroundColor) {
                    const bg = scene.backgroundColor;
                    const colorProxy = {
                        get backgroundColor() {
                            return bg.hex;
                        },
                        set backgroundColor(v: string) {
                            bg.setColorByHEX(v);
                        }
                    };
                    sceneFolder.addInput(colorProxy, 'backgroundColor', {label: 'BG Color'});
                    sceneFolder.addInput(bg, 'a', {min: 0, max: 1, step: 0.01, label: 'BG Alpha'});
                }
            }
        });

        return () => {
            rootFolder.dispose();
        };
    }, [gui, redGPUContext]);

    return null;
};

export default GuiViewList;
