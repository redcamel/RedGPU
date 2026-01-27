import{f as r,D as e,c as k,o as d,a2 as t,H as n,w as l,k as s,a}from"./chunks/framework.cYGcyyTy.js";const C=JSON.parse('{"title":"TextField3D","description":"","frontmatter":{"title":"TextField3D","order":3},"headers":[],"relativePath":"en/assets/text-field/textfield3d.md","filePath":"en/assets/text-field/textfield3d.md","lastUpdated":1769496586000}'),o={name:"en/assets/text-field/textfield3d.md"};function E(c,i,g,y,F,u){const h=e("CodePen"),p=e("ClientOnly");return d(),k("div",null,[i[1]||(i[1]=t("",14)),n(p,null,{default:l(()=>[n(h,{title:"RedGPU Basics - TextField3D Billboard Comparison",slugHash:"textfield3d-billboard"},{default:l(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`// IBL Setup
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// Helper function for creating helmet and text field groups
const createCase = (x, label, color, useBB, useBP) => {
    // 1. Load Model
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            const mesh = loader.resultMesh;
            mesh.x = x;
            scene.addChild(mesh);
        }
    );

    // 2. Create Text Field
    const text = new RedGPU.Display.TextField3D(redGPUContext, label);
    text.x = x; text.y = 1.5;
    text.background = color;
    text.padding = 15; // Add padding
    text.useBillboard = useBB;
    text.useBillboardPerspective = useBP;
    scene.addChild(text);
};

// Place 4 cases
createCase(-4.5, "Billboard: OFF", "rgba(255, 0, 0, 0.8)", false, true);
createCase(-1.5, "Billboard: ON", "rgba(0, 204, 153, 0.8)", true, true);
createCase(1.5, "Perspective: ON", "rgba(0, 102, 255, 0.8)", true, true);
createCase(4.5, "Perspective: OFF", "rgba(255, 102, 0, 0.8)", true, false);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 12;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=t("",6))])}const b=r(o,[["render",E]]);export{C as __pageData,b as default};
