import CubeTextureInfo from "../../../resource/resourceManager/CubeTextureInfo";
import RedGPUContextResourceManager from "../../../resource/resourceManager/RedGPUContextResourceManager";
import TextureInfo from "../../../resource/resourceManager/TextureInfo";

const debuggerRenderResourceManager = (resourceManager: RedGPUContextResourceManager) => {
	// resource debug
	const debugResource = document.getElementById('___debugResource___')
	const {textureTable, cubeTextureTable, samplerTable} = resourceManager
	let debugStr = ''
	const map = {
		textureTable,
		cubeTextureTable,
		samplerTable
	}
	const renderTitle = (title) => debugStr += `<div><b>${title}</b></div>`
	{
		// samplerTable
		renderTitle('samplerTable')
		debugStr += `<div style="padding: 4px;font-size: 10px;background: rgba(0,0,0,0.5);max-width: 200px">`
		Object.entries(samplerTable).forEach(v => {
			const key = v[0]
			const value = v[1]
			debugStr += `
                    <div>
<!--                        <b>${key}</b>-->
                        <div style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden">
                            ${value['optionString']}
                        </div>
                    </div>`
		})
		debugStr += `</div>`
		debugStr += `<div style="margin:6px 0px;height:1px;background: rgba(255,255,255,0.2)"></div>`
	}
	{
		// textureTable
		renderTitle('textureTable')
		debugStr += `<div style="display:flex;flex-direction:column;gap:4px;padding: 4px;font-size: 10px;background: rgba(0,0,0,0.5);max-width: 200px">`
		Object.entries(textureTable).forEach(v => {
			const key: string = v[0]
			const value: TextureInfo = v[1]
			const {resource, textureView} = value;
			const info = {
				src: resource.src,
				// label: textureView?.label,
				size: resource.imgBitmap ? `${resource.imgBitmap?.width} x ${resource.imgBitmap?.height}` : '-'
			}
			debugStr += '<div style="display:flex;justify-content:space-between;gap:4px;align-category:center;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">'
			debugStr += `<div style="background:${textureView?.label ? '#00ff00' : '#ff0000'};border-radius: 50%;min-width: 10px;height:10px"></div>`
			for (const key in info) {
				const value = info[key]
				const style = key === 'src' ? 'white-space: nowrap;text-overflow: ellipsis;overflow: hidden' : 'line-height:1;color:#000;background : rgba(255,255,255,1);padding:2px 4px 3px;border-radius:4px'
				if (value) debugStr += `<span style="${style}">${key} : ${value}</span>`
			}
			debugStr += '</div>'
		})
		debugStr += `</div>`
		debugStr += `<div style="margin:6px 0px;height:1px;background: rgba(255,255,255,0.2)"></div>`
	}
	{
		// textureTable
		renderTitle('cubeTextureTable')
		debugStr += `<div style="padding: 4px;font-size: 10px;background: rgba(0,0,0,0.5);max-width: 200px">`
		Object.entries(cubeTextureTable).forEach(v => {
			const key: string = v[0]
			const value: CubeTextureInfo = v[1]
			const {resource, textureView} = value;
			const sizeList = []
			if (resource.imgBitmapList) {
				resource.imgBitmapList.forEach(v => {
					const t0 = `${v.width} x ${v.height}`
					if (sizeList.indexOf(t0) === -1) sizeList.push(t0)
				})
			}
			const info = {
				src: resource.srcList,
				// label: textureView?.label,
				size: resource.imgBitmapList ? sizeList.toString() : '-'
			}
			debugStr += '<div style="display:flex;justify-content:space-between;gap:4px;align-category:center;white-space: nowrap;text-overflow: ellipsis;overflow: hidden">'
			debugStr += `<div style="background:${textureView?.label ? '#00ff00' : '#ff0000'};border-radius: 50%;min-width: 10px;height:10px"></div>`
			for (const key in info) {
				const value = info[key]
				const style = key === 'src' ? 'white-space: nowrap;text-overflow: ellipsis;overflow: hidden' : 'line-height:1;color:#000;background : rgba(255,255,255,1);padding:2px 4px 3px;border-radius:4px'
				if (value) debugStr += `<span style="${style}">${key} : ${value}</span>`
			}
			debugStr += '</div>'
		})
		debugStr += `</div>`
		debugStr += `<div style="margin:6px 0px;height:1px;background: rgba(255,255,255,0.2)"></div>`
	}
	debugResource.innerHTML = debugStr
}
export default debuggerRenderResourceManager
