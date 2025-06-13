import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../resources/defineProperty/DefineForFragment";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import PackedTexture from "../../resources/texture/PackedTexture";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import ABitmapBaseMaterial from "../core/ABitmapBaseMaterial";
import fragmentModuleSource from './fragment.wgsl';

const EXTENSION_LIST = [
	{
		textureList: [
			'baseColorTexture',
		],
		vec4List: [
			['baseColorFactor', [1, 1, 1, 1]]
		]
	},
	{
		textureList: [
			'normalTexture',
		]
	},
	{
		textureList: [
			'metallicRoughnessTexture',
		],
		positiveNumberList: [
			'metallicFactor',
			'roughnessFactor',
		]
	},
	{
		textureList: [
			'emissiveTexture',
		],
		vec3List: [
			'emissiveFactor',
		]
	},
	{
		textureList: [
			'occlusionTexture',
		],
		positiveNumberList: [
			'occlusionStrength',
		]
	},
	{
		extensionName: 'KHR_materials_clearcoat',
		textureList: [
			'KHR_clearcoatTexture',
			'KHR_clearcoatNormalTexture',
			'KHR_clearcoatRoughnessTexture',
		],
		positiveNumberList: [
			['KHR_clearcoatFactor', 0],
			['KHR_clearcoatRoughnessFactor', 0],
			'KHR_clearcoatNormalScale',
		]
	},
	{
		extensionName: 'KHR_materials_sheen',
		textureList: [
			'KHR_sheenColorTexture',
			'KHR_sheenRoughnessTexture',
		],
		positiveNumberList: [
			['KHR_sheenRoughnessFactor', 0]
		],
		vec3List: [
			['KHR_sheenColorFactor', [0, 0, 0]]
		]
	},
	{
		extensionName: 'KHR_materials_specular',
		textureList: [
			'KHR_specularTexture',
			'KHR_specularColorTexture',
		],
		positiveNumberList: [
			'KHR_specularFactor',
		],
		vec3List: [
			['KHR_specularColorFactor', [1, 1, 1]],
		]
	},
	{
		extensionName: 'KHR_materials_transmission',
		textureList: [
			'KHR_transmissionTexture',
		],
		positiveNumberList: [
			['KHR_transmissionFactor', 0],
		],
	},
	{
		extensionName: 'KHR_materials_volume',
		textureList: [
			'KHR_thicknessTexture',
		],
		positiveNumberList: [
			['KHR_thicknessFactor', 0],
			['KHR_attenuationDistance', 1],
		],
		vec3List: [
			['KHR_attenuationColor', [1, 1, 1]],
		]
	},
	{
		extensionName: 'KHR_materials_diffuse_transmission',
		textureList: [
			'KHR_diffuseTransmissionTexture',
			'KHR_diffuseTransmissionColorTexture',
		],
		positiveNumberList: [
			['KHR_diffuseTransmissionFactor', 0],
		],
		vec3List: [
			['KHR_diffuseTransmissionColorFactor', [1, 1, 1]],
		]
	},
	{
		extensionName: 'KHR_materials_anisotropy',
		textureList: [
			'KHR_anisotropyTexture',
		],
		positiveNumberList: [
			['KHR_anisotropyStrength', 0],
			['KHR_anisotropyRotation', 0],
		]
	},
	{
		extensionName: 'KHR_materials_iridescence',
		textureList: [
			'KHR_iridescenceTexture',
			'KHR_iridescenceThicknessTexture',
		],
		positiveNumberList: [
			['KHR_iridescenceFactor', 0.0],
			['KHR_iridescenceIor', 1.3],
			['KHR_iridescenceThicknessMinimum', 100],
			['KHR_iridescenceThicknessMaximum', 400],
		]
	}
]
const parseExtensionShaderCode = (source: string) => {
	const result = EXTENSION_LIST.map(v => {
		const {textureList, positiveNumberList} = v
		const textureDefine = textureList?.map(textureName => {
			return `
				use${textureName.charAt(0).toUpperCase() + textureName.slice(1)}: u32,
    		${textureName}_texCoord_index: u32,
				use_${textureName}_KHR_texture_transform: u32,
				${textureName}_KHR_texture_transform_offset: vec2<f32>,
				${textureName}_KHR_texture_transform_scale: vec2<f32>,
				${textureName}_KHR_texture_transform_rotation: f32,`
		}).join('')
		return [textureDefine].join('\n')
	}).join('')
	const resultStr = source.replace(/#redgpu_include KHR_texture_transform/g, result)
	// console.log('resultStr', resultStr)
	return resultStr
}
const SHADER_INFO = parseWGSL(parseExtensionShaderCode(fragmentModuleSource))

interface PBRMaterial {
	useVertexColor: boolean
	useCutOff: boolean
	cutOff: number
	alphaBlend: number
	use2PathRender: boolean
	//
	baseColorTexture: BitmapTexture
	baseColorTextureSampler: Sampler
	baseColorFactor: number[],
	baseColorTexture_texCoord_index: number,
	//
	useKHR_materials_clearcoat: boolean,
	KHR_clearcoatNormalScale: number,
	KHR_clearcoatFactor: number,
	KHR_clearcoatRoughnessFactor: number,
	KHR_clearcoatTexture: BitmapTexture,
	KHR_clearcoatNormalTexture: BitmapTexture,
	KHR_clearcoatRoughnessTexture: BitmapTexture,
	KHR_clearcoatTextureSampler: Sampler,
	KHR_clearcoatNormalTextureSampler: Sampler,
	KHR_clearcoatRoughnessTextureSampler: Sampler,
	KHR_clearcoatTexture_texCoord_index: number,
	KHR_clearcoatNormalTexture_texCoord_index: number,
	KHR_clearcoatRoughnessTexture_texCoord_index: number,
	//
	useKHR_materials_anisotropy: boolean;
	KHR_anisotropyStrength: number;
	KHR_anisotropyRotation: number;
	KHR_anisotropyTexture: BitmapTexture,
	KHR_anisotropyTextureSampler: Sampler,
	KHR_anisotropyTexture_texCoord_index: number,
	//
	//
	useKHR_materials_transmission: boolean;
	KHR_transmissionFactor: number;
	KHR_transmissionTexture: BitmapTexture,
	KHR_transmissionTextureSampler: Sampler,
	KHR_transmissionTexture_texCoord_index: number,
	//
	useKHR_materials_diffuse_transmission: boolean;
	KHR_diffuseTransmissionFactor: number;
	KHR_diffuseTransmissionColorFactor: [number, number, number];
	KHR_diffuseTransmissionTexture: BitmapTexture,
	KHR_diffuseTransmissionTextureSampler: Sampler,
	KHR_diffuseTransmissionTexture_texCoord_index: number,
	KHR_diffuseTransmissionColorTexture: BitmapTexture,
	KHR_diffuseTransmissionColorTextureSampler: Sampler,
	KHR_diffuseTransmissionColorTexture_texCoord_index: number,
	//
	useKHR_materials_volume: boolean;
	KHR_thicknessFactor: number;
	KHR_attenuationDistance: number;
	KHR_attenuationColor: number[];
	KHR_thicknessTexture: BitmapTexture,
	KHR_thicknessTextureSampler: Sampler,
	KHR_thicknessTexture_texCoord_index: number,
	//
	useKHR_materials_sheen: boolean,
	KHR_sheenColorFactor: [number, number, number],
	KHR_sheenRoughnessFactor: number,
	KHR_sheenColorTexture: BitmapTexture,
	KHR_sheenColorTextureSampler: Sampler,
	KHR_sheenRoughnessTexture: BitmapTexture,
	KHR_sheenRoughnessTextureSampler: Sampler,
	//
	useKHR_materials_specular: boolean,
	KHR_specularFactor: number,
	KHR_specularColorFactor: [number, number, number],
	KHR_specularTexture: BitmapTexture,
	KHR_specularTextureSampler: Sampler,
	KHR_specularColorTexture: BitmapTexture,
	KHR_specularColorTextureSampler: Sampler,
	//
	//
	useKHR_materials_iridescence: boolean,
	KHR_iridescenceFactor: number,
	KHR_iridescenceIor: number,
	KHR_iridescenceThicknessMinimum: number,
	KHR_iridescenceThicknessMaximum: number,
	KHR_iridescenceTexture: BitmapTexture,
	KHR_iridescenceTextureSampler: Sampler,
	KHR_iridescenceThicknessTexture: BitmapTexture,
	KHR_iridescenceThicknessTextureSampler: Sampler,
	//
	useKHR_materials_unlit: boolean,
	//
	KHR_materials_ior: number,
	//
	normalScale: number
	useNormalTexture: boolean
	normalTexture: BitmapTexture
	normalTextureSampler: Sampler,
	normalTexture_texCoord_index: number,
	//
	emissiveTexture: BitmapTexture
	emissiveTextureSampler: Sampler
	emissiveTexture_texCoord_index: number
	emissiveFactor: number[]
	emissiveStrength: number[]
	//
	occlusionTexture: BitmapTexture
	occlusionTextureSampler: Sampler
	occlusionTexture_texCoord_index: number
	occlusionStrength: number
	//
	metallicRoughnessTexture: BitmapTexture
	metallicRoughnessTextureSampler: Sampler
	metallicRoughnessTexture_texCoord_index: number
	metallicFactor: number
	roughnessFactor: number
	//
	// environmentTexture: CubeTexture
	// environmentTextureSampler: Sampler
	doubleSided: boolean
	//
	//
	KHR_dispersion: boolean
}

class PBRMaterial extends ABitmapBaseMaterial {
	#packedORMTexture: PackedTexture
	#packedKHR_clearcoatTexture: PackedTexture
	#packedKHR_transmission: PackedTexture
	#packedKHR_diffuse_transmission: PackedTexture
	#packedKHR_sheen: PackedTexture
	#packedKHR_iridescence: PackedTexture

	/**
	 * @classdesc The constructor for creating an instance of the class.
	 * @constructor
	 * @param {RedGPUContext} redGPUContext - The RedGPUContext object.
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(
			redGPUContext,
			'PBR_MATERIAL',
			SHADER_INFO,
			2
		)
		this.initGPURenderInfos();
		this.#packedORMTexture = new PackedTexture(redGPUContext)
		this.#packedKHR_clearcoatTexture = new PackedTexture(redGPUContext)
		this.#packedKHR_transmission = new PackedTexture(redGPUContext)
		this.#packedKHR_diffuse_transmission = new PackedTexture(redGPUContext)
		this.#packedKHR_sheen = new PackedTexture(redGPUContext)
		this.#packedKHR_iridescence = new PackedTexture(redGPUContext)
		this.__packingList = [
			() => {
				//TODO - 이거 개선해야함... 대상만 갱신되도록
				this.setupPackORMTexture()
				this.setupPackedKHR_clearcoatTexture()
				this.setupPackedKHR_transmission()
				this.setupPackedKHR_diffuse_transmission()
				this.setupPackedKHR_sheen()
				this.setupPackedKHR_iridescence()
			}
		]
	}

	get packedKHR_iridescence(): PackedTexture {
		return this.#packedKHR_iridescence;
	}

	get packedORMTexture(): PackedTexture {
		return this.#packedORMTexture;
	}

	get packedKHR_sheen(): PackedTexture {
		return this.#packedKHR_sheen;
	}

	get packedKHR_transmission(): PackedTexture {
		return this.#packedKHR_transmission;
	}

	get packedKHR_diffuse_transmission(): PackedTexture {
		return this.#packedKHR_diffuse_transmission;
	}

	get packedKHR_clearcoatTexture(): PackedTexture {
		return this.#packedKHR_clearcoatTexture;
	}

	async setupPackORMTexture() {
		const width = Math.max(
			this.occlusionTexture?.gpuTexture.width || 1,
			this.metallicRoughnessTexture?.gpuTexture.width || 1
		);
		const height = Math.max(
			this.occlusionTexture?.gpuTexture.height || 1,
			this.metallicRoughnessTexture?.gpuTexture.height || 1
		);
		await this.#packedORMTexture.packing(
			{
				r: this.occlusionTexture?.gpuTexture,
				g: this.metallicRoughnessTexture?.gpuTexture,
				b: this.metallicRoughnessTexture?.gpuTexture,
			},
			width,
			height,
			'packedORMTexture'
		)
	}

	async setupPackedKHR_clearcoatTexture() {
		const width = Math.max(
			this.KHR_clearcoatTexture?.gpuTexture.width || 1,
			this.KHR_clearcoatRoughnessTexture?.gpuTexture.width || 1
		);
		const height = Math.max(
			this.KHR_clearcoatTexture?.gpuTexture.height || 1,
			this.KHR_clearcoatRoughnessTexture?.gpuTexture.height || 1
		);
		await this.#packedKHR_clearcoatTexture.packing(
			{
				r: this.KHR_clearcoatTexture?.gpuTexture,
				g: this.KHR_clearcoatRoughnessTexture?.gpuTexture,
			},
			width,
			height,
			'packedKHR_clearcoatTexture'
		)
	}

	async setupPackedKHR_transmission() {
		const width = Math.max(
			this.KHR_transmissionTexture?.gpuTexture.width || 1,
			this.KHR_thicknessTexture?.gpuTexture.width || 1
		);
		const height = Math.max(
			this.KHR_transmissionTexture?.gpuTexture.height || 1,
			this.KHR_thicknessTexture?.gpuTexture.height || 1
		);
		await this.#packedKHR_transmission.packing(
			{
				r: this.KHR_transmissionTexture?.gpuTexture,
				g: this.KHR_thicknessTexture?.gpuTexture,
			},
			width,
			height,
			'packedKHR_transmission'
		)
	}

	async setupPackedKHR_diffuse_transmission() {
		const width = Math.max(
			this.KHR_diffuseTransmissionColorTexture?.gpuTexture.width || 1,
			this.KHR_diffuseTransmissionTexture?.gpuTexture.width || 1
		);
		const height = Math.max(
			this.KHR_diffuseTransmissionColorTexture?.gpuTexture.height || 1,
			this.KHR_diffuseTransmissionTexture?.gpuTexture.height || 1
		);
		await this.#packedKHR_diffuse_transmission.packing(
			{
				r: this.KHR_diffuseTransmissionColorTexture?.gpuTexture,
				g: this.KHR_diffuseTransmissionColorTexture?.gpuTexture,
				b: this.KHR_diffuseTransmissionColorTexture?.gpuTexture,
				a: this.KHR_diffuseTransmissionTexture?.gpuTexture,
			},
			width,
			height,
			'packedKHR_diffuse_transmission'
		)
	}

	async setupPackedKHR_sheen() {
		const width = Math.max(
			this.KHR_sheenColorTexture?.gpuTexture.width || 1,
			this.KHR_sheenRoughnessTexture?.gpuTexture.width || 1
		);
		const height = Math.max(
			this.KHR_sheenColorTexture?.gpuTexture.height || 1,
			this.KHR_sheenRoughnessTexture?.gpuTexture.height || 1
		);
		await this.#packedKHR_sheen.packing(
			{
				r: this.KHR_sheenColorTexture?.gpuTexture,
				g: this.KHR_sheenColorTexture?.gpuTexture,
				b: this.KHR_sheenColorTexture?.gpuTexture,
				a: this.KHR_sheenRoughnessTexture?.gpuTexture,
			},
			width,
			height,
			'packedKHR_sheen'
		)
	}

	async setupPackedKHR_iridescence() {
		const width = Math.max(
			this.KHR_iridescenceTexture?.gpuTexture.width || 1,
			this.KHR_iridescenceThicknessTexture?.gpuTexture.width || 1
		);
		const height = Math.max(
			this.KHR_iridescenceTexture?.gpuTexture.height || 1,
			this.KHR_iridescenceThicknessTexture?.gpuTexture.height || 1
		);
		await this.#packedKHR_iridescence.packing(
			{
				r: this.KHR_iridescenceTexture?.gpuTexture,
				g: this.KHR_iridescenceThicknessTexture?.gpuTexture,
			},
			width,
			height,
			'packedKHR_iridescence'
		)
	}
}

DefineForFragment.defineByPreset(PBRMaterial, [
	DefineForFragment.PRESET_POSITIVE_NUMBER.EMISSIVE_STRENGTH,
	DefineForFragment.PRESET_POSITIVE_NUMBER.NORMAL_SCALE,
]);
const defineTexture = (textureList: string[], useSampler: boolean) => {
	textureList?.forEach(key => {
		DefineForFragment.defineBoolean(PBRMaterial, [
			`use_${key}`,
		])
		DefineForFragment.definePositiveNumber(PBRMaterial, [
			[`${key}_KHR_texture_transform_rotation`, 0],
		]);
		DefineForFragment.defineBoolean(PBRMaterial, [
			`use_${key}_KHR_texture_transform`,
		])
		DefineForFragment.defineVec2(PBRMaterial, [
			`${key}_KHR_texture_transform_offset`,
			[`${key}_KHR_texture_transform_scale`, [1, 1]],
		])
		//
		DefineForFragment.defineUint(PBRMaterial, [
			`${key}_texCoord_index`,
		])
		//
		DefineForFragment.defineTexture(PBRMaterial, [
			key
		])
		if (useSampler) {
			DefineForFragment.defineSampler(PBRMaterial, [
				`${key}Sampler`,
			])
		}
	})
}
const extensionDefine = (defineList) => {
	defineList.forEach(v => {
		const {extensionName, textureList, useSampler} = v;
		const {positiveNumberList, vec3List, vec4List} = v;
		if (extensionName) DefineForFragment.defineBoolean(PBRMaterial, [`use${extensionName}`])
		defineTexture(textureList, !useSampler)
		positiveNumberList?.forEach(v => {
			DefineForFragment.definePositiveNumber(PBRMaterial, [
				v
			])
		})
		vec3List?.forEach(v => {
			DefineForFragment.defineVec3(PBRMaterial, [
				v
			])
		})
		vec4List?.forEach(v => {
			DefineForFragment.defineVec4(PBRMaterial, [
				v
			])
		})
	})
}
extensionDefine(EXTENSION_LIST)
DefineForFragment.definePositiveNumber(PBRMaterial, [
	['cutOff', 0],
	['KHR_materials_ior', 1.5],
	['KHR_dispersion', 0],
]);
DefineForFragment.defineUint(PBRMaterial, [
	'alphaBlend',
])
DefineForFragment.defineBoolean(PBRMaterial, [
	'doubleSided',
	'useCutOff',
	'useVertexColor',
	'useVertexTangent',
	//
	'useKHR_materials_unlit',
])
Object.freeze(PBRMaterial)
export default PBRMaterial
