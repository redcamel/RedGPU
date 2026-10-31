import React, {useState} from 'react';
import {ExampleItem} from '../../types/example';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleGridCard} from './exampleCard/ExampleGridCard';
import {ExampleListCard} from './exampleCard/ExampleListCard';

interface ExampleCardProps {
    item: ExampleItem;
    lcpCounter?: React.MutableRefObject<number>;
}

export interface CardProps {
    item: ExampleItem;
    hovered: boolean;
    isNarrow: boolean;
    isLCP: boolean;
    thumbUrl: string;
    description: string;
    plainDescription: string;
    imageAlt: string;
    imageTitle: string;
    href: string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const ExampleCard: React.FC<ExampleCardProps> = ({item, lcpCounter}) => {
    const language = useExamplesStore(state => state.language);
    const viewMode = useExamplesStore(state => state.viewMode);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const [hovered, setHovered] = useState(false);

    let isLCP = false;
    // [KO] SEO/Web Vitals: 초기 화면에 렌더링되는 상위 8개 아이템을 LCP 후보로 지정
    // [EN] SEO/Web Vitals: Designate the top 8 items rendered in the initial viewport as LCP candidates
    if (lcpCounter && lcpCounter.current < 8) {
        isLCP = true;
        lcpCounter.current += 1;
    }

    const thumbUrl = item.path ? `/RedGPU/examples/${item.path}/thumb.webp` : '';
    const description = item.description ? (item.description[language] || item.description['en']) : '';
    const plainDescription = description.replace(/<[^>]*>?/gm, '').trim();
    const altSuffix = language === 'ko' ? 'RedGPU WebGPU 예제' : 'RedGPU WebGPU Example';
    const imageAlt = `${item.name} - ${altSuffix}`;
    const imageTitle = plainDescription || item.name;
    const href = item.path ? `/RedGPU/examples/${item.path}/index.html` : '#';

    const commonProps: CardProps = {
        item,
        hovered,
        isNarrow,
        isLCP,
        thumbUrl,
        description,
        plainDescription,
        imageAlt,
        imageTitle,
        href,
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
    };

    return viewMode === 'list' 
        ? <ExampleListCard {...commonProps} /> 
        : <ExampleGridCard {...commonProps} />;
};

export default ExampleCard;
