import React from 'react';

import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import GenreInfo from '../GenreInfo';

import StarIcon from 'react-star-rating-component';

import image_default from '../../assets/images/image_default.png';

import './index.css';

const Component = ({ movieData }) => {
    const movie = useSelector(state => state.movie);
    const ui = useSelector(state => state.ui);

    const thisMovie = movie.histories.find(history => history.movieId === movieData.id);

    const starColor = '#FFEA00';
    const emptyStarColor = '#505050';

    return (
        <Link to={`/detail/${movieData.id}`}>
            <div className='movie'>
                <div
                    className='movie-poster'
                    style={{
                        backgroundImage:
                            movieData.poster_path !== null
                                ? `url('https://image.tmdb.org/t/p/w500/${movieData.poster_path}')`
                                : `url('${image_default}')`
                    }}
                >
                    <div className='movie-progress-bar'>
                        <div
                            className='movie-progress'
                            style={{
                                width:
                                    thisMovie !== undefined
                                        ? (thisMovie.current / thisMovie.duration) * 100 + '%'
                                        : 0
                            }}
                        ></div>
                    </div>
                </div>
                <div className='movie-info'>
                    <div className='movie-genre'>
                        <GenreInfo genre_ids={movieData.genre_ids} />
                    </div>
                    <div className='movie-title'>{movieData.title}</div>
                    <div className='movie-rate'>
                        <StarIcon
                            name='rating'
                            value={movieData.vote_average / 2.0}
                            starColor={starColor}
                            emptyStarColor={emptyStarColor}
                            editing={false}
                        />
                    </div>
                    <div className='movie-release'>{movieData.release_date}</div>
                    <div className='movie-overview'>
                        {movieData.overview === ''
                            ? ui.lang === 'en_US'
                                ? 'There is no overview about this movie.'
                                : '이 영화의 개요 정보를 찾을 수 없습니다.'
                            : movieData.overview}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Component;
