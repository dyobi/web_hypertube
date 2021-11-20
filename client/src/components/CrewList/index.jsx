import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import Crew from '../Crew';

import { apiMovieDetail } from '../../data';

import './index.css';

const Component = ({ id }) => {
    const [crewList, setCrewList] = useState([]);
    const [isDoneSearch, setIsDoneSearch] = useState(false);

    const ui = useSelector(state => state.ui);

    useEffect(() => {
        let isCancelled = false;

        apiMovieDetail(id, ui.lang, res => {
            if (!isCancelled) {
                setCrewList(res.crew);
                setIsDoneSearch(true);
            }
        });
        return () => {
            isCancelled = true;
        };
    }, [id, ui.lang, setIsDoneSearch]);

    return (
        <div className='crewList'>
            {crewList.length !== 0
                ? crewList.map((crew, index) => <Crew crew={crew} key={index} />)
                : null}
            {crewList.length === 0 && isDoneSearch
                ? ui.lang === 'en_US'
                    ? 'We cannot find out any producer information :('
                    : '제작진 정보를 찾을 수 없습니다 :('
                : null}
            {crewList.length === 0 && !isDoneSearch
                ? ui.lang === 'en_US'
                    ? 'We are looking for producer information!'
                    : '제작진 정보를 검색 중입니다!'
                : null}
        </div>
    );
};

export default Component;
