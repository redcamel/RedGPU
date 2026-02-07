import RedGPUContext from "../../context/RedGPUContext";
import DefineForFragment from "../../defineProperty/DefineForFragment";
import Sampler from "../../resources/sampler/Sampler";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import PackedTexture from "../../resources/texture/packedTexture/PackedTexture";
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
				use${textureName.charAt(0).toUpperCase()}${textureName.substring(1)}: u32,
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

/**
 * [KO] PBRMaterial 속성 인터페이스
 * [EN] PBRMaterial property interface
 */
interface PBRMaterial {
    /**
     * [KO] 버텍스 컬러 사용 여부
     * [EN] Whether to use vertex color
     */
    useVertexColor: boolean
    /**
     * [KO] 알파 컷오프 사용 여부
     * [EN] Whether to use alpha cut-off
     */
    useCutOff: boolean
    /**
     * [KO] 알파 컷오프 값
     * [EN] Alpha cut-off value
     */
    cutOff: number
}

/**
 * [KO] PBR(Physically Based Rendering) 머티리얼 클래스입니다.
 * [EN] PBR (Physically Based Rendering) material class.
 *
 * [KO] ABitmapBaseMaterial을 상속받아 PBR 렌더링을 위한 머티리얼을 생성하며, 다양한 KHR 확장을 지원합니다.
 * [EN] Inherits from ABitmapBaseMaterial to create a material for PBR rendering, supporting various KHR extensions.
 *
 * ### Example
 * ```typescript
 * const material = new RedGPU.Material.PBRMaterial(redGPUContext);
 * material.baseColorFactor = [1, 0, 0, 1];
 * material.metallicFactor = 1.0;
 * material.roughnessFactor = 0.5;
 * ```
 * @category Material
 */
class PBRMaterial extends ABitmapBaseMaterial {
    #packedORMTexture: PackedTexture
    // #packedKHR_clearcoatTexture: PackedTexture
    // #packedKHR_transmission: PackedTexture
    #packedKHR_diffuse_transmission: PackedTexture
    #packedKHR_sheen: PackedTexture
    #packedKHR_iridescence: PackedTexture
    #packedKHR_clearcoatTexture_transmission: PackedTexture

    /**
     * [KO] PBRMaterial 생성자
     * [EN] PBRMaterial constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(
            redGPUContext,
            'PBR_MATERIAL',
            SHADER_INFO,
            2
        )
        this.initGPURenderInfos();


        this.__packingList = [
            () => {
                //TODO - 이거 개선해야함... 대상만 갱신되도록
                this.setupPackORMTexture()
                this.setupPackedKHR_clearcoatTexture_transmission()
                // this.setupPackedKHR_clearcoatTexture()
                // this.setupPackedKHR_transmission()
                this.setupPackedKHR_diffuse_transmission()
                this.setupPackedKHR_sheen()
                this.setupPackedKHR_iridescence()
            }
        ]
    }

    /**
     * [KO] Clearcoat 및 Transmission 패킹 텍스처 반환
     * [EN] Returns packed texture for Clearcoat and Transmission
     */
    get packedKHR_clearcoatTexture_transmission(): PackedTexture {
        return this.#packedKHR_clearcoatTexture_transmission;
    }

    /**
     * [KO] Iridescence 패킹 텍스처 반환
     * [EN] Returns packed texture for Iridescence
     */
    get packedKHR_iridescence(): PackedTexture {
        return this.#packedKHR_iridescence;
    }

    /**
     * [KO] ORM(Occlusion, Roughness, Metallic) 패킹 텍스처 반환
     * [EN] Returns packed texture for ORM (Occlusion, Roughness, Metallic)
     */
    get packedORMTexture(): PackedTexture {
        return this.#packedORMTexture;
    }

    /**
     * [KO] Sheen 패킹 텍스처 반환
     * [EN] Returns packed texture for Sheen
     */
    get packedKHR_sheen(): PackedTexture {
        return this.#packedKHR_sheen;
    }

    // get packedKHR_transmission(): PackedTexture {
    // 	return this.#packedKHR_transmission;
    // }
    /**
     * [KO] Diffuse Transmission 패킹 텍스처 반환
     * [EN] Returns packed texture for Diffuse Transmission
     */
    get packedKHR_diffuse_transmission(): PackedTexture {
        return this.#packedKHR_diffuse_transmission;
    }

    // get packedKHR_clearcoatTexture(): PackedTexture {
    // 	return this.#packedKHR_clearcoatTexture;
    // }
    /**
     * [KO] ORM(Occlusion, Roughness, Metallic) 텍스처 패킹 설정
     * [EN] Setup ORM (Occlusion, Roughness, Metallic) texture packing
     */
    async setupPackORMTexture() {
        if(!(this.occlusionTexture || this.metallicRoughnessTexture)){
            return
        }
        if(!this.#packedORMTexture){
            this.#packedORMTexture = new PackedTexture(this.redGPUContext)
        }
        const width = Math.max(
            this.occlusionTexture?.gpuTexture?.width || 1,
            this.metallicRoughnessTexture?.gpuTexture?.width || 1
        );
        const height = Math.max(
            this.occlusionTexture?.gpuTexture?.height || 1,
            this.metallicRoughnessTexture?.gpuTexture?.height || 1
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

    /**
     * [KO] Clearcoat 및 Transmission 텍스처 패킹 설정
     * [EN] Setup Clearcoat and Transmission texture packing
     */
    async setupPackedKHR_clearcoatTexture_transmission() {
        // if(!this.useKHR_materials_clearcoat && !this.useKHR_materials_transmission){
        //     return
        // }
        if(!this.#packedKHR_clearcoatTexture_transmission){
            this.#packedKHR_clearcoatTexture_transmission = new PackedTexture(this.redGPUContext)
        }
        // Clearcoat + Transmission을 하나의 텍스처로 패킹
        const clearcoatWidth = Math.max(
            this.KHR_clearcoatTexture?.gpuTexture?.width || 1,
            this.KHR_clearcoatRoughnessTexture?.gpuTexture?.width || 1
        );
        const clearcoatHeight = Math.max(
            this.KHR_clearcoatTexture?.gpuTexture?.height || 1,
            this.KHR_clearcoatRoughnessTexture?.gpuTexture?.height || 1
        );
        const transmissionWidth = Math.max(
            this.KHR_transmissionTexture?.gpuTexture?.width || 1,
            this.KHR_thicknessTexture?.gpuTexture?.width || 1
        );
        const transmissionHeight = Math.max(
            this.KHR_transmissionTexture?.gpuTexture?.height || 1,
            this.KHR_thicknessTexture?.gpuTexture?.height || 1
        );
        // 최종 크기는 두 그룹 중 큰 크기로 통일
        const finalWidth = Math.max(clearcoatWidth, transmissionWidth);
        const finalHeight = Math.max(clearcoatHeight, transmissionHeight);
        // 하나의 텍스처에 4개 채널 모두 패킹
        await this.#packedKHR_clearcoatTexture_transmission.packing(
            {
                r: this.KHR_clearcoatTexture?.gpuTexture,           // Red: Clearcoat
                g: this.KHR_clearcoatRoughnessTexture?.gpuTexture,  // Green: Clearcoat Roughness
                b: this.KHR_transmissionTexture?.gpuTexture,        // Blue: Transmission
                a: this.KHR_thicknessTexture?.gpuTexture,          // Alpha: Thickness
            },
            finalWidth,
            finalHeight,
            'packedKHR_clearcoatTexture_transmission',
            {
                b: 'r', a: 'g'
            }
        )
    }

    // async setupPackedKHR_clearcoatTexture() {
    // 	const width = Math.max(
    // 		this.KHR_clearcoatTexture?.gpuTexture?.width || 1,
    // 		this.KHR_clearcoatRoughnessTexture?.gpuTexture?.width || 1
    // 	);
    // 	const height = Math.max(
    // 		this.KHR_clearcoatTexture?.gpuTexture?.height || 1,
    // 		this.KHR_clearcoatRoughnessTexture?.gpuTexture?.height || 1
    // 	);
    // 	await this.#packedKHR_clearcoatTexture.packing(
    // 		{
    // 			r: this.KHR_clearcoatTexture?.gpuTexture,
    // 			g: this.KHR_clearcoatRoughnessTexture?.gpuTexture,
    // 		},
    // 		width,
    // 		height,
    // 		'packedKHR_clearcoatTexture'
    // 	)
    // }
    //
    // async setupPackedKHR_transmission() {
    // 	const width = Math.max(
    // 		this.KHR_transmissionTexture?.gpuTexture?.width || 1,
    // 		this.KHR_thicknessTexture?.gpuTexture?.width || 1
    // 	);
    // 	const height = Math.max(
    // 		this.KHR_transmissionTexture?.gpuTexture?.height || 1,
    // 		this.KHR_thicknessTexture?.gpuTexture?.height || 1
    // 	);
    // 	await this.#packedKHR_transmission.packing(
    // 		{
    // 			r: this.KHR_transmissionTexture?.gpuTexture,
    // 			g: this.KHR_thicknessTexture?.gpuTexture,
    // 		},
    // 		width,
    // 		height,
    // 		'packedKHR_transmission'
    // 	)
    // }
    /**
     * [KO] Diffuse Transmission 텍스처 패킹 설정
     * [EN] Setup Diffuse Transmission texture packing
     */
    async setupPackedKHR_diffuse_transmission() {
        if(!(this.KHR_diffuseTransmissionColorTexture || this.KHR_diffuseTransmissionTexture)){
            return
        }
        if(!this.#packedKHR_diffuse_transmission){
            this.#packedKHR_diffuse_transmission = new PackedTexture(this.redGPUContext)
        }
        const width = Math.max(
            this.KHR_diffuseTransmissionColorTexture?.gpuTexture?.width || 1,
            this.KHR_diffuseTransmissionTexture?.gpuTexture?.width || 1
        );
        const height = Math.max(
            this.KHR_diffuseTransmissionColorTexture?.gpuTexture?.height || 1,
            this.KHR_diffuseTransmissionTexture?.gpuTexture?.height || 1
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

    /**
     * [KO] Sheen 텍스처 패킹 설정
     * [EN] Setup Sheen texture packing
     */
    async setupPackedKHR_sheen() {
        if(!(this.KHR_sheenColorTexture || this.KHR_sheenRoughnessTexture)){
            return
        }
        if(!this.#packedKHR_sheen){
            this.#packedKHR_sheen = new PackedTexture(this.redGPUContext)
        }
        const width = Math.max(
            this.KHR_sheenColorTexture?.gpuTexture?.width || 1,
            this.KHR_sheenRoughnessTexture?.gpuTexture?.width || 1
        );
        const height = Math.max(
            this.KHR_sheenColorTexture?.gpuTexture?.height || 1,
            this.KHR_sheenRoughnessTexture?.gpuTexture?.height || 1
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

    /**
     * [KO] Iridescence 텍스처 패킹 설정
     * [EN] Setup Iridescence texture packing
     */
    async setupPackedKHR_iridescence() {
        if(!(this.KHR_iridescenceTexture || this.KHR_iridescenceThicknessTexture)){
            return
        }
        if(!this.#packedKHR_iridescence){
            this.#packedKHR_iridescence = new PackedTexture(this.redGPUContext)
        }
        const width = Math.max(
            this.KHR_iridescenceTexture?.gpuTexture?.width || 1,
            this.KHR_iridescenceThicknessTexture?.gpuTexture?.width || 1
        );
        const height = Math.max(
            this.KHR_iridescenceTexture?.gpuTexture?.height || 1,
            this.KHR_iridescenceThicknessTexture?.gpuTexture?.height || 1
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
            `use${key.charAt(0).toUpperCase()}${key.substring(1)}`
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
    //
    ['useSSR', true]
])
Object.freeze(PBRMaterial)
export default PBRMaterial
