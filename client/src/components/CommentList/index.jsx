import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import Comment from '../Comment';
import CommentPost from '../CommentPost';

import { getCommentsByMovieId, deleteComment } from '../../data';

import { alert } from '../../util';
import './index.css';

const Component = ({ id }) => {
    const [commentList, setCommentList] = useState([]);
    const [isDoneSearch, setIsDoneSearch] = useState(false);

    const auth = useSelector(state => state.auth);
    const ui = useSelector(state => state.ui);

    useEffect(() => {
        let isCancelled = false;

        getCommentsByMovieId(id, res => {
            if (!isCancelled) {
                if (res.status === 200) {
                    setCommentList(res.list);
                    setIsDoneSearch(true);
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
        return () => {
            isCancelled = true;
        };
    }, [id, setIsDoneSearch, ui.lang]);

    const _handleDeleteComment = id => {
        deleteComment(auth.token, id, res => {
            if (res.status === 200) {
                setCommentList(commentList.filter(comment => comment.id !== id));
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
    };

    return (
        <div className='commentList'>
            <div className='commentList-container'>
                {commentList.length !== 0
                    ? commentList.map((comment, index) => (
                          <Comment
                              comment={comment}
                              _handleDeleteComment={_handleDeleteComment}
                              key={index}
                          />
                      ))
                    : null}
                {commentList.length === 0 && isDoneSearch
                    ? ui.lang === 'en_US'
                        ? 'We cannot find out any comments :('
                        : '등록된 코멘트가 없습니다 :('
                    : null}
                {commentList.length === 0 && !isDoneSearch
                    ? ui.lang === 'en_US'
                        ? 'We are looking for comments!'
                        : '코멘트를 검색 중입니다!'
                    : null}
            </div>
            <CommentPost id={id} commentList={commentList} setCommentList={setCommentList} />
        </div>
    );
};

export default Component;
