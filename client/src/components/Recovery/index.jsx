import React from 'react';

import { useSelector } from 'react-redux';

import { getEmail, recovery } from '../../data';

import { alert } from '../../util';
import FeatherIcon from 'feather-icons-react';
import '../Auth/index.css';

const Component = ({ history }) => {
    const ui = useSelector(state => state.ui);

    const _handleForm = e => {
        e.preventDefault();
        if (_handleCheckEmail) {
            const form = document.recovery;
            recovery(form.email.value, res => {
                if (res.status === 200) {
                    alert(
                        'message',
                        ui.lang === 'en_US'
                            ? 'Password recovery mail has sent :)'
                            : '비밀번호 복구 이메일이 발송되었습니다.',
                        () => history.goBack(),
                        null
                    );
                } else {
                    alert(
                        'message',
                        ui.lang === 'en_US' ? 'Email is invalid :(' : '이메일이 올바르지 않습니다.',
                        null,
                        null
                    );
                }
            });
        } else {
            alert(
                'messeage',
                'Input data is invalid! Please check your information again.',
                null,
                null
            );
        }
    };

    const _handleBack = () => {
        history.goBack();
    };

    const normalColor = '#505050';
    const confirmedColor = '#64FFDA';

    const _handleCheckEmail = () => {
        const value = document.recovery.email.value;
        const target = 'recovery-email';

        if (value.length < 5) {
            document.getElementById(target).style.color = normalColor;
            return false;
        }

        getEmail(value, res => {
            if (res.status !== 200) {
                document.getElementById(target).style.color = confirmedColor;
                return true;
            } else {
                document.getElementById(target).style.color = normalColor;
                return false;
            }
        });
    };

    document.title = `Recovery Password - HyperTube`;

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
                <form name='recovery' autoComplete='off' onSubmit={_handleForm}>
                    <div className='auth-placeholder'>
                        {ui.lang === 'en_US' ? 'EMAIL' : '이메일'}
                        <div className='auth-input-check'>
                            <FeatherIcon
                                id='recovery-email'
                                className='auth-input-check-icon'
                                icon='check'
                            />
                        </div>
                    </div>
                    <input
                        className='auth-input'
                        type='email'
                        name='email'
                        autoComplete='password'
                        autoFocus
                        onChange={_handleCheckEmail}
                    />
                    <button className='auth-button auth-submit' type='submit'>
                        {ui.lang === 'en_US' ? 'SUBMIT' : '비밀번호 찾기'}
                    </button>
                    <button className='auth-button' type='button' onClick={_handleBack}>
                        {ui.lang === 'en_US' ? 'BACK' : '돌아가기'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Component;
