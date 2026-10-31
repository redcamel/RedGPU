import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import Logo from './header/Logo';
import SearchInput from './header/SearchInput';
import HeaderActions from './header/HeaderActions';

const Header: React.FC = () => {
    const isNarrow = useExamplesStore(state => state.isNarrow);

    return (
        <header style={{
            ...headerStyle,
            margin: isNarrow ? '10px 10px 0 10px' : '14px 20px 0 20px',
            height: isNarrow ? '40px' : '46px',
        }}>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '46px',
    backgroundColor: 'transparent',
    padding: 0,
    zIndex: 100,
    flexShrink: 0,
};

const centerSectionStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '560px',
    padding: '0 16px',
};

export default Header;
