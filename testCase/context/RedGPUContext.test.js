import * as RedGPU from "../../dist/RedGPU.mjs";

RedTest.title = "RedGPUContext TEST";
RedTest.testGroup(
	"RedGPUContext Test",
	function () {
		RedTest.test(
			"성공 테스트 : 초기 사이즈값은 100% 100%",
			function () {
				const canvas = document.createElement('canvas');
				RedGPU.init(canvas).then(v => {
					console.log(v.width, v.height)

					RedTest.run(true)
					v.destroy()
				}).catch(v => {
					console.log(v)
					RedTest.run(false)
				})
			},
			true
		);

	}
);
RedTest.testGroup(
	"setSize Test - 부모가 지정되지 않았을때 document.body기반으로 계산하는지",
	function () {
		[
			{
				value: ['50%', '10%'],
				successTestYn: true
			},
			{
				value: ['0%', '0%'],
				successTestYn: true
			},
			{
				value: [100, '100px'],
				successTestYn: true
			},
			{
				value: ['100em', '100px'],
				description: '허용되지않는 unit을 사용했을때',
				successTestYn: false
			},
			{
				value: ['test', 0],
				description: '허용되지않는 unit을 사용했을때',
				successTestYn: false
			},
			{
				value: [0, 'test2'],
				description: '허용되지않는 unit을 사용했을때',
				successTestYn: false
			}
		].forEach(v => {
			const {value, successTestYn, description} = v
			const [width, height] = value
			const title = `${v['successTestYn'] ? '성공' : '실패'} 테스트 : setSize( ${width}, ${height} ) ${description || ''} `
			RedTest.test(
				title,
				function () {
					const canvas = document.createElement('canvas');
					canvas.style.cssText = `border : 1px solid #fff; background : rgba(${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},${parseInt(Math.random() * 255)},0.5)`
					RedGPU.init(canvas).then(v => {
						v.setSize(width, height)
						console.log('입력값', width, height, '세팅값', v.width, v.height)
						console.log('pixelSizeInt', v.pixelSizeInt)

						RedTest.run(v.width === width && v.height === height)
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
const size = 125;
RedTest.testGroup(
	"setSize Test - 부모가 존재할때 부모의 크기를 기반으로 계산하는지",
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
			},
			{
				value: ['test', 0],
				expect:[0,0],
				successTestYn: false
			},
			{
				value: [0, 'test2'],
				expect:[0,0],
				successTestYn: false
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
						console.log('pixelSizeInt', v.pixelSizeInt, pixelSizeInt_width, pixelSizeInt_height)
						console.log('pixelSizeInt', v.pixelSizeInt.width === pixelSizeInt_width, v.pixelSizeInt.height === pixelSizeInt_height)

						RedTest.run(v.pixelSizeInt.width === pixelSizeInt_width && v.pixelSizeInt.height === pixelSizeInt_height)
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
	"addView Test",
	function () {
		const failTestView = null;

		[
			{
				title: '등록하려는 대상이 View instance 가 아닌경우',
				value: failTestView,
				expectValue: false,
				successTestYn: false
			},
			{
				title: '등록하려는 대상이 View instance 일때',
				value: (v)=> new RedGPU.View(v),
				expectValue: true,
				successTestYn: true
			}
		].forEach(v => {
			let {title, value, successTestYn, expectValue} = v

			RedTest.test(
				`${successTestYn ? '성공' : '실패'} 테스트 ${title || ''} : ${value} `,
				function () {
					const canvas = document.createElement('canvas')
					RedGPU.init(canvas).then(v => {
						if(value instanceof Function){
							value = value(v)
						}
						v.addView(value)

						RedTest.run(true)
						v.destroy()
					}).catch(v => {
						RedTest.run(false)
					})
				},
				expectValue
			);
		})

	}
);
RedTest.testGroup(
	"removeView Test",
	function () {
		[
			{
				title: '제거하려는 대상이 View instance 일때',
				value: (v)=> new RedGPU.View(v),
				expectValue: true,
				successTestYn: true
			},
			{
				title: '제거하려는 대상이 View instance 가 아닐때',
				value: {},
				expectValue: false,
				successTestYn: false
			}
		].forEach(v => {
			let {title, value, successTestYn, expectValue} = v

			RedTest.test(
				`${successTestYn ? '성공' : '실패'} 테스트 ${title || ''}  `,
				function () {
					const canvas = document.createElement('canvas')
					RedGPU.init(canvas).then(v => {
						if(value instanceof Function){
							value = value(v)
						}
						v.addView(value)
						v.removeView(value)

						RedTest.run(true)
						v.destroy()
					}).catch(v => {
						RedTest.run(false)
					})
				},
				expectValue
			);
		});
		RedTest.test(
			`성공 테스트 : 제거하려는 View가 viewList에 존재하지 않을때`,
			function () {
				const canvas = document.createElement('canvas')
				RedGPU.init(canvas).then(v => {
					const view1 = new RedGPU.View(v)
					const view2 = new RedGPU.View(v)
					v.addView(view1)
					v.removeView(view2)

					RedTest.run(true)
					v.destroy()
				}).catch(v => {
					RedTest.run(false)
				})
			},
			true
		);
	}
);
