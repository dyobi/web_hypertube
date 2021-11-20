import React from 'react';

import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import './index.css';

const Component = ({ url, titleEN, titleKR, genre, filter }) => {
    const ui = useSelector(state => state.ui);

    return (
        <Link
            to={`/feed/${url}/${
                filter === 'trend_day' ||
                filter === 'trend_week' ||
                filter === 'now_playing' ||
                filter === 'upcoming'
                    ? 'popularity'
                    : filter
            }`}
        >
            <button
                className={
                    filter !== 'trend_day' &&
                    filter !== 'trend_week' &&
                    filter !== 'now_playing' &&
                    filter !== 'upcoming' &&
                    genre === url
                        ? 'genreButton-active'
                        : 'genreButton'
                }
            >
                {ui.lang === 'en_US' ? titleEN : titleKR}
            </button>
        </Link>
    );
};

export default Component;
