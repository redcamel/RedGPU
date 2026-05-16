import React, {useEffect} from 'react';
import {useExamplesStore} from './store/useExamplesStore';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from '../common/components/Footer';
import './styles/common.css';

const ExamplesApp: React.FC = () => {
    const restoreState = useExamplesStore(state => state.restoreState);

    useEffect(() => {
        restoreState();
    }, [restoreState]);

    return (
        <div className="examples-app">
            <Header />
            <CategoryNav />
            <div className="layout-wrapper">
                <Sidebar />
                <MainContent />
            </div>
            <Footer useSourceModal={false} />
        </div>
    );
};

export default ExamplesApp;
