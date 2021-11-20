import React from 'react';
import { useSelector } from 'react-redux'; 

import './index.css';

const Component = ({ index, nav, setNav }) => {
    const ui = useSelector(state => state.ui);

    return (
        <div
            className={nav === index ? 'userMenu-active' : 'userMenu'}
            onClick={() => setNav(index)}
        >
            {index === 0 ? ui.lang === 'en_US' ? 'Recent Watching' : '최근 본 영화' : null}
            {index === 1 ? ui.lang === 'en_US' ? 'Comments' : '작성 댓글' : null}
            {index === 2 ? ui.lang === 'en_US' ? 'Settings' : '설정' : null}
        </div>
    );
};

export default Component;
