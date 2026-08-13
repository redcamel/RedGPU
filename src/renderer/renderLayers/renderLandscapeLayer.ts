import View3D from "../../display/view/View3D";

/**
 * [KO] Scene 내의 전체 Landscape 지형 시스템을 렌더 패스에 디스패치합니다 (Zero-GC / 1-Call Instancing).
 * [EN] Dispatches all Landscape terrain systems in the scene to the render pass (Zero-GC / 1-Call Instancing).
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

        const components = landscape.components;
        if (!components || components.length === 0) continue;

        // passEncoder를 2번째 인자로 명시 전달하여 단 1회의 드로우 콜(1 Call) 발사
        components[0].render(view, passEncoder);
    }
}

export default renderLandscapeLayer;
