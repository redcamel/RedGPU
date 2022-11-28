import * as RedGPU from '../dist/RedGPU.d.ts'

const canvas = document.createElement('canvas')
canvas.style.width = '100%'
canvas.style.height = 600 + 'px'
canvas.style.background = 'red'
document.body.appendChild(canvas)
console.log('RedGPU', RedGPU)

RedGPU.init(canvas)
	.then(redGPUContext => {
			console.log('성공', redGPUContext)
		}
	)
