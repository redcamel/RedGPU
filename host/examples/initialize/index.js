import * as RedGPU from '../../../dist/RedGPU.mjs'
import setExampleHelper from "../../exampleHelper/setExampleHelper.js";

const run = () => {
	const canvas = document.createElement('canvas')
	canvas.style.width = '100%'
	canvas.style.height = 600 + 'px'
	canvas.style.background = 'red'
	document.body.appendChild(canvas)
	RedGPU.init(canvas)
		.then(redGPUContext => {
			redGPUContext.debugger.useDebugger = true

				const scene = new RedGPU.Scene()
				const renderer = new RedGPU.Renderer(redGPUContext)
				const view = new RedGPU.View(redGPUContext, scene)
				redGPUContext.addView(view)



				scene.grid = new RedGPU.Grid(redGPUContext)
				scene.axis = new RedGPU.Axis(redGPUContext)
				renderer.beforeRender = (nowTime, targetView, targetScene) => {
					targetView.camera.x = Math.cos(nowTime / 3000) * 25 - Math.cos(nowTime / 2000) * 25
					targetView.camera.y = Math.sin(nowTime / 3000) * 25 + Math.sin(nowTime / 2000) * 25
					targetView.camera.z = Math.sin(nowTime / 3000) * 40
				}
				renderer.mainRender = (nowTime, targetView, targetScene) => {

				}
				renderer.afterRender = (nowTime, targetView) => {

				}
				renderer.startRender()
				setExampleHelper(redGPUContext, run.toString());

			}
		)
		.catch(v => {
			console.log('에러', v)

		})
}
run();
