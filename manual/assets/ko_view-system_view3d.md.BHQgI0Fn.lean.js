import{D as h,o,c,a2 as t,G as e,w as n,k as s,a}from"./chunks/framework.n5RLHRfo.js";const C=JSON.parse('{"title":"View3D","description":"RedGPU의 렌더링 단위인 View3D의 기술적 명세와 사용법을 다룹니다.","frontmatter":{"title":"View3D","description":"RedGPU의 렌더링 단위인 View3D의 기술적 명세와 사용법을 다룹니다.","order":2},"headers":[],"relativePath":"ko/view-system/view3d.md","filePath":"ko/view-system/view3d.md","lastUpdated":1792993711000}'),E={name:"ko/view-system/view3d.md"},P=Object.assign(E,{setup(g){const d=`
    graph TD
        Context["RedGPUContext (실행 환경)"]
        View["View3D (렌더 뷰포트)"]
        Scene["Scene (3D 공간 데이터)"]
        Camera["Camera (투영 시점)"]
        Controller["Controller (입력 제어)"]

        Context -->|관리| View
        View -->|참조| Scene
        View -->|참조| Camera
        Controller -->|갱신| Camera
        View -.->|보유| Controller
        
        %% 회색조 스타일 적용
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Scene fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Camera fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`,r=`
    graph TD
        Context["RedGPUContext"]
        View1["View3D (메인 뷰포트)"]
        View2["View3D (서브 뷰포트)"]
        SceneA["Scene A (동일 씬)"]
        CameraX["Camera X (메인 시점)"]
        CameraY["Camera Y (보조 시점)"]

        Context --> View1
        Context --> View2
        
        View1 --> SceneA
        View1 --> CameraX
        
        View2 -->|공유 참조| SceneA
        View2 --> CameraY

        %% 회색조 스타일 적용
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style View1 fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style View2 fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style SceneA fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style CameraX fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style CameraY fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(y,i)=>{const p=h("MermaidResponsive"),l=h("ClientOnly"),k=h("CodePen");return o(),c("div",null,[i[2]||(i[2]=t("",4)),e(l,null,{default:n(()=>[e(p,{definition:d})]),_:1}),i[3]||(i[3]=t("",6)),e(l,null,{default:n(()=>[e(k,{title:"RedGPU Basics - View3D",slugHash:"view-basic"},{default:n(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const controller = new RedGPU.Camera.OrbitController (redGPUContext);`),a(`
`),s("pre",null,[s("code",null,`const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true; 
view.axis = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=t("",20)),e(l,null,{default:n(()=>[e(p,{definition:r})]),_:1}),i[5]||(i[5]=t("",2)),e(l,null,{default:n(()=>[e(k,{title:"RedGPU Basics - Multi View",slugHash:"view-multi"},{default:n(()=>[...i[1]||(i[1]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(
canvas,
(redGPUContext) => {
const sharedScene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`    // 1. 메인 뷰 설정 (전체 화면)
    const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
    const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
    mainView.setSize('100%', '100%');
    mainView.grid = true;
    redGPUContext.addView(mainView);

    // 2. 미니맵 뷰 설정 (우측 상단 200x200 고정)
    const miniMapSize = 200;
    const miniMapCamera = new RedGPU.Camera.PerspectiveCamera();
    miniMapCamera.y = 50;
    miniMapCamera.lookAt(0, 0, 0);

    const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
    miniMapView.setSize(miniMapSize, miniMapSize);
    miniMapView.axis = true;
    miniMapView.grid = true;
    redGPUContext.addView(miniMapView);

    // 3. 리사이즈 시 메인 뷰 표시 크기(screenRectObject) 기준으로 미니맵 위치 갱신
    const updateLayout = () => {
        const { width } = mainView.screenRectObject;
        miniMapView.setPosition(width - miniMapSize - 10, 10);
    };

    redGPUContext.onResize = updateLayout;
    updateLayout();

    // 씬 오브젝트 배치
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
    for (let i = 0; i < 30; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.x = Math.random() * 40 - 20;
        mesh.z = Math.random() * 40 - 20;
        sharedScene.addChild(mesh);
    }

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
},
(error) => console.error(error)
`)]),a(`
`),s("p",null,");"),a(`
`)],-1)])]),_:1})]),_:1}),i[6]||(i[6]=t("",7))])}}});export{C as __pageData,P as default};
