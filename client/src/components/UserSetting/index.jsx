import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { auth_token, user_data } from '../../actions';

import cookie from 'react-cookies';

import { getUserName, getEmail, putUser, deleteUser } from '../../data';
import { session, alert } from '../../util';

import FeatherIcon from 'feather-icons-react';
import './index.css';
import '../Auth/index.css';

const Component = ({ userData, setUserData }) => {
    const [checkUserName, setCheckUserName] = useState(false);
    const [checkEmail, setCheckEmail] = useState(false);

    const auth = useSelector(state => state.auth);
    const ui = useSelector(state => state.ui);
    const dispatch = useDispatch();

    const normalColor = '#505050';
    const confirmedColor = '#64FFDA';

    const _handleForm = e => {
        e.preventDefault();

        const form = document.setting;

        if (
            (form.userName.value === userData.userName || checkUserName) &&
            _handleCheckPassword() &&
            _handleCheckConfrim() &&
            (form.email.value === userData.email || checkEmail)
        ) {
            putUser(
                auth.token,
                form.userName.value,
                form.password.value,
                form.email.value,
                form.firstName.value,
                form.lastName.value,
                res => {
                    if (session(dispatch, res)) {
                        setUserData({
                            id: userData.id,
                            userName: form.userName.value,
                            email: form.email.value,
                            firstName: form.firstName.value,
                            lastName: form.lastName.value,
                            picture: userData.picture,
                            socialType: userData.socialType
                        });
                        dispatch(
                            user_data({
                                id: userData.id,
                                userName: form.userName.value,
                                email: form.email.value,
                                firstName: form.firstName.value,
                                lastName: form.lastName.value,
                                picture: userData.picture,
                                socialType: userData.socialType
                            })
                        );
                        document.getElementById('setting-userName').style.color = normalColor;
                        document.getElementById('setting-password').style.color = normalColor;
                        document.getElementById('setting-confirm').style.color = normalColor;
                        document.getElementById('setting-email').style.color = normalColor;
                    } else {
                        alert(
                            'message',
                            ui.lang === 'en_US'
                                ? 'Something went wrong :('
                                : '알 수 없는 오류가 발생했습니다 :(',
                            null,
                            null
                        );
                    }
                }
            );
        } else {
            alert(
                'message',
                'Input data is invalid! Please check your information again.',
                null,
                null
            );
        }
    };

    const _handleReset = () => {
        const form = document.setting;

        form.userName.value = userData.userName;
        form.password.value = '';
        form.confirm.value = '';
        form.email.value = userData.email;
        form.firstName.value = userData.firstName;
        form.lastName.value = userData.lastName;

        document.getElementById('setting-userName').style.color = normalColor;
        document.getElementById('setting-password').style.color = normalColor;
        document.getElementById('setting-confirm').style.color = normalColor;
        document.getElementById('setting-email').style.color = normalColor;
    };

    const _handleCheckUserName = () => {
        const value = document.setting.userName.value;
        const target = 'setting-userName';

        if (value.length < 5) {
            document.getElementById(target).style.color = normalColor;
            setCheckUserName(false);
        } else {
            getUserName(value, res => {
                if (res.status === 200) {
                    document.getElementById(target).style.color = confirmedColor;
                    setCheckUserName(true);
                } else {
                    document.getElementById(target).style.color = normalColor;
                    setCheckUserName(false);
                }
            });
        }
    };

    const _handleCheckPassword = () => {
        const password = document.setting.password.value;
        const target = 'setting-password';

        const pattern1 = /[0-9]/;
        const pattern2 = /[a-zA-Z]/;
        const pattern3 = /[~!@#$%<>^&*]/;

        document.getElementById(target).style.color = normalColor;

        if (password.length === 0) {
            return true;
        }

        let error = 0;

        if (!(8 <= password.length && password.length <= 20)) {
            error++;
        }

        if (!pattern1.test(password) || !pattern2.test(password) || !pattern3.test(password)) {
            error++;
        }

        if (error === 0) {
            document.getElementById(target).style.color = confirmedColor;
            return true;
        } else {
            return false;
        }
    };

    const _handleCheckConfrim = () => {
        const password = document.setting.password.value;
        const confirm = document.setting.confirm.value;
        const target = 'setting-confirm';

        document.getElementById(target).style.color = normalColor;

        if (password.length === 0) {
            return true;
        }

        let error = 0;

        if (password === '' || password !== confirm) {
            error++;
        }

        if (error === 0) {
            document.getElementById(target).style.color = confirmedColor;
            return true;
        } else {
            return false;
        }
    };

    const _handleCheckEmail = () => {
        const value = document.setting.email.value;
        const target = 'setting-email';

        const format = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!format.test(value)) {
            document.getElementById(target).style.color = normalColor;
            setCheckEmail(false);
        } else {
            getEmail(value, res => {
                if (res.status === 200) {
                    document.getElementById(target).style.color = confirmedColor;
                    setCheckEmail(true);
                } else {
                    document.getElementById(target).style.color = normalColor;
                    setCheckEmail(false);
                }
            });
        }
    };

    const _handleClose = () => {
        if (auth.token !== '') {
            deleteUser(auth.token, res => {
                if (session(dispatch, res)) {
                    _handleSignOut();
                } else {
                    alert(
                        'message',
                        ui.lang === 'en_US'
                            ? 'Something went wrong :('
                            : '알 수 없는 오류가 발생했습니다 :(',
                        null,
                        null
                    );
                }
            });
        }
    };

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
        <div className='userSetting'>
            <form name='setting' autoComplete='off' onSubmit={_handleForm}>
                <div className='auth-placeholder'>
                    {ui.lang === 'en_US' ? 'USER NAME' : '아이디'}
                    <div className='auth-input-check'>
                        <FeatherIcon
                            id='setting-userName'
                            className='auth-input-check-icon'
                            icon='check'
                        />
                    </div>
                </div>
                <input
                    className='auth-input'
                    type='text'
                    name='userName'
                    defaultValue={userData.userName}
                    onChange={_handleCheckUserName}
                />
                <div
                    className={
                        userData.socialType !== null
                            ? 'auth-placeholder-disabled'
                            : 'auth-placeholder'
                    }
                >
                    {ui.lang === 'en_US' ? 'PASSWORD' : '비밀번호 변경'}
                    <div className='auth-input-check'>
                        <FeatherIcon
                            id='setting-password'
                            className='auth-input-check-icon'
                            icon='check'
                        />
                    </div>
                </div>
                <input
                    className={userData.socialType !== null ? 'auth-input-disabled' : 'auth-input'}
                    type='password'
                    name='password'
                    onChange={_handleCheckPassword}
                    disabled={userData.socialType !== null ? 'disabled' : ''}
                />
                <div
                    className={
                        userData.socialType !== null
                            ? 'auth-placeholder-disabled'
                            : 'auth-placeholder'
                    }
                >
                    {ui.lang === 'en_US' ? 'CONFIRM PASSWORD' : '비밀번호 확인'}
                    <div className='auth-input-check'>
                        <FeatherIcon
                            id='setting-confirm'
                            className='auth-input-check-icon'
                            icon='check'
                        />
                    </div>
                </div>
                <input
                    className={userData.socialType !== null ? 'auth-input-disabled' : 'auth-input'}
                    type='password'
                    name='confirm'
                    onChange={_handleCheckConfrim}
                    disabled={userData.socialType !== null ? 'disabled' : ''}
                />
                <div
                    className={
                        userData.socialType !== null
                            ? 'auth-placeholder-disabled'
                            : 'auth-placeholder'
                    }
                >
                    {ui.lang === 'en_US' ? 'EMAIL' : '이메일'}
                    <div className='auth-input-check'>
                        <FeatherIcon
                            id='setting-email'
                            className='auth-input-check-icon'
                            icon='check'
                        />
                    </div>
                </div>
                <input
                    className={userData.socialType !== null ? 'auth-input-disabled' : 'auth-input'}
                    type='email'
                    name='email'
                    defaultValue={userData.email}
                    autoComplete='password'
                    autoFocus
                    onChange={_handleCheckEmail}
                    disabled={userData.socialType !== null ? 'disabled' : ''}
                />
                <div className='auth-placeholder'>
                    {ui.lang === 'en_US' ? 'FIRST NAME' : '이름'}
                </div>
                <input
                    className='auth-input'
                    type='text'
                    name='firstName'
                    defaultValue={userData.firstName}
                    autoComplete='password'
                />
                <div className='auth-placeholder'>{ui.lang === 'en_US' ? 'LAST NAME' : '성'}</div>
                <input
                    className='auth-input'
                    type='text'
                    name='lastName'
                    defaultValue={userData.lastName}
                    autoComplete='password'
                />
                <div className='auth-nav' onClick={_handleClose}>
                    {ui.lang === 'en_US'
                        ? 'By any chance, Do you want to close this account?'
                        : '혹시 계정을 삭제하시겠습니까?'}
                </div>
                <button className='auth-button auth-submit' type='submit'>
                    {ui.lang === 'en_US' ? 'SAVE' : '저장'}
                </button>
                <button className='auth-button' type='button' onClick={_handleReset}>
                    {ui.lang === 'en_US' ? 'RESET' : '취소'}
                </button>
            </form>
        </div>
    );
};

export default Component;
