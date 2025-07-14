import * as RedGPU from "../../dist/index.js";

RedTest.title = 'parseWGSLToObject Test'

// Success group
RedTest.testGroup(
	"Success Group - parseWGSLToObject",
	function () {
		RedTest.test(
			`parseWGSLToObject - empty struct test`,
			() => {
				let pass, error
				try {
					const wgslCode = `
            struct Empty {
            };
          `
					const parsedObj = RedGPU.Resource.parseWGSLToObject(wgslCode)
					const expect = {
						Empty: {}
					}
					pass = JSON.stringify(parsedObj) === JSON.stringify(expect)
				} catch (e) {
					pass = false
					error = e
				}
				RedTest.run(pass, error)
			},
			true
		);

		RedTest.test(
			`parseWGSLToObject - basic f32 test`,
			() => {
				let pass, error
				try {
					const wgslCode = `
						struct Light {
							testF32: f32,	
							testVec2F32: vec2<f32>,
							testVec3F32: vec3<f32>,	
							testVec4F32: vec4<f32>,	
						};
				`
					const parsedObj = RedGPU.Resource.parseWGSLToObject(wgslCode)
					const expect = {
						Light: {
							testF32: RedGPU.Resource.UniformTypeSize.f32,
							testVec2F32: RedGPU.Resource.UniformTypeSize.vec2f32,
							testVec3F32: RedGPU.Resource.UniformTypeSize.vec3f32,
							testVec4F32: RedGPU.Resource.UniformTypeSize.vec4f32,
						}
					}
					pass = JSON.stringify(parsedObj) === JSON.stringify(expect)
				} catch (e) {
					pass = false
					error = e
				}
				RedTest.run(pass, error)
			},
			true
		);

		RedTest.test(
			`parseWGSLToObject - basic i32 test`,
			() => {
				let pass, error
				try {
					const wgslCode = `
						struct Light {
							testI32: i32,	
							testVec2I32: vec2<i32>,
							testVec3I32: vec3<i32>,	
							testVec4I32: vec4<i32>,	
						};
				`
					const parsedObj = RedGPU.Resource.parseWGSLToObject(wgslCode)
					const expect = {
						Light: {
							testI32: RedGPU.Resource.UniformTypeSize.i32,
							testVec2I32: RedGPU.Resource.UniformTypeSize.vec2i32,
							testVec3I32: RedGPU.Resource.UniformTypeSize.vec3i32,
							testVec4I32: RedGPU.Resource.UniformTypeSize.vec4i32,
						}
					}
					pass = JSON.stringify(parsedObj) === JSON.stringify(expect)
				} catch (e) {
					pass = false
					error = e
				}
				RedTest.run(pass, error)
			},
			true
		);

		RedTest.test(
			`parseWGSLToObject - basic u32 test`,
			() => {
				let pass, error
				try {
					const wgslCode = `
            struct Light {
              testU32: u32,  
              testVec2U32: vec2<u32>,
              testVec3U32: vec3<u32>,  
              testVec4U32: vec4<u32>,  
            };
        `
					const parsedObj = RedGPU.Resource.parseWGSLToObject(wgslCode)
					const expect = {
						Light: {
							testU32: RedGPU.Resource.UniformTypeSize.u32,
							testVec2U32: RedGPU.Resource.UniformTypeSize.vec2u32,
							testVec3U32: RedGPU.Resource.UniformTypeSize.vec3u32,
							testVec4U32: RedGPU.Resource.UniformTypeSize.vec4u32,
						}
					}
					pass = JSON.stringify(parsedObj) === JSON.stringify(expect)
				} catch (e) {
					pass = false
					error = e
				}
				RedTest.run(pass, error)
			},
			true
		);

		RedTest.test(
			`parseWGSLToObject - struct with array test`,
			() => {
				let pass, error
				try {
					const wgslCode = `
                    struct Light {
                        testArray: array<f32>,
                        testVec2Array: array<vec2<f32>>,
                        testVec3Array: array<vec3<f32>>,
                        testVec4Array: array<vec4<f32>>,
                    };
                `
					const parsedObj = RedGPU.Resource.parseWGSLToObject(wgslCode)
					const expect = {
						Light: {
							testArray: RedGPU.Resource.UniformTypeSize.arrayf32,
							testVec2Array: RedGPU.Resource.UniformTypeSize.arrayvec2f32,
							testVec3Array: RedGPU.Resource.UniformTypeSize.arrayvec3f32,
							testVec4Array: RedGPU.Resource.UniformTypeSize.arrayvec4f32,
						}
					}
					pass = JSON.stringify(parsedObj) === JSON.stringify(expect)
				} catch (e) {
					pass = false
					error = e
				}
				RedTest.run(pass, error)
			},
			true
		);

		RedTest.test(
			`parseWGSLToObject - basic bool test`,
			() => {
				let pass, error
				try {
					const wgslCode = `
            struct Light {
              testBool: bool,
              testVec2Bool: vec2<bool>,
              testVec3Bool: vec3<bool>,
              testVec4Bool: vec4<bool>,
            };
        `
					const parsedObj = RedGPU.Resource.parseWGSLToObject(wgslCode)
					const expect = {
						Light: {
							testBool: RedGPU.Resource.UniformTypeSize.bool,
							testVec2Bool: RedGPU.Resource.UniformTypeSize.vec2bool,
							testVec3Bool: RedGPU.Resource.UniformTypeSize.vec3bool,
							testVec4Bool: RedGPU.Resource.UniformTypeSize.vec4bool,
						}
					}
					pass = JSON.stringify(parsedObj) === JSON.stringify(expect)
				} catch (e) {
					pass = false
					error = e
				}
				RedTest.run(pass, error)
			},
			true
		);
	}
);
