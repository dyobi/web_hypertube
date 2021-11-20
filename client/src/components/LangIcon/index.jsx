import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { ui_lang } from '../../actions';

import cookie from 'react-cookies';

import en_US from '../../assets/icons/en_US.png';
import ko_KR from '../../assets/icons/ko_KR.png';

import './index.css';

const Component = () => {
    const ui = useSelector(state => state.ui);
    const dispatch = useDispatch();

    const _handleLang = () => {
        const feed = document.querySelector('.feed-container');

        if (feed !== null) {
            feed.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }

        const search = document.querySelector('.search');

        if (search !== null) {
            search.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }

        cookie.save('lang', ui.lang === 'en_US' ? 'ko_KR' : 'en_US', {
            path: '/'
        });
        dispatch(ui_lang(ui.lang === 'en_US' ? 'ko_KR' : 'en_US'));
    };

    return (
        <div className='langIcon' onClick={_handleLang}>
            <div
                className='langIcon-image'
                style={{
                    backgroundImage: `url('${ui.lang === 'en_US' ? en_US : ko_KR}')`
                }}
            ></div>
        </div>
    );
};

export default Component;
