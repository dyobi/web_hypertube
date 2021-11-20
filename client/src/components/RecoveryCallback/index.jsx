import React from 'react';

import { useSelector } from 'react-redux';

import { recoveryCallback } from '../../data';

import { alert } from '../../util';
import FeatherIcon from 'feather-icons-react';
import '../Auth/index.css';

const Component = ({ match }) => {
    const uuid = match.params.uuid;

    const ui = useSelector(state => state.ui);

    const _handleForm = e => {
        e.preventDefault();

        if (_handleCheckPassword() && _handleCheckConfrim()) {
            const form = document.recoveryCallback;
            recoveryCallback(uuid, form.password.value, res => {
                if (res.status === 200) {
                    alert(
                        'message',
                        ui.lang === 'en_US' ? 'Done!' : '변경완료!',
                        () => window.open('/auth/signin', '_self'),
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
            });
        } else {
            alert(
                'message',
                'Input data is invalid! Please check your information again.',
                null,
                null
            );
        }
    };

    const normalColor = '#505050';
    const confirmedColor = '#64FFDA';

    const _handleCheckPassword = () => {
        const password = document.recoveryCallback.password.value;
        const target = 'recovery-password';

        const pattern1 = /[0-9]/;
        const pattern2 = /[a-zA-Z]/;
        const pattern3 = /[~!@#$%<>^&*]/;

        document.getElementById(target).style.color = normalColor;

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
        const password = document.recoveryCallback.password.value;
        const confirm = document.recoveryCallback.confirm.value;
        const target = 'recovery-confirm';

        document.getElementById(target).style.color = normalColor;

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

    return (
        <div className='auth'>
            <div className='auth-container'>
                <div className='auth-title'>
                    {ui.lang === 'en_US' ? 'Password Recovery' : '비밀번호 찾기'}
                </div>
                <div className='auth-description'>
                    {ui.lang === 'en_US'
                        ? 'Sometimes, all you need to do is completely make an ass of yourself and laugh it off to realise that life isn’t so bad after all. The green tea and avocado smoothie turned out exactly as would be expected.'
                        : '모든 국민은 건강하고 쾌적한 환경에서 생활할 권리를 가지며, 국가와 국민은 환경보전을 위하여 노력하여야 한다. 이 헌법은 1988년 2월 25일부터 시행한다. 다만, 이 헌법을 시행하기 위하여 필요한 법률의 제정·개정과 이 헌법에 의한 대통령 및 국회의원의 선거 기타 이 헌법시행에 관한 준비는 이 헌법시행 전에 할 수 있다.'}
                </div>
                <form name='recoveryCallback' autoComplete='off' onSubmit={_handleForm}>
                    <div className='auth-placeholder'>
                        {ui.lang === 'en_US' ? 'NEW PASSWORD' : '새로운 비밀번호'}
                        <div className='auth-input-check'>
                            <FeatherIcon
                                id='recovery-password'
                                className='auth-input-check-icon'
                                icon='check'
                            />
                        </div>
                    </div>
                    <input
                        className='auth-input'
                        type='password'
                        name='password'
                        autoComplete='password'
                        onChange={_handleCheckPassword}
                        autoFocus
                    />
                    <div className='auth-placeholder'>
                        {ui.lang === 'en_US' ? 'CONFIRM PASSWORD' : '비밀번호 확인'}
                        <div className='auth-input-check'>
                            <FeatherIcon
                                id='recovery-confirm'
                                className='auth-input-check-icon'
                                icon='check'
                            />
                        </div>
                    </div>
                    <input
                        className='auth-input'
                        type='password'
                        name='confirm'
                        autoComplete='password'
                        onChange={_handleCheckConfrim}
                    />
                    <button className='auth-button auth-submit' type='submit'>
                        {ui.lang === 'en_US' ? 'SUBMIT' : '비밀번호 찾기'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Component;
