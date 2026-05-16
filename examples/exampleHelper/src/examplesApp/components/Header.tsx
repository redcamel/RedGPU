import React from 'react';
import {useExamplesStore} from '../store/useExamplesStore';
import {HomeIcon, OutLinkIcon} from '../../common/components/Icons';
import IconButton from '../../common/components/basic/IconButton';

const Header: React.FC = () => {
    const searchQuery = useExamplesStore(state => state.searchQuery);
    const setSearchQuery = useExamplesStore(state => state.setSearchQuery);
    const isNarrow = useExamplesStore(state => state.isNarrow);

    const openLink = (url: string) => window.open(url, '_blank');

    return (
        <header style={{...headerStyle, padding: isNarrow ? '0 10px' : '0 20px'}}>
            <div style={leftSection}>
                <div style={{
                    ...logoContainer, 
                    flexDirection: isNarrow ? 'column' : 'row',
                    alignItems: isNarrow ? 'flex-start' : 'center',
                    gap: isNarrow ? '0' : '12px'
                }}>
                    <span style={{...titleStyle, fontSize: isNarrow ? '14px' : '18px', lineHeight: '1.2'}}>
                        RedGPU
                    </span>
                    <span style={{
                        ...subTitle, 
                        fontSize: isNarrow ? '9px' : '18px', 
                        marginTop: isNarrow ? '-2px' : '0',
                        opacity: isNarrow ? 0.7 : 1
                    }}>
                        Examples
                    </span>
                </div>
            </div>

            <div style={{...centerSection, padding: isNarrow ? '0 10px' : '0 20px'}}>
                <div style={searchContainer}>
                    <input
                        type="text"
                        placeholder={isNarrow ? "Search..." : "Search examples..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{...searchInputStyle, height: isNarrow ? '32px' : '36px'}}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} style={clearButtonStyle}>×</button>
                    )}
                </div>
            </div>

            <div style={rightSection}>
                <IconButton
                    icon={<OutLinkIcon color="#fff" size={isNarrow ? 14 : 18} />}
                    label="GITHUB"
                    onClick={() => openLink('https://github.com/redcamel/RedGPU')}
                    title="GitHub Repository"
                />
                {!isNarrow && (
                    <button style={manualButtonStyle} onClick={() => openLink('/RedGPU/manual/')}>
                        MANUAL
                    </button>
                )}
            </div>
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

const leftSection: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
};

const logoContainer: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
};

const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '0.02em',
    color: '#fff',
};

const subTitle: React.CSSProperties = {
    color: '#fdb48d',
    fontWeight: 'normal',
};

const centerSection: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '600px',
    padding: '0 20px',
};

const searchContainer: React.CSSProperties = {
    position: 'relative',
    width: '100%',
};

const searchInputStyle: React.CSSProperties = {
    width: '100%',
    height: '36px',
    backgroundColor: '#1e1e1f',
    border: '1px solid #333',
    borderRadius: '18px',
    padding: '0 40px 0 16px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
};

const clearButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '18px',
    cursor: 'pointer',
};

const rightSection: React.CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: '1px',
};

const manualButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ccc',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '0 15px',
    transition: 'color 0.2s',
};

export default Header;
