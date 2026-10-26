import{D as e,o as d,c as o,a2 as n,G as t,w as l,k as i,a}from"./chunks/framework.n5RLHRfo.js";const F=JSON.parse('{"title":"PBR Material","description":"","frontmatter":{"title":"PBR Material","order":3},"headers":[],"relativePath":"ko/lighting-and-shadow/pbr-material.md","filePath":"ko/lighting-and-shadow/pbr-material.md","lastUpdated":1792993711000}'),E={name:"ko/lighting-and-shadow/pbr-material.md"},C=Object.assign(E,{setup(g){const k=`
    BaseColor["BaseColor (기본 색상)"] --> PBR["PBRMaterial (물리 기반 재질)"]
    MetalRough["Metallic / Roughness (금속성·거칠기)"] --> PBR
    Detail["Normal / Occlusion / Emissive"] --> PBR

    %% 회색조 스타일 적용
    style BaseColor fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style MetalRough fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Detail fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style PBR fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(y,s)=>{const p=e("MermaidResponsive"),h=e("ClientOnly"),r=e("CodePen");return d(),o("div",null,[s[1]||(s[1]=n("",3)),t(h,null,{default:l(()=>[t(p,{definition:k})]),_:1}),s[2]||(s[2]=n("",12)),t(h,null,{default:l(()=>[t(r,{title:"RedGPU Basics - PBR Material",slugHash:"pbr-material-basic"},{default:l(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById ("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();`),a(`
`),i("pre",null,[i("code",null,`const light = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(light);

const ibl = new RedGPU.Resource.IBL(
    redGPUContext,
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 64, 64);

for (let i = 0; i < 5; i++) {
    const material = new RedGPU.Material.PBRMaterial(redGPUContext);
    material.baseColorFactor = [1.0, 0.82, 0.35, 1.0];
    material.metallicFactor = 1.0;
    material.roughnessFactor = i / 4;

    const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
    mesh.x = (i - 2) * 3;
    scene.addChild(mesh);
}

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 12;

const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
redGPUContext.addView(view);

new RedGPU.Renderer().start(redGPUContext);
`)]),a(`
`),i("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=n("",6))])}}});export{F as __pageData,C as default};
