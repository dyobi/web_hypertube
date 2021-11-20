/*
    Response = {
        status: number
            200: success
            400: failure
            401: invalid token
        obj: object(return value)
        list: list(return value)
    }
*/

import Axios from 'axios';

/*
    method: 
        GET
    url: 
        /api/comments/movieId/:movieId
    parameter: 
        null
    result:
        status
        list
    using at:
        CommentList
*/
export const getCommentsByMovieId = (movieId, cb) => {
    const url = `/api/comments/movieId/${movieId}`;

    Axios.get(url)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb({
                status: 400
            });
        });
};

/*
    method: 
        GET
    url: 
        /api/comments/userId/:userId
    parameter: 
        token
    result:
        status
        list
    using at:
        UserComments
*/
export const getCommentsByUserId = (token, userId, cb) => {
    const url = `/api/comments/userId/${userId}`;
    const data = {
        token
    };

    Axios.get(url, { params: data }).then(res => {
        cb(res.data);
    });
    // .catch(() => {
    //     cb({
    //         status: 400
    //     });
    // });
};

/*
    method: 
        POST
    url: 
        /api/comment
    parameter: 
        token, movieId, content
    result:
        status
    using at:
        CommentPost
*/
export const postComment = (token, movieId, content, cb) => {
    const url = `/api/comment`;
    const data = {
        token,
        movieId,
        content
    };

    Axios.post(url, data)
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb({
                status: 400
            });
        });
};

/*
    method: 
        DELETE
    url: 
        /api/comment/:commentId
    parameter: 
        token
    result:
        status
    using at:
        
*/
export const deleteComment = (token, commentId, cb) => {
    const url = `/api/comment/${commentId}`;
    const data = {
        token
    };

    Axios.delete(url, { params: data })
        .then(res => {
            cb(res.data);
        })
        .catch(() => {
            cb({
                status: 400
            });
        });
};
