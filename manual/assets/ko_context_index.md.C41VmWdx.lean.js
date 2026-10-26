import{D as a,o as h,c as d,a2 as e,G as i,w as p}from"./chunks/framework.n5RLHRfo.js";const E=JSON.parse('{"title":"RedGPU Context","description":"RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.","frontmatter":{"title":"RedGPU Context","description":"RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.","order":2},"headers":[],"relativePath":"ko/context/index.md","filePath":"ko/context/index.md","lastUpdated":1792993711000}'),o={name:"ko/context/index.md"},g=Object.assign(o,{setup(k){const n=`
    graph LR
        Init["RedGPU.init() 호출"] -->|비동기| Callback["onWebGPUInitialized 콜백"]
        Callback -->|인스턴스 획득| Setup["씬 및 뷰 설정"]
        Setup -->|루프 시작| Render["Renderer.start()"]
        
        %% 회색조 스타일 적용
        style Init fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
        style Callback fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Setup fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Render fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`;return(r,s)=>{const t=a("MermaidResponsive"),l=a("ClientOnly");return h(),d("div",null,[s[0]||(s[0]=e("",6)),i(l,null,{default:p(()=>[i(t,{definition:n})]),_:1}),s[1]||(s[1]=e("",26))])}}});export{E as __pageData,g as default};
