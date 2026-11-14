import React, {useEffect} from 'react';
import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import {bindSizeDimensions} from "../../utils/guiUtils";
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
            const isView3D = view.constructor.name === 'View3D';
            if (isView3D) {
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
            }
            // Size & Position
            const sizeFolder = container.addFolder({title: 'Size & Position'});
            bindSizeDimensions(sizeFolder, view, ['width', 'height', 'x', 'y'], true);

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
