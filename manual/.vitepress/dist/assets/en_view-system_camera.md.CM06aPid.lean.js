import{f as p,D as n,o as k,c as r,a2 as d,G as e,w as t,k as s,a}from"./chunks/framework.DZW1bhNM.js";const D=JSON.parse('{"title":"Camera","description":"","frontmatter":{"title":"Camera","order":4},"headers":[],"relativePath":"en/view-system/camera.md","filePath":"en/view-system/camera.md","lastUpdated":1770698112000}'),E={name:"en/view-system/camera.md"};function o(g,i,c,y,F,m){const l=n("CodePen"),h=n("ClientOnly");return k(),r("div",null,[i[1]||(i[1]=d("",13)),e(h,null,{default:t(()=>[e(l,{title:"RedGPU Basics - Camera lookAt",slugHash:"camera-lookat"},{default:t(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`const mesh = new RedGPU.Display.Mesh(
    redGPUContext, 
    new RedGPU.Primitive.TorusKnot(redGPUContext),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
);
scene.addChild(mesh);

const dirLight = new RedGPU.Light.DirectionalLight();

scene.lightManager.addDirectionalLight(dirLight);

const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
camera.y = 8;

// Field of View setup
camera.fieldOfView = 45;

const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
view.grid = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext, (time) => {
    const angle = time / 1000;
    camera.x = Math.sin(angle) * 15;
    camera.z = Math.cos(angle) * 15;
    camera.lookAt(0, 0, 0);
});
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=s("hr",null,null,-1)),i[3]||(i[3]=s("h2",{id:"next-steps",tabindex:"-1"},[a("Next Steps "),s("a",{class:"header-anchor",href:"#next-steps","aria-label":'Permalink to "Next Steps"'},"​")],-1)),i[4]||(i[4]=s("p",null,"Instead of manually calculating camera positions in code, learn how to control it intuitively using a mouse or touch.",-1)),i[5]||(i[5]=s("ul",null,[s("li",null,[s("strong",null,[s("a",{href:"./controller.html"},"Camera Controller")])])],-1))])}const A=p(E,[["render",o]]);export{D as __pageData,A as default};
