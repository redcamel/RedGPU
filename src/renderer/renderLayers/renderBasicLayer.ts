import View3D from "../../display/view/View3D";

/**
 * [KO] ?ъ쓽 ?먯떇 媛앹껜?ㅼ쓣 ?뚮뜑留곹븯??湲곕낯 ?덉씠???뚮뜑 踰덈뱾???섏쭛?????ㅽ뻾?⑸땲??
 * [EN] Renders the scene's children to collect basic layer render bundles and then executes them.
 *
 * @param view -
 * [KO] ?뚮뜑留곹븷 View3D ?몄뒪?댁뒪
 * [EN] View3D instance to render
 * @param viewRenderPassEncoder -
 * [KO] 踰덈뱾???ㅽ뻾???뚮뜑 ?⑥뒪 ?몄퐫?? * [EN] Render pass encoder that executes the bundles
 */
const renderBasicLayer = (view: View3D, viewRenderPassEncoder: GPURenderPassEncoder) => {
    const {renderViewStateData, scene} = view
    renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
    const {children} = scene
    let i = 0
    {
        const len = children.length;
        for (i; i < len; i++) {
            children[i].render(renderViewStateData);
        }
    }
    viewRenderPassEncoder.executeBundles(renderViewStateData.renderBundleResults.bundleListBasicList);
}
export default renderBasicLayer