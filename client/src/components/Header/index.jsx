import React from 'react';

import { useSelector } from 'react-redux';

import CI from '../CI';
import SearchBar from '../SearchBar';
import SignoutIcon from '../SignoutIcon';
import UserIcon from '../UserIcon';
import LangIcon from '../LangIcon';

import './index.css';

const Component = () => {
    const auth = useSelector(state => state.auth);

    return (
        <div className='header'>
            <div className='header-ci-section'>
                <CI />
            </div>
            <div className='header-search-section'>
                <SearchBar />
            </div>
            <div className='header-util-section'>
                {auth.token !== '' ? <SignoutIcon /> : null}
                <UserIcon />
                <LangIcon />
            </div>
        </div>
    );
};

export default Component;
