import React from 'react';

import { useSelector } from 'react-redux';

import './index.css';

const Component = () => {
    const ui = useSelector(state => state.ui);

    return (
        <div className='searchNull'>
            {ui.lang === 'en_US'
                ? 'Please input your search keyword :)'
                : '키워드를 입력하여 주십시오 :)'}
        </div>
    );
};

export default Component;
