import{D as n,o as k,c as o,k as i,a,G as e,w as d,a2 as l}from"./chunks/framework.n5RLHRfo.js";const C=JSON.parse(`{"title":"Camera Controller","description":"앞서 배운 Camera 가 '눈'이라면, Controller 는 그 눈을 움직이는 '조종간'입니다. 사용자 입력 (마우스, 터치, 키보드)을 감지하여 카메라의 위치와 회전을 실시간으로 제어하는 상호작용 모듈(Interaction Module)이며, 복잡한 행렬 연산 없이도...","frontmatter":{"title":"Camera Controller","order":5},"headers":[],"relativePath":"ko/view-system/controller.md","filePath":"ko/view-system/controller.md","lastUpdated":1794650641000}`),E={name:"ko/view-system/controller.md"},m=Object.assign(E,{setup(c){const r=`
    graph LR
        Input["사용자 입력 (마우스 · 터치 · 키보드)"]
        Controller["Controller (Orbit / Free / Follow / Isometric)"]
        Camera["내장 Camera (뷰 · 투영 행렬 갱신)"]
        View["View3D (화면 렌더링)"]

        Input -->|이벤트 감지| Controller
        Controller -->|실시간 제어| Camera
        Controller -.->|뷰에 직접 등록| View

        %% 회색조 스타일 일괄 적용
        style Input fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Camera fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`;return(g,s)=>{const h=n("MermaidResponsive"),p=n("ClientOnly"),t=n("ExampleFrame");return k(),o("div",null,[s[0]||(s[0]=i("h1",{id:"camera-controller",tabindex:"-1"},[a("Camera Controller "),i("a",{class:"header-anchor",href:"#camera-controller","aria-label":'Permalink to "Camera Controller"'},"​")],-1)),s[1]||(s[1]=i("p",null,[a("앞서 배운 "),i("code",null,"Camera"),a(" 가 '눈'이라면, "),i("strong",null,"Controller"),a(" 는 그 눈을 움직이는 '조종간'입니다. 사용자 입력 (마우스, 터치, 키보드)을 감지하여 카메라의 위치와 회전을 실시간으로 제어하는 "),i("strong",null,"상호작용 모듈"),a("(Interaction Module)이며, 복잡한 행렬 연산 없이도 직관적인 3D 내비게이션 환경을 구축할 수 있습니다.")],-1)),s[2]||(s[2]=i("h2",{id:"_1-아키텍처-및-역할",tabindex:"-1"},[a("1. 아키텍처 및 역할 "),i("a",{class:"header-anchor",href:"#_1-아키텍처-및-역할","aria-label":'Permalink to "1. 아키텍처 및 역할"'},"​")],-1)),e(p,null,{default:d(()=>[e(h,{definition:r})]),_:1}),s[3]||(s[3]=l("",9)),e(t,{src:"/RedGPU/examples/3d/controller/orbitController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),s[4]||(s[4]=l("",3)),e(t,{src:"/RedGPU/examples/3d/controller/freeController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),s[5]||(s[5]=l("",3)),e(t,{src:"/RedGPU/examples/3d/controller/isometricController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),s[6]||(s[6]=l("",3)),e(t,{src:"/RedGPU/examples/3d/controller/followController/",style:{width:"100%",height:"400px",border:"none","border-radius":"8px"}}),s[7]||(s[7]=l("",11))])}}});export{C as __pageData,m as default};
