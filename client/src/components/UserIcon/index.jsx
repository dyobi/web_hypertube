import React from 'react';

import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import user_default from '../../assets/images/user_default.png';

import './index.css';

const Component = () => {
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);

    return (
        <Link
            to={auth.token && user.id !== -1 ? `/user/${user.userName}` : '/auth/signin'}
            className='userIcon'
        >
            <div
                className='userIcon-image'
                style={{
                    backgroundImage: `url('${
                        auth.token !== ''
                            ? user.picture !== null &&
                              user.picture !== undefined &&
                              user.picture !== ''
                                ? user.picture.match('SERVER/')
                                    ? `/api/user/picture/${user.picture.replace('SERVER/', '')}`
                                    : user.picture
                                : user_default
                            : user_default
                    }')`
                }}
            ></div>
        </Link>
    );
};

export default Component;
