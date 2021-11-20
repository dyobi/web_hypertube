import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { auth_token } from '../../actions';

import { Link } from 'react-router-dom';
import cookie from 'react-cookies';

import SocialSignIn from '../SocialSignIn';

import { signin } from '../../data';

import { alert } from '../../util';
import '../Auth/index.css';

const Component = ({ history }) => {
    const ui = useSelector(state => state.ui);
    const dispatch = useDispatch();

    const _handleBack = () => {
        history.goBack();
    };

    const _handleForm = e => {
        e.preventDefault();
        const form = document.signin;
        signin(form.userName.value, form.password.value, res => {
            if (res.status === 200) {
                dispatch(auth_token(res.obj));
                alert(
                    'question',
                    ui.lang === 'en_US'
                        ? 'Do you want to keep your signin status?'
                        : '로그인을 유지하시겠습니까?',
                        () => _handleCallback(true, res.obj),
                        () => _handleCallback(false, res.obj)
                );
            } else {
                if (res.status === 411) {
                    alert(
                        'message',
                        ui.lang === 'en_US'
                            ? 'Username is invalid :('
                            : '아이디가 올바르지 않습니다.',
                        null,
                        null
                    );
                } else if (res.status === 412) {
                    alert(
                        'message',
                        ui.lang === 'en_US'
                            ? 'Password is invalid :('
                            : '비밀번호가 올바르지 않습니다.',
                        null,
                        null
                    );
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
        });
    };

    const _handleCallback = (isSave, token) => {
        if (isSave) {
            cookie.save('token', token, {
                path: '/'
            });
        } else {
            cookie.save('token', token, {
                path: '/',
                maxAge: 60 * 30
            });
        }
        window.open('/', '_self');
    };

    document.title = `Sign In - HyperTube`;

    return (
        <div className='auth'>
            <div className='auth-container'>
                <div className='auth-title'>{ui.lang === 'en_US' ? 'Sign In' : '로그인'}</div>
                <div className='auth-description'>
                    {ui.lang === 'en_US'
                        ? 'Sometimes, all you need to do is completely make an ass of yourself and laugh it off to realise that life isn’t so bad after all. The green tea and avocado smoothie turned out exactly as would be expected.'
                        : '모든 국민은 건강하고 쾌적한 환경에서 생활할 권리를 가지며, 국가와 국민은 환경보전을 위하여 노력하여야 한다. 이 헌법은 1988년 2월 25일부터 시행한다. 다만, 이 헌법을 시행하기 위하여 필요한 법률의 제정·개정과 이 헌법에 의한 대통령 및 국회의원의 선거 기타 이 헌법시행에 관한 준비는 이 헌법시행 전에 할 수 있다.'}
                </div>
                <form name='signin' autoComplete='off' onSubmit={_handleForm}>
                    <div className='auth-placeholder'>
                        {ui.lang === 'en_US' ? 'USER NAME' : '아이디'}
                    </div>
                    <input className='auth-input' type='text' name='userName' autoFocus />
                    <div className='auth-placeholder'>
                        {ui.lang === 'en_US' ? 'PASSWORD' : '비밀번호'}
                    </div>
                    <input className='auth-input' type='password' name='password' />
                    <Link to='/auth/signup'>
                        <div className='auth-nav'>
                            {ui.lang === 'en_US'
                                ? "Don't you have an account yet? Just Sign Up for free!"
                                : '아직 계정이 없으신가요? 바로 무료로 가입하세요!'}
                        </div>
                    </Link>
                    <Link to='/auth/recovery'>
                        <div className='auth-nav'>
                            {ui.lang === 'en_US'
                                ? 'Do you Forgot Password?'
                                : '비밀번호를 잊으셨나요?'}
                        </div>
                    </Link>
                    <button className='auth-button auth-submit' type='submit'>
                        {ui.lang === 'en_US' ? 'SIGN IN' : '로그인'}
                    </button>
                    <button className='auth-button' type='button' onClick={_handleBack}>
                        {ui.lang === 'en_US' ? 'BACK' : '돌아가기'}
                    </button>
                </form>
                <div className='auth-division'>
                    <div className='auth-division-line'></div>
                    <div className='auth-division-text'>{ui.lang === 'en_US' ? 'OR' : '혹은'}</div>
                </div>
                <div className='auth-title'>
                    {ui.lang === 'en_US' ? 'Sign In with Social Media' : '소셜미디어를 통해 로그인'}
                </div>
                <div className='auth-description'>
                    {ui.lang === 'en_US'
                        ? 'Sometimes, all you need to do is completely make an ass of yourself and laugh it off to realise that life isn’t so bad after all.'
                        : '모든 국민은 건강하고 쾌적한 환경에서 생활할 권리를 가지며, 국가와 국민은 환경보전을 위하여 노력하여야 한다. 이 헌법은 1988년 2월 25일부터 시행한다.'}
                </div>
                <SocialSignIn />
            </div>
        </div>
    );
};

export default Component;
