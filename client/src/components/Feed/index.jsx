import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { apiMovies } from '../../data';

import Movie from '../Movie';
import FilterIcon from '../FilterIcon';
import Filter from '../Filter';

import FeatherIcon from 'feather-icons-react';

import './index.css';

const Component = ({ match }) => {
    const genre = match.params.genre;
    const filter = match.params.filter;

    const [page, setPage] = useState(1);
    const [movies, setMovies] = useState([]);
    const [isDoneSearch, setIsDoneSearch] = useState(false);
    const [isOpenFilter, setIsOpenFilter] = useState(false);

    const ui = useSelector(state => state.ui);

    useEffect(() => {
        let isCancelled = false;

        apiMovies(genre, filter, 1, ui.lang, res => {
            if (!isCancelled) {
                if (res !== null) {
                    setMovies(res);
                    setPage(page => page + 1);
                    setIsDoneSearch(true);
                }
            }
        });
        return () => {
            isCancelled = true;
        };
    }, [genre, filter, ui.lang]);

    let isWorking = false;

    const _handleScroll = e => {
        if (
            !isWorking &&
            e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight) > 0.9
        ) {
            isWorking = true;
            apiMovies(genre, filter, page, ui.lang, res => {
                if (res !== null) {
                    setMovies([...movies, ...res]);
                    setPage(page => page + 1);
                }
                isWorking = false;
            });
        }
        if (e.target.scrollTop > 100) {
            document.querySelector('.feed-toTop').style.opacity = 1;
        } else {
            document.querySelector('.feed-toTop').style.opacity = 0;
        }
    };

    const _handleScrollTop = () => {
        const feed = document.querySelector('.feed-container');

        if (feed !== null) {
            feed.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
    };

    const _handleFilter = () => {
        setIsOpenFilter(isOpenFilter => !isOpenFilter);
    };

    document.title = 'HyperTube';

    return (
        <div className='feed' onScroll={_handleScroll}>
            <div className='feed-container'>
                <FilterIcon genre={genre} filter={filter} _handleFilter={_handleFilter} />
                {isDoneSearch ? (
                    movies.map((movie, index) => <Movie movieData={movie} key={index} />)
                ) : (
                    <div className='feed-loading'>
                        {ui.lang === 'en_US' ? 'Loading...' : '로딩중...'}
                    </div>
                )}
            </div>
            {isOpenFilter ? (
                <Filter genre={genre} filter={filter} _handleFilter={_handleFilter} />
            ) : null}
            <div className='feed-toTop' onClick={_handleScrollTop}>
                <FeatherIcon className='feed-toTop-icon' icon='arrow-up' />
            </div>
        </div>
    );
};

export default Component;
