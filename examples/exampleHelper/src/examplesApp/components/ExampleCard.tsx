import React, {useState} from 'react';
import {ExampleItem} from '../../types/example';
import {useExamplesStore} from '../store/useExamplesStore';
import {ExampleGridCard} from './exampleCard/ExampleGridCard';
import {ExampleListCard} from './exampleCard/ExampleListCard';

interface ExampleCardProps {
    item: ExampleItem;
}

const ExampleCard: React.FC<ExampleCardProps> = ({item}) => {
    const language = useExamplesStore(state => state.language);
    const viewMode = useExamplesStore(state => state.viewMode);
    const isNarrow = useExamplesStore(state => state.isNarrow);
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        if (item.path) {
            window.location.href = `/RedGPU/examples/${item.path}/index.html`;
        }
    };

    const commonProps = {
        item,
        language,
        hovered,
        isNarrow,
        onClick: handleClick,
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
    };

    return viewMode === 'list' 
        ? <ExampleListCard {...commonProps} /> 
        : <ExampleGridCard {...commonProps} />;
};

export default ExampleCard;

