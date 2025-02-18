import * as RedGPU from "../../dist";

RedTest.title = 'ResourceManager Test'
const runTest = (pass, error = null) => {
	RedTest.run(pass, error);

};

const onFailureInitialization = (error) => {
	runTest(false, error);
};
//
// Success group
RedTest.testGroup(
	"Success Group - GPUShaderModule Management",
	function () {
		RedTest.test(
			`Test for creating and getting a Module`,
			() => {
				const canvas = document.createElement("canvas");
				RedGPU.init(canvas, (redGPUContext) => {
					try {
						const vertexSourceCode = TEST_MODULE_SOURCE
						const vModuleDescriptor = {
							label: 'vertexModuleDescriptor',
							code: vertexSourceCode
						}
						const moduleName = 'testModule'
						const newModule = redGPUContext.resourceManager.createGPUShaderModule(moduleName, vModuleDescriptor)
						const getVModule = redGPUContext.resourceManager.getGPUShaderModule(moduleName)
						runTest(getVModule === newModule);
						redGPUContext.destroy()
					} catch (error) {
						runTest(false, error);
					}

				}, onFailureInitialization)
			},
			true
		);
		RedTest.test(
			`Get a Module That Already Exists`,
			() => {
				const canvas = document.createElement("canvas");
				RedGPU.init(canvas, (redGPUContext) => {
					try {
						const vertexSourceCode = TEST_MODULE_SOURCE
						const vModuleDescriptor = {
							label: 'vertexModuleDescriptor2',
							code: vertexSourceCode
						}
						const moduleName = 'testModule2'
						const newModule = redGPUContext.resourceManager.createGPUShaderModule(moduleName, vModuleDescriptor)
						const alreadyCreatedModuleReturn = redGPUContext.resourceManager.createGPUShaderModule(moduleName)

						runTest(alreadyCreatedModuleReturn === newModule);
						redGPUContext.destroy()
					} catch (error) {
						runTest(false, error);
					}

				}, onFailureInitialization)
			},
			true
		);

		RedTest.test(
			"Should return undefined when getting an undefined module",
			() => {
				const canvas = document.createElement("canvas");
				RedGPU.init(canvas, (redGPUContext) => {
					try {
						const getUndefinedModule = redGPUContext.resourceManager.getGPUShaderModule('undefinedModule');
						runTest(getUndefinedModule === undefined);
						redGPUContext.destroy()
					} catch (error) {
						runTest(false, error);
					}
				}, onFailureInitialization)
			},
			true
		);
		RedTest.test(
			"Deleting a module",
			() => {
				const canvas = document.createElement("canvas");
				RedGPU.init(canvas, (redGPUContext) => {
					try {
						const vertexSourceCode = TEST_MODULE_SOURCE
						const vModuleDescriptor = {
							label: 'vertexModuleDescriptorForDelete',
							code: vertexSourceCode
						}
						const moduleName = 'testModuleForDelete'
						const newModule = redGPUContext.resourceManager.createGPUShaderModule(moduleName, vModuleDescriptor)
						redGPUContext.resourceManager.deleteGPUShaderModule(moduleName);
						const getGPUShaderModuleAfterDelete = redGPUContext.resourceManager.getGPUShaderModule(moduleName)
						runTest(getGPUShaderModuleAfterDelete === undefined);
						redGPUContext.destroy()
					} catch (error) {
						runTest(false, error);
					}
				}, onFailureInitialization)
			},
			true
		);
		RedTest.test(
			"When trying to create a module with a name that already exists",
			() => {
				const canvas = document.createElement("canvas");
				RedGPU.init(canvas, (redGPUContext) => {
					try {
						const vertexSourceCode = TEST_MODULE_SOURCE
						const vModuleDescriptor = {
							label: 'vertexModuleDescriptor',
							code: vertexSourceCode
						}
						const moduleName = 'testModule'
						const newModule = redGPUContext.resourceManager.createGPUShaderModule(moduleName, vModuleDescriptor)
						const newModule2 = redGPUContext.resourceManager.createGPUShaderModule(moduleName, vModuleDescriptor)

						runTest(newModule === newModule2);
						redGPUContext.destroy()
					} catch (error) {
						runTest(false, error);
					}

				}, onFailureInitialization)
			},
			true
		);

	}
);

// Failure group
RedTest.testGroup(
	"Failure Group - GPUShaderModule Management",
	function () {
		RedTest.test(
			"Should throw an error when attempting to create a module without a name",
			() => {
				const canvas = document.createElement("canvas");
				RedGPU.init(canvas, (redGPUContext) => {
					try {
						const vertexSourceCode = TEST_MODULE_SOURCE
						const vModuleDescriptor = {
							label: 'vertexModuleDescriptor',
							code: vertexSourceCode
						}
						const moduleName = ''
						const newModule = redGPUContext.resourceManager.createGPUShaderModule(moduleName, vModuleDescriptor)
						runTest(true);
						redGPUContext.destroy()
					} catch (error) {
						runTest(false, error);
					}
				}, onFailureInitialization)
			},
			false
		);
		RedTest.test(
			"Should throw an error when try to create module with invalid source code",
			() => {
				const canvas = document.createElement("canvas");
				RedGPU.init(canvas, (redGPUContext) => {
					const invalidSourceCode = `
              @erreerrr
              fnsdf main( @builtin(vertex_index) VertexIndex : u32 ) -> @builtin(position) vec4<f32> {
                return vec4<f32>(0.0, 0.0, 0.0, 1.0);
              }
            `;
					const vModuleDescriptor = {
						label: 'invalidModuleDescriptor',
						code: invalidSourceCode
					};
					const moduleName = 'invalidModule';
					const module = redGPUContext.resourceManager.createGPUShaderModule(moduleName, vModuleDescriptor);
					module.getCompilationInfo().then(v => {
						v.messages.length ? runTest(false, v) : runTest(true)
						redGPUContext.destroy()
					})

				}, onFailureInitialization);
			},
			false
		);

		RedTest.test(
			"Deleting a non-existent module",
			() => {
				const canvas = document.createElement("canvas");
				RedGPU.init(canvas, (redGPUContext) => {
					try {
						redGPUContext.resourceManager.deleteGPUShaderModule('nonExistentModule');
						runTest(true);
					} catch (error) {
						runTest(false, error);
					}
					redGPUContext.destroy()
				}, onFailureInitialization)
			},
			false
		);
		RedTest.test(
			"Deleting a null module",
			() => {
				const canvas = document.createElement("canvas");
				RedGPU.init(canvas, (redGPUContext) => {
					try {
						redGPUContext.resourceManager.deleteGPUShaderModule(null);
						runTest(true);
					} catch (error) {
						runTest(false, error);
					}
					redGPUContext.destroy()
				}, onFailureInitialization)
			},
			false
		);
	}
);

// Success group
RedTest.testGroup(
	"Success Group - GPUShaderModule Management",
	function () {

		RedTest.test(
			`Test for creating and getting a Module`,
			() => {
				const canvas = document.createElement("canvas");
				RedGPU.init(canvas, (redGPUContext) => {
					try {
						const vertexSourceCode = TEST_MODULE_SOURCE
						const vModuleDescriptor = {
							label: 'vertexModuleDescriptor',
							code: vertexSourceCode
						}
						const name = 'testModule'
						const newModule = redGPUContext.resourceManager.createGPUShaderModule(name, vModuleDescriptor)
						const getVModule = redGPUContext.resourceManager.getGPUShaderModule(name)
						runTest(getVModule === newModule);
						redGPUContext.destroy()
					} catch (error) {
						runTest(false, error);
					}

				}, onFailureInitialization)
			},
			true
		);

	}
);
const TEST_MODULE_SOURCE = ` 
@vertex
fn main( @builtin(vertex_index) VertexIndex : u32 ) -> @builtin(position) vec4<f32> {
  var pos = array<vec2<f32>, 6>(
    vec2<f32>(-1, 1),
    vec2<f32>(-1, -1),
    vec2<f32>(1, 1),
    //
   vec2<f32>(1, 1),
   vec2<f32>(1, -1),
   vec2<f32>(-1, -1),
  );
  return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}
`
