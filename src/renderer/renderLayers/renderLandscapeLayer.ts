import View3D from "../../display/view/View3D";

/**
 * [KO] Scene 내의 전체 Landscape 지형 시스템을 매 프레임 자동 갱신 및 렌더 패스에 디스패치합니다 (Zero-GC / 1-Call Instancing).
 * [EN] Automatically updates per frame and dispatches all Landscape terrain systems in the scene to the render pass (Zero-GC / 1-Call Instancing).
 *
 * @param view - [KO] 현재 View3D 객체 [EN] Current View3D object
 * @param passEncoder - [KO] 현재 GPURenderPassEncoder 인스턴스 [EN] Current GPURenderPassEncoder instance
 */
export function renderLandscapeLayer(view: View3D, passEncoder: GPURenderPassEncoder): void {
    const scene = (view as any).rawScene || view.scene;
    if (!scene) return;

    const landscapes = (scene as any).landscapeChildren;
    if (!landscapes || landscapes.length === 0) return;

    const count = landscapes.length;
    for (let i = 0; i < count; i++) {
        const landscape = landscapes[i];
        if (!landscape) continue;

        // 매 프레임 지형 카메라 위치 기반 자동 업데이트 수행 (Zero-GC / Auto Update)
        if (view.camera) {
            landscape.update(view.camera);
        }

        const components = landscape.components;
        if (!components || components.length === 0) continue;

        // passEncoder를 2번째 인자로 명시 전달하여 Multi-LOD Batching 드로우 콜 디스패치
        components[0].render(view, passEncoder);
    }
}

export default renderLandscapeLayer;
