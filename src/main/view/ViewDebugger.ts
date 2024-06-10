import View from "./View";

class ViewDebugger {
	ViewRect = {}
	Frame = {}
	Render = {}
	Light = {}

	constructor() {
	}

	update(view: View, scene, startTime, prevTime, beforeTime, mainTime, afterTime, renderMeshNum, triangleNum) {
		const {Frame, Render, Light, ViewRect} = this
		//
		this['View Label'] = view['label']
		this['scene Label'] = scene['label']
		ViewRect['size'] = `${view.width} x ${view.height} (${view.pixelViewRect[2]}px x ${view.pixelViewRect[3]}px)`
		ViewRect['location'] = `${view.x} x ${view.y} (${view.pixelViewRect[0]}px x ${view.pixelViewRect[1]}px)`
		//
		Frame['FrameNum'] = (Frame['FrameNum'] || 0) + 1
		//
		// const fps: number = 1000 / (beforeTime + mainTime + afterTime)
		// console.log(startTime - prevTime)
		const fps: number = 1000 / (startTime - prevTime)
		Frame['Before render time'] = +beforeTime.toFixed(2)
		Frame['Main render time'] = +mainTime.toFixed(2)
		Frame['After render time'] = +afterTime.toFixed(2)
		Frame['Frame render time'] = +(beforeTime + mainTime + afterTime).toFixed(2)
		Frame['Frame FPS'] = +(fps).toFixed(0)
		Frame['Total Frame FPS'] = +(Frame['Total Frame FPS'] || 0) + fps
		Frame['AVG FPS'] = +(Frame['Total Frame FPS'] / Frame['FrameNum']).toFixed(2)
		//
		Render['Total Mesh'] = scene.children.length
		Render['Render Mesh'] = renderMeshNum
		Render['Triangle Num'] = triangleNum
		//
		Light['Total PointLight'] = scene.lightManager.pointLightList.length
		Light['Render PointLight'] = view.renderPointLightNum
		Light['Render DirectionalLight'] = view.renderDirectionalLightNum
		//
	}
}

export default ViewDebugger
