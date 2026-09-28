import View3D from "../../display/view/View3D";
import Landscape from "../../landscape/Landscape";
import LandscapeFoliageManager from "../../landscape/foliage/LandscapeFoliageManager";

/**
 * [KO] Scene 내의 Landscape가 소유한 Foliage 식생 시스템을 매 프레임 렌더 패스에 디스패치합니다 (Zero-GC / Direct Instancing).
 * [EN] Dispatches the Foliage system owned by the Landscape in the scene to the render pass every frame (Zero-GC / Direct Instancing).
 *
 * @param view - [KO] 현재 View3D 객체 [EN] Current View3D object
 * @param passEncoder - [KO] 현재 GPURenderPassEncoder 인스턴스 [EN] Current GPURenderPassEncoder instance
 */
export function renderFoliageLayer(view: View3D, passEncoder: GPURenderPassEncoder): void {
    const scene = (view as any).rawScene || view.scene;
    if (!scene) return;

    const landscape: Landscape | null = scene.landscape;
    const foliage: LandscapeFoliageManager | undefined = landscape?.foliageManager;
    if (!foliage || !foliage.hasFoliageTypes || !foliage.enabled) return;

    foliage.render(view, passEncoder);
}

/**
 * [KO] Scene 내의 Landscape가 소유한 Foliage 식생 시스템을 섀도우 맵 렌더 패스에 디스패치합니다.
 * [EN] Dispatches the Foliage system owned by the Landscape in the scene to the shadow map render pass.
 *
 * @param view - [KO] 현재 View3D 객체 [EN] Current View3D object
 * @param passEncoder - [KO] 현재 GPURenderPassEncoder 인스턴스 [EN] Current GPURenderPassEncoder instance
 */
export function renderFoliageShadowLayer(view: View3D, passEncoder: GPURenderPassEncoder): void {
    const scene = (view as any).rawScene || view.scene;
    if (!scene) return;

    const landscape: Landscape | null = scene.landscape;
    const foliage: LandscapeFoliageManager | undefined = landscape?.foliageManager;
    if (!foliage || !foliage.hasFoliageTypes || !foliage.enabled) return;

    foliage.renderShadow(view, passEncoder);
}

export default renderFoliageLayer;
