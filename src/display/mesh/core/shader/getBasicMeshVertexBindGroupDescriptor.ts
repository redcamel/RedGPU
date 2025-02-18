import Sampler from "../../../../resources/sampler/Sampler";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import CubeTexture from "../../../../resources/texture/CubeTexture";
import Mesh from "../../Mesh";

const getBasicMeshVertexBindGroupDescriptor = (mesh: Mesh, skin: boolean = false): GPUBindGroupDescriptor => {
    const {redGPUContext, gpuRenderInfo, material} = mesh
    const {resourceManager} = redGPUContext
    const {vertexUniformBuffer, vertexBindGroupLayout} = gpuRenderInfo
    const {basicSampler, emptyBitmapTextureView, emptyCubeTextureView} = resourceManager
    const {gpuSampler: basicGPUSampler} = basicSampler
    return {
        layout: vertexBindGroupLayout,
        label: skin ? 'VERTEX_BIND_GROUP_DESCRIPTOR_MESH_SKIN' : 'VERTEX_BIND_GROUP_DESCRIPTOR_MESH',
        entries: skin ? [
            {
                binding: 0,
                resource: {
                    buffer: vertexUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: vertexUniformBuffer.size
                },
            },
            {
                binding: 1,
                // TODO - displacementTextureSampler 이놈을 프레그먼트 변화를 추적하는데 현재 정의 되어있지 않음 확인해야함
                resource: getGPUResourceSampler(material?.displacementTextureSampler) || basicGPUSampler
            },
            {
                binding: 2,
                resource: getGPUResourceBitmapTextureView(material?.displacementTexture) || emptyBitmapTextureView
            },
            {
                binding: 3,
                resource: {
                    buffer: mesh.animationInfo.skinInfo.vertexStorageBuffer.gpuBuffer,
                    offset: 0,
                    size: mesh.animationInfo.skinInfo.vertexStorageBuffer.size
                },
            },
        ] : [
            {
                binding: 0,
                resource: {
                    buffer: vertexUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: vertexUniformBuffer.size
                },
            },
            {
                binding: 1,
                // TODO - displacementTextureSampler 이놈을 프레그먼트 변화를 추적하는데 현재 정의 되어있지 않음 확인해야함
                resource: getGPUResourceSampler(material?.displacementTextureSampler) || basicGPUSampler
            },
            {
                binding: 2,
                resource: getGPUResourceBitmapTextureView(material?.displacementTexture) || emptyBitmapTextureView
            },
        ]
    }
}
export default getBasicMeshVertexBindGroupDescriptor
const getGPUResourceBitmapTextureView = (texture: BitmapTexture,) => {
    return texture?.gpuTexture?.createView({label: texture.src})
}
const getGPUResourceCubeTextureView = (cubeTexture: CubeTexture, viewDescriptor?: GPUTextureViewDescriptor) => {
    return cubeTexture?.gpuTexture?.createView(viewDescriptor || CubeTexture.defaultViewDescriptor)
}
const getGPUResourceSampler = (sampler: Sampler) => {
    return sampler?.gpuSampler
}
