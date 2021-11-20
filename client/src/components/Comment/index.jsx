import React from 'react';

import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import user_default from '../../assets/images/user_default.png';
import FeatherIcon from 'feather-icons-react';
import './index.css';

const Component = ({ comment, _handleDeleteComment }) => {
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);

    const _handleDelete = () => {
        _handleDeleteComment(comment.id);
    };

    return (
        <div className='comment-container'>
            <Link to={auth.token !== '' ? `/user/${comment.user.userName}` : '/auth/signin'}>
                <div className='comment'>
                    <div
                        className='comment-picture'
                        style={{
                            backgroundImage:
                                comment.user.picture !== null &&
                                comment.user.picture !== undefined &&
                                comment.user.picture !== ''
                                    ? `url('${
                                          comment.user.picture.match('SERVER/')
                                              ? `/api/user/picture/${comment.user.picture.replace(
                                                    'SERVER/',
                                                    ''
                                                )}`
                                              : comment.user.picture
                                      }')`
                                    : `url('${user_default}')`
                        }}
                    ></div>
                    <div className='comment-content'>
                        <div className='comment-content-name'>
                            {comment.user.firstName} {comment.user.lastName}
                        </div>
                        <div className='comment-content-time'>({comment.time})</div>
                        <div className='comment-content-message'>{comment.content}</div>
                    </div>
                </div>
            </Link>
            {comment.user.id === user.id ? (
                <FeatherIcon className='comment-delete' icon='x' onClick={_handleDelete} />
            ) : null}
        </div>
    );
};

export default Component;
