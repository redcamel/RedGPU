import Mesh from "../../../../../display/mesh/Mesh";

/**
 * [KO] 메쉬 및 하위 자식 노드의 머티리얼을 순회하며 식생 전용 셰이더 상태(CutOff, DoubleSided, AlphaBlend)를 설정합니다.
 * [EN] Traverses materials of a mesh and its children, configuring foliage-specific shader states (CutOff, DoubleSided, AlphaBlend).
 */
export default function prepareFoliageMaterials(node: Mesh): void {
    if (!node) return;
    if (node.material) {
        const mat = node.material as any;
        const isMasked = !!mat.useCutOff || mat.alphaBlend === 1 || mat.alphaBlend === 2 || !!mat.transparent;
        mat.isFoliage = true;
        if (isMasked) {
            mat.useCutOff = true;
            mat.cutOff = (mat.cutOff > 0) ? mat.cutOff : 0.3333;
            mat.doubleSided = true;
            mat.alphaBlend = 1;
            mat.transparent = false;
        } else {
            mat.useCutOff = false;
            mat.doubleSided = false;
            mat.alphaBlend = 0;
            mat.transparent = false;
        }
        mat.dirtyPipeline = true;

        if (mat.dirtyPipeline || !mat.gpuRenderInfo?.fragmentShaderModule || !mat.gpuRenderInfo?.fragmentUniformBindGroup) {
            mat._updateFragmentState?.();
            mat.dirtyPipeline = false;
        }
    }
    const children = node.children;
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            prepareFoliageMaterials(children[i] as Mesh);
        }
    }
}
