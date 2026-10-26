import{D as t,o as d,c as o,a2 as n,G as e,w as l,k as i,a}from"./chunks/framework.n5RLHRfo.js";const m=JSON.parse('{"title":"PBR Material","description":"","frontmatter":{"title":"PBR Material","order":3},"headers":[],"relativePath":"en/lighting-and-shadow/pbr-material.md","filePath":"en/lighting-and-shadow/pbr-material.md","lastUpdated":1792987289000}'),g={name:"en/lighting-and-shadow/pbr-material.md"},F=Object.assign(g,{setup(E){const r=`
    BaseColor["BaseColor (Albedo)"] --> PBR["PBRMaterial (Physically Based Material)"]
    MetalRough["Metallic / Roughness"] --> PBR
    Detail["Normal / Occlusion / Emissive"] --> PBR

    %% Grayscale styles applied
    style BaseColor fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style MetalRough fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Detail fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style PBR fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`;return(c,s)=>{const p=t("MermaidResponsive"),h=t("ClientOnly"),k=t("CodePen");return d(),o("div",null,[s[1]||(s[1]=n("",3)),e(h,null,{default:l(()=>[e(p,{definition:r})]),_:1}),s[2]||(s[2]=n("",12)),e(h,null,{default:l(()=>[e(k,{title:"RedGPU Basics - PBR Material",slugHash:"pbr-material-basic"},{default:l(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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
`)],-1)])]),_:1})]),_:1}),s[3]||(s[3]=n("",6))])}}});export{m as __pageData,F as default};
