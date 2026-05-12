import React from 'react';

/**
 * [KO] 모든 아이콘을 중앙 관리하고 최적화된 SVG 컴포넌트로 제공합니다.
 * [EN] Centralized management of all icons as optimized SVG components.
 */

interface IconProps {
    color?: string;
    size?: number | string;
    style?: React.CSSProperties;
    opacity?: number;
}

const defaultSize = 18;
const defaultColor = '#ccc';

export const AxisIcon: React.FC<IconProps> = ({color = defaultColor, size = defaultSize, style, opacity}) => (
    <svg width={size} height={size} viewBox="0 0 14 14" fill={color} style={{...style, opacity}}
         xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6.995 1.802L6.258 3.981c.154.087.328.145.509.173v3.361l-.979.565v1.082L2.922 10.818c-.118-.155-.256-.276-.408-.366L1 12.198l2.255-.452c-.002-.177-.038-.356-.105-.528l2.827-1.632 1.021.589 1.021-.589 2.827 1.632c-.066.171-.102.351-.105.528L13 12.192l-1.518-1.728c-.152.09-.29.211-.405.354l-2.869-1.656v-1.082l-.979-.565V4.154c.181-.028.355-.087.509-.173L6.995 1.802z"/>
    </svg>
);

export const DebugIcon: React.FC<IconProps> = ({color = defaultColor, size = 24, style, opacity}) => (
    <svg width={size} height={size} viewBox="0 0 640 640" fill={color} style={{...style, opacity}}
         xmlns="http://www.w3.org/2000/svg">
        <path
            d="M224 160C224 107 267 64 320 64C373 64 416 107 416 160L416 163.6C416 179.3 403.3 192 387.6 192L252.5 192C236.8 192 224.1 179.3 224.1 163.6L224.1 160zM569.6 172.8C580.2 186.9 577.3 207 563.2 217.6L465.4 290.9C470.7 299.8 474.7 309.6 477.2 320L576 320C593.7 320 608 334.3 608 352C608 369.7 593.7 384 576 384L480 384L480 416C480 418.6 479.9 421.3 479.8 423.9L563.2 486.4C577.3 497 580.2 517.1 569.6 531.2C559 545.3 538.9 548.2 524.8 537.6L461.7 490.3C438.5 534.5 395.2 566.5 344 574.2L344 344C344 330.7 333.3 320 320 320C306.7 320 296 330.7 296 344L296 574.2C244.8 566.5 201.5 534.5 178.3 490.3L115.2 537.6C101.1 548.2 81 545.3 70.4 531.2C59.8 517.1 62.7 497 76.8 486.4L160.2 423.9C160.1 421.3 160 418.7 160 416L160 384L64 384C46.3 384 32 369.7 32 352C32 334.3 46.3 320 64 320L162.8 320C165.3 309.6 169.3 299.8 174.6 290.9L76.8 217.6C62.7 207 59.8 186.9 70.4 172.8C81 158.7 101.1 155.8 115.2 166.4L224 248C236.3 242.9 249.8 240 264 240L376 240C390.2 240 403.7 242.8 416 248L524.8 166.4C538.9 155.8 559 158.7 569.6 172.8z"/>
    </svg>
);

export const GridIcon: React.FC<IconProps> = ({color = defaultColor, size = 24, style, opacity}) => (
    <svg width={size} height={size} viewBox="0 0 640 640" fill={color} style={{...style, opacity}}
         xmlns="http://www.w3.org/2000/svg">
        <path
            d="M160 96C124.7 96 96 124.7 96 160v320c0 35.3 28.7 64 64 64h320c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H160zm0 32h320c17.7 0 32 14.3 32 32v320c0 17.7-14.3 32-32 32H160c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32z"/>
        <rect x="240" y="128" width="8" height="384"/>
        <rect x="316" y="128" width="8" height="384"/>
        <rect x="392" y="128" width="8" height="384"/>
        <rect x="128" y="240" width="384" height="8"/>
        <rect x="128" y="316" width="384" height="8"/>
        <rect x="128" y="392" width="384" height="8"/>
    </svg>
);

export const SettingIcon: React.FC<IconProps> = ({color = defaultColor, size = 24, style, opacity}) => (
    <svg width={size} height={size} viewBox="0 0 640 640" fill={color} style={{...style, opacity}}
         xmlns="http://www.w3.org/2000/svg">
        <path
            d="M415.9 274.5C428.1 271.2 440.9 277 446.4 288.3L465 325.9C475.3 327.3 485.4 330.1 494.9 334L529.9 310.7C540.4 303.7 554.3 305.1 563.2 314L582.4 333.2C591.3 342.1 592.7 356.1 585.7 366.5L562.4 401.4C564.3 406.1 566 411 567.4 416.1C568.8 421.2 569.7 426.2 570.4 431.3L608.1 449.9C619.4 455.5 625.2 468.3 621.9 480.4L614.9 506.6C611.6 518.7 600.3 526.9 587.7 526.1L545.7 523.4C539.4 531.5 532.1 539 523.8 545.4L526.5 587.3C527.3 599.9 519.1 611.3 507 614.5L480.8 621.5C468.6 624.8 455.9 619 450.3 607.7L431.7 570.1C421.4 568.7 411.3 565.9 401.8 562L366.8 585.3C356.3 592.3 342.4 590.9 333.5 582L314.3 562.8C305.4 553.9 304 540 311 529.5L334.3 494.5C332.4 489.8 330.7 484.9 329.3 479.8C327.9 474.7 327 469.6 326.3 464.6L288.6 446C277.3 440.4 271.6 427.6 274.8 415.5L281.8 389.3C285.1 377.2 296.4 369 309 369.8L350.9 372.5C357.2 364.4 364.5 356.9 372.8 350.5L370.1 308.7C369.3 296.1 377.5 284.7 389.6 281.5L415.8 274.5zM448.4 404C424.1 404 404.4 423.7 404.5 448.1C404.5 472.4 424.2 492 448.5 492C472.8 492 492.5 472.3 492.5 448C492.4 423.6 472.7 404 448.4 404zM224.9 18.5L251.1 25.5C263.2 28.8 271.4 40.2 270.6 52.7L267.9 94.5C276.2 100.9 283.5 108.3 289.8 116.5L331.8 113.8C344.3 113 355.7 121.2 359 133.3L366 159.5C369.2 171.6 363.5 184.4 352.2 190L314.5 208.6C313.8 213.7 312.8 218.8 311.5 223.8C310.2 228.8 308.4 233.8 306.5 238.5L329.8 273.5C336.8 284 335.4 297.9 326.5 306.8L307.3 326C298.4 334.9 284.5 336.3 274 329.3L239 306C229.5 309.9 219.4 312.7 209.1 314.1L190.5 351.7C184.9 363 172.1 368.7 160 365.5L133.8 358.5C121.6 355.2 113.5 343.8 114.3 331.3L117 289.4C108.7 283 101.4 275.6 95.1 267.4L53.1 270.1C40.6 270.9 29.2 262.7 25.9 250.6L18.9 224.4C15.7 212.3 21.4 199.5 32.7 193.9L70.4 175.3C71.1 170.2 72.1 165.2 73.4 160.1C74.8 155 76.4 150.1 78.4 145.4L55.1 110.5C48.1 100 49.5 86.1 58.4 77.2L77.6 58C86.5 49.1 100.4 47.7 110.9 54.7L145.9 78C155.4 74.1 165.5 71.3 175.8 69.9L194.4 32.3C200 21 212.7 15.3 224.9 18.5zM192.4 148C168.1 148 148.4 167.7 148.4 192C148.4 216.3 168.1 236 192.4 236C216.7 236 236.4 216.3 236.4 192C236.4 167.7 216.7 148 192.4 148z"/>
    </svg>
);

export const HomeIcon: React.FC<IconProps> = ({color = '#fff', size = 24, style, opacity}) => (
    <svg width={size} height={size} viewBox="0 0 640 640" fill={color} style={{...style, opacity}}
         xmlns="http://www.w3.org/2000/svg">
        <path
            d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/>
    </svg>
);

export const OutLinkIcon: React.FC<IconProps> = ({color = '#fff', size = 24, style, opacity}) => (
    <svg width={size} height={size} viewBox="0 0 640 640" fill={color} style={{...style, opacity}}
         xmlns="http://www.w3.org/2000/svg">
        <path
            d="M354.4 83.8C359.4 71.8 371.1 64 384 64L544 64C561.7 64 576 78.3 576 96L576 256C576 268.9 568.2 280.6 556.2 285.6C544.2 290.6 530.5 287.8 521.3 278.7L464 221.3L310.6 374.6C298.1 387.1 277.8 387.1 265.3 374.6C252.8 362.1 252.8 341.8 265.3 329.3L418.7 176L361.4 118.6C352.2 109.4 349.5 95.7 354.5 83.7zM64 240C64 195.8 99.8 160 144 160L224 160C241.7 160 256 174.3 256 192C256 209.7 241.7 224 224 224L144 224C135.2 224 128 231.2 128 240L128 496C128 504.8 135.2 512 144 512L400 512C408.8 512 416 504.8 416 496L416 416C416 398.3 430.3 384 448 384C465.7 384 480 398.3 480 416L480 496C480 540.2 444.2 576 400 576L144 576C99.8 576 64 540.2 64 496L64 240z"/>
    </svg>
);

export const ToneMappingIcon: React.FC<IconProps> = ({color = '#fff', size = 20, style, opacity}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" style={{...style, opacity}} xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2v20"/>
        <path d="M12 12h5" opacity="0.6"/>
        <path d="M12 7h5" opacity="0.6"/>
        <path d="M12 17h5" opacity="0.6"/>
    </svg>
);

export const ChevronLeft: React.FC<IconProps & { strokeWidth?: number }> = ({
                                                                                color = '#fdb48d',
                                                                                size = 14,
                                                                                style,
                                                                                opacity,
                                                                                strokeWidth = 3
                                                                            }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}
         strokeLinecap="round" strokeLinejoin="round" style={{...style, opacity}}>
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

export const ChevronRight: React.FC<IconProps & { strokeWidth?: number }> = ({
                                                                                 color = '#fdb48d',
                                                                                 size = 14,
                                                                                 style,
                                                                                 opacity,
                                                                                 strokeWidth = 3
                                                                             }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth}
         strokeLinecap="round" strokeLinejoin="round" style={{...style, opacity}}>
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);
