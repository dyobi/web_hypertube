import React from 'react';

import { Link } from 'react-router-dom';

import image_default from '../../assets/images/image_default.png';

import './index.css';

const Component = ({ movie, setIsOpenDetail }) => {
    const handleIsOpenDetail = () => {
        setIsOpenDetail(false);
    };

    return (
        <Link to={`/detail/${movie.id}`} onClick={handleIsOpenDetail}>
            <div className='similarMovie'>
                <div
                    className='similarMovie-poster'
                    style={{
                        backgroundImage:
                            movie.poster_path !== null
                                ? `url('https://image.tmdb.org/t/p/w500/${movie.poster_path}')`
                                : `url('${image_default}')`
                    }}
                ></div>
                <div className='similarMovie-title'>{movie.title}</div>
            </div>
        </Link>
    );
};

export default Component;
