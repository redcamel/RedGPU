import{f as k,D as n,o as p,c as r,a2 as d,G as h,w as t,k as s,a}from"./chunks/framework.Dn9yU8Jh.js";const A=JSON.parse('{"title":"Camera","description":"","frontmatter":{"title":"Camera","order":4},"headers":[],"relativePath":"ko/view-system/camera.md","filePath":"ko/view-system/camera.md","lastUpdated":1769585107000}'),E={name:"ko/view-system/camera.md"};function g(y,i,o,c,F,C){const l=n("CodePen"),e=n("ClientOnly");return p(),r("div",null,[i[1]||(i[1]=d("",13)),h(e,null,{default:t(()=>[h(l,{title:"RedGPU Basics - Camera lookAt",slugHash:"camera-lookat"},{default:t(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
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

// fieldOfView 설정
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
`)],-1)])]),_:1})]),_:1}),i[2]||(i[2]=s("hr",null,null,-1)),i[3]||(i[3]=s("h2",{id:"다음-단계",tabindex:"-1"},[a("다음 단계 "),s("a",{class:"header-anchor",href:"#다음-단계","aria-label":'Permalink to "다음 단계"'},"​")],-1)),i[4]||(i[4]=s("p",null,"카메라의 위치를 코드로 일일이 계산하는 대신, 마우스와 터치를 이용해 직관적으로 조종하는 방법을 알아봅니다.",-1)),i[5]||(i[5]=s("ul",null,[s("li",null,[s("strong",null,[s("a",{href:"./controller.html"},"카메라 컨트롤러")])])],-1))])}const D=k(E,[["render",g]]);export{A as __pageData,D as default};
