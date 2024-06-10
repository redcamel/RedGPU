import * as RedGPU from '../../../dist/RedGPU.mjs'
import setExampleHelper from "../../exampleHelper/setExampleHelper.js";

const canvas = document.createElement('canvas')
canvas.style.width = '100%'
canvas.style.height = 600 + 'px'
canvas.style.background = 'red'
document.body.appendChild(canvas)
console.log('RedGPU', RedGPU)
const run = () => {
	RedGPU.init(canvas)
		.then(redGPUContext => {
				console.log('성공', redGPUContext)
				console.log(redGPUContext.debugger)
				// redGPUContext.debugger.useDebugger = true
				const scene = new RedGPU.Scene()
				const ambientLight = new RedGPU.AmbientLight(redGPUContext)
				// ambientLight.color = 0xff0000
				// ambientLight.intensity=1

				scene.lightManager.addLight(ambientLight);
				const renderer = new RedGPU.Renderer(redGPUContext)
				const lightNum = 1024
				const meshNum = 2000
				{
					let i = lightNum
					const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
					while (i--) {
						const color = ('0x' + genRanHex(6))
						const t0 = new RedGPU.PointLight(redGPUContext, color)
						t0.x = Math.random() * 50 - 25
						t0.y = Math.random() * 50 - 25
						t0.z = Math.random() * 50 - 25
						t0.radius = 2
						t0.intensity = 5
						scene.lightManager.addLight(t0)
					}
				}
				console.log(scene.lightManager.pointLightList)
				{
					const color1 = 0xff0000
					const color2 = 0x00ff00
					const color3 = 0x0000ff
					scene.lightManager.addLight(new RedGPU.DirectionalLight(redGPUContext, color1))
					scene.lightManager.addLight(new RedGPU.DirectionalLight(redGPUContext, color2))
					scene.lightManager.addLight(new RedGPU.DirectionalLight(redGPUContext, color3))
					scene.lightManager.directionalLightList[0].intensity = 0.3
					scene.lightManager.directionalLightList[1].intensity = 0.3
					scene.lightManager.directionalLightList[2].intensity = 0.6
					scene.lightManager.directionalLightList[0].x = 1
					scene.lightManager.directionalLightList[0].y = -1
					scene.lightManager.directionalLightList[1].y = 1
					scene.lightManager.directionalLightList[2].x = -1
				}
				const view = new RedGPU.View(redGPUContext, scene)
				redGPUContext.addView(view)
				// redGPUContext.setSize(10,10)
				// view.setSize(10,10)

				{
					const destroyTexture = new RedGPU.BitmapTexture(redGPUContext, '../../assets/UV_Grid_Sm.jpg')
					setTimeout(v => {
						destroyTexture.destroy()
						console.log('destroyTexture', destroyTexture)
					}, 1000)
				}
				let i = meshNum
				const geometrySphere = new RedGPU.Sphere(redGPUContext)
				const geometryBox = new RedGPU.Box(redGPUContext)
				const testTexture = new RedGPU.BitmapTexture(redGPUContext, '../../assets/crate.png')
				const testMat = new RedGPU.BitmapPhongMaterial(redGPUContext, testTexture)
				testMat.specularPower = 10
				testMat.shininess = 64
				testMat.specularColor = '0xffffff'
				scene.skyBox = new RedGPU.SkyBox(redGPUContext, ['../../assets/cubemap/SwedishRoyalCastle/px.jpg', '../../assets/cubemap/SwedishRoyalCastle/nx.jpg', '../../assets/cubemap/SwedishRoyalCastle/py.jpg', '../../assets/cubemap/SwedishRoyalCastle/ny.jpg', '../../assets/cubemap/SwedishRoyalCastle/pz.jpg', '../../assets/cubemap/SwedishRoyalCastle/nz.jpg'])
				scene.grid = new RedGPU.Grid(redGPUContext)
				scene.axis = new RedGPU.Axis(redGPUContext)
				// {
				// 	while (i--) {
				//
				//
				// 	}
				// }
				i = meshNum
				while (i--) {
					let mesh
					let testTexture2 = testTexture
					let testMat2 = testMat
					// {
					// if(i%20===0) {
					// 	testTexture2 = new RedGPU.BitmapTexture(redGPUContext, '../../assets/crate.png')
					// 	testMat2 = new RedGPU.BitmapPhongMaterial(redGPUContext, testTexture)
					// }
					//
					// }
					const size = Math.random() * 3
					if (Math.random() > 0.5) {
						mesh = new RedGPU.Mesh(redGPUContext, new RedGPU.Sphere(redGPUContext, size), testMat2)
					} else {
						mesh = new RedGPU.Mesh(redGPUContext, new RedGPU.Box(redGPUContext, size, size, size), testMat2)
					}
					// mesh = new RedGPU.Mesh(redGPUContext, geometrySphere, testMat2)
					scene.addChild(mesh)
					mesh.z = Math.random() * 50 - 25
					mesh.x = Math.random() * 50 - 25
					mesh.y = Math.random() * 50 - 25
					mesh.rotationX = Math.random() * 360
					mesh.rotationY = Math.random() * 360
					mesh.rotationZ = Math.random() * 360
					// mesh.material.opacity = Math.random()
				}
				renderer.beforeRender = (nowTime, targetView, targetScene) => {
					// console.log(navigator.hardwareConcurrency)
					targetView.camera.x = Math.cos(nowTime / 3000) * 125 - Math.cos(nowTime / 2000) * 25
					targetView.camera.y = Math.sin(nowTime / 3000) * 125 + Math.sin(nowTime / 2000) * 25
					targetView.camera.z = Math.sin(nowTime / 3000) * 140
					// testMat.shininess = Math.sin(nowTime / 500) * 60 + 60
					// testMat.specularPower = Math.sin(nowTime / 500) * 3 + 5
					// targetScene.lightManager.directionalLightList[0].x = Math.sin(nowTime / 300)
					// targetScene.lightManager.directionalLightList[0].y = Math.cos(nowTime / 300)
				}
				renderer.mainRender = (nowTime, targetView, targetScene) => {
					const list = targetView.scene.children
					let i = targetView.scene.children.length
					while (i--) {
						list[i].rotationX += 0.025
					}
				}
				renderer.afterRender = (nowTime, targetView) => {
					// console.log(redGPUContext.debugger)

				}
				renderer.startRender()
				setExampleHelper(redGPUContext, run.toString());
			}
		)
		.catch(v => {
			console.log('에러', v)
		})
}
run()
