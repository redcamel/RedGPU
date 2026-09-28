import View3D from "../../display/view/View3D";
import Landscape from "../../landscape/Landscape";
import LandscapeGrassManager from "../../landscape/grass/LandscapeGrassManager";

/**
 * [KO] Scene 내의 Landscape가 소유한 Grass 잔디 식생 시스템을 매 프레임 렌더 패스에 디스패치합니다 (Zero-GC / Multi-Draw Indirect).
 * [EN] Dispatches the Grass system owned by the Landscape in the scene to the render pass every frame (Zero-GC / Multi-Draw Indirect).
 *
 * @param view - [KO] 현재 View3D 객체 [EN] Current View3D object
 * @param passEncoder - [KO] 현재 GPURenderPassEncoder 인스턴스 [EN] Current GPURenderPassEncoder instance
 */
export function renderGrassLayer(view: View3D, passEncoder: GPURenderPassEncoder): void {
    const scene = (view as any).rawScene || view.scene;
    if (!scene) return;

    const landscape: Landscape | null = scene.landscape;
    const grass: LandscapeGrassManager | undefined = landscape?.grassManager;
    if (!grass || !grass.hasGrass || !grass.enabled) return;

    grass.render(view, passEncoder);
}

/**
 * [KO] Scene 내의 Landscape가 소유한 Grass 잔디 식생 시스템을 섀도우 맵 렌더 패스에 디스패치합니다 (초근거리 30m / Cascade 0, 1 한정).
 * [EN] Dispatches the Grass system owned by the Landscape in the scene to the shadow map render pass (Ultra near 30m / Cascade 0, 1 only).
 *
 * @param view - [KO] 현재 View3D 객체 [EN] Current View3D object
 * @param passEncoder - [KO] 현재 GPURenderPassEncoder 인스턴스 [EN] Current GPURenderPassEncoder instance
 */
export function renderGrassShadowLayer(view: View3D, passEncoder: GPURenderPassEncoder): void {
    const scene = (view as any).rawScene || view.scene;
    if (!scene) return;

    const landscape: Landscape | null = scene.landscape;
    const grass: LandscapeGrassManager | undefined = landscape?.grassManager;
    if (!grass || !grass.hasGrass || !grass.enabled) return;

    grass.renderShadow(view, passEncoder);
}

export default renderGrassLayer;
