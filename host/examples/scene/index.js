import * as RedGPU from '../../../dist/RedGPU.mjs'
import setExampleHelper from "../../exampleHelper/setExampleHelper.js";
import testUI from "./testUI.js";

const run = () => {
	const canvas = document.createElement('canvas')
	canvas.style.width = '100%'
	canvas.style.height = 600 + 'px'
	canvas.style.background = 'red'
	document.body.appendChild(canvas)
	RedGPU.init(canvas)
		.then(redGPUContext => {
				// Set scene
				const scene = new RedGPU.Scene()
				scene.grid = new RedGPU.Grid(redGPUContext)
				scene.axis = new RedGPU.Axis(redGPUContext)

				// Set View
				const view = new RedGPU.View(redGPUContext, scene)
				redGPUContext.addView(view)

				// Set Renderer
				const renderer = new RedGPU.Renderer(redGPUContext)
				renderer.beforeRender = (nowTime, targetView, targetScene) => {
					targetView.camera.x = Math.cos(nowTime / 3000) * 25 - Math.cos(nowTime / 2000) * 25
					targetView.camera.y = Math.sin(nowTime / 3000) * 25 + Math.sin(nowTime / 2000) * 25
					targetView.camera.z = Math.sin(nowTime / 3000) * 40
				}
				renderer.mainRender = (nowTime, targetView, targetScene) => {}
				renderer.afterRender = (nowTime, targetView) => {}
				renderer.startRender()

				// Set Example UI
				setExampleHelper(redGPUContext, run.toString());

				// Setting Debug
				redGPUContext.debugger.useDebugger = true
				redGPUContext.debugger.userDebugSet = testUI
			}
		)
		.catch(v => {
			console.log('에러', v)

		})
}
run();
