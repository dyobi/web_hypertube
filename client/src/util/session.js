import { auth_token } from '../actions';

import cookie from 'react-cookies';

import { alert } from './alert';

export const session = (dispatch, res) => {
    if (res.status === 401) {
        cookie.save('token', '', {
            path: '/'
        });
        dispatch(auth_token(''));
        alert(
            'message',
            'Token is invalid. Please sign in again :)',
            () => window.open('/auth/signin', '_self'),
            null
        );
        return false;
    } else {
        if (res.status === 200) {
            return true;
        } else {
            return false;
        }
    }
};
