import{f as r,D as a,o as p,c as o,a2 as t,G as n,w as l,k as s,a as e}from"./chunks/framework.DpNgdNqH.js";const b=JSON.parse('{"title":"TextField3D","description":"","frontmatter":{"title":"TextField3D","order":3},"headers":[],"relativePath":"en/assets/text-field/textfield3d.md","filePath":"en/assets/text-field/textfield3d.md","lastUpdated":1770625747000}'),k={name:"en/assets/text-field/textfield3d.md"};function c(g,i,E,y,u,x){const h=a("CodePen"),d=a("ClientOnly");return p(),o("div",null,[i[1]||(i[1]=t("",26)),n(d,null,{default:l(()=>[n(h,{title:"RedGPU Basics - TextField3D Showcase",slugHash:"textfield3d-showcase"},{default:l(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),e(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),e(`
`),s("pre",null,[s("code",null,`// IBL Setup
const ibl = new RedGPU.Resource.IBL(
    redGPUContext, 
    'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
);

// Helper function for creating helmet and text field groups
const createCase = (x, label, color, useBB, usePS) => {
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
    text.padding = 15;
    text.useBillboard = useBB;
    text.usePixelSize = usePS;
    scene.addChild(text);
};

// Place cases
createCase(-3, "Billboard: OFF", "rgba(255, 0, 0, 0.8)", false, false);
createCase(0, "World Size", "rgba(0, 204, 153, 0.8)", true, false);
createCase(3, "Pixel Size", "rgba(0, 102, 255, 0.8)", true, true);

const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.distance = 10;
const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.ibl = ibl;
view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),e(`
`),s("p",null,"});"),e(`
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=t("",6))])}const m=r(k,[["render",c]]);export{b as __pageData,m as default};
