import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import SimilarMovie from '../SimilarMovie';

import { apiRecommendationMovies } from '../../data';

import './index.css';

const Component = ({ id, setIsOpenDetail }) => {
    const [recommendationList, setRecommendationList] = useState([]);
    const [isDoneSearch, setIsDoneSearch] = useState(false);

    const ui = useSelector(state => state.ui);

    useEffect(() => {
        let isCancelled = false;

        apiRecommendationMovies(id, ui.lang, res => {
            if (!isCancelled) {
                setRecommendationList(res);
                setIsDoneSearch(true);
            }
        });
        return () => {
            isCancelled = true;
        };
    }, [id, ui.lang, setIsDoneSearch]);

    return (
        <div className='recommendationList'>
            {recommendationList.length !== 0
                ? recommendationList.map((movie, index) => (
                      <SimilarMovie movie={movie} setIsOpenDetail={setIsOpenDetail} key={index} />
                  ))
                : null}
            {recommendationList.length === 0 && isDoneSearch
                ? ui.lang === 'en_US'
                    ? 'We cannot find out any recommedation :('
                    : '추천 컨텐츠 정보를 찾을 수 없습니다 :('
                : null}
            {recommendationList.length === 0 && !isDoneSearch
                ? ui.lang === 'en_US'
                    ? 'We are looking for recommedation!'
                    : '추천 컨텐츠 정보를 검색 중입니다!'
                : null}
        </div>
    );
};

export default Component;
