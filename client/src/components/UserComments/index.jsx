import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import UserComment from '../UserComment';

import { getCommentsByUserId } from '../../data';
import { session, alert } from '../../util';

import './index.css';

const Component = ({ userData }) => {
    const [comments, setComments] = useState([]);

    const auth = useSelector(state => state.auth);
    const ui = useSelector(state => state.ui);
    const dispatch = useDispatch();

    useEffect(() => {
        let isCancelled = false;

        if (userData.id !== -1) {
            getCommentsByUserId(auth.token, userData.id, res => {
                if (!isCancelled) {
                    if (session(dispatch, res)) {
                        setComments(res.list);
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
        }

        return () => {
            isCancelled = true;
        };
    }, [dispatch, auth.token, userData.id, ui.lang]);

    return (
        <div className='userComments'>
            {comments.length !== 0 ? (
                comments.map((data, index) => <UserComment data={data} key={index} />)
            ) : (
                <div className='userComments-none'>There is no comment data</div>
            )}
        </div>
    );
};

export default Component;
