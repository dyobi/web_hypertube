import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import SimilarMovie from '../SimilarMovie';

import { apiSimilarMovies } from '../../data';

import './index.css';

const Component = ({ id, setIsOpenDetail }) => {
    const [similarList, setSimilarList] = useState([]);
    const [isDoneSearch, setIsDoneSearch] = useState(false);

    const ui = useSelector(state => state.ui);

    useEffect(() => {
        let isCancelled = false;

        apiSimilarMovies(id, ui.lang, res => {
            if (!isCancelled) {
                setSimilarList(res);
                setIsDoneSearch(true);
            }
        });
        return () => {
            isCancelled = true;
        };
    }, [id, ui.lang, setIsDoneSearch]);

    return (
        <div className='similarList'>
            {similarList.length !== 0
                ? similarList.map((movie, index) => (
                      <SimilarMovie movie={movie} setIsOpenDetail={setIsOpenDetail} key={index} />
                  ))
                : null}
            {similarList.length === 0 && isDoneSearch
                ? ui.lang === 'en_US'
                    ? 'We cannot find out any similar movies :('
                    : '비슷한 컨텐츠 정보를 찾을 수 없습니다 :('
                : null}
            {similarList.length === 0 && !isDoneSearch
                ? ui.lang === 'en_US'
                    ? 'We are looking for similar movies!'
                    : '비슷한 컨텐츠 정보를 검색 중입니다!'
                : null}
        </div>
    );
};

export default Component;
