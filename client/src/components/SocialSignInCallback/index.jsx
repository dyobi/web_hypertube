import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { auth_token } from '../../actions';

import cookie from 'react-cookies';

import queryString from 'query-string';

import {
    requestGoogleCode,
    requestGoogleProfile,
    requestFacebookCode,
    requestFacebookProfile,
    request42Code,
    request42Profile,
    oAuth
} from '../../data';

import { alert } from '../../util';
import './index.css';

const Component = ({ history, location, match }) => {
    const source = match.params.source;

    const ui = useSelector(state => state.ui);
    const dispatch = useDispatch();

    useEffect(() => {
        let isCancelled = false;

        if (location !== undefined && location.search !== undefined) {
            const { code } = queryString.parse(location.search);

            let codeFunc;

            if (source === 'google') codeFunc = requestGoogleCode;
            else if (source === 'facebook') codeFunc = requestFacebookCode;
            else if (source === '42') codeFunc = request42Code;

            codeFunc(code, res => {
                const token = res.token;

                if (!isCancelled) {
                    if (token !== null) {
                        let profileFunc;

                        if (source === 'google') profileFunc = requestGoogleProfile;
                        else if (source === 'facebook') profileFunc = requestFacebookProfile;
                        else if (source === '42') profileFunc = request42Profile;

                        profileFunc(token, res => {
                            if (!isCancelled) {
                                oAuth(res, res => {
                                    if (!isCancelled) {
                                        if (res.status === 200) {
                                            dispatch(auth_token(res.obj));
                                            alert(
                                                'question',
                                                ui.lang === 'en_US'
                                                    ? 'Do you want to keep your signin status?'
                                                    : '???????????? ?????????????????????????',
                                                () => _handleFinish(true, res.obj),
                                                () => _handleFinish(false, res.obj)
                                            );
                                        } else if (res.status === 411) {
                                            alert(
                                                'message',
                                                ui.lang === 'en_US'
                                                    ? 'This email address has signed up already :('
                                                    : '?????? ??????????????? ?????????????????? :(',
                                                () => history.goBack(),
                                                null
                                            );
                                        } else {
                                            alert(
                                                'message',
                                                ui.lang === 'en_US'
                                                    ? 'Something went wrong :('
                                                    : '??? ??? ?????? ????????? ?????????????????? :(',
                                                () => history.goBack(),
                                                null
                                            );
                                        }
                                    }
                                });
                            }
                        });
                    } else {
                        alert(
                            'message',
                            ui.lang === 'en_US'
                                ? 'This access is invalid! Please try again.'
                                : '???????????? ?????? ???????????????. ?????? ?????????????????????.',
                            () => history.goBack(),
                            null
                        );
                    }
                }
            });
        }

        return () => {
            isCancelled = true;
        };
    }, [location, history, ui.lang, source, dispatch]);

    const _handleFinish = (isPermanent, token) => {
        if (isPermanent) {
            cookie.save('token', token, {
                path: '/'
            });
            window.open('/', '_self');
        } else {
            cookie.save('token', token, {
                path: '/',
                maxAge: 60 * 30
            });
            window.open('/', '_self');
        }
    };

    return (
        <div className='socialSignInWith42'>
            <div className='socialSignInWith42-loading'>
                {ui.lang === 'en_US' ? 'SignIn is processing!' : '???????????? ?????? ????????????.'}
            </div>
        </div>
    );
};

export default Component;
