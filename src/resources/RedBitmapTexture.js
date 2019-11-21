
export default class RedBitmapTexture {
	#updateList = [];
	#GPUTexture;
	#GPUTextureView;
	constructor(redGPU, src) {
		// 귀찮아서 텍스쳐 맹그는 놈은 들고옴
		let self= this;
		if (!src) {
			console.log('src')

		} else {
			const img = new Image();
			img.src = src;
			img.onerror = function(v){
				console.log(v)
			};
			img.onload = async function () {
				await img.decode();
				let imageCanvas;
				let imageCanvasContext;
					imageCanvas = document.createElement('canvas');
					imageCanvasContext = imageCanvas.getContext('2d');

				imageCanvas.width = img.width;
				imageCanvas.height = img.height;
				imageCanvasContext.translate(0, img.height);
				imageCanvasContext.scale(1, -1);
				imageCanvasContext.drawImage(img, 0, 0, img.width, img.height);
				const imageData = imageCanvasContext.getImageData(0, 0, img.width, img.height);

				let data = null;

				const rowPitch = Math.ceil(img.width * 4 / 256) * 256;
				if (rowPitch == img.width * 4) {
					data = imageData.data;
				} else {
					data = new Uint8Array(rowPitch * img.height);
					for (let y = 0; y < img.height; ++y) {
						for (let x = 0; x < img.width; ++x) {
							let i = x * 4 + y * rowPitch;
							data[i] = imageData.data[i];
							data[i + 1] = imageData.data[i + 1];
							data[i + 2] = imageData.data[i + 2];
							data[i + 3] = imageData.data[i + 3];
						}
					}
				}
				const texture = redGPU.device.createTexture({
					size: {
						width: img.width,
						height: img.height,
						depth: 1,
					},
					format: "rgba8unorm",
					usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.SAMPLED,
				});

				const textureDataBuffer = redGPU.device.createBuffer({
					size: data.byteLength,
					usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
				});

				textureDataBuffer.setSubData(0, data);

				const commandEncoder = redGPU.device.createCommandEncoder({});
				commandEncoder.copyBufferToTexture({
					buffer: textureDataBuffer,
					rowPitch: rowPitch,
					imageHeight: 0,
				}, {
					texture: texture,
				}, {
					width: img.width,
					height: img.height,
					depth: 1,
				});
				redGPU.device.defaultQueue.submit([commandEncoder.finish()]);

				self.resolve(texture)

			}
		}
	}
	get GPUTexture(){
		return this.#GPUTexture
	}
	get GPUTextureView(){
		return this.#GPUTextureView
	}
	resolve(texture){
		this.#GPUTexture = texture;
		this.#GPUTextureView = texture.createView();
		console.log('this.#updateList',this.#updateList);
		this.#updateList.forEach(data=>{
			console.log(data[1]);
			data[0][data[1]] = this
		});
		this.#updateList.length = 0
	}
	addUpdateTarget(target, key) {
		this.#updateList.push([
			target, key
		])
	}
}
