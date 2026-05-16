import RedGPUContext from "@redgpu/src/context/RedGPUContext";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {GuiConfig, useExampleHelperStore} from './store';
import {findCurrentExample} from './utils/exampleFinder';
import View3D from "../../../src/display/view/View3D.ts";
import updateObject3DMatrix from "@redgpu/src/math/updateObject3DMatrix";
import {OrbitController} from "@redgpu/src/camera";

const calcTargetMeshMatrix = (mesh: any, view: View3D) => {

    updateObject3DMatrix(mesh, view);
    let len = mesh.children.length;
    for (let i = 0; i < len; i++) {
        const child = mesh.children[i];
        if (child.constructor.name === 'Mesh' ) {
            calcTargetMeshMatrix(child, view);
        }

    }
}
/**
 * RedGPUExampleHelper
 */
class RedGPUExampleHelper {
    static loadingProgressInfoHandler = (info: any) => {
        useExampleHelperStore.getState().updateLoadingState(info);
    };

    /**
     * [KO] 메쉬가 화면 중앙에 꽉 차도록 카메라 거리를 자동으로 조절합니다.
     * [EN] Automatically adjusts the camera distance so that the mesh fills the screen center.
     *
     * ### Example
     * ```typescript
     * controller.fitMeshToScreenCenter(mesh, view);
     * ```
     *
     * @param mesh -
     * [KO] 화면에 맞출 대상 메쉬
     * [EN] Target mesh to fit to the screen
     * @param view -
     * [KO] 현재 뷰 인스턴스
     * [EN] Current view instance
     */
    static fitMeshToScreenCenter(mesh: any, view: View3D): void {
        const orbitController = view.camera as OrbitController;
        calcTargetMeshMatrix(mesh, view)
        const bounds = mesh.combinedBoundingAABB;

        // 데이터 유효성 검사 (0,0,0 반환 방지)
        if (!bounds || bounds.minX === Infinity || isNaN(bounds.centerX)) return;

        // 1. 화각 정보 추출
        //@ts-ignore
        const fovY = view.rawCamera.fieldOfView * Math.PI / 180; // Radian 변환
        const tanHalfFovY = Math.tan(fovY / 2);
        const tanHalfFovX = tanHalfFovY * view.aspect;

        // 2. 모델의 실제 크기 (절대값 보장)
        const xSize = (bounds.xSize);
        const ySize = (bounds.ySize);
        const zSize = (bounds.zSize);

        // 3. 거리 계산 (수학적 정석)
        // 각 축의 절반 크기를 해당 축의 fov 탄젠트로 나누어 거리를 구합니다.
        const distToFitX = (xSize / 2) / tanHalfFovX;
        const distToFitY = (ySize / 2) / tanHalfFovY;

        // 4. 최종 거리 결정
        // - Math.max: 가로/세로 중 더 멀리 떨어져야 하는 축을 선택
        // - padding: 1.15 정도로 설정하여 모델이 테두리에 닿지 않게 여유를 줌
        // - zSize / 2: 카메라가 모델 '중심'이 아닌 '앞면'을 기준으로 거리를 잡도록 보정
        const padding = 1.15;
        // const requiredDistance = (Math.max(distToFitX, distToFitY) * padding) + (zSize / 2);
        const requiredDistance = (Math.max(distToFitX, distToFitY) * padding) + (zSize / 2);

        // 5. 타겟(Center) 설정 - 질문하신 centerY 보정 적용
        orbitController.centerX = bounds.centerX;
        orbitController.centerY = bounds.centerY
        orbitController.centerZ = bounds.centerZ;


        // 6. 결과 적용 및 최소 거리 보호
        //@ts-ignore
        orbitController.distance = Math.max(requiredDistance, view.rawCamera.nearClipping * 2);
        //@ts-ignore
        if (orbitController.distance < 1) {
            const multiple = 1 / orbitController.distance
            mesh.setScale(multiple)
            orbitController.centerX *= multiple;
            orbitController.centerY *= multiple
            orbitController.centerZ *= multiple;
            orbitController.distance = 1;
        }
        orbitController.speedDistance = Math.max(0.1, requiredDistance * 0.1);

        // },1000)

    }

    private root: ReactDOM.Root | null = null;
    private domRoot: HTMLElement | null = null;

    constructor(redGPUContext: RedGPUContext, guiCallback?: GuiConfig | ((gui: any) => void)) {
        useExampleHelperStore.getState().setRedGPUContext(redGPUContext);
        if (guiCallback) {
            if (typeof guiCallback === 'function') {
                useExampleHelperStore.getState().setGuiConfig({
                    guiCallback: guiCallback
                });
            } else {
                if (guiCallback.RedGPU) {
                    useExampleHelperStore.getState().setRedGPU(guiCallback.RedGPU);
                }
                useExampleHelperStore.getState().setGuiConfig(guiCallback);
            }
        }

        this.init();
    }

    public destroy() {
        if (this.root) {
            this.root.unmount();
            this.root = null;
        }
        if (this.domRoot) {
            this.domRoot.remove();
            this.domRoot = null;
        }
    }

    private async init() {
        // 현재 예제 정보 설정
        const currentExample = await findCurrentExample(window.location.pathname);
        useExampleHelperStore.getState().setCurrentExample(currentExample);

        if (!this.domRoot) {
            this.domRoot = document.createElement('div');
            this.domRoot.className = 'RedGPUExampleHelper';
            document.body.appendChild(this.domRoot);

            this.root = ReactDOM.createRoot(this.domRoot);
            this.root.render(
                <React.StrictMode>
                    <App/>
                </React.StrictMode>
            );
        }
    }
}

export default RedGPUExampleHelper;
