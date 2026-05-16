import React, {useState} from 'react';
import {ExampleItem} from '../../types/example';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleGridCard} from './exampleCard/ExampleGridCard';
import {ExampleListCard} from './exampleCard/ExampleListCard';

interface ExampleCardProps {
    item: ExampleItem;
    lcpCounter?: React.MutableRefObject<number>;
}

const ExampleCard: React.FC<ExampleCardProps> = ({item, lcpCounter}) => {
    const language = useExamplesStore(state => state.language);
    const viewMode = useExamplesStore(state => state.viewMode);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        if (item.path) {
            window.location.href = `/RedGPU/examples/${item.path}/index.html`;
        }
    };

    let isLCP = false;
    // [KO] SEO/Web Vitals: 초기 화면에 렌더링되는 상위 8개 아이템을 LCP 후보로 지정
    // [EN] SEO/Web Vitals: Designate the top 8 items rendered in the initial viewport as LCP candidates
    if (lcpCounter && lcpCounter.current < 8) {
        isLCP = true;
        lcpCounter.current += 1;
    }

    const commonProps = {
        item,
        language,
        hovered,
        isNarrow,
        isLCP,
        onClick: handleClick,
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
    };

    return viewMode === 'list' 
        ? <ExampleListCard {...commonProps} /> 
        : <ExampleGridCard {...commonProps} />;
};

export default ExampleCard;

