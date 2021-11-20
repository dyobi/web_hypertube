import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import { apiMovie } from '../../data';

import './index.css';

const Component = ({ data }) => {
    const [movie, setMovie] = useState({});

    const ui = useSelector(state => state.ui);

    useEffect(() => {
        let isCancelled = false;

        apiMovie(data.movieId, ui.lang, res => {
            if (!isCancelled) {
                setMovie(res);
            }
        });

        return () => {
            isCancelled = true;
        };
    }, [data.movieId, ui.lang]);

    return (
        <Link to={`/detail/${movie.id}`}>
            <div className='userRecentWatchingMovie'>
                <div
                    className='userRecentWatchingMovie-picture'
                    style={{
                        backgroundImage:
                            movie.poster_path !== '' &&
                            movie.poster_path !== null &&
                            movie.poster_path !== undefined
                                ? `url('https://image.tmdb.org/t/p/original/${movie.poster_path}')`
                                : ''
                    }}
                ></div>
                <div className='userRecentWatchingMovie-title'>{movie.title}</div>
                <div className='userRecentWatchingMovie-time'>{data.time}</div>
            </div>
        </Link>
    );
};

export default Component;
