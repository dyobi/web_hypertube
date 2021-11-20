import React from 'react';

import { useDispatch } from 'react-redux';
import { auth_token, user_data } from '../../actions';

import cookie from 'react-cookies';

import SignoutIcon from '../../assets/icons/SignoutIcon.png';
import './index.css';

const Component = () => {
    const dispatch = useDispatch();

    const _handleSignOut = () => {
        cookie.save('token', '', {
            path: '/'
        });
        dispatch(auth_token(''));
        dispatch(
            user_data({
                id: -1,
                userName: '',
                email: '',
                firstName: '',
                lastName: '',
                picture: '',
                socialType: ''
            })
        );
        window.open('/', '_self');
    };

    return (
        <div
            className='signoutIcon'
            onClick={_handleSignOut}
            style={{ backgroundImage: `url('${SignoutIcon}')` }}
        ></div>
    );
};

export default Component;
