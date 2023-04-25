import * as RedGPU from "../../../dist/RedGPU.mjs";

console.log(RedGPU)
RedTest.title = "View TEST";
RedTest.testGroup(
	"View Constructor Test",
	function () {
		RedTest.test(
			"실패 테스트 : new View(redGPUContext instance)만 허용",
			function () {
				const canvas = document.createElement('canvas');
				RedGPU.init(canvas).then(v => {
					try {
						new RedGPU.View()
						RedTest.run(true)
						v.destroy()
					} catch (e) {
						RedTest.run(false)
						v.destroy()
					}
				}).catch(v => {
					console.log(v)
					RedTest.run(null)
					v.destroy()
				})
			},
			false
		);
		RedTest.test(
			"성공 테스트 : new View(redGPUContext instance)만 허용",
			function () {
				const canvas = document.createElement('canvas');
				RedGPU.init(canvas).then(v => {
					try {
						new RedGPU.View(v)
						RedTest.run(true)
						v.destroy()
					} catch (e) {
						RedTest.run(false)
						v.destroy()
					}
				}).catch(v => {
					console.log(v)
					RedTest.run(null)
				})
			},
			true
		);
	}
);
[
	'x', 'y', 'width', 'height'
].map(key => {
	RedTest.testGroup(
		`(View instance).${key} Test`,
		function () {
			const sizeBaseYn = key === 'width' || key === 'height';
			[
				{
					key, value: 0,
					description: 'number 타입을 입력했을떄',
					successTestYn: true
				},
				{
					key, value: 100,
					description: 'number 타입을 입력했을떄',
					successTestYn: true
				},
				{
					key, value: -1,
					description: 'number 타입을 음수로 입력했을떄',
					successTestYn: sizeBaseYn ? false : true
				},
				{
					key, value: '100%',
					description: '% 타입을 입력했을떄',
					successTestYn: true
				},
				{
					key, value: '-100%',
					description: '% 타입을 음수로 입력했을떄',
					successTestYn: sizeBaseYn ? false : true
				},
				{
					key, value: '50%',
					description: '% 타입을 입력했을떄',
					successTestYn: true
				},
				{
					key, value: '-50%',
					description: '% 타입을 음수로 입력했을떄',
					successTestYn: sizeBaseYn ? false : true
				},
				{
					key, value: '100px',
					description: 'px 허용하지 않는 데이터를 넣었을때',
					successTestYn: false
				},
				{
					key, value: '100',
					description: '문자열100 허용하지 않는 데이터를 넣었을때',
					successTestYn: false
				}
			].forEach(v => {
				const {key, value, successTestYn, description} = v
				RedTest.test(
					`${successTestYn ? '성공' : '실패'} 테스트 : (View instance).${key} = ${value} / ${description}`,
					function () {
						const canvas = document.createElement('canvas');
						RedGPU.init(canvas).then(redGPUContext => {
							const view = new RedGPU.View(redGPUContext)
							console.log(key, '입력값', value)
							try {
								view[key] = value
								console.log(key, '입력값', value, ' / ', `확인 view.${key}`, view[key])
								console.log('redGPUContext.pixelSizeInt', redGPUContext.pixelSizeInt)
								console.log('view.pixelViewRect', view.pixelViewRect)
								RedTest.run(view[key] === value)
								redGPUContext.destroy()
							} catch (e) {
								RedTest.run(false)
								redGPUContext.destroy()
							}
						}).catch(v => {
							RedTest.run(null)
						})
					},
					successTestYn
				);
			})
		}
	);
})
const size = 125;
RedTest.testGroup(
	"(View instance).pixelViewRect Test",
	function () {
		[
			{
				value: ['50%', '10%'],
				expect: [Math.floor(size * (50 / 100)), Math.floor(size * (10 / 100))],
				successTestYn: true
			},
			{
				value: ['100%', '100%'],
				expect: [Math.floor(size * (100 / 100)), Math.floor(size * (100 / 100))],
				successTestYn: true
			},
			{
				value: ['100%', 50],
				expect: [Math.floor(size * (100 / 100)), 50],
				successTestYn: true
			},
			{
				value: [0, 0],
				expect: [0, 0],
				successTestYn: true
			}
		].forEach(v => {
			const {value, expect, successTestYn, description} = v
			const [width, height] = value
			const [pixelSizeInt_width, pixelSizeInt_height] = expect
			const title = `${v['successTestYn'] ? '성공' : '실패'} 테스트 : setSize( ${width}, ${height} ) ${description || ''} `
			RedTest.test(
				title,
				function () {
					const container = document.createElement('div')
					const titleBox = document.createElement('div')
					const canvas = document.createElement('canvas');
					container.style.cssText = `position:relative;display:flex;flex-direction:column;width:${size}px;height:${size}px;background:rgba(255,255,255,0.1)`
					canvas.style.cssText = `position:absolute;top:0;left:0;box-shadow:0 0 10px rgb(0 0 0 / 10%); background : rgba(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},0.5)`
					titleBox.innerHTML = title
					container.appendChild(canvas)
					document.body.appendChild(titleBox)
					document.body.appendChild(container)
					RedGPU.init(canvas).then(v => {
						const view = new RedGPU.View(v)
						view.setSize(width, height)
						console.log('pixelViewRect', view.pixelViewRect, pixelSizeInt_width, pixelSizeInt_height)
						console.log('pixelViewRect', view.pixelViewRect[2] === pixelSizeInt_width, view.pixelViewRect[3] === pixelSizeInt_height)
						RedTest.run(view.pixelViewRect[2] === pixelSizeInt_width && view.pixelViewRect[3] === pixelSizeInt_height)
						v.destroy()
					}).catch(v => {
						console.log(v)
						RedTest.run(false)
					})
				},
				successTestYn ? true : false
			);
		})
	}
);
RedTest.testGroup(
	"(View instance).pixelViewRect Test : redGPUContext도 같이 체크",
	function () {
		[
			{
				value: ['50%', '10%'],
				expect: [Math.floor(Math.floor(size * (50 / 100)) * (50 / 100)), Math.floor(Math.floor(size * (10 / 100)) * (10 / 100))],
				successTestYn: true
			},
			{
				value: ['100%', '100%'],
				expect: [Math.floor(Math.floor(size * (100 / 100)) * (100 / 100)), Math.floor(Math.floor(size * (100 / 100)) * (100 / 100))],
				successTestYn: true
			},
			{
				value: ['100%', 50],
				expect: [Math.floor(Math.floor(size * (100 / 100)) * (100 / 100)), 50],
				successTestYn: true
			},
			{
				value: [0, 0],
				expect: [0, 0],
				successTestYn: true
			}
		].forEach(v => {
			const {value, expect, successTestYn, description} = v
			const [width, height] = value
			const [pixelSizeInt_width, pixelSizeInt_height] = expect
			const title = `${v['successTestYn'] ? '성공' : '실패'} 테스트 : setSize( ${width}, ${height} ) ${description || ''} `
			RedTest.test(
				title,
				function () {
					const container = document.createElement('div')
					const titleBox = document.createElement('div')
					const canvas = document.createElement('canvas');
					container.style.cssText = `position:relative;display:flex;flex-direction:column;width:${size}px;height:${size}px;background:rgba(255,255,255,0.1)`
					canvas.style.cssText = `position:absolute;top:0;left:0;box-shadow:0 0 10px rgb(0 0 0 / 10%); background : rgba(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},0.5)`
					titleBox.innerHTML = title
					container.appendChild(canvas)
					document.body.appendChild(titleBox)
					document.body.appendChild(container)
					RedGPU.init(canvas).then(v => {
						v.setSize(width, height)
						const view = new RedGPU.View(v)
						view.setSize(width, height)
						console.log('pixelViewRect', view.pixelViewRect, pixelSizeInt_width, pixelSizeInt_height)
						console.log('pixelViewRect', view.pixelViewRect[2] === pixelSizeInt_width, view.pixelViewRect[3] === pixelSizeInt_height)
						RedTest.run(view.pixelViewRect[2] === pixelSizeInt_width && view.pixelViewRect[3] === pixelSizeInt_height)
						v.destroy()
					}).catch(v => {
						console.log(v)
						RedTest.run(false)
					})
				},
				successTestYn ? true : false
			);
		})
	}
);
