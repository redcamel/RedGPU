import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import Logo from './header/Logo';
import SearchInput from './header/SearchInput';
import HeaderActions from './header/HeaderActions';

const Header: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <header style={{...headerStyle, padding: isNarrow ? '0 10px' : '0 20px'}}>
            <Logo />

            <div style={centerSectionStyle}>
                <SearchInput />
            </div>

            <HeaderActions />
        </header>
    );
};

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    height: '60px',
    backgroundColor: '#111112',
    borderBottom: '1px solid #333',
    padding: '0 20px',
    zIndex: 100,
};

const centerSectionStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '600px',
    padding: '0 20px',
};

export default Header;