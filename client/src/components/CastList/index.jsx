import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import Cast from '../Cast';

import { apiMovieDetail } from '../../data';

import './index.css';

const Component = ({ id }) => {
    const [castList, setCastList] = useState([]);
    const [isDoneSearch, setIsDoneSearch] = useState(false);

    const ui = useSelector(state => state.ui);

    useEffect(() => {
        let isCancelled = false;

        apiMovieDetail(id, ui.lang, res => {
            if (!isCancelled) {
                setCastList(res.cast);
                setIsDoneSearch(true);
            }
        });
        return () => {
            isCancelled = true;
        };
    }, [id, ui.lang, setIsDoneSearch]);

    return (
        <div className='castList'>
            {castList.length !== 0
                ? castList.map((cast, index) => <Cast cast={cast} key={index} />)
                : null}
            {castList.length === 0 && isDoneSearch
                ? ui.lang === 'en_US'
                    ? 'We cannot find out any casting information :('
                    : '출연진 정보를 찾을 수 없습니다 :('
                : null}
            {castList.length === 0 && !isDoneSearch
                ? ui.lang === 'en_US'
                    ? 'We are looking for casting information!'
                    : '출연진 정보를 검색 중입니다!'
                : null}
        </div>
    );
};

export default Component;
