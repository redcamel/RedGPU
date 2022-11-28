import RedGPUContextBase from "../../context/RedGPUContextBase";
import RedGPUContext from "../../context/RedGPUContext";
import generateWebGPUTextureMipmap from "./mipmapGenerator/generateWebGPUTextureMipmap";
import makeUUID from "../../util/makeUUID";


class BitmapCubeTexture extends RedGPUContextBase {
    #srcList: string[]
    get srcList(): string[] {
        return this.#srcList;
    }

    #imgBitmapList: ImageBitmap[]
    get imgBitmapList(): ImageBitmap[] {
        return this.#imgBitmapList;
    }

    #gpuTexture: GPUTexture
    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    get gpuTextureView(): GPUTextureView {
        const tResource = this.redGPUContext.resourceManager.getResource(this)
        if (this.#gpuTexture) {
            if (tResource.textureView) {
                console.log('BitmapCubeTexture 캐시된 녀석의 뷰를 사용함')
                return tResource.textureView
            } else {
                console.log('BitmapCubeTexture 캐시된 녀석의 뷰를 만듬')
                tResource.textureView = this.#gpuTexture?.createView({
                    dimension: 'cube',
                    aspect: 'all',
                    baseMipLevel: 0,
                    mipLevelCount: 1,
                    baseArrayLayer: 0,
                    arrayLayerCount: 6,
                    label: (this.#srcList || []).toString()
                })
                return tResource.textureView
            }
        } else {
            return this.redGPUContext.resourceManager['emptyCubeTextureInfo'].textureView
        }

    }

    #targetList = new Set()

    constructor(redGPUContext: RedGPUContext, srcList: string[]) {
        super(redGPUContext);
        this.#srcList = srcList
        if (this.#srcList) {
            const resource = redGPUContext.resourceManager.getResource(this)
            if (resource) {
                console.log('BitmapCubeTexture 캐시된 녀석을씀')
                // console.log('캐시된 녀석을씀',redGPUContext.resourceManager,redGPUContext.resourceManager.getResource(this))
                return resource.resource
            } else {
                console.log('BitmapCubeTexture 캐시된 녀석을안씀')
                redGPUContext.resourceManager.addResource(this)
                this.#webGPUTextureFromImageUrl(this.#srcList)
            }
        }
    }

    destroy() {
        //TODO destroy
    }

    addTargetMaterial(target) {
        this.#targetList.add(target)
    }

    #webGPUTextureFromImageUrl(srcList) {
        const {redGPUContext} = this
        const {gpuDevice} = redGPUContext
        console.log('srcList', srcList)
        Promise.all(
            srcList.map(url => {
                console.log('url', url)
                return fetch(url).then(response => response.blob().then(blob => createImageBitmap(blob)))
            })
        ).then(imgBitmapList => {
            this.#gpuTexture = makeWebGPUTexture(gpuDevice, imgBitmapList, true, (srcList || []).toString())
            this.#imgBitmapList = imgBitmapList
            this.#resolve()
        }).catch(e => {
            this.#gpuTexture = null
            this.#resolve()
        })

    }

    #resolve() {
        const temp = this.#targetList
        this.#targetList = new Set()
        console.log('#targetList', temp)
        for (const value of temp) {
            temp.delete(value)
            value['bindGroupID'] = makeUUID()
            value['dirtyTexture'] = true
        }
        console.log('#targetList', temp)
        // temp.clear()
    }
}


function makeWebGPUTexture(gpuDevice, sourceList, generateMipmaps: boolean = true, label?: string) {
    console.log('sourceList', sourceList)
    // 텍스쳐에 대한 정의를 내리고
    const textureDescriptor: GPUTextureDescriptor = {
        size: {width: sourceList[0].width, height: sourceList[0].height, depthOrArrayLayers: 6},
        format: 'rgba8unorm',
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
        label
    };
    // 밉맵을 생성할꺼면 소스를 계산해서... 밉맵 카운트를 추가 정의한다.
    // if (generateMipmaps) {
    //     // Compute how many mip levels are needed for a full chain.
    //     textureDescriptor.mipLevelCount = Math.floor(Math.log2(Math.max(sourceList[0].width, sourceList[0].height))) + 1;
    //     // Needed in order to use render passes to generate the mipmaps.
    //     textureDescriptor.usage |= GPUTextureUsage.RENDER_ATTACHMENT;
    // }
    // 생성할 원본 소스를 생성한다.
    const cubeMapTexture2 = gpuDevice.createTexture(textureDescriptor);
    console.log('cubeMapTexture1', cubeMapTexture2)
    sourceList.forEach((imageBitmap, i) => {
        gpuDevice.queue.copyExternalImageToTexture(
            {source: imageBitmap},
            {texture: cubeMapTexture2, origin: [0, 0, i]},
            [imageBitmap.width, imageBitmap.height]
        );
    })
    if (generateMipmaps) {
        // 밉맵생성을 한다.
        generateWebGPUTextureMipmap(gpuDevice, cubeMapTexture2, textureDescriptor);
    }
    // // 생성한 텍스쳐에 데이터를 밀어넣는다.
    // console.log('cubeTexture1', cubeTexture)
    // sourceList.forEach((source, face) => {
    //     console.log(source)
    //     gpuDevice.queue.copyExternalImageToTexture({source}, {
    //         texture: cubeTexture,
    //         mipLevel: face,
    //         origin: {z: face},
    //         textureExtent: {
    //             width: source.width,
    //             height: source.height,
    //             depthOrArrayLayers: 1
    //         }
    //     }, textureDescriptor.size);
    //
    // })
    // console.log('cubeTexture2', cubeTexture)
    // if (generateMipmaps) {
    //     // 밉맵생성을 한다.
    //     generateWebGPUTextureMipmap(gpuDevice, cubeTexture, textureDescriptor);
    // }

    console.log('cubeMapTexture2', cubeMapTexture2)

    return cubeMapTexture2;
}

export default BitmapCubeTexture