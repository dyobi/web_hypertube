import React from 'react';

import { Link } from 'react-router-dom';

import image_default from '../../assets/images/image_default.png';

import './index.css';

const Component = ({ crew }) => {
    return (
        <Link to={`/search/crew/${crew.id}/${crew.name}/`}>
            <div className='crew'>
                <div
                    className='crew-picture'
                    style={{
                        backgroundImage:
                            crew.profile_path !== '' &&
                            crew.profile_path !== null &&
                            crew.profile_path !== undefined
                                ? `url('https://image.tmdb.org/t/p/original/${crew.profile_path}')`
                                : `url('${image_default}')`
                    }}
                ></div>
                <div className='crew-info'>
                    <div className='crew-info-name'>{crew.name}</div>
                    <div className='crew-info-role'>{crew.job}</div>
                </div>
            </div>
        </Link>
    );
};

export default Component;
