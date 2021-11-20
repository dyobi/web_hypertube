import React from 'react';

import { Link } from 'react-router-dom';

import image_default from '../../assets/images/image_default.png';

import './index.css';

const Component = ({ cast }) => {
    return (
        <Link to={`/search/cast/${cast.id}/${cast.name}/`}>
            <div className='cast'>
                <div
                    className='cast-picture'
                    style={{
                        backgroundImage:
                            cast.profile_path !== '' &&
                            cast.profile_path !== null &&
                            cast.profile_path !== undefined
                                ? `url('https://image.tmdb.org/t/p/original/${cast.profile_path}')`
                                : `url('${image_default}')`
                    }}
                ></div>
                <div className='cast-info'>
                    <div className='cast-info-name'>{cast.name}</div>
                    <div className='cast-info-role'>{cast.character}</div>
                </div>
            </div>
        </Link>
    );
};

export default Component;
