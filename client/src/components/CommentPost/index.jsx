import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { postComment } from '../../data';

import { session, alert } from '../../util';

import './index.css';

const Component = ({ id, commentList, setCommentList }) => {
    const auth = useSelector(state => state.auth);
    const ui = useSelector(state => state.ui);
    const dispatch = useDispatch();

    const _handleForm = e => {
        e.preventDefault();

        const text = document.comment.comment.value;
        if (text !== '') {
            postComment(auth.token, id, text, res => {
                if (session(dispatch, res)) {
                    setCommentList([res.obj, ...commentList]);
                    alert('message', ui.lang === 'en_US' ? 'Done!' : '등록완료!', null, null);
                    document.comment.comment.value = '';
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
                ui.lang === 'en_US' ? 'Please input your review.' : '리뷰를 작성하여 주십시오.',
                null,
                null
            );
        }
    };

    return (
        <div className='commentPost'>
            <form name='comment' onSubmit={_handleForm}>
                <textarea
                    className='commentPost-textarea'
                    placeholder={
                        ui.lang === 'en_US'
                            ? auth.token === ''
                                ? 'This feature requires SignIn first.'
                                : 'What do you think about this movie?'
                            : auth.token === ''
                            ? '로그인이 필요한 서비스입니다.'
                            : '이 영화에 대해 어떻게 생각하시나요?'
                    }
                    name='comment'
                    disabled={auth.token === '' ? 'disabled' : null}
                ></textarea>
                <div className='commentPost-button-container'>
                    <button
                        className='commentPost-button'
                        type='submit'
                        disabled={auth.token === '' ? 'disabled' : null}
                    >
                        POST
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Component;
