import * as RedGPU from "../dist/RedGPU.mjs";

RedTest.title = "RedGPU TEST";
RedTest.testGroup(
	"RedGPU.initialize Test",
	function () {
		RedTest.test(
			"실패 테스트 : canvas 인자를 입력 안했을때",
			function () {
				const canvas = null;
				RedGPU.init(canvas).then(v => {
					RedTest.run(true)
				}).catch(v => {
					RedTest.run(false)
				})
			},
			false
		);
		RedTest.test(
			"실패 테스트 : canvas 인자를 HTMLCanvasElement 타입이 아닌 값이 들어왔을때",
			function () {
				const canvas = document.createElement('div')
				RedGPU.init(canvas).then(v => {
					RedTest.run(true)
				}).catch(v => {
					RedTest.run(false)
				})
			},
			false
		);
	}
)
RedTest.testGroup(
	"RedGPU.initialize - label Test",
	function () {
		[
			{
				value: 'label 초기화',
				expectValue: 'label 초기화',
				successTestYn: true
			},
			{
				value: '~~~~~',
				expectValue: '~~~~~',
				successTestYn: true
			}
		].forEach(v => {
			const {value, successTestYn, expectValue} = v
			RedTest.test(
				`${successTestYn ? '성공' : '실패'} 테스트 : ${value} `,
				function () {
					const canvas = document.createElement('canvas')
					RedGPU.init(canvas, value).then(v => {
						console.log(v)
						console.log(v.label)
						RedTest.run(v.label)
					}).catch(v => {
						console.log(v)
						RedTest.run(false)
					})
				},
				expectValue
			);
		})

	}
)
RedTest.testGroup(
	"RedGPU.initialize - alphaMode Test",
	function () {
		[
			{
				value: 'opaque',
				expectValue: 'opaque',
				successTestYn: true
			},
			{
				value: 'premultiplied',
				expectValue: 'premultiplied',
				successTestYn: true
			},
			{
				title: '기본값 테스트',
				value: undefined,
				expectValue: 'premultiplied',
				successTestYn: true
			},
			{
				title: '기본값 테스트',
				value: null,
				expectValue: 'premultiplied',
				successTestYn: true
			},
			{
				title: '허용되지 않는값 테스트',
				value: '허용되지 않는값 테스트',
				expectValue: false,
				successTestYn: false
			}
		].forEach(v => {
			const {title, value, successTestYn, expectValue} = v
			RedTest.test(
				`${successTestYn ? '성공' : '실패'} 테스트 ${title || ''}: ${value} `,
				function () {
					const canvas = document.createElement('canvas')
					RedGPU.init(canvas, null, value).then(v => {

						RedTest.run(v.alphaMode)
					}).catch(v => {
						RedTest.run(false)
					})
				},
				expectValue
			);
		})
	}
)
RedTest.testGroup(
	"RedGPU.initialize - alphaMode Test",
	function () {
		RedTest.test(
			"성공 테스트 : canvas 인자를 제대로 입력했을때",
			function () {
				const canvas = document.createElement('canvas')
				RedGPU.init(canvas).then(v => {
					RedTest.run(true)
				}).catch(v => {
					RedTest.run(false)
				})
			},
			true
		);
		RedTest.test(
			"성공 테스트 : 초기화가 정상적으로 입력되고 RedGPUContext 인스턴스가 잘들어오는지",
			function () {
				const canvas = document.createElement('canvas')
				RedGPU.init(canvas).then(v => {
					RedTest.run(v instanceof RedGPU.RedGPUContext)
				}).catch(v => {
					RedTest.run(false)
				})
			},
			true
		);
		// RedTest.test(
		// 	"성공 테스트 : lost 되었을때 핸들러가 잘동작하는가",
		// 	function () {
		// 		const canvas = document.createElement('canvas')
		// 		const HD_destroy = (v) => {
		// 			console.log('HD_destroy가 발동하는가', v)
		// 			RedTest.run(true)
		// 		}
		// 		RedGPU.initialize(canvas, undefined, undefined, HD_destroy)
		// 			.then(v => {
		// 				v.destroy()
		// 			}).catch(e => {
		// 				e.preventDefault()
		// 			RedTest.run(false)
		// 		})
		// 	},
		// 	true
		// );
	}
);