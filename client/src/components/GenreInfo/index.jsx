import React from 'react';

import { useSelector } from 'react-redux';

import './index.css';

const Component = ({ genre_ids }) => {
    const movie = useSelector(state => state.movie);
    const ui = useSelector(state => state.ui);

    return genre_ids.length === 0 ? (
        <div className='genre'>{ui.lang === 'en_US' ? 'No Data' : '정보없음'}</div>
    ) : (
        genre_ids.map((genre_id, index) => (
            <div className='genre' key={index}>
                {movie.genres.find(genre => genre.id === genre_id) === undefined
                    ? 'NULL'
                    : movie.genres.find(genre => genre.id === genre_id).name}
            </div>
        ))
    );
};

export default Component;
