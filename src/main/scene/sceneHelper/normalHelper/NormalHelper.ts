import UniformBufferDescriptor from "../../../../resource/buffers/uniformBuffer/UniformBufferDescriptor";
import TypeSize from "../../../../resource/buffers/TypeSize";
import {Mesh} from "../../../../object3d";
import Geometry from "../../../../resource/geometry/Geometry";
import InterleaveUnit from "../../../../resource/buffers/interleaveInfo/InterleaveUnit";
import InterleaveInfo from "../../../../resource/buffers/interleaveInfo/InterleaveInfo";
import {vec3} from "../../../../util/gl-matrix";
import NormalHelperMaterial from "./NormalHelperMaterial";

const vertexUniformBufferDescriptor: UniformBufferDescriptor = new UniformBufferDescriptor(
    [
        {size: TypeSize.mat4, valueName: 'modelMatrix'},
    ]
);
const vertexUniformBindGroupLayoutDescriptor: GPUBindGroupLayoutDescriptor = {
    entries: [
        {
            binding: 0,
            visibility: GPUShaderStage.VERTEX,
            buffer: {
                type: 'uniform',
            },
        }
    ]
};

class NormalHelper extends Mesh {
    updateBindGroup() {
        // TODO 유니포내용중 텍스쳐 등이 변화하면 업데이트 해야함
        this.updateVertexUniformBindGroup({
            layout: this.renderInfo_VertexUniformBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {
                        buffer: this.vertexUniformBuffer.gpuBuffer,
                        offset: 0,
                        size: this.vertexUniformBuffer.gpuBufferSize
                    }
                }
            ]
        })
    }

    #targetMesh: Mesh

    constructor(mesh: Mesh, scale: number = 1) {
        super(mesh.redGPUContext, null, null, vertexUniformBufferDescriptor, vertexUniformBindGroupLayoutDescriptor)
        const device = mesh.redGPUContext.gpuDevice
        this.#targetMesh = mesh
        const data = []
        //
        let i = 0;
        const len = mesh.geometry.data.length
        console.log(mesh.geometry)
        console.log(mesh.geometry.vertexBuffer)
        const normalInfo = mesh.geometry.vertexBuffer.attributes.filter(v => v['attributeHint'] === InterleaveUnit.VERTEX_NORMAL)
        if (normalInfo.length) {
            const normalOffset = normalInfo[0]['offset'] / Float32Array.BYTES_PER_ELEMENT
            const stride = mesh.geometry.vertexBuffer.arrayStride / Float32Array.BYTES_PER_ELEMENT
            for (i; i < len; i = i + stride) {
                const position = [
                    mesh.geometry.data[i],
                    mesh.geometry.data[i + 1],
                    mesh.geometry.data[i + 2],
                ]

                const normal = [
                    mesh.geometry.data[i + normalOffset],
                    mesh.geometry.data[i + 1 + normalOffset],
                    mesh.geometry.data[i + 2 + normalOffset],
                ]
                vec3.normalize(normal, normal)
                const resultVec = vec3.create()
                const distance = vec3.length(position) * scale * 0.5
                vec3.add(resultVec, position, vec3.scale(normal, normal, distance))
                data.push(
                    ...position,
                    1, 0, 0, 1,
                    ...resultVec,
                    1, 1, 0, 1,
                )
            }
            //
            this.geometry = new Geometry(
                mesh.redGPUContext,
                new Float32Array(data),
                new InterleaveInfo([
                    new InterleaveUnit(InterleaveUnit.VERTEX_POSITION, 'float32x3'),
                    new InterleaveUnit(InterleaveUnit.VERTEX_COLOR, 'float32x4')
                ])
            )
            this.material = new NormalHelperMaterial(mesh.redGPUContext)
            this.topology = 'line-list'
        }

    }


    // render(view: View, passEncoder: GPURenderPassEncoder, time) {
    //     // dirty 계산
    //     this.updatePipeline()
    //     this.vertexUniformBuffer.update(0, this.#targetMesh.matrix)
    //     /////////////////////////////////////////////////////////
    //
    //
    //     // GPU렌더링
    //     if (this.geometry && this.material) {
    //         passEncoder.setPipeline(this.renderInfo_pipeline.gpuPipeline); // 무조건갱신
    //         passEncoder.setVertexBuffer(0, this.geometry.vertexGpuBuffer); // 줄일수있으면 줄이면 좋음
    //         passEncoder.setBindGroup(1, this.renderInfo_VertexUniformBindGroup); // 버텍스 유니폼 버퍼 1번 고정
    //         passEncoder.setBindGroup(2, this.material.renderInfo_FragmentUniformBindGroup); // 프래그 먼트 유니폼 버퍼 2번 고정
    //         passEncoder.draw(this.geometry.vertexBuffer.vertexCount, 1, 0, 0);
    //
    //     }
    //
    // }
}

export default NormalHelper
