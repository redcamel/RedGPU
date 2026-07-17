import{$ as a,Q as p,j as r,g as i,n as e,o as t,ax as k,m as o}from"./chunks/framework.D5MFXpji.js";const E=JSON.parse('{"title":"SkyAtmosphere","description":"","frontmatter":{"title":"SkyAtmosphere","order":3},"headers":[],"relativePath":"en/environment/skyatmosphere.md","filePath":"en/environment/skyatmosphere.md","lastUpdated":1784265003000}'),d={name:"en/environment/skyatmosphere.md"},m=Object.assign(d,{setup(g){const n=`
    Sun["Sun (DirectionalLight)"] -->|Provide Light Direction| Atmosphere["SkyAtmosphere (Calculate Atmosphere Scattering)"]
    Atmosphere -->|Render Background| View["View3D (Apply Background & Post Effect)"]

    %% Grayscale styles applied
    style Sun fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Atmosphere fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style View fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(c,s)=>{const l=a("MermaidResponsive"),h=a("ClientOnly");return p(),r("div",null,[s[0]||(s[0]=i("h1",{id:"skyatmosphere",tabindex:"-1"},[e("SkyAtmosphere "),i("a",{class:"header-anchor",href:"#skyatmosphere","aria-label":'Permalink to "SkyAtmosphere"'},"​")],-1)),s[1]||(s[1]=i("p",null,[i("strong",null,"SkyAtmosphere"),e(" is a physically-based atmospheric scattering simulation system. It calculates Rayleigh scattering, Mie scattering, and Ozone absorption in real time to provide realistic skies, evening sunsets, and aerial perspective effects based on altitude and distance.")],-1)),t(h,null,{default:k(()=>[t(l,{definition:n})]),_:1}),s[2]||(s[2]=o("",23))])}}});export{E as __pageData,m as default};
