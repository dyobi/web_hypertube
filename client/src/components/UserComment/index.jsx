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
            <div className='userComment'>
                <div className='userComment-movie'>
                    To {movie.title}{' '}
                    {movie.release_date !== null && movie.release_date !== undefined
                        ? `(${movie.release_date.substring(0, 4)})`
                        : null}
                </div>
                <div className='userComment-comment'>{data.content}</div>
                <div className='userComment-time'>{data.time}</div>
            </div>
        </Link>
    );
};

export default Component;
