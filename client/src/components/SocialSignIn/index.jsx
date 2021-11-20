import React from 'react';

import { GOOGLE_ID, FACEBOOK_ID, SV_ID } from '../../constants/api';
import { APP_REDIRECT_URL } from '../../constants/url';

import './index.css';

const Component = () => {
    const _handleGoogleSignin = () => {
        window.open(
            `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_ID}&scope=openid%20email%20profile&redirect_uri=${APP_REDIRECT_URL}/google&response_type=code`,
            '_self'
        );
    };

    const _handleFacebookSignin = () => {
        window.open(
            `https://www.facebook.com/v6.0/dialog/oauth?client_id=${FACEBOOK_ID}&redirect_uri=${APP_REDIRECT_URL}/facebook`,
            '_self'
        );
    };

    const _handle42Signin = () => {
        window.open(
            `https://api.intra.42.fr/oauth/authorize?client_id=${SV_ID}&scope=public&redirect_uri=${APP_REDIRECT_URL}/42&response_type=code`,
            '_self'
        );
    };

    return (
        <div className='socialSignIn'>
            <div className='socialSignIn-button google' onClick={_handleGoogleSignin}>
                Google
            </div>
            <div className='socialSignIn-button facebook' onClick={_handleFacebookSignin}>
                Facebook
            </div>
            <div className='socialSignIn-button siliconvalley' onClick={_handle42Signin}>
                42SV
            </div>
        </div>
    );
};

export default Component;
