import View3D from "../../display/view/View3D";

/**
 * [KO] Scene에 등록된 Landscape 지형 전용 Multi-LOD Instanced Rendering 렌더 패스 디스패치 함수입니다.
 * [EN] Multi-LOD Instanced Rendering render pass dispatch function dedicated to Landscape terrain registered in Scene.
 */
const renderLandscapeLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {renderViewStateData, scene} = view;
    const landscapeChildren = scene.landscapeChildren;
    const count = landscapeChildren.length;
    if (count === 0) return;

    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder;

    for (let i = 0; i < count; i++) {
        const landscape = landscapeChildren[i];
        const components = landscape.components;
        const compCount = components.length;

        // 지형의 모든 타일 컴포넌트들을 순회하며 Render Pass에 바인딩 및 Draw Call 발사
        for (let j = 0; j < compCount; j++) {
            const comp = components[j];
            if (comp.render) {
                comp.render(renderViewStateData);
            }
        }
    }
};

export default renderLandscapeLayer;
