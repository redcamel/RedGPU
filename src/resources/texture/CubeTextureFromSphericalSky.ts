import RedGPUContext from "../../context/RedGPUContext";
import ManagedResourceBase from "../ManagedResourceBase";
import basicRegisterResource from "../resourceManager/core/basicRegisterResource";
import basicUnregisterResource from "../resourceManager/core/basicUnregisterResource";
import ResourceStateBitmapTexture from "../resourceManager/resourceState/ResourceStateBitmapTexture";
import loadAndCreateBitmapImage from "./core/loadAndCreateBitmapImage";
import ResourceStateCubeTextureFromSphericalSky
    from "../resourceManager/resourceState/ResourceStateCubeTextureFromSphericalSky";

const MANAGED_STATE_KEY = 'managedCubeTextureFromSphericalSkyState'

class CubeTextureFromSphericalSky extends ManagedResourceBase {
    static defaultViewDescriptor: GPUTextureViewDescriptor = {
        dimension: 'cube',
        aspect: 'all',
        baseMipLevel: 0,
        mipLevelCount: 1,
        baseArrayLayer: 0,
        arrayLayerCount: 6,
    }
    #gpuTexture: GPUTexture
    #src: string
    #cacheKey: string
    #mipLevelCount: number
    #useMipmap: boolean
    #imgBitmap: ImageBitmap
    #videoMemorySize: number = 0
    readonly #format: GPUTextureFormat
    readonly #onLoad: (cubeTextureInstance: CubeTextureFromSphericalSky) => void;
    readonly #onError: (error: Error) => void;

    constructor(
        redGPUContext: RedGPUContext,
        src?: any,
        useMipMap: boolean = true,
        onLoad?: (cubeTextureInstance?: CubeTextureFromSphericalSky) => void,
        onError?: (error: Error) => void,
        format?: GPUTextureFormat
    ) {
        super(redGPUContext, MANAGED_STATE_KEY);
        this.#onLoad = onLoad
        this.#onError = onError
        this.#useMipmap = useMipMap
        this.#format = format || navigator.gpu.getPreferredCanvasFormat()
        if (src) {
            this.#src = src?.src || src;
            this.#cacheKey = src?.cacheKey || src || this.uuid;
            const {table} = this.targetResourceManagedState
            let target: ResourceStateBitmapTexture
            for (const k in table) {
                if (table[k].cacheKey === this.#cacheKey) {
                    target = table[k]
                    break
                }
            }
            // console.log('target',	this.#cacheKey ,this)
            if (target) {
                this.#onLoad?.(this)
                return table[target.uuid].texture
            } else {
                this.src = src;
                this.#registerResource()
            }
        } else {
            // TODO - 없으면 등록을 안하는게 맞는건지 확인해야함
        }
    }

    get cacheKey(): string {
        return this.#cacheKey;
    }

    get videoMemorySize(): number {
        return this.#videoMemorySize;
    }

    get gpuTexture(): GPUTexture {
        return this.#gpuTexture;
    }

    get mipLevelCount(): number {
        return this.#mipLevelCount;
    }

    get src(): string {
        return this.#src;
    }

    set src(value: string | any) {
        this.#src = value?.src || value;
        this.#cacheKey = value?.cacheKey || value || this.uuid;
        if (this.#src) this.#loadBitmapTexture(this.#src);
    }

    get useMipmap(): boolean {
        return this.#useMipmap;
    }

    set useMipmap(value: boolean) {
        this.#useMipmap = value;
        this.#createGPUTexture()
    }

    destroy() {
        //TODO 체크
        const temp = this.#gpuTexture
        this.#setGpuTexture(null);
        this.__fireListenerList(true)
        this.#src = null
        this.#cacheKey = null
        this.#unregisterResource()
        if (temp) temp.destroy()
    }

    #setGpuTexture(value: GPUTexture) {
        this.#gpuTexture = value;
        if (!value) this.#imgBitmap = null
        this.__fireListenerList();
    }

    #registerResource() {
        basicRegisterResource(
            this,
            new ResourceStateCubeTextureFromSphericalSky(this)
        )
    }

    #unregisterResource() {
        basicUnregisterResource(this)
    }

    #createGPUTexture() {
        const {gpuDevice, resourceManager} = this.redGPUContext
        const {mipmapGenerator} = resourceManager
        if (this.#gpuTexture) {
            this.#gpuTexture.destroy()
            this.#gpuTexture = null
        }
        this.#mipLevelCount = 1;

        function createCubeMapTexture(device, size) {
            return device.createTexture({
                size: [size, size, 6], // 6 faces for the cube map
                format: "rgba8unorm",
                usage: GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.RENDER_ATTACHMENT |
                    GPUTextureUsage.COPY_SRC
            });
        }

        function createRenderPipeline(device, cubeMapTexture, shaderModule) {
            const pipeline = device.createRenderPipeline({
                layout: "auto",
                vertex: {
                    module: shaderModule,
                    entryPoint: "vertexMain"
                },
                fragment: {
                    module: shaderModule,
                    entryPoint: "fragmentMain",
                    targets: [{format: "rgba8unorm"}]
                },
                primitive: {
                    topology: "triangle-list"
                }
            });
            // Create cube map texture views (one view for each face)
            const renderPassViews = [];
            for (let i = 0; i < 6; i++) {
                renderPassViews.push(
                    cubeMapTexture.createView({
                        dimension: "2d",         // Create a 2D view
                        arrayLayerCount: 1,      // One layer per cube face
                        baseArrayLayer: i        // Specific layer for cube face
                    })
                );
            }
            return {pipeline, renderPassViews};
        }

        {
            const imgBitmap = this.#imgBitmap;
            // Step 1: Create spherical texture
            const sphericalTexture = gpuDevice.createTexture({
                size: [imgBitmap.width, imgBitmap.height, 1],
                format: "rgba8unorm",
                usage: GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_DST |
                    GPUTextureUsage.RENDER_ATTACHMENT
            });
            gpuDevice.queue.copyExternalImageToTexture(
                {source: imgBitmap},
                {texture: sphericalTexture},
                [imgBitmap.width, imgBitmap.height]
            );
            // Step 2: Define cube map dimensions
            const cubeMapSize = 512;
            const cubeMapTexture = createCubeMapTexture(gpuDevice, cubeMapSize);
// Step 3: Create a sampler for the texture
            const sampler = gpuDevice.createSampler({
                magFilter: "linear",
                minFilter: "linear"
            });
            // Step 3: Create shader module
            const shaderModule = gpuDevice.createShaderModule({
                code: `
struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
};
\n
@group(0) @binding(0) var textureSampler: sampler;
@group(0) @binding(1) var sphericalTexture: texture_2d<f32>; 
@group(0) @binding(2) var<uniform> cubeFaceIndex:u32;
\n
fn atan2(y: f32, x: f32) -> f32 {
    if (x > 0.0) {
        return atan(y / x);
    } else if (x < 0.0 && y >= 0.0) {
        return atan(y / x) + 3.141592653589793;
    } else if (x < 0.0 && y < 0.0) {
        return atan(y / x) - 3.141592653589793; 
    } else if (x == 0.0 && y > 0.0) {
        return 1.5707963267948966; 
    } else if (x == 0.0 && y < 0.0) {
        return -1.5707963267948966; 
    } else {
        return 0.0; 
    }
}\n
@vertex\n
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
    var positions = array<vec3<f32>, 6>(
        vec3<f32>(-1.0,  1.0, 0.0),
        vec3<f32>( 1.0,  1.0, 0.0),
        vec3<f32>(-1.0, -1.0, 0.0),
        vec3<f32>( 1.0, -1.0, 0.0),
        vec3<f32>(-1.0, -1.0, 0.0),
        vec3<f32>( 1.0,  1.0, 0.0)
    );
    var position = positions[vertexIndex];
    var output: VertexOutput;
    output.position = vec4<f32>(position, 1.0);

   var direction: vec3<f32>;
    if (cubeFaceIndex == 0u) {
        direction = vec3<f32>(1.0, position.y, -position.x);
    } else if (cubeFaceIndex == 1u) { 
        direction = vec3<f32>(-1.0, position.y, position.x);
    } else if (cubeFaceIndex == 2u) {
        direction = vec3<f32>(position.x, 1.0, -position.y);
    } else if (cubeFaceIndex == 3u) { 
        direction = vec3<f32>(position.x, -1.0, position.y);
    } else if (cubeFaceIndex == 4u) {
        direction = vec3<f32>(position.x, position.y, 1.0);
    } else {
        direction = vec3<f32>(-position.x, position.y, -1.0);
    }

    // 방향 정규화\n
    direction = normalize(direction);

    // 구형 텍스처 UV 좌표 계산\n
    let theta = atan2(direction.z, direction.x); 
    let phi = acos(direction.y);               

    // 구형 텍스처의 UV로 변환\n
    let PI = 3.1415927;
    let u = theta / (2.0 * PI); 
    let v = phi / PI;          

    // UV 값 전달\n
    output.uv = vec2<f32>(u, v);



    return output;
}
\n
@fragment\n
fn fragmentMain(@location(0) fragUV: vec2<f32>) -> @location(0) vec4<f32> {
 var sampledColor: vec4<f32> = textureSample(sphericalTexture, textureSampler, fragUV);;
    
    if (fragUV.x < 0.0 || fragUV.x > 1.0 || fragUV.y < 0.0 || fragUV.y > 1.0) {
        sampledColor = vec4<f32>(0.0, 0.0, 0.0, 1.0); 
    } 

    let gamma = 2.2;
    let outputColor = pow(sampledColor.rgb, vec3<f32>(1.0 / gamma));

    return vec4<f32>(outputColor, sampledColor.a);
}
        `
            });
            // Step 4: Create render pipeline
            const {pipeline, renderPassViews} = createRenderPipeline(
                gpuDevice,
                cubeMapTexture,
                shaderModule
            );
            const faceIndexBuffer = gpuDevice.createBuffer({
                size: 4, // enough for one u32 (4 bytes)
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            // Create bind group for the texture and sampler
            const bindGroup = gpuDevice.createBindGroup({
                layout: pipeline.getBindGroupLayout(0), // Group 0 for texture and sampler
                entries: [
                    {binding: 0, resource: sampler},                        // 샘플러 바인딩
                    {binding: 1, resource: sphericalTexture.createView()},  // 텍스처 뷰 바인딩
                    {
                        binding: 2, resource: {
                            buffer: faceIndexBuffer,  // GPUBuffer
                            offset: 0,               // 버퍼의 시작점
                            size: 4                  // `u32` 타입의 크기 (4바이트)
                        }
                    },                // 유니폼 버퍼 바인딩
                ],
            });
            // Step 5: Render commands for each face
            const commandEncoder = gpuDevice.createCommandEncoder();
            for (let i = 0; i < 6; i++) {
                gpuDevice.queue.writeBuffer(faceIndexBuffer, 0, new Uint32Array([i]));
                // Ensure the view is correctly used for the render pass
                const passEncoder = commandEncoder.beginRenderPass({
                    colorAttachments: [
                        {
                            view: renderPassViews[i], // Use the proper face view
                            loadOp: "clear",
                            clearValue: [0, 0, 0, 1], // Clear color (black)
                            storeOp: "store"          // Store the result
                        }
                    ]
                });
                passEncoder.setPipeline(pipeline);
                passEncoder.setBindGroup(0, bindGroup); // Bind
                passEncoder.draw(6, 1, 0, 0); // Draw 6 vertices
                passEncoder.end();
            }
            // Step 6: Submit command to GPU queue
            gpuDevice.queue.submit([commandEncoder.finish()]);
            this.#setGpuTexture(cubeMapTexture)
        }
    }

    async #loadBitmapTexture(src: string) {
        this.#imgBitmap = await loadAndCreateBitmapImage(src);
        try {
            this.#createGPUTexture()
            this.#onLoad?.(this)
        } catch (error) {
            console.error(error);
            this.#onError?.(error)
        }
    }
}

Object.freeze(CubeTextureFromSphericalSky)
export default CubeTextureFromSphericalSky
